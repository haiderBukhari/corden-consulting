import { useQuery } from 'react-query';
import axios from 'axios';

const fetchAllLoanData = async (  ) => {
    try {
        const authToken = localStorage.getItem('authToken');

        if (!authToken) {
            throw new Error('No authentication token found.');
        }
        
      
        const response = await axios.get(`https://hr-backend-talo.com/api/getallLoanList`, {

            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });

        if (response.status === 200) {
            return response.data.response;
        } else {
            throw new Error('Failed to fetch loan list');
        }
    } catch (error) {
        console.log('Failed to fetch  loan list', error);

    }
};

export const getAllLoanList = () => {
    return useQuery('AllLoan', () => fetchAllLoanData());
};