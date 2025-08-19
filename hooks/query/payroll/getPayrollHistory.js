import { useQuery } from 'react-query';
import axios from 'axios';

const getPayrollHistory = async () => {
  try {
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
      throw new Error('No authentication token found.');
    }

    const response = await axios.get(`https://hr-backend-talo.com/api/payroll/history`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

    if (response.status === 200) {
      return response.data.payroll_history
    } else {
      throw new Error('Failed to fetch payroll history.');
    }
  } catch (error) {
    console.log('Failed to fetch fetch payroll history.', error);

  }
};

export const UseGetPayrollHistory = () => {
  return useQuery('PayrollHistory', () => getPayrollHistory());
};
