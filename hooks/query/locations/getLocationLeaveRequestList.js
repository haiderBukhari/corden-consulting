import { useQuery } from 'react-query';
import axios from 'axios';

const getLocationLeaveRequestList = async (locationId, status) => {
  try {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      throw new Error('No authentication token found.');
    }
    const url = locationId ? `https://hr-backend-talo.com/api/location-leave-request-list/${locationId}?status=${status}` : `https://hr-backend-talo.com/api/location-leave-request-list?status=${status}`

    const response = await axios.get(
      url,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    if (response.status === 200) {
      return response.data.leaves;
    } else {
      throw new Error('Failed to fetch location leave request list.');
    }
  } catch (error) {
    console.error('Failed to fetch location leave request list.', error);
    throw error;
  }
};

export const UseGetLocationLeaveRequestList = (locationId, status) => {
  return useQuery(
    ['locationLeaveRequestList', locationId, status],
    () => getLocationLeaveRequestList(locationId, status)
  );
};