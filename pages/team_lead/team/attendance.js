
import Layout from "../../../components/layout/layout";
import withAuth from "../../../components/auth/auth"
import TeamAttendanceList from "../../../components/common/TeamAttendance/TeamAttendenceList";
import useGetActiveUser from "../../../hooks/query/getUserFromLocalStorage";

const TeamAttendance = () => {

  const { data: user } = useGetActiveUser()

  return (
    <Layout title={'Attendance'} subtitle={'Team > Attendance'}>
      <TeamAttendanceList role={user.role} />
    </Layout>
  )
}
export default withAuth(TeamAttendance, ['HR','manager','team_lead']);
