import { useQuery } from 'react-query';
import axios from 'axios';

const getIndividualPayroll = async (id ) => {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
        throw new Error('No authentication token found.');
    }

    const response = await axios.get(`https://hr-backend-talo.com/api/get-last-payouts/${id}`, {
        headers: {
            Authorization: `Bearer ${authToken}`,
        },

    });

    if (response.status === 200) {
        return response.data.payroll;
    } else {
        throw new Error('Failed to fetch user Payroll.');
    }
};

export const useGetIndividualPayroll = (id) => {
    return useQuery('individualPayroll', () => getIndividualPayroll(id));
};