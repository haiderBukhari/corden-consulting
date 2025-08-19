import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { errorToaster, successToaster } from '../../../utils/toaster';

export const useUpdateOffboardingConfig = () => {
  const queryClient = useQueryClient();

  const updateOffboardingConfig = async ({ id, data }) => {    
    const authToken = localStorage.getItem('authToken');
    
    if (!authToken) {
      throw new Error('No authentication token found.');
    }
    
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('type', data.type);
    
    return await axios.post(
      `https://hr-backend-talo.com/api/offboarding-configurations/offboarding-update/${id}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
  };
  
  return useMutation(updateOffboardingConfig, {
    onSuccess: async (res, variables, context) => {
      successToaster('Offboarding checklist configuration updated successfully');
      queryClient.invalidateQueries(['offboarding-configurations']);
    },
    onError: (error) => {
      let errorMessage = "Error updating offboarding configuration. ";
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