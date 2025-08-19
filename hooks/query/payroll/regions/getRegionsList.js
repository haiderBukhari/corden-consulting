import { useQuery } from 'react-query';
import axios from 'axios';

const getRegionsList = async () => {
  try {
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
      throw new Error('No authentication token found.');
    }

    const response = await axios.get(`https://hr-backend-talo.com/api/regions`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

    if (response.status === 200) {
      return response.data.response
    } else {
      throw new Error('Failed to fetch regions.');
    }
  } catch (error) {
    console.log('Failed to fetch fetch regions.', error);

  }
};

export const UseGetRegionsList = () => {
  return useQuery('regions', () => getRegionsList());
};
