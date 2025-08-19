

import Layout from "../../../components/layout/layout"
import withAuth from "../../../components/auth/auth"
import useGetActiveUser from "../../../hooks/query/getUserFromLocalStorage";
import CreateBranchComponent from "../../../components/admin/UserManagement/Branch/CreateBranch";

const CreatePosition = () => {
  const { data: user } = useGetActiveUser()

  return (
    <Layout title={'Branches'} subtitle={'User Management > Branches'}>
      <CreateBranchComponent role={user.role} />
    </Layout>
  )
}

export default withAuth(CreatePosition, ['admin','HR','manager']);
