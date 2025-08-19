import axios from "axios";
import { useQueryClient, useMutation } from "react-query";
import { errorToaster, successToaster } from "../../../utils/toaster";

export default function useDownloadDocument() {
  const queryClient = useQueryClient();

  const downloadDocument = async (formData) => {
    console.log("path", formData);

    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      throw new Error('No authentication token found.');
    }

    try {
      const response = await axios.post('https://hr-backend-talo.com/api/download-document-path',
        formData,   
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          responseType: 'blob',
        }
      );

      // Ensure the response is a Blob and has content
      if (response.data instanceof Blob && response.data.size > 0) {
        return response.data;
      } else {
        throw new Error('Invalid response data: not a valid blob or empty data');
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error downloading the file');
    }
  };

  return useMutation(downloadDocument, {
    onSuccess: (blob, variables, context) => {


      // Optionally refetch the queries
      queryClient.refetchQueries(["profile"]);
    },
    onError: (err, variables, context) => {
      let errorMessage = "Error in downloading document: ";

      const errorData = err.response?.data;

      if (Array.isArray(errorData)) {
        // Handle case when response data is an array of errors
        errorData.forEach(error => {
          errorMessage += `\n${error.field}: ${error.message}`;
        });
      } else if (errorData?.errors) {
        // Handle case when errors are in an object with keys
        Object.keys(errorData.errors).forEach(key => {
          errorMessage += `\n${key}: ${errorData.errors[key]}`;
        });
      } else if (errorData?.message) {
        // Handle case when there is a single error message
        errorMessage += `\nMessage: ${errorData.message}`;
      } else {
        // Handle unexpected cases where no clear error format exists
        errorMessage += "\nAn unknown error occurred.";
      }

      errorToaster(errorMessage);
    },
  });
}
