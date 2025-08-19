
import TeamLeaveList from "../../../components/common/TeamLeave/TeamLeaveList";
import Layout from "../../../components/layout/layout";
import withAuth from "../../../components/auth/auth"
import useGetActiveUser from "../../../hooks/query/getUserFromLocalStorage";

const TeamLeave = () => {
  const { data: user } = useGetActiveUser()

  return (
    <Layout title={'Team Leave List'} subtitle={'Workforce > Leave List'}>
      <TeamLeaveList role={user.role} />
    </Layout>
  )
}
export default withAuth(TeamLeave, ['HR', 'manager','team_lead']);
