import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/router";
import SingleRequest from "../../common/SingleRequest";
import UseApproveRejectAdvanceSalary from "../../../../../hooks/mutations/finances/salary/SalaryAction";

function NewRequests({ user, requests, mode }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("pending");
  const salaryAction = UseApproveRejectAdvanceSalary()

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const transformedRequests = requests?.map((loanItem) => {
    const { early_salary_details, approval_process } = loanItem;
    const {
      id: id,
      requested_by,
      status: overallLoanStatus,
      es_amount,
      created_at,
      due_date,
      reason,
      month
    } = early_salary_details;
    const approvalProcessData = approval_process?.map((item) => ({ ...item }));
    const currentApprover = approvalProcessData.find(
      (appr) => appr.approver_id === user?.id
    );
    const currentUserStatus = currentApprover ? currentApprover.status?.toLowerCase() : null;
    const summaryData = {
      id,
      userRequestingName: requested_by,
      details: [
        { label: "Salary Amount", value: es_amount, format: "currency" },
        { label: "Status", value: overallLoanStatus },
        { label: "Reason", value: reason },
        { label: "Month", value: month },
        {
          label: "Due Date",
          value: due_date,
          format: "date",
        },
        {
          label: "Apply Date",
          value: created_at,
          format: "date",
        },
      ],
    };

    return {
      summaryData,
      approvalProcessData,
      overallLoanStatus: overallLoanStatus.toLowerCase(),
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
          onClick={() => router.push("/finances/workforce/advance-salary")}
          type="button"
          className="flex space-x-2 items-center px-2 py-1 text-white bg-primary rounded-xl"
        >
          <ArrowLeft className="text-white h-5 w-5" />
          <span>Back</span>
        </button>

        {/* Tabs for Filtering */}
        <div className="flex space-x-4">
          <button
            className={`px-4 py-2 rounded-full ${activeTab === "pending" ? "bg-primary text-white" : "bg-gray-200 text-gray-700"
              }`}
            onClick={() => handleTabChange("pending")}
          >
            Pending
          </button>
          <button
            className={`px-4 py-2 rounded-full ${activeTab === "approved" ? "bg-primary text-white" : "bg-gray-200 text-gray-700"
              }`}
            onClick={() => handleTabChange("approved")}
          >
            Approved
          </button>
          <button
            className={`px-4 py-2 rounded-full ${activeTab === "rejected" ? "bg-primary text-white" : "bg-gray-200 text-gray-700"
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
              salary={true}
              user={user}
              action={salaryAction}
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