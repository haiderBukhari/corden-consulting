import React, { useState } from 'react';
import ApprovalsComponent from './ApprovalsComponent';

import { UseHRandManagerLeaveApprovalRequests } from '../../../hooks/query/getHRandManagerLeaveApprovalRequests';
import DataLoader from '../../ui/dataLoader';
import { UseGetConfigurations } from '../../../hooks/query/admin/getConfigurations';
import { UseGetLoanCount } from '../../../hooks/query/payroll/getLoanCount';

const AllApprovalsListComponent = ({ role, currentUserName }) => {
  const [activeTab, setActiveTab] = useState('leave_requests');
  const { data: HRandManagerLeaves, isLoading: isLoadingHRandManagerLeaves } = UseHRandManagerLeaveApprovalRequests("pending");
  const { data: configurations, isLoading: isLoadingConfigurations } = UseGetConfigurations();
  const { data: count, countLoading } = UseGetLoanCount()
  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const noOfDays = configurations && configurations.length > 0 && configurations[0]?.no_of_days;

  // Filter the leaves based on the specified conditions
  const filteredLeaves = HRandManagerLeaves?.filter(leave =>
    leave.leave_status === 'pending' &&
    leave.manager_status === 'pending' &&
    leave?.no_of_days >= noOfDays
  );

  return (
    <>
      {
        isLoadingHRandManagerLeaves || isLoadingConfigurations || countLoading ?
          <DataLoader />
          :
          <div className="">
            <ApprovalsComponent role={role} currentUserName={currentUserName} leaves={filteredLeaves} />
            
          </div>
      }
    </>
  );
};

export default AllApprovalsListComponent;
