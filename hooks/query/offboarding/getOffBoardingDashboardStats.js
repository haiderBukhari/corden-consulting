import { useQuery } from 'react-query';
import axios from 'axios';

const getOffBoardingDashboardStats = async () => {
    try {
        const authToken = localStorage.getItem('authToken');

        if (!authToken) {
            throw new Error('No authentication token found.');
        }

        const url = `https://hr-backend-talo.com/api/offboarding/summary`
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });

        if (response.status === 200) {
            return response.data.response;
        } else {
            throw new Error('Failed to fetch OffBoarding Dashboard Stats');
        }
    } catch (error) {
        console.error('Failed to fetch OffBoarding Dashboard Stats', error);
        throw error;
    }
};

export const useOffBoardingDashboardStats = () => {
    return useQuery('offBoardingDashboardStats', getOffBoardingDashboardStats);
};
