import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { FaCaretRight, FaEye, FaEyeSlash } from "react-icons/fa";
import Image from "next/image";
import PayrollRequest from "./PayrollRequest";
import PayrollHistoryTable from "../../payroll/PayrollHistoryTable";
import UseInitiatePayroll from "../../../../hooks/mutations/payroll/initiatePayroll";
import DataLoader from "../../../ui/dataLoader";
import { UseGetPayrollHistory } from "../../../../hooks/query/payroll/getPayrollHistory";
import { UseGetPayrollStats } from "../../../../hooks/query/payroll/getPayrollStats";
import { UseGetPayrollCurrentStatus } from "../../../../hooks/query/payroll/getPayrollCurrentStatus";
import ConfirmationModal from "./InitiateConfirmationModal";
import UseCancelPayroll from "../../../../hooks/mutations/payroll/cancelInitiate";
import { errorToaster } from "../../../../utils/toaster";

export default function Payroll({ currentUser, ConfigurationData }) {
  const router = useRouter();
  const { data: payrollHistory, isLoading: isLoadingPayrollHistory } =
    UseGetPayrollHistory();
  const initiatePayroll = UseInitiatePayroll();
  const cancelPayroll = UseCancelPayroll();
  const {
    data: payrollApprovalStatus,
    isLoading: isLoadingPayrollApprovalStatus,
  } = UseGetPayrollCurrentStatus();
  const { data: payrollStats, isLoading: isLoadingPayrollStats } =
    UseGetPayrollStats();

  const [selectedStatus, setSelectedStatus] = useState("");
  const [showPayout, setShowPayout] = useState(false);
  const [isPay, setIsPay] = useState(false);
  const [view, setView] = useState("main");
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isInitiated, setInitiated] = useState(false);

  // Use the approvers array from ConfigurationData to determine who can initiate
  const approvers = ConfigurationData?.approvers || [];
  const sortedApprovers = [...approvers].sort(
    (a, b) => a.approval_order - b.approval_order
  );

  const isApprover = sortedApprovers.some(
    (approver) => approver.id === currentUser?.id
  );

  // Only the first approver (approval_order === 1) can initiate and edit
  const canInitiatePayroll =
    sortedApprovers?.length && currentUser?.id === sortedApprovers[0]?.id;

  // Use the payroll initiation status from the API or local state if the payroll has just been initiated
  const isPayrollInitiated =
    payrollApprovalStatus?.status === "pending" ||
    payrollApprovalStatus?.status === "approved" ||
    isPay;

  // Extract and format month and year from the payroll initiation date
  const payrollDate = new Date(payrollApprovalStatus?.date);
  const monthName = payrollDate.toLocaleString("default", { month: "long" });
  const year = payrollDate.getFullYear();
  const formattedMonthYear = `${monthName} ${year}`;

  const handleInitiatePayroll = () => {
    if (isApprover) {
      // Only allow approvers to initiate payroll.
      setShowModal(true);
    }
  };

  const handleConfirmInitiation = () => {
    initiatePayroll.mutate(
      {},
      {
        onSuccess: () => {
          setIsPay(true);
          setView("request");
          setInitiated(true);
          setShowModal(false); // Close modal
        },
        onError: () => {
          setShowModal(false); // Close modal
        },
      }
    );
  };

  const handleCancelInitiation = () => {
    cancelPayroll.mutate(
      { id: payrollApprovalStatus?.id },
      {
        onSuccess: () => {
          setInitiated(false); // Immediately update state
          setIsPay(false); // Reset pay status after cancellation
        },
      }
    );
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleBack = () => {
    setView("main");
  };

  const handleGoToApproval = () => {
    if (isApprover) {
      setView("request");
    } else {
      errorToaster("You are not authorized to view the approval flow.");
    }
  };

  useEffect(() => {
    if (router.query.view === "request") {
      setView("request");
    }
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  }, [router.query.view]);

  return (
    <div className="min-h-screen">
      {isLoadingPayrollApprovalStatus ||
      isLoadingPayrollHistory ||
      isLoadingPayrollStats ||
      isLoading ? (
        <DataLoader />
      ) : view === "request" ? (
        <PayrollRequest
        id={payrollApprovalStatus?.id}
          employeeCount={payrollStats?.total_users}
          total_amount={payrollStats?.total_amount}
          setBack={handleBack}
          currentUser={currentUser}
          configurationData={ConfigurationData}
          formattedMonthYear={formattedMonthYear}
        />
      ) : (
        <div className="px-4">
          <div className="gap-4 grid grid-cols-8">
            <div className="border rounded-xl px-4 py-4 col-span-3 hover:shadow-md hover:border-primary">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Image
                    src="/assets/payout.svg"
                    alt="Payout Icon"
                    className="h-12 w-12 mr-3"
                    height={200}
                    width={400}
                  />
                  <h3 className="text-lg mr-4">Total Payroll</h3>
                  <button onClick={() => setShowPayout(!showPayout)}>
                    {showPayout ? (
                      <FaEye className="text-primary h-5 w-5 mt-1" />
                    ) : (
                      <FaEyeSlash className="text-primary h-5 w-5 mt-1" />
                    )}
                  </button>
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-default_text text-xl font-medium">
                    {payrollStats?.total_users}
                  </span>
                  <span>Employees</span>
                </div>
              </div>

              <div className="flex justify-between items-center mt-5">
                <div className="flex items-center gap-2 mt-2">
                  {showPayout ? (
                    <span className="text-4xl text-primary">
                      {payrollStats?.total_amount
                        ? `$${payrollStats?.total_amount.toLocaleString(
                            "en-US"
                          )}`
                        : "N/A"}
                    </span>
                  ) : (
                    <span className="text-4xl text-primary">****</span>
                  )}
                </div>
                <button className="py-1 px-4 text-white bg-primary rounded-full cursor-default">
                  Pay
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 mb-4 py-5 px-5 bg-primary text-white rounded-xl">
            <div className="flex justify-between items-center">
              <span>
                Payroll &nbsp;
                <span className="font-bold">
                  {payrollApprovalStatus ? formattedMonthYear : null}
                </span>
              </span>

              <div>
                {isPayrollInitiated || isInitiated ? (
                  <div className="flex space-x-3 items-center">
                    {/* Only show Cancel Initiation if the current user is the initiator (approver order 1) */}
                    {canInitiatePayroll &&
                      payrollApprovalStatus?.status === "pending" && (
                        <div
                          className="cursor-pointer"
                          onClick={handleCancelInitiation}
                        >
                          <button className="py-1 px-4 rounded-full bg-white text-black ">
                            Cancel Initiation
                          </button>
                        </div>
                      )}

                    <div
                      className="flex cursor-pointer"
                      onClick={handleGoToApproval}
                    >
                      <span>Go to Approval</span>
                      <FaCaretRight className="h-6 w-6 text-white" />
                    </div>
                  </div>
                ) : (
                  canInitiatePayroll && (
                    <div
                      className="cursor-pointer"
                      onClick={handleInitiatePayroll}
                    >
                      <button className="py-1 px-4 rounded-full text-white">
                        Initiate Payroll Request
                      </button>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          <PayrollHistoryTable
            title={"Payroll History"}
            tableType={"overview"}
            data={payrollHistory}
            id={payrollApprovalStatus?.id}
            height={"550px"}
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
          />
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showModal}
        onClose={handleClose}
        onConfirm={handleConfirmInitiation}
        message={"Are you sure you want to initiate the payroll?"}
      />
    </div>
  );
}
