import { useQuery } from 'react-query';
import axios from 'axios';

const getPayrollLogsHistory = async () => {
  try {
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
      throw new Error('No authentication token found.');
    }

    const response = await axios.get(`https://hr-backend-talo.com/api/payroll/log-history`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

    if (response.status === 200) {
      return response.data["Payroll logs"].payroll_histories
    } else {
      throw new Error('Failed to fetch payroll logs history.');
    }
  } catch (error) {
    console.log('Failed to fetch fetch payroll logs history.', error);

  }
};

export const UseGetPayrollLogsHistory = () => {
  return useQuery('PayrollLogsHistory', () => getPayrollLogsHistory());
};
