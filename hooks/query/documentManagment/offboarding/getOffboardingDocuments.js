import { useQuery } from 'react-query';
import axios from 'axios';

const getOffboardingDocuments = async (userId) => {
    try {
        const authToken = localStorage.getItem('authToken');

        if (!authToken) {
            throw new Error('No authentication token found.');
        }

        const url = `https://hr-backend-talo.com/api/offboarding-documents/offboarding-get-documents/${userId}`;
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });

        if (response.status === 200) {
            return response.data.response;
        } else {
            throw new Error('Failed to fetch Offboarding Documents');
        }
    } catch (error) {
        console.error('Failed to fetch Offboarding Documents', error);
        throw error;
    }
};

export const useOffboardingDocuments = (userId) => {
    return useQuery(['offboardingDocuments', userId], () => getOffboardingDocuments(userId), {
        enabled: !!userId,
    });
}; 