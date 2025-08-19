import Layout from "../../../components/layout/layout";
import withAuth from "../../../components/auth/auth";
import OffboardingProcess from "../../../components/common/offboarding/hr/OffboardingProcess";

const NewOffboardingPage = () => {
  return (
    <Layout title="Employee Offboarding" subtitle="Employee Offboarding Workflow">
      <OffboardingProcess />
    </Layout>
  );
};

export default withAuth(NewOffboardingPage, ['HR','Admin']); 