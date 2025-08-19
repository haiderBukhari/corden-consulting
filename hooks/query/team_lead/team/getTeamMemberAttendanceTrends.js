import { useQuery } from 'react-query';
import axios from 'axios';

const fetchTeamMemberAttendanceTrends = async (id) => {
    try {
        const authToken = localStorage.getItem('authToken');

        if (!authToken) {
            throw new Error('No authentication token found.');
        }

        const response = await axios.get(
            `https://hr-backend-talo.com/api/attendance-trends/${id}`,
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });

        if (response.status === 200) {
            return response.data.attendance_graph_stats;
        } else {
            throw new Error('Failed to fetch team member attendance trends');
        }
    } catch (error) {
        console.log('Failed to fetch team member attendance trends', error);
    }
};

export const useTeamMemberAttendanceTrends = (id) => {
    return useQuery('allTeamMemberAttendanceTrends', () => fetchTeamMemberAttendanceTrends(id));
};
  