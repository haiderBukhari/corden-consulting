import React from 'react';
import { useRouter } from 'next/router';
import withAuth from '../../components/auth/auth';
import useGetActiveUser from '../../hooks/query/getUserFromLocalStorage';
import OnboardingDocumentManagment from '../../components/common/document_management/user/OnboardingDocumentManagment';
import Layout from '../../components/layout/layout';
const InEmploymentDocumentsPage = () => {
  const { data: user } = useGetActiveUser();
  const router = useRouter();

  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <Layout title={'Onboarding Documents'} subtitle={'Document Management > Onboarding > Overview'}>
      <OnboardingDocumentManagment />
    </Layout>
  );
};

export default withAuth(InEmploymentDocumentsPage, ['team_lead', 'staff', 'manager', 'admin']);