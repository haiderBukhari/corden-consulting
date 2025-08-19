import React, { useState } from "react";
import RequestManagementComponent from "./GeneralComponent";
import { UseGetLoanList } from "../../../hooks/query/payroll/loan/getLoanList";
import UseApproveRejectLoan from "../../../hooks/mutations/payroll/loan/ApproveRejectLoan";

export default function LoanRequestsComponent() {
    const { data: LoanList, isLoading } = UseGetLoanList()
    return (
        <div>
            <RequestManagementComponent data={LoanList} role={'manager'} manageRequestApi={UseApproveRejectLoan} isLoading={isLoading} />
        </div>
    );
}
