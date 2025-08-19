

import Layout from "../../../components/layout/layout"
import withAuth from "../../../components/auth/auth"
import useGetActiveUser from "../../../hooks/query/getUserFromLocalStorage";
import BranchListComponent from "../../../components/admin/UserManagement/Branch/BranchList";


const PositionList = () => {
  const { data: user } = useGetActiveUser()

  return (
    <Layout title={'Branches'} subtitle={'User Management > Branches'}>
      <BranchListComponent role={user.role} />
    </Layout>
  )
}

export default withAuth(PositionList, ['admin','HR','manager']);
