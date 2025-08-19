
import Layout from "../../../components/layout/layout"
import withAuth from "../../../components/auth/auth"
import useGetActiveUser from "../../../hooks/query/getUserFromLocalStorage";
import CreateRegion from "../../../components/admin/UserManagement/Regions/CreateRegion";

const CreatePosition = () => {
  const { data: user } = useGetActiveUser()

  return (
    <Layout title={'Regions'} subtitle={'User Management > Regions'}>
      <CreateRegion role={user.role} />
    </Layout>
  )
}

export default withAuth(CreatePosition, ['admin','HR','manager']);
