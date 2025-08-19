import Layout from "../../components/layout/layout"
import StaffDashboard from "../../components/StaffDashboard/dashboard";
import withAuth from "../../components/auth/auth"
import { UseHRandManagerLeaveApprovalRequests } from "../../hooks/query/getHRandManagerLeaveApprovalRequests";
import useGetActiveUser from "../../hooks/query/getUserFromLocalStorage";
import { getManagerEarlySalaryList } from "../../hooks/query/finances/salary/getManagerSalaryList";
import { getAllManagerLoansList } from "../../hooks/query/finances/loan/getManagerLoanList";
import { getAllLeaveList } from "../../hooks/query/getALLLeaveList";
import { successToaster } from "../../utils/toaster";
import { useState } from "react";
import UserOnboardingContainer from "../../components/common/onboarding/user/UserOnboardingContainer";
import { UseGetProfile } from "../../hooks/query/getProfile";
const Home = () => {

  const { data: HRandManagerLeaves, isLoading } = UseHRandManagerLeaveApprovalRequests("pending");
  const { data: advanceSalaryList, } = getManagerEarlySalaryList();
 
  
  const { data: LoanList,  } = getAllManagerLoansList();
 
  const pendingSalaries = advanceSalaryList?.filter(salary => salary?.early_salary_details?.status === 'pending') || [];

  // Filter pending loan requests
  const pendingLoans = LoanList?.filter(loan => loan?.loan_details?.status === 'Pending') || [];

  // Consolidate all pending items into one object for manager
  const pendingApprovals = {
    leaves: HRandManagerLeaves,
    salaries: pendingSalaries,
    loans: pendingLoans,
    totalCount: HRandManagerLeaves?.length + pendingSalaries?.length + pendingLoans?.length,
  };
  const { data: userProfile } = UseGetProfile();
  const { data: user, isLoading: isUserLoading, refetch: refetchUser } = useGetActiveUser();


  return (
    <Layout title={'Dashboard'} subtitle={'Overview'} userProfile={userProfile}>
      <StaffDashboard role={user.role} id={user?.id} pendingLeaveApprovals={pendingApprovals} isLoading={isLoading} />
    </Layout>
  )
  }

export default withAuth(Home, ['staff', 'manager', 'team_lead']);
