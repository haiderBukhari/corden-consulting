import Layout from "../../components/layout/layout"
import StaffDashboard from "../../components/StaffDashboard/dashboard";
import withAuth from "../../components/auth/auth"
import useGetActiveUser from "../../hooks/query/getUserFromLocalStorage";
import { useMemberLeaves } from "../../hooks/query/team_lead/team/getMembersLeaves";
const Home = () => {
  const { data: user } = useGetActiveUser();
  const { data: allMemberPendingLeaves = [], isLoading } = useMemberLeaves('pending');

  const pendingApprovals = {
    leaves: allMemberPendingLeaves,
    totalCount: allMemberPendingLeaves?.length,
  };

  return (
    <Layout title={'Dashboard'} subtitle={'Overview'}>
      <StaffDashboard role={user.role} id={user?.id} pendingLeaveApprovals={pendingApprovals} isLoading={isLoading} />
    </Layout>
  )
}
export default withAuth(Home, ['team_lead']);