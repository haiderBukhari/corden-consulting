import { useQuery } from 'react-query';
import axios from 'axios';

const getPayrollCurrentStatus = async () => {
  try {
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
      throw new Error('No authentication token found.');
    }

    const response = await axios.get(`https://hr-backend-talo.com/api/check-payroll/status`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

    if (response.status === 200) {
      return response.data.payroll
    } else {
      throw new Error('Failed to fetch current payroll status.');
    }
  } catch (error) {
    console.log('Failed to fetch fetch current payroll status.', error);
  }
};

export const UseGetPayrollCurrentStatus = () => {
  return useQuery('PayrollCurrentStatus', () => getPayrollCurrentStatus());
};
