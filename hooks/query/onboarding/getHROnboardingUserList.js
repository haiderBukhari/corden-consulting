import { useQuery } from 'react-query';
import axios from 'axios';

const fetchUserDoc = async (type) => {
    try {
        const authToken = localStorage.getItem('authToken');

        if (!authToken) {
            throw new Error('No authentication token found.');
        }
        
        const response = await axios.get(`https://hr-backend-talo.com/api/user/newOnboard?type=${type}`, {

            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });

        if (response.status === 200) {
            return response.data.users_with_status;
        } else {
            throw new Error('Failed to fetch all onboarding users');
        }
    } catch (error) {
        console.log('Failed to fetch all onboarding users', error);

    }
};

export const useGetHROnboardingUserList = (type) => {
    return useQuery('HROnboardingUserList', () => fetchUserDoc(type));
};