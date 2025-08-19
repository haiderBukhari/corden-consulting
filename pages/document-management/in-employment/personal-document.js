import React from 'react';
import { useRouter } from 'next/router';
import withAuth from '../../../components/auth/auth';
import useGetActiveUser from '../../../hooks/query/getUserFromLocalStorage';
import HRPolicyDocumentManagement from '../../../components/common/document_management/HR/InEmploymentPolicies';
import Layout from '../../../components/layout/layout';
import InEmploymentPersonalDocs from '../../../components/common/document_management/HR/InEmploymentPersonalDocs';
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
    <Layout title={'In Employment Documents'} subtitle={'Document Management > In Employment > Personal Documents'}>
     
       
        <InEmploymentPersonalDocs />
    </Layout>
  );
};

export default withAuth(InEmploymentDocumentsPage, ['HR']);