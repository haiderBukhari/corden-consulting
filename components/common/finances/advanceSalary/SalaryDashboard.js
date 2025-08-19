import React, { useState } from "react";
import { useRouter } from "next/router";
import { ArrowRight } from "lucide-react";
import SalaryTable from "./SalaryTable";
import { getEarlySalaryList } from "../../../../hooks/query/finances/salary/getEarlySalaryList";
import { getManagerEarlySalaryList } from "../../../../hooks/query/finances/salary/getManagerSalaryList";
import DataLoader from "../../../ui/dataLoader";
import { getEarlySalaryStats } from "../../../../hooks/query/finances/salary/getSalaryStats";
import { getAllSalaryList } from "../../../../hooks/query/finances/salary/getAllSalaryList";

export default function AdvanceSalaryDashboard({ mode, role, user, isApproverOne }) {
  const router = useRouter();
  const [activeCard, setActiveCard] = useState("");
  const { data: UserSalaryList, isLoading: isLoadingSalaryList } = getEarlySalaryList();
  const { data: ManagerSalaryList, isLoading: isLoadingManagerSalaryList } = getAllSalaryList();
  const { data: SalaryStats, isLoading: SalaryLoading } = getEarlySalaryStats()

  const handleCardClick = (card) => {
    setActiveCard(card.label);
    router.push(card.navigateTo);
  };

  const isPendingRequest = ManagerSalaryList?.filter((salary) =>
    salary.approval_process.some(
      (approver) => approver.approver_id === user?.id && approver.status === "pending"
    )
  );
  
  const managerArray = Array.isArray(ManagerSalaryList) ? ManagerSalaryList : [];
  const userArray = Array.isArray(UserSalaryList) ? UserSalaryList : [];

  const displayedSalaryList =
    role === "manager" && mode === "workforce"
      ? managerArray
      : userArray;

  let cardData = [];
  if (role === "manager" && mode === "workforce") {
    cardData.push({
      label: "New Requests",
      navigateTo: "/finances/workforce/advance-salary/new_requests",
      value: isPendingRequest?.length,
    });
    cardData.push({
      label: "All Salary History",
      navigateTo: "/finances/workforce/advance-salary/history",
      value: displayedSalaryList?.length,
    });;
    // Optionally show "Create New Loan" if manager isApproverOne
    if (isApproverOne) {
      cardData.push({
        label: "Create Advance Salary",
        navigateTo: "/finances/workforce/advance-salary/create_advance_salary_request",
      });
    }
  } else {
    // PERSONAL view (manager acting as a normal user)
    cardData.push({
      label: "Salary History",
      navigateTo: "/finances/advance-salary/history",
      value: displayedSalaryList?.length,
    });
    cardData.push({
      label: "Request Advance Salary",
      navigateTo: "/finances/advance-salary/create_advance_salary_request",
    });
  }

  return (
    <div>
      {isLoadingManagerSalaryList || isLoadingSalaryList ? (
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
                <div className={`flex justify-between items-start  ${activeCard === card.label
                  ? " text-white"
                  : "text-default_text "
                  }`}>
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
                SalaryStats?.total_es_issued,
                SalaryStats?.total_outstanding,
                SalaryStats?.last_month_payments,

                SalaryStats?.total_staff_with_es,
              ].map((value, index) => (
                <div
                  key={index}
                  className="p-4  bg-gray-100 rounded-xl border text-start space-y-6 "
                >
                  <p className="text-base text-gray-700">
                    {[
                      "Total Amount of Advance Salary Issued",
                      "Amount of Advance Salary Outstanding",
                      "Amount of Advance Salary Received Last Month",
                      "Total Number of Staff with Advance Salary",
                    ][index]}
                  </p>
                  <h3 className="text-xl font-bold mt-2">
                    {typeof value === 'number' ? value : `$${value}`}
                  </h3>
                </div>
              ))}
            </div>
          )}

          <SalaryTable mode={mode} data={displayedSalaryList} title={"Advance Salary Summary"} />
        </div>
      )}
    </div >
  );
}