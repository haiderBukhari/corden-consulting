import { useQuery } from 'react-query';
import axios from 'axios';
import { errorToaster } from '../../../utils/toaster';

const fetchOffboardingConfigurations = async () => {
  try {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      throw new Error('No authentication token found.');
    }

    const response = await axios.get('https://hr-backend-talo.com/api/offboarding-configurations', {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (response.status === 200) {
      return response.data.data;
    } else {
      errorToaster('Failed to fetch offboarding checklist configurations');
    }
  } catch (error) {
    console.error('Failed to fetch offboarding checklist configurations:', error);
  }
};

export const useOffboardingConfigurations = () => {
  return useQuery('offboarding-configurations', () => fetchOffboardingConfigurations());
};