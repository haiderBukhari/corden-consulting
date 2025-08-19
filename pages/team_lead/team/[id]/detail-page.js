import Layout from "../../../../components/layout/layout";
import { useRouter } from 'next/router';
import MemberDetailComponent from "../../../../components/Team/members_list/memberDetail/MemberDetailComponent";
import withAuth from "../../../../components/auth/auth"
import { useGetMemberDetail } from "../../../../hooks/query/team_lead/team/getMemberDetail";

const MemberPerformance = () => {
  const router = useRouter();
  
  const {  id } = router.query;
  const { data: member } = useGetMemberDetail(id);

  return (
    <Layout title={'Team'} subtitle={member && `Member List > ${member?.name} `}>
      <MemberDetailComponent/>
    </Layout>
  )
}
export default withAuth(MemberPerformance, ['team_lead', 'manager']);
