import { useQuery } from 'react-query';
import axios from 'axios';

const fetchUserDoc = async (  ) => {
    try {
        const authToken = localStorage.getItem('authToken');

        if (!authToken) {
            throw new Error('No authentication token found.');
        }
        
        const response = await axios.get(`https://hr-backend-talo.com/api/hr/Onboardingdashboard`, {

            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });

        if (response.status === 200) {
            return response.data.response;
        } else {
            throw new Error('Failed to fetch all onboarding users');
        }
    } catch (error) {
        console.log('Failed to fetch all onboarding users', error);

    }
};

export const useGetHROnboardingDashbaordStats = () => {
    return useQuery('HROnboardingDashbaordStats', () => fetchUserDoc());
};