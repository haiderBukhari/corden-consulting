import { useQuery } from 'react-query';
import axios from 'axios';

const getOffBoardingUsersList = async () => {
    try {
        const authToken = localStorage.getItem('authToken');

        if (!authToken) {
            throw new Error('No authentication token found.');
        }

        const url = `https://hr-backend-talo.com/api/offboarding/offboard-users-list`
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });

        if (response.status === 200) {
            return response.data.response;
        } else {
            throw new Error('Failed to fetch OffBoarding Users List');
        }
    } catch (error) {
        console.error('Failed to fetch OffBoarding Users List', error);
        throw error;
    }
};

export const useOffBoardingUsersList = () => {
    return useQuery('offBoardingUsersList', getOffBoardingUsersList);
};
