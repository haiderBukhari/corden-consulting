import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/router";
import SingleRequest from "../common/SingleRequest";
import UseLoanAction from "../../../../hooks/mutations/finances/loan/loanAction";

function NewRequests({ user, requests }) {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("pending");

  const loanAction = UseLoanAction()

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const transformedRequests = requests?.map((loanItem) => {
    const { loan_details, approval_process, repayment_schedule } = loanItem;
    const {
      id,
      requested_by,
      type,
      status: overallLoanStatusRaw,
      amount_left,
      loan_amount,
      first_payment_date,
      position,
    } = loan_details;

    const approvalProcessData = approval_process?.map((item) => ({ ...item }));

    const currentApprover = approvalProcessData.find(
      (appr) => appr.approver_id === user?.id
    );
    const currentUserStatus = currentApprover
      ? currentApprover.status?.toLowerCase()
      : null;

    const summaryData = {
      id,
      userRequestingName: requested_by,
      requestType: "Loan",
      details: [
        { label: "Position", value: position?.name },
        { label: "Loan Amount", value: loan_amount, format: "currency" },
        { label: "Loan Status", value: overallLoanStatusRaw },
        { label: "Amount Left", value: amount_left, format: "currency" },
        {
          label: "First Payment Date",
          value: first_payment_date,
          format: "date",
        },
      ],
      // repayment_schedule: repayment_schedule,
    };

    return {
      summaryData,
      approvalProcessData,
      overallLoanStatus: overallLoanStatusRaw.toLowerCase(),
      userApprovalStatus: currentUserStatus,
    };
  });

  const filteredRequests = transformedRequests?.filter((req) => {
    const { overallLoanStatus, userApprovalStatus } = req;

    if (overallLoanStatus === "rejected") {
      return activeTab === "rejected";
    }

    if (overallLoanStatus === "approved") {
      return activeTab === "approved";
    }

    if (overallLoanStatus === "pending") {
      if (activeTab === "pending" && userApprovalStatus === "pending") {
        return true;
      }
      if (activeTab === "approved" && userApprovalStatus === "approved") {
        return true;
      }
      if (activeTab === "rejected" && userApprovalStatus === "rejected") {
        return true;
      }
    }

    return false;
  });

  return (
    <div className="p-4 min-h-screen">
      <div className="flex justify-between items-center mb-3">
        {/* Back Button */}

        <button
          onClick={() => router.push("/finances/workforce/loan")}
          type="button"
          className="flex space-x-2 items-center px-2 py-1 text-white bg-primary rounded-xl mb-3"
        >
          <ArrowLeft className="text-white h-5 w-5" />
          <span>Back</span>
        </button>

        {/* Tabs for Filtering */}
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 rounded-full ${
              activeTab === "pending"
                ? "bg-primary text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => handleTabChange("pending")}
          >
            Pending
          </button>
          <button
            className={`px-4 py-2 rounded-full ${
              activeTab === "approved"
                ? "bg-primary text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => handleTabChange("approved")}
          >
            Approved
          </button>
          <button
            className={`px-4 py-2 rounded-full ${
              activeTab === "rejected"
                ? "bg-primary text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => handleTabChange("rejected")}
          >
            Rejected
          </button>
        </div>
      </div>

      {/* Render Filtered Requests */}
      <div className="overflow-y-auto p-4 rounded-xl border border-gray-200">
        {filteredRequests?.length > 0 ? (
          filteredRequests.map((request) => (
            <SingleRequest
              key={request.summaryData.id} // Use loanId as key for better performance
              approvalProcessData={request.approvalProcessData}
              summaryData={request.summaryData}
              user={user}
              action={loanAction}
            />
          ))
        ) : (
          <p className="text-gray-500 text-center">No requests found.</p>
        )}
      </div>
    </div>
  );
}

export default NewRequests;
