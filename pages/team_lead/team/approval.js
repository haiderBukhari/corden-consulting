import Layout from "../../../components/layout/layout";
import { useRouter } from 'next/router';
import withAuth from "../../../components/auth/auth"
import ApprovalsComponent from "../../../components/Team/approvals/ApprovalsComponent";
import useGetActiveUser from "../../../hooks/query/getUserFromLocalStorage";

const Approval = () => {
  const { data: user } = useGetActiveUser();

  return (
    <Layout title={'Approvals'} subtitle={'Team > Approvals'}>
      <ApprovalsComponent role={user.role}/>
    </Layout>
  )

}
export default withAuth(Approval, ['team_lead', 'manager']);
