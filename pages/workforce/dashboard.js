import Layout from "../../components/layout/layout";
import WorkforceDashboardComponent from "../../components/common/WorkForce/dashboard";
import withAuth from "../../components/auth/auth";
import useGetActiveUser from "../../hooks/query/getUserFromLocalStorage";

const WorkforceDashboard = () => {
  const { data: user } = useGetActiveUser();

  return (
    <Layout title={'Dashboard'} subtitle={'Workforce > Dashboard'}>
      <WorkforceDashboardComponent role={user.role} />
    </Layout>
  )
}

export default withAuth(WorkforceDashboard, ['HR', 'manager']);

