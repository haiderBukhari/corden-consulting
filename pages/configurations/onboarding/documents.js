import Layout from "../../../components/layout/layout";
import { useRouter } from 'next/router';
import withAuth from "../../../components/auth/auth";
import DocumentConfigurationComponent from "../../../components/common/onboarding/configurations/DocumentConfigurationComponent";

const OnboardingConf = () => {
  const router = useRouter();
  const { role } = router.query;

  return (
    <Layout title={'Onboarding'} subtitle={'Documents'}>
      <DocumentConfigurationComponent role={role} />
    </Layout>
  )

}
export default withAuth(OnboardingConf, ['Admin','HR']);
