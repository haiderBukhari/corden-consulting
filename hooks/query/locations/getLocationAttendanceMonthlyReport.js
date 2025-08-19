import { useQuery } from 'react-query';
import axios from 'axios';

const getLocationAttendanceMonthlyReport = async (locationId, startDate, endDate) => {
  try {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      throw new Error('No authentication token found.');
    }
     const url = locationId ? `https://hr-backend-talo.com/api/generate-location-attendence-monthly-report/${locationId}?start_date=${startDate}&end_date=${endDate}` : `https://hr-backend-talo.com/api/generate-location-attendence-monthly-report?start_date=${startDate}&end_date=${endDate}`

    const response = await axios.get(
      url,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    if (response.status === 200) {
      return response.data.Monthly_Report;
    } else {
      throw new Error('Failed to fetch location monthly attendance report.');
    }
  } catch (error) {
    console.error('Failed to fetch location monthly attendance report.', error);
    throw error;
  }
};

export const UseGetLocationAttendanceMonthlyReport = (locationId, startDate, endDate) => {
  return useQuery(
    ['locationAttendanceMonthlyReport', locationId, startDate, endDate],
    () => getLocationAttendanceMonthlyReport(locationId, startDate, endDate)
  );
};