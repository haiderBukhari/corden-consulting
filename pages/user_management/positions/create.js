
import CreatePositionComponent from "../../../components/admin/UserManagement/Positions/CreatePosition";


import Layout from "../../../components/layout/layout"
import withAuth from "../../../components/auth/auth"
import useGetActiveUser from "../../../hooks/query/getUserFromLocalStorage";

const CreatePosition = () => {
  const { data: user } = useGetActiveUser()

  return (
    <Layout title={'Positions'} subtitle={'User Management > Positions'}>
      <CreatePositionComponent role={user.role} />
    </Layout>
  )
}

export default withAuth(CreatePosition, ['admin','HR','manager']);
