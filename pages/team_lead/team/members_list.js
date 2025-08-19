import Layout from "../../../components/layout/layout";
import withAuth from "../../../components/auth/auth"
import MembersListComponent from "../../../components/Team/members_list/MembersListComponent";

const  Approval = () => {


  return (
    <Layout title={'Members List'} subtitle={'Team > Members List'}>
      <MembersListComponent />
    </Layout>
  )

}
export default withAuth(Approval, ['team_lead', 'manager']);