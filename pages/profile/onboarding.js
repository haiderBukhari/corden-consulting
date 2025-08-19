import Layout from "../../components/layout/layout";
import { useRouter } from 'next/router';
import withAuth from "../../components/auth/auth";
import OnboardingComponent from "../../components/common/profile/OnboardingComponent";

const ProfileOnboarding = () => {
  const router = useRouter();
  const { role } = router.query;

  return (
    <Layout title={'Profile'} subtitle={'Onboarding'}>
      <OnboardingComponent role={role} />
    </Layout>
  )

}
export default withAuth(ProfileOnboarding, ['team_lead', 'staff', 'manager','HR']);
