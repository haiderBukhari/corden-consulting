import { useQuery } from 'react-query';
import axios from 'axios';

const getUserManagedLocations = async (userId) => {
  try {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      throw new Error('No authentication token found.');
    }

    const response = await axios.get(
      `https://hr-backend-talo.com/api/getManagedLocations/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    if (response.status === 200) {
      return response.data.response;
    } else {
      throw new Error("Failed to fetch user's managed locations.");
    }
  } catch (error) {
    console.error("Failed to fetch user's managed locations.", error);
    throw error;
  }
};

export const UseGetUserManagedLocations = (userId) => {
  return useQuery(['managedLocations', userId], () => getUserManagedLocations(userId));
};