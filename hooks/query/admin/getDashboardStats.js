import { useQuery } from 'react-query';
import axios from 'axios';

const getDashboardStats = async () => {
    try {
        const authToken = localStorage.getItem('authToken');

        if (!authToken) {
            throw new Error('No authentication token found.');
        }

        const response = await axios.get(`https://hr-backend-talo.com/api/admin/staff/stats`, {

            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });

        if (response.status === 200) {
            return response.data.Staff_stats
        } else {
            throw new Error('Failed to fetch dashboard statistics ');
        }
    } catch (error) {
        console.log('Failed to fetch dashboard statistics', error);
    }
};

export const UseGetDashboardStats = () => {
    return useQuery('dashboardStats', () => getDashboardStats());
};
