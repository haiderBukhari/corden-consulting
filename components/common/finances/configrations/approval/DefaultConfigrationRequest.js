import React, { useState } from 'react';
import { getLoanConfigrationApprovalList } from '../../../../../hooks/query/finances/loan/getLoanConfigrationApprovalList';
import DefaultConfigrationApprovalList from './DefaultConfigrationApprovalList';
import { formatDateToDdMmYy } from '../../../../../utils/functions';
import { getSalaryConfigrationApprovalList } from '../../../../../hooks/query/finances/salary/getSalaryConfigrationApprovalList';
import { getPayrollConfigrationApprovalList } from '../../../../../hooks/query/finances/payroll/getPayrollConfigrationApprovalList';
import UseApproveLoanConfigrationApproval from '../../../../../hooks/mutations/finances/loan/approveLoanConfigrationApproval';
import UseApproveSalaryConfigrationApproval from '../../../../../hooks/mutations/finances/salary/approveSalaryConfigration';
import UseApprovePayrollConfigrationApproval from '../../../../../hooks/mutations/finances/payroll/approvePayrollConfigrationApproval';
const DefaultConfigrationRequest = ({ role }) => {
  const [activeTab, setActiveTab] = useState('loan_requests');
  const { data: LoanConfigrationData } = getLoanConfigrationApprovalList()
  const { data: SalaryConfigrationData } = getSalaryConfigrationApprovalList()
  const { data: PayrollConfigrationData } = getPayrollConfigrationApprovalList()
  const updateLoanConfigration = UseApproveLoanConfigrationApproval();
  const updateSalaryConfigration = UseApproveSalaryConfigrationApproval();
  const updatePayrollConfigration=UseApprovePayrollConfigrationApproval()
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };
  const getStatusStyle = (status) => {
    switch (status) {
      case 'approved':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-red-600 bg-yellow-100';
      case 'rejected':
        return 'text-gray-600 bg-red-100';
      case 'cancelled':
        return 'text-gray-600 bg-gray-100';
      default:
        return '';
    }
  };
  const loanColumns = [
    { label: 'ID', accessor: 'id' },
    { label: 'Repayment Method', accessor: 'repayment_method' },
    { label: 'Default Cap', accessor: 'default_loan_cap' },
    { label: 'Cut-off Period', accessor: (item) => formatDateToDdMmYy(new Date(item.cut_off_period)) },
    { label: 'Created At', accessor: (item) => formatDateToDdMmYy(new Date(item.created_at)) },
    { label: 'Created On', accessor: 'requested_by' },
    { label: 'Approvers', accessor: (item) => item.approvers.map((a) => a.user_name).join(', ') },
    {
      label: 'Status',
      accessor: (item) => (
        <p className={`px-2 py-2 rounded-lg text-center ${getStatusStyle(item.status)}`}>
          {item.status}
        </p>
      ),
    },
  ];

  const columns = [
    { label: 'ID', accessor: 'id' },

    { label: 'Cut-off Period', accessor: (item) => formatDateToDdMmYy(new Date(item.cut_off_period)) },
    { label: 'Approvers', accessor: (item) => item.approvers.map((a) => a.user_name).join(', ') },
    { label: 'Created On', accessor: (item) => formatDateToDdMmYy(new Date(item.created_at)) },
    { label: 'Created By', accessor: 'requested_by' },
    {
      label: 'Status',
      accessor: (item) => (
        <p className={`px-2 py-2 rounded-lg  text-center ${getStatusStyle(item.status)}`}>
          {item.status}
        </p>
      ),
    },
  ];

  return (
    <>
      <div className="p-3">
        {/* Tab navigation */}
        {
          role === "manager" &&
          <div className="grid grid-cols-3 gap-2 mb-4">
            <button
              className={`mr-4 border-2 rounded-lg py-2 ${activeTab === 'payroll' ? 'bg-primary text-white' : 'border-primary text-primary'}`}
              onClick={() => handleTabChange('payroll')}
            >
              Payroll Configuration Request
            </button>
            <button
              className={` border-2 rounded-lg py-2 ${activeTab === 'loan_requests' ? 'bg-primary text-white' : 'border-primary text-primary'}`}
              onClick={() => handleTabChange('loan_requests')}
            >
              Loan Configuration Request
            </button>
            <button
              className={`mr-4 border-2 rounded-lg py-2 ${activeTab === 'advance_salary_requests' ? 'bg-primary text-white' : 'border-primary text-primary'}`}
              onClick={() => handleTabChange('advance_salary_requests')}
            >
              Advance Salary Configuration Request
            </button>

          </div>
        }

        {/* Content based on active tab */}
        {activeTab === 'payroll' && <DefaultConfigrationApprovalList columns={columns} data={PayrollConfigrationData} role={role}  action={updatePayrollConfigration} type={'payroll'}/>}
        {activeTab === 'advance_salary_requests' && <DefaultConfigrationApprovalList columns={columns} data={SalaryConfigrationData} role={role}  action={updateSalaryConfigration} type={'salary'}/>}
        {activeTab === 'loan_requests' && <DefaultConfigrationApprovalList columns={loanColumns} data={LoanConfigrationData} role={role} action={updateLoanConfigration} type={'loan'}/>}
      </div>
    </>
  );
};

export default DefaultConfigrationRequest;