import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { errorToaster, successToaster } from '../../../utils/toaster';

const offboardingStepFour = async (data) => {
	try {
		const authToken = localStorage.getItem('authToken');
		if (!authToken) {
			throw new Error('No authentication token found.');
		}

		const response = await axios.post(
			`https://hr-backend-talo.com/api/offboarding/confirm/${data.offboardingId}`,
			{},
			{
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${authToken}`,
				},
			}
		);

		if (response.status === 200) {
			return response.data;
		} else {
			throw new Error('Failed to confirm offboarding.');
		}
	} catch (error) {
		console.error('Failed to confirm offboarding:', error);
		throw error;
	}
};

export const useOffboardingStepFour = () => {
	const queryClient = useQueryClient();

	return useMutation(offboardingStepFour, {
		onSuccess: () => {
			successToaster('Offboarding confirmed successfully!');
			queryClient.refetchQueries(['offBoardingDashboardStats']);
			queryClient.refetchQueries(['offBoardingUsersList']);
		},
		onError: (error) => {
			let errorMessage = "Error confirming offboarding.";
			const errorData = error.response?.data;

			if (Array.isArray(errorData)) {
				errorData.forEach(err => {
					errorMessage += `\n${err.field}: ${err.message}`;
				});
			} else if (errorData?.errors) {
				Object.keys(errorData.errors).forEach(key => {
					errorMessage += `\n${key}: ${errorData.errors[key]}`;
				});
			} else if (errorData?.message) {
				errorMessage += `\nMessage: ${errorData.message}`;
			} else {
				errorMessage += "\nAn unknown error occurred.";
			}

			errorToaster(errorMessage);
		},
	});
}; 