import React, { useState } from "react";
import { useRouter } from "next/router";
import { ArrowRight } from "lucide-react";
import LoanTable from "./LoanTable";
import { getUserLoansList } from "../../../../hooks/query/finances/loan/getUserLoanList";
import DataLoader from "../../../ui/dataLoader";
import { getLoanStats } from "../../../../hooks/query/finances/loan/getLoanStats";
import { getAllLoanList } from "../../../../hooks/query/finances/loan/getAllLaonList";

export default function LoanDashboard({ mode, role, userId, user, isApproverOne }) {
  const router = useRouter();
  const [activeCard, setActiveCard] = useState("");
  const { data: managerLoanList, isLoading: isLoadingManagerLoanList } = getAllLoanList();
  const { data: userLoanList, isLoading: isLoadingUserLoanList } = getUserLoansList(userId);
  const { data: loanStats, isLoading: LoanStatsLoading } = getLoanStats();

  const managerArray = Array.isArray(managerLoanList) ? managerLoanList : [];
  const userArray = Array.isArray(userLoanList) ? userLoanList : [];

  const isPendingRequest = managerArray?.filter((loan) =>
    loan.approval_process.some(
      (approver) =>
        approver.approver_id === user?.id && approver.status.toLowerCase() === "pending"
    )
  );

  const displayedLoanList =
    role === "manager" && mode === "workforce"
      ? managerArray
      : userArray;

  let cardData = [];
  if (role === "manager" && mode === "workforce") {
    cardData.push({
      label: "New Requests",
      navigateTo: "/finances/workforce/loan/new_requests",
      value: isPendingRequest?.length,
    });
    cardData.push({
      label: "Loan History",
      navigateTo: "/finances/workforce/loan/history",
      value: displayedLoanList?.length,
    });
   
    if (isApproverOne) {
      cardData.push({
        label: "Create New Loan",
        navigateTo: "/finances/workforce/loan/create_loan_request",
      });
    }
  } else {
   
    cardData.push({
      label: "Loan History",
      navigateTo: "/finances/loan/history",
      value: displayedLoanList?.length,
    });
    cardData.push({
      label: "Request New Loan",
      navigateTo: "/finances/loan/create_loan_request",
    });
  }

  const handleCardClick = (card) => {
    setActiveCard(card.label)

    router.push(card.navigateTo);
  };

  return (
    <div>
      {isLoadingManagerLoanList || isLoadingUserLoanList || LoanStatsLoading? (
        <DataLoader />
      ) : (
        <div className="p-3 bg-white min-h-screen">
          {/* Top Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {cardData.map((card) => (
              <div
                key={card.label}
                onClick={() => handleCardClick(card)}
                className={`p-4 h-32 w-full text-start border border-primary rounded-lg cursor-pointer space-y-4 flex flex-col justify-between shadow-md 
                  ${activeCard === card.label
                    ? "bg-primary text-white"
                    : "bg-white text-default_text"
                  }`}
              >
                <h3 className="text-lg ">{card.label}</h3>
                <div
                  className={`flex justify-between items-start  ${activeCard === card.label ? " text-white" : "text-default_text "
                    }`}
                >
                  <p className={`text-2xl font-bold `}>{card.value}</p>

                  <ArrowRight className="text-xl self-end" />
                </div>
              </div>
            ))}
          </div>

          {/* Statistics Cards */}
          {role === "manager" && mode === "workforce" && (
            <div className="grid grid-cols-4 gap-4 mb-6">
              {[
                loanStats?.total_loans_issued,
                loanStats?.total_outstanding,
                loanStats?.last_month_payments,
                loanStats?.staff_with_loans,
              ].map((value, index) => (
                <div
                  key={index}
                  className="p-4 h-32 bg-gray-100 rounded-xl border text-start space-y-9 "
                >
                  <p className="text-base text-gray-700">
                    {[
                      "Total Amount of Loans Issued",
                      "Amount of Loans Outstanding",
                      "Amount Received Last Month",
                      "Total Number of Staff with Loans",
                    ][index]}
                  </p>
                  <h3 className="text-xl font-bold">
                    {typeof value === 'number' ? value : `$${value}`}
                  </h3>
                </div>
              ))}
            </div>
          )}

          <LoanTable mode={mode} loans={displayedLoanList} title={"All Loans"} />
        </div>
      )}
    </div>
  );
}
