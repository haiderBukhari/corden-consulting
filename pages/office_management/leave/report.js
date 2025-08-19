import Layout from "../../../components/layout/layout"
import withAuth from "../../../components/auth/auth"
import useGetActiveUser from "../../../hooks/query/getUserFromLocalStorage";
import DataLoader from "../../../components/ui/dataLoader";
import LocationLeaveReport from "../../../components/common/office_management/LocationLeaveReport";
import { UseGetUserManagedLocations } from "../../../hooks/query/locations/getUserManagerLocations";

const LocationLeaveReportePage = () => {
  const { data: user } = useGetActiveUser();
  const userId = user?.id;

  const { data: managedLocations, isLoading: isLocationsLoading } = UseGetUserManagedLocations(userId);
  
  if (isLocationsLoading) {
    return <DataLoader />
  }

  return (
    <Layout title={'Locations'} subtitle={'Office Management > Locations > Report'}>
      <LocationLeaveReport role={user?.role} managedLocations={managedLocations} />
    </Layout>
  )
}

export default withAuth(LocationLeaveReportePage, ['manager', 'staff', 'team_lead'], true);