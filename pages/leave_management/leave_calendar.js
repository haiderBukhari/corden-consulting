import Layout from "../../components/layout/layout"
import withAuth from "../../components/auth/auth"
import LeaveCalendarComponent from "../../components/common/leave_management/LeaveCalendarComponent";
import useGetActiveUser from "../../hooks/query/getUserFromLocalStorage";
import { useGetMemberDetail } from "../../hooks/query/team_lead/team/getMemberDetail";

const LeaveCalender = () => {
  const { data: user } = useGetActiveUser();
  const { data: member, isLoading: memberLoading } = useGetMemberDetail(user?.id);

  return (
    <Layout title={'Leave Management'} subtitle={'Leave Calendar'}>
      <LeaveCalendarComponent role={user.role} member={member} />
    </Layout>
  )
}
export default withAuth(LeaveCalender, ['team_lead', 'staff', 'manager', 'HR']);
