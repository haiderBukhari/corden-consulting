import React from "react";
import { Check } from "lucide-react";
import { FaQuestion } from "react-icons/fa6";
import { XMarkIcon } from "@heroicons/react/24/solid";

function ApprovalTimeline({ approvalProcessData }) {
  const ApprovalStatusIcon = ({
    icon: Icon,
    name,
    role,
    date,
    status,
    created_by,
  }) => {
    let iconColorClass = "";
    let bgColor = "";

    switch (status.toLowerCase()) {
      case "approved":
        iconColorClass = "text-white";
        bgColor = "bg-green-400";
        break;
      case "rejected":
        iconColorClass = "text-white";
        bgColor = "bg-primary";
        break;
      case "pending":
        iconColorClass = "text-yellow-600";
        bgColor = "bg-orange-100";
        break;
      default:
        iconColorClass = "text-gray-500";
        break;
    }

    return (
      <div className="flex items-center">
        <div className="flex items-center flex-col">
          <div className={`p-1 rounded-full ${iconColorClass} ${bgColor} mb-1`}>
            <Icon className="h-5 w-5" />
          </div>
          <span className="text-sm capitalize font-semibold">{name}</span>

          <span className="text-xs text-gray-500 text-center">{role}</span>
          <span className="text-xs text-primary text-center">{date}</span>
          {created_by == 1 && (
            <span className="text-xs text-primary text-center font-semibold">
              (Created By Manager)
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex items-center space-x-8">
      {approvalProcessData.map((approval, index) => (
        <React.Fragment key={index}>
          <div className="flex-1 flex flex-col items-center justify-center">
            <ApprovalStatusIcon
              icon={
                approval.status.toLowerCase() === "approved"
                  ? Check
                  : approval.status.toLowerCase() === "rejected"
                  ? XMarkIcon
                  : FaQuestion
              }
              name={approval.approver_name}
              role={approval.role}
              date={approval.time_ago}
              status={approval.status}
              created_by={approval.created_by}
            />
          </div>
          {index < approvalProcessData.length - 1 && (
            <div
              className={`h-1 w-32 ${
                approval.status.toLowerCase() === "pending"
                  ? "bg-yellow-600"
                  : approval.status.toLowerCase() === "approved"
                  ? "bg-green-400"
                  : "bg-primary"
              }`}
              style={{ marginTop: "-35px" }}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export default ApprovalTimeline;
