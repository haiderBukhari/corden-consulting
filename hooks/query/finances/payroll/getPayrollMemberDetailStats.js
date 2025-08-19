import { useQuery } from 'react-query';
import axios from 'axios';

const fetchPayrollMemberStats = async ( id ) => {
    try {
        const authToken = localStorage.getItem('authToken');

        if (!authToken) {
            throw new Error('No authentication token found.');
        }
        
      
        const response = await axios.get(`https://hr-backend-talo.com/api/members-details-payroll/${id}`, {

            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });

        if (response.status === 200) {
            return response.data.user;
        } else {
            throw new Error('Failed to fetch configration');
        }
    } catch (error) {
        console.log('Failed to fetch    configration', error);

    }
};

export const getPayrollMemberStats = (id) => {
    return useQuery('MemberDetailPayrollStats', () => fetchPayrollMemberStats(id));
};