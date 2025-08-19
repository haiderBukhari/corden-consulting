import { useQuery } from 'react-query';
import axios from 'axios';
import { errorToaster } from '../../../utils/toaster';

const fetchOffboardingReviewDetails = async (offboardingId) => {
  try {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      throw new Error('No authentication token found.');
    }

    const response = await axios.get(`https://hr-backend-talo.com/api/offboarding/review/${offboardingId}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (response.status === 200) {
      return response.data.data;
    } else {
      errorToaster('Failed to fetch offboarding review details');
    }
  } catch (error) {
    console.error('Failed to fetch offboarding review details:', error);
    throw error;
  }
};

export const useOffboardingReviewDetails = (offboardingId) => {
  return useQuery(
    ['offboarding-review-details', offboardingId],
    () => fetchOffboardingReviewDetails(offboardingId),
    {
      enabled: !!offboardingId,
    }
  );
};