import React, { useState, useEffect } from "react";
import LoanSummary from "./RequestSummary";
import ApprovalTimeline from "./ApprovalTimeline";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { Check } from "lucide-react";
import { successToaster } from "../../../../utils/toaster";

function SingleRequest({ approvalProcessData, summaryData, user, action,salary }) {
  const [reason, setReason] = useState("");

  const currentDate = new Date().toLocaleDateString();

  const sortedProcess = [...approvalProcessData].sort(
    (a, b) => a.approval_order - b.approval_order
  );

  const overallLoanStatus =
    summaryData.details.find((d) => d.label === "Loan Status")?.value?.toLowerCase() ||
    "pending";

  const isOverallFinalized = ["rejected", "approved"].includes(overallLoanStatus);

  const userApproverEntry = sortedProcess.find(
    (appr) => appr.approver_id === user?.id
  );
  const userStatus = userApproverEntry?.status?.toLowerCase() || null;

  const nextApprover = sortedProcess.find(
    (appr) => appr.status?.toLowerCase() === "pending"
  );
  const userIsNextApprover = nextApprover?.approver_id === user?.id;

  const canEditReason = userIsNextApprover && !isOverallFinalized && userStatus === "pending";

  useEffect(() => {
    if (!userApproverEntry) {
      setReason("");
      return;
    }
    setReason(userApproverEntry.reason || "");
  }, [approvalProcessData, userApproverEntry]);

  // Approve action
  const handleApprove = () => {
   
    action.mutate({
      id: summaryData.id,
      data: {
        status: "Approved",
        reason,
      },
    },
      {
        onSuccess: () => successToaster("Request approved successfully."),
      });
  };

  // Reject action
  const handleReject = () => {
    
    action.mutate({
      id: summaryData.id,
      data: {
        status: "Rejected",
        reason,
      },
    }, {
      onSuccess: () => successToaster("Request rejected successfully."),
    })
  };

  return (
    <div>
      {/* Current Date Display */}
      <div className="text-lg text-default_text/60 mb-2">
        <p>{currentDate}</p>
      </div>

      <div className="space-y-2 border border-border bg-background p-4 rounded-xl mb-4">
        {/* Approval Timeline Section */}
        <div className="bg-grey p-6 rounded-xl">
          <ApprovalTimeline approvalProcessData={approvalProcessData} />
        </div>

        <div className="flex justify-between space-x-4">
          {/* Loan Summary Section */}
          <LoanSummary
            data={summaryData}
            salary={salary}
           
            isNewRequest={true}
          />

          {/* Approval / Reason Section */}
          <div className="flex flex-col w-full p-4 space-y-4 bg-grey rounded-xl">
            <textarea
              name="reason"
              className="p-4 text-base text-default_text w-full bg-background rounded-2xl border border-border focus:outline-none focus:border-primary"
              placeholder="Add your reason here..."
              style={{ height: "6em", resize: "none" }}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={!canEditReason}
            />

            {isOverallFinalized ? (
              // If overall is already Approved/Rejected
              <div className="flex space-x-4 justify-end">
                <button
                  className={`cursor-default flex items-center ${overallLoanStatus === "approved"
                      ? "text-green-500"
                      : "text-primary"
                    } py-3 px-10 justify-center border rounded-2xl`}
                >
                  <p className="mr-2 text-sm font-semibold capitalize">
                    {overallLoanStatus === "approved" ? "Approved" : "Rejected"}
                  </p>
                  {overallLoanStatus === "approved" ? (
                    <Check className="h-5 w-5 bg-green-400 text-white rounded-full p-1" />
                  ) : (
                    <XMarkIcon className="h-5 w-5 bg-primary text-white rounded-full p-1" />
                  )}
                </button>
              </div>
            ) : userApproverEntry ? (
              userIsNextApprover && userStatus === "pending" ? (
                <div className="flex space-x-4 justify-end">
                  {/* Reject Button */}
                  <button
                    className={`cursor-pointer ${!canEditReason ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    onClick={handleReject}
                    disabled={!canEditReason}
                  >
                    <div className="bg-background shadow-sm px-10 py-3 text-xs my-2 rounded-full">
                      <XMarkIcon className="h-5 w-5 bg-primary text-white rounded-full p-1" />
                    </div>
                    <p>Reject</p>
                  </button>

                  {/* Approve Button */}
                  <button
                    className={`cursor-pointer ${!canEditReason ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    onClick={handleApprove}
                    disabled={!canEditReason}
                  >
                    <div className="bg-background shadow-sm px-10 py-3 text-xs my-2 rounded-full">
                      <Check className="h-5 w-5 bg-green-400 text-white rounded-full p-1" />
                    </div>
                    <p>Approve</p>
                  </button>
                </div>
              ) : (
                // If user is in the chain but either not next or has acted already
                <div className="text-sm text-default_text">
                  {userStatus === "approved" || userStatus === "rejected"
                    ? "You have already acted on this request."
                    : "Waiting on previous approver before you can proceed."}
                </div>
              )
            ) : (
              // User is not in the chain
              <div className="text-sm text-default_text">
                You are not in the approval chain for this request.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SingleRequest;
