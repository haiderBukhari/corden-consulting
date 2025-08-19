import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { errorToaster, successToaster } from '../../../utils/toaster';

const createOffboardingConfig = async (data) => {
  try {
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      throw new Error('No authentication token found.');
    }

    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description);
    formData.append('type', data.type);
    
    const response = await axios.post(
      'https://hr-backend-talo.com/api/offboarding-configurations/create',
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
      throw new Error('Failed to create offboarding checklist configuration');
    }
  } catch (error) {
    console.error('Failed to create offboarding checklist configuration:', error);
    throw error;
  }
};

export const useCreateOffboardingConfig = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createOffboardingConfig,
    onSuccess: () => {
      successToaster('Offboarding checklist configuration created successfully');
      queryClient.refetchQueries(['offboarding-configurations']);
    },
    onError: (error) => {
      let errorMessage = "Error creating offboarding configuration. ";
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