import React from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/router";
import DataLoader from "../../../ui/dataLoader";
import SalaryTable from "./SalaryTable";
import { getEarlySalaryList } from "../../../../hooks/query/finances/salary/getEarlySalaryList";
import { getAllSalaryList } from "../../../../hooks/query/finances/salary/getAllSalaryList";

export default function SalaryHistory({ user, mode }) {
  const router = useRouter();
  const { data: SalaryList, isLoadingUserList } = getEarlySalaryList();
  const { data: managerSalaryList, isLoadingManagerList } = getAllSalaryList();

  const managerArray = Array.isArray(managerSalaryList) ? managerSalaryList : [];
  const userArray = Array.isArray(SalaryList) ? SalaryList : [];

  let displayedSalaryList = userArray;
  if (user?.role === "manager") {
    if (mode === "workforce") {
      displayedSalaryList = [...managerArray, ...userArray];
    } else {
      displayedSalaryList = userArray;
    }
  } else {
    displayedSalaryList = userArray;
  }

  return (
    <div>
      {isLoadingManagerList || isLoadingUserList ? (
        <DataLoader />
      ) : (
        <div className="p-4 min-h-screen">
          <button
            onClick={() => router.push(mode === "workforce" ? "/finances/workforce/advance-salary" : "/finances/advance-salary")}
            type="button"
            className="flex space-x-2 items-center px-2 py-1 text-white bg-primary rounded-xl mb-3"
          >
            <ArrowLeft className="text-white h-5 w-5" />
            <span>Back</span>
          </button>
          <SalaryTable
            mode={mode}
            data={displayedSalaryList}
            title={"Advance Salary History"}
          />
        </div>
      )}
    </div>
  );
}
