import Layout from "../../../components/layout/layout";
import withAuth from "../../../components/auth/auth"
import useGetActiveUser from "../../../hooks/query/getUserFromLocalStorage";

import TeamAttendanceReport from "../../../components/common/TeamAttendance/TeamAttendanceReport";
const TeamReport = () => {
  const { data: user } = useGetActiveUser()
  const isTeam = true;
  return (
    <Layout title={'Team Report'} subtitle={'Team > Report'}>
      <TeamAttendanceReport role={user.role} isTeam={isTeam} />
    </Layout>
  )
}
export default withAuth(TeamReport, ['team_lead']);
