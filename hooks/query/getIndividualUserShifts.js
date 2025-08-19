import { useQuery } from 'react-query';
import axios from 'axios';

const userShiftList = async (id) => {
	try {
		const authToken = localStorage.getItem('authToken');

		if (!authToken) {
			throw new Error('No authentication token found.');
		}

		const url = `https://hr-backend-talo.com/api/users/shifts/${id}`

		
		const response = await axios.get(url,
			{
				headers: {
					Authorization: `Bearer ${authToken}`,
				},
			}
		);

		if (response.status === 200) {
			return response.data.shifts;
		} else {
			throw new Error('Failed to fetch past attendances');
		}
	} catch (error) {
		console.log('Failed to fetch past attendances', error);
	}
};

export const UseGetUserShiftList = (id) => {
	return useQuery('UserShiftList', () => userShiftList(id));
};