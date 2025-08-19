import Layout from "../../../components/layout/layout";
import withAuth from "../../../components/auth/auth";
import UserOnboardingDashboard from "../../../components/common/onboarding/hr/UserOnboardingDashboard";
const UserOnboardingPage = () => {
  return (
    <Layout title="Onboarding" subtitle="Employee Onboarding Management">
      <UserOnboardingDashboard />
    </Layout>
  );
};

export default withAuth(UserOnboardingPage, ["HR"]); 