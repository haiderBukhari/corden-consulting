import axios from "axios";
import { useQueryClient, useMutation } from "react-query";
import { successToaster, errorToaster } from "../../../utils/toaster";

export default function useUploadOnboardingDocument() {
    const queryClient = useQueryClient();
    
    const uploadOnboardingDocument = async ({ data }) => {
        const authToken = localStorage.getItem('authToken');

        if (!authToken) {
            throw new Error('No authentication token found.');
        }

        return await axios.post(
            `https://hr-backend-talo.com/api/admin/user/uploadDocument`,
            data,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${authToken}`,
                },
            }
        );
    };

    return useMutation(uploadOnboardingDocument, {
        onSuccess: async (res, variables, context) => {
            queryClient.refetchQueries(["UserDoc"]);
            queryClient.refetchQueries(["profile"]);
            successToaster("Onboarding Document Uploaded Successfully!");
        },
        onError: (err, variables, context) => {
            let errorMessage = "Error in Uploading Onboarding Document. ";

            const errorData = err.response?.data;

            if (Array.isArray(errorData)) {
                errorData.forEach(error => {
                    errorMessage += `\n${error.field}: ${error.message}`;
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
}