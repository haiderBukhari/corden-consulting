import { useState, useEffect } from "react";
import Layout from "../../components/layout/layout"
import { useRouter } from 'next/router';
import withAuth from "../../components/auth/auth"
import useGetActiveUser from "../../hooks/query/getUserFromLocalStorage";
import RequestLeaveComponent from "../../components/common/leave_management/RequestLeaveComponent";
import { useGetMemberDetail } from "../../hooks/query/team_lead/team/getMemberDetail";

const RequestLeave = () => {
  const router = useRouter();
  const { role } = router.query;
  const { data: user } = useGetActiveUser();
  const { data: member, isLoading: memberLoading } = useGetMemberDetail(user?.id);

  return (
    <Layout title={'Leave Management'} subtitle={'Request Leave'}>
      <RequestLeaveComponent role={user?.role} id={user?.id} member={member} />
    </Layout>
  )
}
export default withAuth(RequestLeave, ['team_lead', 'staff', 'manager', 'HR']);
