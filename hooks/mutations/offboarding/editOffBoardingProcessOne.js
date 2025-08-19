import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { errorToaster, successToaster } from '../../../utils/toaster';

const editOffboardingStepOne = async (data) => {
	try {
		const authToken = localStorage.getItem('authToken');
		if (!authToken) {
			throw new Error('No authentication token found.');
		}

		// If no changes were made, just return success without calling API
		if (data.has_changes === false) {
			return { status: 'success', message: 'No changes to update' };
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

		// Handle existing attachment IDs
		if (data.existing_attachment_ids && data.existing_attachment_ids.length > 0) {
			data.existing_attachment_ids.forEach((id, index) => {
				formData.append(`existing_attachment_ids[${index}]`, id);
			});
		}

		// Handle new attachments
		if (data.attachments && data.attachments.length > 0) {
			data.attachments.forEach((doc, index) => {
				formData.append(`attachments[${index}]`, doc.file, doc.name);
			});
		}

		const response = await axios.post(
			`https://hr-backend-talo.com/api/offboarding/update-step1/${data.id}`,
			formData,
			{
				headers: {
					'Content-Type': 'multipart/form-data',
					Authorization: `Bearer ${authToken}`,
				},
			}
		);

		if (response.status === 200) {
			return response.data;
		} else {
			throw new Error('Failed to update step one of offboarding.');
		}
	} catch (error) {
		console.error('Failed to update step one of offboarding:', error);
		throw error;
	}
};

export const useEditOffboardingStepOne = () => {
	const queryClient = useQueryClient();

	return useMutation(editOffboardingStepOne, {
		onSuccess: () => {
			successToaster('Offboarding step one updated successfully!');
			queryClient.refetchQueries(['offBoardingDashboardStats']);
			queryClient.refetchQueries(['offBoardingUsersList']);
		},
		onError: (error) => {
			let errorMessage = "Error updating offboarding.";
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