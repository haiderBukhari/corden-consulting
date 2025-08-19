import Layout from "../../../components/layout/layout";
import { useRouter } from 'next/router';
import withAuth from "../../../components/auth/auth";
import OffboardingChecklistComponent from "../../../components/common/offboarding/hr/OffboardingChecklistComponent";

const OffboardingConf = () => {
  const router = useRouter();
  const { role } = router.query;

  return (
    <Layout title={'Offbaording'} subtitle={'Checklist'}>
      <OffboardingChecklistComponent role={role} />
    </Layout>
  )

}
export default withAuth(OffboardingConf, ['Admin','HR']);
