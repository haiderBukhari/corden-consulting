
import Layout from "../../../components/layout/layout";
import withAuth from "../../../components/auth/auth"
import useGetActiveUser from "../../../hooks/query/getUserFromLocalStorage";
import TeamLeaveList from "../../../components/common/TeamLeave/TeamLeaveList";
const TeamLeave = () => {
  const { data: user } = useGetActiveUser()
  const isTeam = true;
  return (
    <Layout title={'Team Leave List'} subtitle={'Team > Leave List'}>
      <TeamLeaveList role={user.role} isTeam={isTeam} />
    </Layout>
  )
}
export default withAuth(TeamLeave, ['team_lead']);
