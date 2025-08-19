import React from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/router";
import LoanTable from "./LoanTable";
import { getAllManagerLoansList } from "../../../../hooks/query/finances/loan/getManagerLoanList";
import DataLoader from "../../../ui/dataLoader";
import { getUserLoansList } from "../../../../hooks/query/finances/loan/getUserLoanList";
import { getAllLoanList } from "../../../../hooks/query/finances/loan/getAllLaonList";

export default function LoanHistory({ user, mode }) {
  const router = useRouter();
  const { data: managerLoanList, isLoading: isLoadingManagerLoanList } = getAllLoanList();
  const { data: userLoanList, isLoading: isLoadingUserLoanList } = getUserLoansList(user?.id);
  
  const managerArray = Array.isArray(managerLoanList) ? managerLoanList : [];
  const loanArray = Array.isArray(userLoanList) ? userLoanList : [];

  let displayedLoanList = loanArray;
  if (user?.role === "manager") {
    if (mode === "workforce") {
      displayedLoanList = [...managerArray, ...loanArray];
    } else {
      displayedLoanList = loanArray;
    }
  } else {
    displayedLoanList = loanArray;
  }

  return (
    <div>
      {isLoadingManagerLoanList || isLoadingUserLoanList ? (
        <DataLoader />
      ) : (
        <div className="p-4 min-h-screen">
          <button
            onClick={() => router.push(mode === "workforce" ? "/finances/workforce/loan" : "/finances/loan")}
            type="button"
            className="flex space-x-2 items-center px-2 py-1 text-white bg-primary rounded-xl mb-3"
          >
            <ArrowLeft className="text-white h-5 w-5" />
            <span>Back</span>
          </button>
          <LoanTable mode={mode} loans={displayedLoanList} title={"Loan History"} />
        </div>
      )}
    </div>
  );
}
