import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const withAuth = (WrappedComponent, allowedRoles = []) => {
  const ComponentWithAuth = (props) => {
    const router = useRouter();
    const [userRole, setUserRole] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      // Get role from localStorage
      const role = localStorage.getItem('role');
      setUserRole(role);
      setIsLoading(false);

      // Check if user has permission
      if (role && allowedRoles.length > 0 && !allowedRoles.includes(role)) {
        router.push('/demo/dashboard');
      }
    }, [router, allowedRoles]);

    if (isLoading) {
      return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };

  ComponentWithAuth.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return ComponentWithAuth;
};

export default withAuth;