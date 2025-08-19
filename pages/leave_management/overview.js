
import Layout from "../../components/layout/layout"
import OverviewComponent from "../../components/common/leave_management/OverviewComponent";
import { useRouter } from 'next/router';
import withAuth from "../../components/auth/auth"
import useGetActiveUser from "../../hooks/query/getUserFromLocalStorage";
import { useGetMemberDetail } from "../../hooks/query/team_lead/team/getMemberDetail";

const LeaveOverview = () => {
  const { data: user } = useGetActiveUser();
  const { data: member } = useGetMemberDetail(user?.id);

  return (
    <Layout title={'Leave Management'} subtitle={'Overview'}>
      <OverviewComponent role={user?.role} id={user?.id} isShowBackButton={false} member={member} />
    </Layout>
  )
}

export default withAuth(LeaveOverview, ['team_lead', 'staff', 'manager', 'HR']);
