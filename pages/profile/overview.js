import ProfileOverviewComponent from "../../components/common/profile/overview";
import Layout from "../../components/layout/layout";
import { useRouter } from 'next/router';
import withAuth from "../../components/auth/auth";
import { UseGetProfile } from "../../hooks/query/getProfile";
import AdminProfileForm from "../../components/common/profile/AdminProfile";
const ProfileOverview = () => {
  const router = useRouter();
  const { role } = router.query;
  const { data: user } = UseGetProfile()

  return (
    <Layout title={'Profile'} subtitle={'Overview'}>
      {user?.role === 'admin' ?
        <AdminProfileForm role={user.role} /> :

        <ProfileOverviewComponent role={role} />
      }
    </Layout>
  )
}
export default withAuth(ProfileOverview, ['team_lead', 'staff', 'manager', 'HR', 'admin']);
