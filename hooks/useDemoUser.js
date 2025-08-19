import { useState, useEffect } from 'react';

const useDemoUser = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const role = localStorage.getItem('role');
    if (role) {
      setUser({
        role: role,
        id: 'demo-user-id',
        name: role.charAt(0).toUpperCase() + role.slice(1).replace('_', ' '),
        email: `${role}@demo.com`
      });
    }
    setIsLoading(false);
  }, []);

  return { data: user, isLoading };
};

export default useDemoUser; 