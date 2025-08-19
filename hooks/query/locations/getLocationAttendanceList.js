import { useQuery } from 'react-query';
import axios from 'axios';

const getLocationAttendanceList = async (locationId, date) => {
  try {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      throw new Error('No authentication token found.');
    }
    
    const url = locationId ? `https://hr-backend-talo.com/api/location/attendence/list/${locationId}?date=${date}` : `https://hr-backend-talo.com/api/location/attendence/list?date${date}`
    const response = await axios.get(
      url,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    if (response.status === 200) {
      return response.data.attendance;
    } else {
      throw new Error("Failed to fetch location's attendance list.");
    }
  } catch (error) {
    console.error("Failed to fetch location's attendance list.", error);
    throw error;
  }
};

export const UseGetLocationAttendanceList = (locationId, date) => {
  return useQuery(
    ['locationAttendanceList', locationId, date],
    () => getLocationAttendanceList(locationId, date)
  );
};