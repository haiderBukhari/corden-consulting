import Layout from "../../components/layout/layout";
import withAuth from "../../components/auth/auth"
import useDemoUser from "../../hooks/useDemoUser";
import StaffDashboard from "../../components/StaffDashboard/dashboard";

const HRDashboard = () => {
  const { data: user } = useDemoUser();

  // Dummy data for demo
  const pendingApprovals = {
    leaves: [],
    totalCount: 0,
  };

  return (
    <Layout title={'Dashboard'} subtitle={'Overview'}>
      <StaffDashboard role={user?.role} id={user?.id} pendingLeaveApprovals={pendingApprovals} isLoading={false} />
    </Layout>
  )
}

export default withAuth(HRDashboard, ['HR', 'manager']);
