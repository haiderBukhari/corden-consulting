import { useQuery } from 'react-query';
import axios from 'axios';

const fetchEarlySalaryData = async (  ) => {
    try {
        const authToken = localStorage.getItem('authToken');

        if (!authToken) {
            throw new Error('No authentication token found.');
        }
        
      
        const response = await axios.get(`https://hr-backend-talo.com/api/early-salary/get-ES-stats`, {

            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });

        if (response.status === 200) {
            return response.data.stats;
        } else {
            throw new Error('Failed to fetch salary');
        }
    } catch (error) {
        console.log('Failed to fetch  salary', error);

    }
};

export const getEarlySalaryStats = () => {
    return useQuery('SalaryStats', () => fetchEarlySalaryData());
};