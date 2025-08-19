import { useQuery } from 'react-query';
import axios from 'axios';

const memberDetail = async (id) => {
    try {
        const authToken = localStorage.getItem('authToken');

        if (!authToken) {
            throw new Error('No authentication token found.');
        }

        const response = await axios.get(
            `https://hr-backend-talo.com/api/members-details/${id}`, 
            {
                
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });

        if (response.status === 200) {
            return response.data.user;
        } else {
            throw new Error('Failed to fetch member detail');
        }
    } catch (error) {
        console.log('Failed to fetch member detail', error);
    }
};

export const useGetMemberDetail = (id) => {
    return useQuery(['memberDetail', id], () => memberDetail(id));
};
  