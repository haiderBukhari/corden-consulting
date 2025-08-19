import { useQuery } from 'react-query';
import axios from 'axios';

const getTimeZone = async (id) => {
    try {
        const authToken = localStorage.getItem('authToken');

        if (!authToken) {
            throw new Error('No authentication token found.');
        }


        const response = await axios.get(`https://hr-backend-talo.com/api/timezone/list`, {

            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });

        if (response.status === 200) {
            return response.data.response;
        } else {
            throw new Error('Failed to fetch timeZone');
        }
    } catch (error) {
        console.log('Failed to fetch fetch timeZone', error);
    }
};

export const UseGetTimeZone = () => {
    return useQuery('timeZone', () => getTimeZone())

};
