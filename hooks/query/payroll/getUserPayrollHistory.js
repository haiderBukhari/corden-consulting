import { useQuery } from 'react-query';
import axios from 'axios';

const getUserPayrollHistory = async (id) => {
  try {
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
      throw new Error('No authentication token found.');
    }

    const response = await axios.get(`https://hr-backend-talo.com/api/user/payroll/history/${id}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

    if (response.status === 200) {
      return response.data.upcoming_payroll_history
    } else {
      throw new Error('Failed to fetch user payroll history.');
    }
  } catch (error) {
    console.log('Failed to fetch fetch user payroll history.', error);

  }
};

export const UseGetUserPayrollHistory = (id) => {
  return useQuery('UserPayrollHistory', () => getUserPayrollHistory(id));
};
