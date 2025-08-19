
import Layout from "../../../components/layout/layout";
import withAuth from "../../../components/auth/auth"
import useGetActiveUser from "../../../hooks/query/getUserFromLocalStorage";
import TeamAttendanceReport from "../../../components/common/TeamAttendance/TeamAttendanceReport";

const TeamAttendance = () => {

  const { data: user } = useGetActiveUser()

  return (
    <Layout title={'Attendance Report'} subtitle={'Workforce > Attendance > Report'}>
      <TeamAttendanceReport role={user.role} />
    </Layout>
  )
}
export default withAuth(TeamAttendance, ['HR', 'manager']);
