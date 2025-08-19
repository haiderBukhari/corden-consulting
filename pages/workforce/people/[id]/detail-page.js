import Layout from '../../../../components/layout/layout';
import { useRouter } from 'next/router';
import withAuth from "../../../../components/auth/auth"
import { useGetMemberDetail } from "../../../../hooks/query/team_lead/team/getMemberDetail";
import MemberDetailComponent from '../../../../components/Team/members_list/memberDetail/MemberDetailComponent';

const MemberDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: member } = useGetMemberDetail(id);

  return (
    <Layout title={`Profile ${member?.name}`} subtitle={member && `Workforce > People > All Employees > ${member?.name} `}>
      <MemberDetailComponent />
    </Layout>
  )
}

export default withAuth(MemberDetail, ['team_lead', 'manager', 'HR']);