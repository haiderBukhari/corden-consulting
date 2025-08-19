import React from 'react';
import { useRouter } from 'next/router';
import withAuth from '../../components/auth/auth';
import useGetActiveUser from '../../hooks/query/getUserFromLocalStorage';
import HROffboardingManagement from '../../components/common/document_management/HR/offboarding/HROffboardingManagement';
import Layout from '../../components/layout/layout';

const OffboardingDocumentsPage = () => {
  const { data: user } = useGetActiveUser();
  const router = useRouter();
  
  React.useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <Layout title={'Offboarding Documents'} subtitle={'Document Management > Offboarding > Overview'}>
      <HROffboardingManagement />
    </Layout>
  );
};

export default withAuth(OffboardingDocumentsPage, ['HR']); 