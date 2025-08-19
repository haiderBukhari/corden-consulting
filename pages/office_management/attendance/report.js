import Layout from "../../../components/layout/layout"
import withAuth from "../../../components/auth/auth"
import useGetActiveUser from "../../../hooks/query/getUserFromLocalStorage";
import DataLoader from "../../../components/ui/dataLoader";
import LocationAttendanceReport from "../../../components/common/office_management/LocationAttendanceReport";
import { UseGetUserManagedLocations } from "../../../hooks/query/locations/getUserManagerLocations";

const LocationAttendanceReportPage = () => {
  const { data: user } = useGetActiveUser();
  const userId = user?.id;

  const { data: managedLocations, isLoading: isLocationsLoading } = UseGetUserManagedLocations(userId);
  
  if (isLocationsLoading) {
    return <DataLoader />
  }

  return (
    <Layout title={'Attendance'} subtitle={'Office Management > Attendance > Report'}>
      <LocationAttendanceReport role={user?.role} managedLocations={managedLocations} />
    </Layout>
  )
}

export default withAuth(LocationAttendanceReportPage, ['manager', 'staff', 'team_lead'], true);