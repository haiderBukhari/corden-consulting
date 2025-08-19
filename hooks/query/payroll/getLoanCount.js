import { useQuery } from 'react-query';
import axios from 'axios';

const getLoanCount = async () => {
  try {
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
      throw new Error('No authentication token found.');
    }

    const response = await axios.get(`https://hr-backend-talo.com/api/leave-earlySalary-loan/counts`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

    if (response.status === 200) {
      return response.data.leave_loan_earlySalary_count
    } else {
      throw new Error('Failed to fetch loan count .');
    }
  } catch (error) {
    console.log('Failed to fetch fetch loan count.', error);

  }
};

export const UseGetLoanCount = () => {
  return useQuery('loanCount', () => getLoanCount());
};
