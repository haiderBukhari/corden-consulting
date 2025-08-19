import { useQuery } from 'react-query';
import axios from 'axios';

const fetchAllTeamMembers = async () => {
    try {
        const authToken = localStorage.getItem('authToken');

        if (!authToken) {
            throw new Error('No authentication token found.');
        }

        const response = await axios.get(`https://hr-backend-talo.com/api/get-team-members`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });

        if (response.status === 200) {
            return response.data.teamMembers;
        } else {
            throw new Error('Failed to fetch all team members');
        }
    } catch (error) {
        console.log('Failed to fetch all team members', error);
    }
};

export const useAllTeamMembers = () => {
  return useQuery('allTeamMembers', fetchAllTeamMembers);
};