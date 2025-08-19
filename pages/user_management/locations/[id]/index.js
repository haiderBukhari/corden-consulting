
import Layout from "../../../../components/layout/layout";
import withAuth from "../../../../components/auth/auth"
import useGetActiveUser from "../../../../hooks/query/getUserFromLocalStorage";
import ShiftListComponent from "../../../../components/admin/UserManagement/locations/ShiftList";

const ShiftList = () => {
  const { data: user } = useGetActiveUser()
  
  return (
    <Layout title={'Shifts'} subtitle={'User Management > Locations > Shifts'}>
      <ShiftListComponent role={user.role} />
    </Layout>
  )
}

export default withAuth(ShiftList, ['admin','HR','manager']);