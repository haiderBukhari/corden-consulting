import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { errorToaster, successToaster } from '../../../../utils/toaster';

const uploadOffboardingDocument = async (data) => {
    try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            throw new Error('No authentication token found.');
        }

        const formData = new FormData();
        formData.append('document_type', data.documentType);
        formData.append('requires_acknowledgment', data.requiresAcknowledgment ? '1' : '0');
        formData.append('expiry_date', data.expiryDate);
        formData.append('user_id', data.userId);
        formData.append('file', data.file);

        const response = await axios.post(
            'https://hr-backend-talo.com/api/offboarding-documents/offboarding/documents',
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
            throw new Error('Failed to upload document');
        }
    } catch (error) {
        console.error('Failed to upload document:', error);
        throw error;
    }
};

export const useUploadOffboardingDocument = () => {
    const queryClient = useQueryClient();

    return useMutation(uploadOffboardingDocument, {
        onSuccess: (data) => {
            successToaster('Document uploaded successfully!');
            queryClient.invalidateQueries(['offboardingDocuments']);
        },
        onError: (error) => {
            let errorMessage = "Error uploading document.";
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
            }

            errorToaster(errorMessage);
        },
    });
}; 