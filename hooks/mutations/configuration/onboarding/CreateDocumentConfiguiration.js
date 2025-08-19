import axios from "axios";
import { successToaster, errorToaster } from "../../../../utils/toaster";

import { useMutation, useQueryClient } from "react-query";

export default function UseCreateDocumentConfiguration() {
  const queryClient = useQueryClient()

  const createDocumentConfiguration = async (data) => {

    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
      throw new Error('No authentication token found.');
    }
    return await axios.post(
      `https://hr-backend-talo.com/api/onboarding-documents/create`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${authToken}`,
        },
      }
    );


  };

  return useMutation(createDocumentConfiguration, {
    onSuccess: async (res, variables, context) => {

      queryClient.refetchQueries(["documentConfigurations"]);
      // queryClient.refetchQueries(["workingHours"]);
      successToaster("Document Created Successfully")

    },

    onError: (err, variables, context) => {
      let errorMessage = "Error in creating document configuration! ";

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
    }
  })
}