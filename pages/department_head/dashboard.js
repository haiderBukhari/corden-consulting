import Layout from "../../components/layout/layout";
import withAuth from "../../components/auth/auth"
import useGetActiveUser from "../../hooks/query/getUserFromLocalStorage";
import StaffDashboard from "../../components/StaffDashboard/dashboard";
import { UseHRandManagerLeaveApprovalRequests } from "../../hooks/query/getHRandManagerLeaveApprovalRequests";

const DHDashboard = () => {
  const { data: user } = useGetActiveUser()
  const { data: HRandManagerLeaves, isLoading } = UseHRandManagerLeaveApprovalRequests("pending");

  const pendingApprovals = {
    leaves: HRandManagerLeaves,
    totalCount: HRandManagerLeaves?.length,
  };

  return (
    <Layout title={'Dashboard'} subtitle={'Overview'}>
      <StaffDashboard role={user.role} id={user?.id} pendingLeaveApprovals={pendingApprovals} isLoading={isLoading} />
    </Layout>
  )
}

export default withAuth(DHDashboard, ['HR', 'manager','department_head']);
