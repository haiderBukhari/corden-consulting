import Layout from "../../../components/layout/layout"
import withAuth from "../../../components/auth/auth"
import useGetActiveUser from "../../../hooks/query/getUserFromLocalStorage";
import LocationLeaveList from "../../../components/common/office_management/LocationLeaveList";
import { UseGetUserManagedLocations } from "../../../hooks/query/locations/getUserManagerLocations";
import DataLoader from "../../../components/ui/dataLoader";

const LocationLeaveListPage = () => {
  const { data: user } = useGetActiveUser();
  const userId = user?.id;

  const { data: managedLocations, isLoading: isLocationsLoading } = UseGetUserManagedLocations(userId);
  
  if (isLocationsLoading) {
    return <DataLoader />
  }

  return (
    <Layout title={'Locations'} subtitle={'Office Management > Locations > List'}>
      <LocationLeaveList role={user?.role} managedLocations={managedLocations} />
    </Layout>
  )
}

export default withAuth(LocationLeaveListPage, ['manager','staff','team_lead'], true);