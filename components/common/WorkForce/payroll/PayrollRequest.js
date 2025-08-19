import React, { useState, useEffect, useMemo } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import WorkforcePayrollTable from "../../payroll/WorkforcePayrollTable";
import { IoMdSend } from "react-icons/io";
import { IoCloseCircleOutline, IoDocumentTextOutline } from "react-icons/io5";
import { Check, X, ChevronDown } from "lucide-react";
import { FaQuestion } from "react-icons/fa6";
import FeedbackView from "./FeedbackView";
import { UseGetUpcomingPayroll } from "../../../../hooks/query/payroll/getUpcomingPayrollHistory";
import UseUpdatePayrollRequest from "../../../../hooks/mutations/finances/payroll/approverPayrollStatus";
import { UseGetPayrollCurrentStatus } from "../../../../hooks/query/payroll/getPayrollCurrentStatus";
import { UseGetPayrollLogsHistory } from "../../../../hooks/query/payroll/getPayrollLogHistory";
import FeedbackHistoryPopup from "./FeedbackHistoryPopup";
import DataLoader from "../../../ui/dataLoader";

function PayrollRequest({
  id,
  employeeCount,
  setBack,
  currentUser,
  total_amount,
  configurationData,
  formattedMonthYear,
}) {
  const sortedApprovers = useMemo(() => {
    const approvers = (configurationData && configurationData.approvers) || [];
    return [...approvers].sort((a, b) => a.approval_order - b.approval_order);
  }, [configurationData]);

  const { data: payrollLogsHistory, isLoading: isLoadingPayrollLogsHistory } =
    UseGetPayrollLogsHistory();
  const {
    data: payrollApprovalStatus,
    isLoading: isLoadingPayrollApprovalStatus,
  } = UseGetPayrollCurrentStatus();
  const { mutate: submitApproverAction } = UseUpdatePayrollRequest();

  const payrollId = payrollApprovalStatus?.id;

  const [approvalStatus, setApprovalStatus] = useState(
    sortedApprovers.reduce((acc, approver) => {
      // Look up a matching approval record from the API.
      const approvalRecord = payrollApprovalStatus?.approvals?.find(
        (record) => record.approver_id === approver.id
      );
      acc[approver.id] = approvalRecord ? approvalRecord.status : "pending";
      return acc;
    }, {})
  );

  const [isTableDisabled, setIsTableDisabled] = useState(false);
  const [isViewingFeedback, setIsViewingFeedback] = useState(false);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackComments, setFeedbackComments] = useState([]);
  const [showPayout, setShowPayout] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const {
    data: upcomingPayroll,
    isLoading: isLoadingUpcomingPayroll,
    refetch,
  } = UseGetUpcomingPayroll(selectedRegion);

  // Determine which approver’s turn it is (the first with a "pending" status)
  const currentApprover = useMemo(() => {
    return sortedApprovers.find((app) => approvalStatus[app.id] === "pending");
  }, [sortedApprovers, approvalStatus]);

  // Only allow the current approver to take action
  const canApproverAct = useMemo(() => {
    return currentApprover && currentApprover.id === currentUser.id;
  }, [currentApprover, currentUser]);

  // Only the first approver can edit the payroll
  const canEditPayroll = useMemo(() => {
    return (
      sortedApprovers.length > 0 && currentUser.id === sortedApprovers[0].id
    );
  }, [sortedApprovers, currentUser]);

  useEffect(() => {
    if (sortedApprovers.length) {
      const updatedStatus = sortedApprovers.reduce((acc, approver) => {
        const approvalRecord = payrollApprovalStatus?.approvals?.find(
          (record) => record.approver_id === approver.id
        );
        acc[approver.id] = approvalRecord ? approvalRecord.status : "pending";
        return acc;
      }, {});
      setApprovalStatus(updatedStatus);
      setIsTableDisabled(!(canApproverAct || canEditPayroll));
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [
    payrollApprovalStatus,
    sortedApprovers,
    currentUser,
    canApproverAct,
    canEditPayroll,
  ]);

  const handleApprove = () => {
    const formData = new FormData();
    formData.append("status", "Approved");
    formData.append("reason", "");

    submitApproverAction(
      {id:payrollId, formData },
      {
        onSuccess: () => {
          setApprovalStatus((prevStatus) => ({
            ...prevStatus,
            [currentUser.id]: "approved",
          }));
        },
      }
    );
  };

  const handleReject = () => {
    setIsSubmittingFeedback(true);
  };

  const handleFeedbackSubmit = (feedback) => {
    const formData = new FormData();
    formData.append("status", "Rejected");
    formData.append("reason", feedback);

    submitApproverAction(
      { id:payrollId, approverId: currentUser.id, formData },
      {
        onSuccess: () => {
          setApprovalStatus((prevStatus) => ({
            ...prevStatus,
            [currentUser.id]: "rejected",
          }));
          setIsSubmittingFeedback(false);
          setIsViewingFeedback(false);
        },
      }
    );
  };

  const allApproversApproved = Object.values(approvalStatus).every(
    (status) => status === "approved"
  );

  const showApprovalMessage = () => {
    if (allApproversApproved) {
      return "Payroll has been sent to Finance to execute payment.";
    }
    if (
      approvalStatus[currentUser.id] === "approved" &&
      !Object.values(approvalStatus).includes("rejected")
    ) {
      return "Waiting for next approver's action.";
    }
    return "";
  };

  const ManagerStatusLayout = ({ approver, status }) => {
    return (
      <div className="flex flex-col items-center mx-4">
        <div
          className={`p-2 rounded-full ${
            status === "approved"
              ? "bg-green-400"
              : status === "rejected"
              ? "bg-secondary"
              : "bg-orange-100"
          }`}
        >
          {status === "approved" ? (
            <Check className="text-white h-5 w-5" />
          ) : status === "rejected" ? (
            <X className="text-white h-5 w-5" />
          ) : (
            <FaQuestion className="text-yellow-600 h-5 w-5" />
          )}
        </div>
        <span className="text-sm mt-2 text-center">{approver?.user_name}</span>
        <span className="text-xs text-gray-500 text-center">{`Approver ${approver?.approval_order}`}</span>
      </div>
    );
  };

  const handleViewFeedback = () => {
    setIsViewingFeedback(true);
    // Assuming the feedback comments are fetched from the backend, you would update feedbackComments here with the actual comments.
    const rejectedLogs = payrollLogsHistory?.filter(
      (log) => log.status === "Rejected"
    );
    setFeedbackComments(
      rejectedLogs?.map((log) => ({
        message: log.reason,
        date: log.date,
        managerName: log.manager_name,
      }))
    );
  };

  const goBackToRequest = () => {
    setIsViewingFeedback(false);
    setIsSubmittingFeedback(false);
  };

  const handleEditPayroll = (id, updatedValues) => {
    setPayrollData((prevData) =>
      prevData.map((item) =>
        item.id === id
          ? {
              ...item,
              ...updatedValues,
              netSalary:
                item.basicSalary -
                updatedValues.penalties -
                item.deduction +
                updatedValues.bonus,
            }
          : item
      )
    );
  };

  return (
    <div className="px-4 min-h-screen">
      {isLoading || isLoadingPayrollApprovalStatus ? (
        <DataLoader />
      ) : isViewingFeedback || isSubmittingFeedback ? (
        <FeedbackView
          feedbackComments={feedbackComments}
          goBack={goBackToRequest}
          mode={isSubmittingFeedback ? "edit" : "view"}
          onSubmitFeedback={isSubmittingFeedback ? handleFeedbackSubmit : null}
          payrollMonth={formattedMonthYear}
        />
      ) : (
        <div className="min-h-screen">
          <div className="flex items-center">
            <button
              onClick={() => setBack()}
              type="button"
              className="flex space-x-2 items-center px-2 py-1 text-white bg-primary rounded-xl"
            >
              <ArrowLeft className="text-white h-5 w-5" />
              <span>Back</span>
            </button>
            <h2 className="text-lg font-medium ml-3">
              {formattedMonthYear} Payroll Request
            </h2>
          </div>

          <div className="border rounded-xl px-4 py-4 hover:shadow-md hover:border-primary mt-4 mb-4">
            <div className="flex justify-between col-span-3">
              <div
                className="flex flex-col justify-between"
                style={{ width: "25%" }}
              >
                <div className="flex flex-row">
                  <Image
                    src="/assets/payout.svg"
                    alt="Payout Icon"
                    className="h-12 w-12 mr-3"
                    height={200}
                    width={400}
                  />
                  <div className="flex flex-col">
                    <div className="flex items-center">
                      <h3 className="text-lg mr-4">Total Payroll</h3>
                      <button onClick={() => setShowPayout(!showPayout)}>
                        {showPayout ? (
                          <FaEye className="text-primary h-5 w-5 mt-1" />
                        ) : (
                          <FaEyeSlash className="text-primary h-5 w-5 mt-1" />
                        )}
                      </button>
                    </div>
                    <div className="text-sm">
                      <span className="text-default_text font-bold">
                        {employeeCount}
                      </span>
                      <span className="ml-1">Employees</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center mt-5">
                  <div className="flex items-center gap-2 mt-2">
                    {showPayout ? (
                      <span className="text-4xl text-primary">
                        ${total_amount && total_amount?.toLocaleString("en-US")}
                      </span>
                    ) : (
                      <span className="text-4xl text-primary">****</span>
                    )}
                  </div>
                </div>
              </div>

              <div
                className="flex justify-center items-center"
                style={{ width: "50%" }}
              >
                {sortedApprovers.map((approver, index) => (
                  <React.Fragment key={approver.id}>
                    <div
                      className={`flex items-center ${
                        approvalStatus[approver.id] === "approved" ? "" : "mr-4"
                      }`}
                    >
                      <ManagerStatusLayout
                        approver={approver}
                        status={approvalStatus[approver.id]}
                      />
                      {index < sortedApprovers.length - 1 &&
                        approvalStatus[approver.id] === "approved" &&
                        approvalStatus[sortedApprovers[index + 1].id] !==
                          "rejected" && (
                          <div className="h-1 w-20 mx-4 bg-green-400" />
                        )}
                    </div>
                  </React.Fragment>
                ))}
              </div>

              <div
                className="flex flex-col justify-center items-end"
                style={{ width: "25%" }}
              >
                <div className="flex flex-row">
                  <button
                    className={`flex flex-col mr-2 border items-center justify-center shadow-sm px-4 py-2 space-y-1 rounded-lg w-full cursor-pointer border-yellow-600 text-yellow-600 bg-[#FBF5E8]`}
                    onClick={handleViewFeedback}
                  >
                    <IoDocumentTextOutline className="h-6 w-6 text-yellow-600" />
                    <span className="text-yellow-600">View</span>
                  </button>
                  <div className="flex flex-col space-y-2">
                    {/* Only show the Reject button for Managers 2 and 3 */}
                    {!canEditPayroll && (
                      <button
                        className={`flex border items-center justify-center shadow-sm px-4 py-2 space-x-2 rounded-lg w-full border-red-400 text-red-400 ${
                          !canApproverAct
                            ? "cursor-not-allowed"
                            : "cursor-pointer"
                        }`}
                        onClick={handleReject}
                        disabled={!canApproverAct}
                      >
                        <span>Reject</span>
                        <IoCloseCircleOutline
                          className={`h-6 w-6 text-red-400`}
                        />
                      </button>
                    )}
                    {/* Approve button, height adjusted for Manager 1 */}
                    <button
                      className={`flex border items-center justify-center h-full px-4 py-2 space-x-2 rounded-lg w-full bg-primary text-white 
                        ${
                          (canEditPayroll &&
                            approvalStatus[currentUser.id] === "approved") ||
                          !(canApproverAct || canEditPayroll) ||
                          allApproversApproved
                            ? "cursor-not-allowed"
                            : "cursor-pointer"
                        }
                        `}
                      onClick={handleApprove}
                      disabled={
                        (canEditPayroll &&
                          approvalStatus[currentUser.id] === "approved") ||
                        !(canApproverAct || canEditPayroll) ||
                        allApproversApproved
                      }
                    >
                      <span>Approve</span>
                      <IoMdSend className={`h-6 w-6 text-white`} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <button
                className="flex space-x-2 items-center"
                onClick={() => setShowHistory(true)}
              >
                <span>View History</span>
                <ChevronDown className="h-5 w-5" />
              </button>
              {/* Feedback History Popup */}
              {showHistory && (
                <FeedbackHistoryPopup
                  feedbackHistory={payrollLogsHistory}
                  onClose={() => setShowHistory(false)}
                  formattedMonthYear={formattedMonthYear}
                />
              )}
            </div>
          </div>

          {showApprovalMessage() && (
            <div className="flex flex-col items-center space-y-1 border rounded-xl px-4 py-4 mt-4 mb-4">
              <div className="p-2 rounded-full bg-green-400">
                <Check className="text-white h-5 w-5" />
              </div>
              <span className="text-lg">Payroll Approved Successfully!</span>
              <span className="text-base font-light">
                {typeof showApprovalMessage() === "string"
                  ? showApprovalMessage()
                  : ""}
              </span>
              <span className="text-base font-light">
                {typeof showApprovalMessage() !== "string" &&
                  "You will not be able to edit until the one of the next approvers reject the submitted payroll."}
              </span>
            </div>
          )}

          <div
            className={`flex-grow ${
              isTableDisabled
                ? "opacity-40 pointer-events-none bg-gray-200 rounded-xl border border-gray-500"
                : ""
            }`}
          >
            {isLoadingUpcomingPayroll || isLoadingPayrollLogsHistory ? (
              <DataLoader />
            ) : (
              <WorkforcePayrollTable
                title={"Staff Directory Upcoming Payroll"}
                selectedRegion={selectedRegion}
                setSelectedRegion={setSelectedRegion}
                refetch={refetch}
                userData={upcomingPayroll}
                height={showApprovalMessage() ? "500px" : "600px"}
                isTableDisabled={isTableDisabled}
                shouldHideEditColumn={!canEditPayroll || allApproversApproved}
                formattedMonthYear={formattedMonthYear}
                canEdit={canEditPayroll}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default PayrollRequest;
