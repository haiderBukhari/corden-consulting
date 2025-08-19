import { useQuery } from 'react-query';
import axios from 'axios';

const memberLeave = async (id) => {
    try {
        const authToken = localStorage.getItem('authToken');

        if (!authToken) {
            throw new Error('No authentication token found.');
        }

        const response = await axios.get(
            `https://hr-backend-talo.com/api/get-user-leaves?user_id=${id}`, 
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });

        if (response.status === 200) {
            return response.data.leaves;
        } else {
            throw new Error('Failed to fetch member leave');
        }
    } catch (error) {
        console.log('Failed to fetch member leave', error);
    }
};

export const useGetIndividualMemberLeave = (id) => {
    return useQuery(['individualMemberLeave', id], () => memberLeave(id));
};
  