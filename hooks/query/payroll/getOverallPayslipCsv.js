
import { useQuery } from 'react-query';
import axios from 'axios';

const getOverallPayslipCSV = async ({ month, year }) => {
  const authToken = localStorage.getItem('authToken');
  if (!authToken) {
    throw new Error('No authentication token found.');
  }

  const response = await axios.get(`https://hr-backend-talo.com/api/export-payroll?year=${year}&month=${month}`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
    responseType: 'blob',
  });

  if (response.status === 200) {
    return response.data;
  } else {
    throw new Error('Failed to fetch user payslip csv.');
  }
};

export const useGetOverallPayslipCSV = (payslipParams) => {
  return useQuery(
    ['UserOverallPayslipCSV', payslipParams],
    () => getOverallPayslipCSV(payslipParams),
    {
      enabled: !!payslipParams,
    }
  );
};