import LocationListComponent from "../../../components/admin/UserManagement/locations/LocationList";

import Layout from "../../../components/layout/layout"
import withAuth from "../../../components/auth/auth"
import useGetActiveUser from "../../../hooks/query/getUserFromLocalStorage";

const LocationList = () => {
  const { data: user } = useGetActiveUser()
  
  return (
    <Layout title={'Locations'} subtitle={'User Management > Locations'}>
      <LocationListComponent role={user.role} />
    </Layout>
  )
}

export default withAuth(LocationList, ['admin','HR','manager']);