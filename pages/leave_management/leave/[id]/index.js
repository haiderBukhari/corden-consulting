import Layout from "../../../../components/layout/layout"
import withAuth from "../../../../components/auth/auth"
import useGetActiveUser from "../../../../hooks/query/getUserFromLocalStorage";
import LeaveDetailPage from "../../../../components/common/leave_management/LeaveDetailPage";

const LeaveDetail = () => {
  const { data: user } = useGetActiveUser();

  return (
    <Layout title={'Leave Detail Page'} subtitle={'Leave Management > Leave Detail Page'}>
      <LeaveDetailPage role={user.role} isIndividualUser={true}/>
    </Layout>
  )
}

export default withAuth(LeaveDetail, ['staff', 'team_lead', 'manager', 'HR']);
