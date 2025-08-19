import {useState, useEffect} from 'react';
import withAuth from '../../../../components/auth/auth';
import OffboardingProcess from '../../../../components/common/offboarding/hr/OffboardingProcess';
import Layout from '../../../../components/layout/layout';
import { useRouter } from 'next/router';
import { useOffBoardingUsersList } from '../../../../hooks/query/offboarding/getOffBoardingUsersList';
import DataLoader from '../../../../components/ui/dataLoader';

const EditOffboardingPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [initialData, setInitialData] = useState(null);
  const { data: offboardingUsers, isLoading } = useOffBoardingUsersList();

  useEffect(() => {
    if (id && offboardingUsers) {
      const caseData = offboardingUsers.find(c => c.id === parseInt(id));
      if (caseData) {
        setInitialData(caseData);
      } else {
        console.error('Case not found');
        router.push('/HR/offboarding/dashboard');
      }
    }
  }, [id, offboardingUsers, router]);

  if (isLoading) {
    return (
      <DataLoader />
    );
  }

  return (
    <Layout title="Offboarding" subtitle="Edit Employee Offboarding Management">
      <OffboardingProcess initialData={initialData} />
    </Layout>
  );
};

export default withAuth(EditOffboardingPage, ['HR', 'Admin']); 