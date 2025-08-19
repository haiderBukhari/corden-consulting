import Layout from "../../../components/layout/layout";
import withAuth from "../../../components/auth/auth";
import OffboardingDashboard from "../../../components/common/offboarding/hr/OffboardingDashboard";

const OffboardingPage = () => {
  return (
    <Layout title="Offboarding" subtitle="Employee Offboarding Management">
      <OffboardingDashboard />
    </Layout>
  );
};

export default withAuth(OffboardingPage, ["HR"]); 