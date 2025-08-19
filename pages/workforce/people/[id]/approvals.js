
import ApprovalsComponent from "../../../../components/Team/approvals/ApprovalsComponent";
import Layout from '../../../../components/layout/layout';
import { useRouter } from 'next/router';
import withAuth from "../../../../components/auth/auth"
import { useGetMemberDetail } from "../../../../hooks/query/team_lead/team/getMemberDetail";
import useGetActiveUser from "../../../../hooks/query/getUserFromLocalStorage";

const MemberApprovalDetailPage = () => {
  const router = useRouter();
  const { data: user } = useGetActiveUser()
  const { id } = router.query;
  const { data: member } = useGetMemberDetail(id)

  return (
    <Layout title={'Approvals'} subtitle={`Workforce > People > All Employees > ${member?.name} > Approvals `}>
      <ApprovalsComponent role={user.role} id={id}/>
    </Layout>
  )

}
export default withAuth(MemberApprovalDetailPage, ['team_lead', 'manager', 'HR']);
