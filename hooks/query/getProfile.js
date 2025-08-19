import { useQuery } from 'react-query';
import axios from 'axios';

const getProfile = async (id) => {
    try {
        const authToken = localStorage.getItem('authToken');

        if (!authToken) {
            throw new Error('No authentication token found.');
        }

        const url = id ? `https://hr-backend-talo.com/api/getProfile/${id}` : `https://hr-backend-talo.com/api/getProfile`;

        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });

        if (response.status === 200) {
            return response.data.response;
        } else {
            throw new Error('Failed to fetch Profile');
        }
    } catch (error) {
        console.log('Failed to fetch Profile', error);
        throw error; // Ensure error propagates to React Query's error handling
    }
};

export const UseGetProfile = (id, options = {}) => {
    return useQuery(['profile', id], () => getProfile(id), {
        enabled: !!id,
        refetchOnWindowFocus: false,
        staleTime: Infinity,
        cacheTime: Infinity,
        ...options,
    });
};
