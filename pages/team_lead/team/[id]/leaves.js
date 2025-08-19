import Layout from "../../../../components/layout/layout";
import { useRouter } from 'next/router';
import withAuth from "../../../../components/auth/auth"
import OverviewComponent from "../../../../components/common/leave_management/OverviewComponent";
import { useGetMemberDetail } from "../../../../hooks/query/team_lead/team/getMemberDetail";
import useGetActiveUser from "../../../../hooks/query/getUserFromLocalStorage";

const Leaves = () => {
  const router = useRouter();
  const { data: user } = useGetActiveUser()
  const { id } = router.query;
  const { data: member } = useGetMemberDetail(id)

  return (
    <Layout title={'Team'} subtitle={`Member List > ${member?.name} > Leaves`}>
      <OverviewComponent role={user.role} id={member?.id} isShowBackButton={true} member={member} isTeamLead={true}/>
    </Layout>
  )
}
export default withAuth(Leaves, ['team_lead']);
