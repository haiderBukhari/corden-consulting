import Layout from "../../components/layout/layout";
import withAuth from "../../components/auth/auth";
import useGetActiveUser from "../../hooks/query/getUserFromLocalStorage";
import TeamAttendanceList from "../../components/common/TeamAttendance/TeamAttendenceList";
const  AdminAttendance= () =>{
  const { data: user } = useGetActiveUser()

  return (
    <Layout title={'Attendance'} subtitle={'Overview'}>
      <TeamAttendanceList role={user.role}/>
    </Layout>
  )
}

export default withAuth(AdminAttendance, ['admin']);
