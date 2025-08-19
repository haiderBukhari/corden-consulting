
import PositionListComponent from "../../../components/admin/UserManagement/Positions/PositionList";

import Layout from "../../../components/layout/layout"
import withAuth from "../../../components/auth/auth"
import useGetActiveUser from "../../../hooks/query/getUserFromLocalStorage";


const PositionList = () => {
  const { data: user } = useGetActiveUser()

  return (
    <Layout title={'Positions'} subtitle={'User Management > Positions'}>
      <PositionListComponent role={user.role} />
    </Layout>
  )
}

export default withAuth(PositionList, ['admin','HR','manager']);
