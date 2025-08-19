import { useQuery } from 'react-query';
import axios from 'axios';

const getDeactivatedUsers = async () => {
    try {
        const authToken = localStorage.getItem('authToken');

        if (!authToken) {
            throw new Error('No authentication token found.');
        }

        const response = await axios.get(`https://hr-backend-talo.com/api/admin/deactive-user/list`, {

            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });

        if (response.status === 200) {
            return response.data.users
        } else {
            throw new Error('Failed to fetch departments ');
        }
    } catch (error) {
        console.log('Failed to fetch departments statistics', error);
    }
};

export const UseGetDeactivatedUsers = () => {
    return useQuery('deactivatedUsers', () => getDeactivatedUsers());
};
