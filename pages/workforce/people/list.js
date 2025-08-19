
import AllPeopleListComponent from "../../../components/common/WorkForce/people/AllPeopleList";
import Layout from "../../../components/layout/layout";
import withAuth from "../../../components/auth/auth"
import useGetActiveUser from "../../../hooks/query/getUserFromLocalStorage";
const TeamAttendance = () => {

  const { data: user } = useGetActiveUser()

  return (
    <Layout title={'People'} subtitle={'Workforce > People'}>
      <AllPeopleListComponent role={user.role} />
    </Layout>
  )
}
export default withAuth(TeamAttendance, ['HR','manager']);
