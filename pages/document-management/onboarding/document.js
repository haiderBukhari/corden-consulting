import React from 'react';
import { useRouter } from 'next/router';
import withAuth from '../../../components/auth/auth';
import useGetActiveUser from '../../../hooks/query/getUserFromLocalStorage';
import OnboardingDocumentManagmentHR from '../../../components/common/document_management/HR/HROnbaordingPolcies';
import OnboardingDocumentManagmentUser from '../../../components/common/document_management/user/components/UserOnboardingPolicies';
import Layout from '../../../components/layout/layout';
import OnboardingDocumentManagmentHRComponent from '../../../components/common/document_management/HR/HROnbaordingDocuments';
const OnboardingDocumentsPage = () => {
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
    <Layout title={'Onboarding Documents'} subtitle={'Document Management > Onboarding  > Documents'}>
     
        <OnboardingDocumentManagmentHRComponent />
      
    </Layout>
  );
};

export default withAuth(OnboardingDocumentsPage, ['team_lead', 'staff', 'manager', 'HR', 'admin']);