import Layout from '../../../components/layout/layout';
import withAuth from '../../../components/auth/auth';
import useGetActiveUser from '../../../hooks/query/getUserFromLocalStorage';
import ApprovalsHistory from '../../../components/common/RequestsHistory';

const ApprovalHistory = () => {
  const { data: user } = useGetActiveUser()

  return (
    <Layout title={'Leave List'} subtitle={'Workforce > Leave List'}>
      <ApprovalsHistory role={user.role} />
    </Layout>
  )
}

export default withAuth(ApprovalHistory, ['manager']);
