import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { errorToaster, successToaster } from "../../../utils/toaster";

export default function UseUpdatePayroll() {

  const queryClient = useQueryClient()

  const updatePayroll = async (data) => {
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
      throw new Error('No authentication token found.');
    }

    return await axios.post(
      `https://hr-backend-talo.com/api/updatePayroll/${data.id}`,
      data.formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
  };

  return useMutation(updatePayroll, {
    onSuccess: async (res, variables, context) => {
      queryClient.refetchQueries(['UpcomingPayroll']);
      queryClient.refetchQueries(['UserPayrollHistory']);
      queryClient.refetchQueries(['PayrollStats']);

      successToaster("Payroll updated successfully!")
    },
    onError: (err, variables, context) => {
      let errorMessage = "Error in updating payroll";

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