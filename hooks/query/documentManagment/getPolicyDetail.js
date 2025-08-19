import { useQuery } from 'react-query';
import axios from 'axios';

const fetchPolicyDetail = async (id) => {
    try {
        const authToken = localStorage.getItem('authToken');

        if (!authToken) {
            throw new Error('No authentication token found.');
        }
        
      
        const response = await axios.get(`https://hr-backend-talo.com/api/user/viewPolicyDetail/${id}`, {

            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });

        if (response.status === 200) {
            return response.data.data;
        } else {
            throw new Error('Failed to fetch policy detail');
        }
    } catch (error) {
        console.log('Failed to fetch policy detail', error);

    }
};

export const getPolicyDetail = (id) => {
    return useQuery('policyDetail', () => fetchPolicyDetail(id));
};