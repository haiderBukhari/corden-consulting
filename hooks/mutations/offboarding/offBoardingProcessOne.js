import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { errorToaster, successToaster } from '../../../utils/toaster';

const offboardingStepOne = async (data) => {
	try {
		const authToken = localStorage.getItem('authToken');
		if (!authToken) {
			throw new Error('No authentication token found.');
		}

		const formData = new FormData();
		formData.append('user_id', data.user_id);
		formData.append('emp_id', data.emp_id);
		formData.append('department', data.department);
		formData.append('position', data.position);
		formData.append('joining_date', data.joining_date);
		formData.append('manager_id', data.manager_id);
		formData.append('exit_type', data.exit_type);
		formData.append('last_working_day', data.last_working_day);
		formData.append('reason', data.reason);

		// Handle attachments
		if (data.attachments && data.attachments.length > 0) {
			data.attachments.forEach((doc, index) => {
				formData.append(`attachments[${index}]`, doc.file, doc.name);
			});
		}

		const response = await axios.post(
			'https://hr-backend-talo.com/api/offboarding/step1',
			formData,
			{
				headers: {
					'Content-Type': 'multipart/form-data',
					Authorization: `Bearer ${authToken}`,
				},
			}
		);

		if (response.status === 200) {
			// Only make the notification API call if either notifyManager or notifyFinance is true
			if (data.notifyManager || data.notifyFinance) {
				const notificationResponse = await axios.post(
					`https://hr-backend-talo.com/api/offboarding/notify/${response.data.response.id}`,
					{},
					{
						headers: {
							Authorization: `Bearer ${authToken}`,
						},
					}
				);

				if (notificationResponse.status === 200) {
					return {
						...response.data,
						notificationSuccess: true
					};
				} else {
					throw new Error('Failed to send notification.');
				}
			}
			
			return response.data;
		} else {
			throw new Error('Failed to complete step one of offboarding.');
		}
	} catch (error) {
		console.error('Failed to complete step one of offboarding:', error);
		throw error;
	}
};

export const useOffboardingStepOne = () => {
	const queryClient = useQueryClient();

	return useMutation(offboardingStepOne, {
		onSuccess: (data) => {
			successToaster('Offboarding step one completed successfully!');
			if (data.notificationSuccess) {
				successToaster('Notification sent successfully!');
			}
			queryClient.refetchQueries(['offBoardingDashboardStats']);
			queryClient.refetchQueries(['offBoardingUsersList']);
		},
		onError: (error) => {
			let errorMessage = "Error completing step one of offboarding.";
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