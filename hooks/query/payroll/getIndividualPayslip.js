import { useQuery } from 'react-query';
import axios from 'axios';

const getIndividualPayslip = async ({ id, month, year }) => {
  const authToken = localStorage.getItem('authToken');
  if (!authToken) {
    throw new Error('No authentication token found.');
  }

  const response = await axios.get(`https://hr-backend-talo.com/api/payslip/${id}/${month}/${year}`, {
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
    responseType: 'blob',
  });

  if (response.status === 200) {
    return response.data;
  } else {
    throw new Error('Failed to fetch user payslip.');
  }
};

export const useGetIndividualPayslip = (payslipParams) => {
  return useQuery(
    ['UserIndividualPayslip', payslipParams],
    () => getIndividualPayslip(payslipParams),
    {
      enabled: !!payslipParams,
    }
  );
};
