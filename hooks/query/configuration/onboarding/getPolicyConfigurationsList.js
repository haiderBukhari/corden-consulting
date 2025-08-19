import { useQuery } from 'react-query';
import axios from 'axios';

const fetchAllPolcyList = async ( id ) => {
    try {
        const authToken = localStorage.getItem('authToken');

        if (!authToken) {
            throw new Error('No authentication token found.');
        }
        
       
        const response = await axios.get(`https://hr-backend-talo.com/api/policies`, {

            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });

        if (response.status === 200) {
            return response.data.data;
        } else {
            throw new Error('Failed to fetch all approved leaves');
        }
    } catch (error) {
        console.log('Failed to fetch all approved  leaves', error);

    }
};

export const useGetAllPolicyConfiguiration = () => {
    return useQuery('policies', () => fetchAllPolcyList());
};