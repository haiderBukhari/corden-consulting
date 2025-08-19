import { useQuery } from 'react-query';
import axios from 'axios';

const fetchMemberStats = async () => {
    try {
        const authToken = localStorage.getItem('authToken');

        if (!authToken) {
            throw new Error('No authentication token found.');
        }

        const response = await axios.get(`https://hr-backend-talo.com/api/get-members-stats`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });

        if (response.status === 200) {
            return response.data.Team_Members_Stats;
        } else {
            throw new Error('Failed to fetch member statistics');
        }
    } catch (error) {
        console.log('Failed to fetch member statistics', error);
    }
};

export const useMemberStats = () => {
  return useQuery('allMembersStats', fetchMemberStats);
};