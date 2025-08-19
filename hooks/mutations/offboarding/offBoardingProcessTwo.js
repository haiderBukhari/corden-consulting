import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { errorToaster, successToaster } from '../../../utils/toaster';

const offboardingStepTwo = async (data) => {
	try {
		const authToken = localStorage.getItem('authToken');
		if (!authToken) {
			throw new Error('No authentication token found.');
		}

		const response = await axios.post(
			`https://hr-backend-talo.com/api/offboarding/step2/${data.step}`,
			{
				exit_checklist: data.exit_checklist
			},
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
			throw new Error('Failed to complete step two of offboarding.');
		}
	} catch (error) {
		console.error('Failed to complete step two of offboarding:', error);
		throw error;
	}
};

export const useOffboardingStepTwo = () => {
	const queryClient = useQueryClient();

	return useMutation(offboardingStepTwo, {
		onSuccess: () => {
			successToaster('Offboarding step two completed successfully!');
			queryClient.refetchQueries(['offBoardingDashboardStats']);
			queryClient.refetchQueries(['offBoardingUsersList']);
		},
		onError: (error) => {
			let errorMessage = "Error completing step two of offboarding.";
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