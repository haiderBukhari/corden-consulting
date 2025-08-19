import Layout from "../../../components/layout/layout";
import withAuth from "../../../components/auth/auth";
import OnboardingProcess from "../../../components/common/onboarding/hr/OnboardingProcess";

const NewOnboardingPage = () => {
  return (
    <Layout title="New Onboarding" subtitle="Employee Onboarding Workflow">
      <OnboardingProcess />
    </Layout>
  );
};

export default withAuth(NewOnboardingPage, ['HR','Admin']); 