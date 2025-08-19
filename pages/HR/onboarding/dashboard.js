import Layout from "../../../components/layout/layout";
import withAuth from "../../../components/auth/auth";
import OnboardingDashboard from "../../../components/common/onboarding/hr/OnboardingDashboard";
const OnboardingPage = () => {
  return (
    <Layout title="Onboarding" subtitle="Employee Onboarding Management">
      <OnboardingDashboard />
    </Layout>
  );
};

export default withAuth(OnboardingPage, ["HR"]); 