import { useQuery } from 'react-query';
import axios from 'axios';

const fetchLoanConfigrationData = async (  ) => {
    try {
        const authToken = localStorage.getItem('authToken');

        if (!authToken) {
            throw new Error('No authentication token found.');
        }
        
      
        const response = await axios.get(`https://hr-backend-talo.com/api/getConfiguration-update-list`, {

            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });

        if (response.status === 200) {
            return response.data.response;
        } else {
            throw new Error('Failed to fetch configration');
        }
    } catch (error) {
        console.log('Failed to fetch    configration', error);

    }
};

export const getLoanConfigrationApprovalList = () => {
    return useQuery('LoanConfigrationApprovalList', () => fetchLoanConfigrationData());
};