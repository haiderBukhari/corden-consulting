import Layout from "../components/layout/layout"
import AttendanceComponent from "../components/common/attendance/AttendanceComponent";
import withAuth from "../components/auth/auth"
import useGetActiveUser from "../hooks/query/getUserFromLocalStorage";

const Attendance = () => {
  const { data: user } = useGetActiveUser();

  return (
    <Layout title={'Attendance'} subtitle={'Overview'}>
      <AttendanceComponent role={user.role} id={user?.id} isShowBackButton={false}/>
    </Layout>
  )
}

export default withAuth(Attendance, ['staff', 'team_lead', 'manager','HR']);
