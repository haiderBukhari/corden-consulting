import React from 'react';
import { useRouter } from 'next/router';
import withAuth from '../../../components/auth/auth';
import useGetActiveUser from '../../../hooks/query/getUserFromLocalStorage';
import InEmploymentPolicyDocumentManagement from '../../../components/common/document_management/HR/InEmploymentPolicies';
import Layout from '../../../components/layout/layout';
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
    <Layout title={'In Employment Documents'} subtitle={'Document Management > In Employment > Policies'}>
     
        <InEmploymentPolicyDocumentManagement />
      
    </Layout>
  );
};

export default withAuth(InEmploymentDocumentsPage, ['HR']);