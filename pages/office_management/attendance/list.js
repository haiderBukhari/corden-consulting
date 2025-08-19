import Layout from "../../../components/layout/layout"
import withAuth from "../../../components/auth/auth"
import useGetActiveUser from "../../../hooks/query/getUserFromLocalStorage";
import LocationAttendanceList from "../../../components/common/office_management/LocationAttendanceList";
import { UseGetUserManagedLocations } from "../../../hooks/query/locations/getUserManagerLocations";
import DataLoader from "../../../components/ui/dataLoader";

const LocationAttendanceListPage = () => {
  const { data: user } = useGetActiveUser();
  const userId = user?.id;

  const { data: managedLocations, isLoading: isLocationsLoading } = UseGetUserManagedLocations(userId);
  
  if (isLocationsLoading) {
    return <DataLoader />
  }

  return (
    <Layout title={'Attendance'} subtitle={'Office Management > Attendance > List'}>
      <LocationAttendanceList role={user?.role} managedLocations={managedLocations} />
    </Layout>
  )
}

export default withAuth(LocationAttendanceListPage, ['manager','staff','team_lead'], true);