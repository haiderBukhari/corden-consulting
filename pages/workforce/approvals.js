import Layout from '../../components/layout/layout';
import withAuth from '../../components/auth/auth';
import useGetActiveUser from '../../hooks/query/getUserFromLocalStorage';
import AllApprovalsListComponent from '../../components/Team/approvals/AllApprovalsListComponent';

const Approval = () => {
  const { data: user } = useGetActiveUser()

  return (
    <Layout title={'Leave Approvals'} subtitle={'Workforce > Leave Approvals'}>
      <AllApprovalsListComponent role={user.role} />
    </Layout>
  )
}

export default withAuth(Approval, ['team_lead', 'manager', "HR"]);
