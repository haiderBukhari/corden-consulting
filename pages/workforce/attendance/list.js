
import Layout from "../../../components/layout/layout";
import withAuth from "../../../components/auth/auth"
import useGetActiveUser from "../../../hooks/query/getUserFromLocalStorage";
import TeamAttendanceList from "../../../components/common/TeamAttendance/TeamAttendenceList";
const TeamAttendance = () => {

  const { data: user } = useGetActiveUser()

  return (
    <Layout title={'Attendance List'} subtitle={'Workforce > Attendance > List'}>
      <TeamAttendanceList role={user.role} />
    </Layout>
  )
}
export default withAuth(TeamAttendance, ['HR', 'manager']);
