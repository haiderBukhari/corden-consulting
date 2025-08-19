import { useQuery } from 'react-query';
import axios from 'axios';

const getExportLocationLeaves = async (locationId, startDate, endDate) => {
  try {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      throw new Error('No authentication token found.');
    }

    const params = {};
    if (startDate) {
      params.start_date = format(startDate, 'yyyy-MM-dd');
    }
    if (endDate) {
      params.end_date = format(endDate, 'yyyy-MM-dd');
    }
    const url = locationId ? `https://hr-backend-talo.com/api/export-location-leaves/${locationId}` : `https://hr-backend-talo.com/api/export-location-leaves`

    const response = await axios.get(
      url,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        params,
      }
    );

    if (response.status === 200) {
      return response.data.users_leaves_report;
    } else {
      throw new Error('Failed to export location leaves.');
    }
  } catch (error) {
    console.error('Failed to export location leaves.', error);
    throw error;
  }
};

export const UseExportLocationLeaves = (locationId) => {
  return useQuery(
    ['exportLocationLeaves', locationId],
    () => getExportLocationLeaves(locationId)
  );
};
