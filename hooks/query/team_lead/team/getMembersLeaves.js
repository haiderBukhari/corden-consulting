import { useQuery } from 'react-query';
import axios from 'axios';

const fetchMemberLeaves = async (leaveStatus) => {
    try {
        const authToken = localStorage.getItem('authToken');

        if (!authToken) {
            throw new Error('No authentication token found.');
        }

        const response = await axios.get(
            `https://hr-backend-talo.com/api/get-members-leaves`, 
            {
                params: {
                    status: leaveStatus
                },
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });

        if (response.status === 200) {
            return response.data.leaves;
        } else {
            throw new Error('Failed to fetch member leaves');
        }
    } catch (error) {
        console.log('Failed to fetch member leaves', error);
    }
};

export const useMemberLeaves = (leaveStatus) => {
    return useQuery(['allMemberLeaves', leaveStatus], () => fetchMemberLeaves(leaveStatus));
};
  