import React from "react";
import GeneralListComponent from "./GeneralListComponent";
import DataLoader from "../ui/dataLoader";
import { UseGetLoanList } from "../../hooks/query/payroll/loan/getLoanList";

export default function LoanRequestsList({role}) {
  const { data: LoanList, isLoading } = UseGetLoanList();

  return (
    <>
      {
        isLoading ?
          <DataLoader />
          :
          <div>
            <GeneralListComponent data={LoanList} role={role} listType={"loan_requests"}/>
          </div>
      }
    </>
  );
}
