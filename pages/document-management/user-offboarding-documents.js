import { useEffect } from 'react';
import { useRouter } from 'next/router';
import withAuth from '../../components/auth/auth';
import useGetActiveUser from '../../hooks/query/getUserFromLocalStorage';
import OffboardingDocumentManagement from '../../components/common/document_management/user/OffboardingDocumentManagement';

const UserOffboardingDocumentsPage = () => {
  const { data: user } = useGetActiveUser();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else if (user.offboarding_status !== 1) {
      router.push('/dashboard');
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Offboarding Documents</h1>
          <p className="mt-1 text-sm text-gray-500">Access and download your offboarding documents</p>
        </div>
        <OffboardingDocumentManagement userId={user.id} />
      </div>
    </div>
  );
};

export default withAuth(UserOffboardingDocumentsPage, ['team_lead', 'staff', 'manager', 'admin', 'HR']); 