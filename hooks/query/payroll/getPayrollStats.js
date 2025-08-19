import { useQuery } from 'react-query';
import axios from 'axios';

const getPayrollStats = async () => {
  try {
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
      throw new Error('No authentication token found.');
    }

    const response = await axios.get(`https://hr-backend-talo.com/api/payroll/stats`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

    if (response.status === 200) {
      return response.data.total_payroll_amount[0];
    } else {
      throw new Error('Failed to fetch payroll stats.');
    }
  } catch (error) {
    console.log('Failed to fetch fetch payroll stats.', error);

  }
};

export const UseGetPayrollStats = () => {
  return useQuery('PayrollStats', () => getPayrollStats());
};
