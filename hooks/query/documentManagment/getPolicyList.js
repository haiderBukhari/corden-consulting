import { useQuery } from 'react-query';
import axios from 'axios';

const fetchPolicyList = async () => {
    try {
        const authToken = localStorage.getItem('authToken');

        if (!authToken) {
            throw new Error('No authentication token found.');
        }
        
      
        const response = await axios.get(`https://hr-backend-talo.com/api/user/listPolicy`, {

            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });
        

        if (response.status === 200) {
            return response.data.data  ;
        } else {
            throw new Error('Failed to fetch policy list');
        }
    } catch (error) {
        console.log('Failed to fetch policy detail', error);

    }
};

export const getPolicyList = () => {
    return useQuery('policyList', () => fetchPolicyList());
};