import AttendanceComponent from "../../../../components/common/attendance/AttendanceComponent";
import Layout from '../../../../components/layout/layout';
import { useRouter } from 'next/router';
import withAuth from "../../../../components/auth/auth"
import { useGetMemberDetail } from "../../../../hooks/query/team_lead/team/getMemberDetail";
import useGetActiveUser from "../../../../hooks/query/getUserFromLocalStorage";
const MemberAttendance = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: user } = useGetActiveUser()
  const { data: member } = useGetMemberDetail(id)
  
  return (
    <Layout title={'Attendance'} subtitle={`Workforce > People > All Employees > ${member?.name} > Attendance`}>
      <AttendanceComponent role={user.role} id={id} isShowBackButton={true}/>
    </Layout>
  )
}
export default withAuth(MemberAttendance, ['team_lead','HR','manager']);
