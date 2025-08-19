import { useQuery } from 'react-query';
import axios from 'axios';

const fetchAllPeopleCount = async () => {
    try {
        const authToken = localStorage.getItem('authToken');

        if (!authToken) {
            throw new Error('No authentication token found.');
        }

       
        const response = await axios.get(`https://hr-backend-talo.com/api/hr/dep-emp-team/counts`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });

        if (response.status === 200) {
            return response.data.departmen_emplyee_team_count
        } else {
            throw new Error('Failed to fetch all people counts ');
        }
    } catch (error) {
        console.log('Failed to fetch all people counts', error);

    }
};

export const useGetPeopleCount = (id) => {
    return useQuery('peopleCount', () => fetchAllPeopleCount(id));
};