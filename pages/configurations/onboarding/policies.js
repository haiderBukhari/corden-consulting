import Layout from "../../../components/layout/layout";
import { useRouter } from 'next/router';
import withAuth from "../../../components/auth/auth";
import PolicyConfigurationComponent from "../../../components/common/onboarding/configurations/PolicyConfigurationComponent";

const PolicyConf = () => {
  const router = useRouter();
  const { role } = router.query;

  return (
    <Layout title={'Onboarding'} subtitle={'Policy'}>
      <PolicyConfigurationComponent role={role} />
    </Layout>
  )

}
export default withAuth(PolicyConf, ['Admin','HR']);
