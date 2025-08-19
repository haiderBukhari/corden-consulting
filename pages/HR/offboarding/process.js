import Layout from "../../../components/layout/layout";
import withAuth from "../../../components/auth/auth";
import OffboardingProcess from "../../../components/common/offboarding/hr/OffboardingProcess";
import { useRouter } from 'next/router';
import { useOffboardingReviewDetails } from '../../../hooks/query/offboarding/getOffboardingProcessThreeDetails';
import DataLoader from '../../../components/ui/dataLoader';

const OffboardingProcessPage = () => {
  const router = useRouter();
  const { offboardingId, resumeStep } = router.query;

  const { data: initialData, isLoading } = useOffboardingReviewDetails(offboardingId);

  if (isLoading) {
    return (
      <Layout title="Employee Offboarding" subtitle="Employee Offboarding Workflow">
        <DataLoader />
      </Layout>
    );
  }

  return (
    <Layout title="Employee Offboarding" subtitle="Employee Offboarding Workflow">
      <OffboardingProcess initialData={initialData} />
    </Layout>
  );
};

export default withAuth(OffboardingProcessPage, ['HR','Admin']); 