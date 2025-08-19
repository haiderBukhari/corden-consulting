import { useQuery } from 'react-query';
import axios from 'axios';

const fetchTeamLeaveCalendar = async (month, year) => {
    try {
        const authToken = localStorage.getItem('authToken');

        if (!authToken) {
            throw new Error('No authentication token found.');
        }

        const response = await axios.get(
            `https://hr-backend-talo.com/api/get-team-leave-calender`, 
            {
                params: {
                    month: month,
                    year: year
                },
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
            });

        if (response.status === 200) {
            return response.data.leaves;
        } else {
            throw new Error('Failed to fetch team leave calendar');
        }
    } catch (error) {
        console.log('Failed to fetch team leave calendar', error);
    }
};

export const useTeamLeaveCalendar = (month, year) => {
    return useQuery(['allTeamLeaveCalendar', month, year], () => fetchTeamLeaveCalendar(month, year));
};
  