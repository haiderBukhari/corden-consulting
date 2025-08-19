import { useMutation } from 'react-query';
import axios from 'axios';
import { errorToaster } from '../../../../utils/toaster';

const downloadOffboardingDocument = async (documentId) => {
    try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
            throw new Error('No authentication token found.');
        }

        const response = await axios.get(
            `https://hr-backend-talo.com/api/offboarding-documents/${documentId}/download`,
            {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
                responseType: 'blob',
            }
        );

        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error('Failed to download document');
        }
    } catch (error) {
        console.error('Failed to download document:', error);
        throw error;
    }
};

export const useDownloadOffboardingDocument = () => {
    return useMutation(downloadOffboardingDocument, {
        onSuccess: (blob) => {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `document-${Date.now()}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        },
        onError: (error) => {
            errorToaster('Failed to download document');
        },
    });
}; 