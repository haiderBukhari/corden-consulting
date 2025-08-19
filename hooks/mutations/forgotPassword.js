import axios from "axios";
import { useQueryClient, useMutation } from "react-query";
import { errorToaster, successToaster } from "../../utils/toaster";

export default function UseForgotPassword() {
  const forgotPassword = async (formData) => {
    return await axios.post(
      `https://hr-backend-talo.com/api/forgot-password`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  };

  return useMutation(forgotPassword, {
    onSuccess: () => {
      successToaster("One time Otp code is send to you Email! ")
    },

    onError: (err, variables, context) => {
      let errorMessage = "Error ";

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