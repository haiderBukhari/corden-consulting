import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { errorToaster, successToaster } from "../../../../utils/toaster";


export default function UseApproveRejectLoan() {

  const queryClient = useQueryClient()
  const approveLoan = async ({ id, data }) => {
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
      throw new Error('No authentication token found.');
    }

    return await axios.post(
      `https://hr-backend-talo.com/api/loans/approved_rejected/${id}`,
      data,
      {
        headers: {

          Authorization: `Bearer ${authToken}`,
        },
      }
    );
  };

  return useMutation(approveLoan, {
    onSuccess: (err) => {
      successToaster("Loan Accepted/rejected SuccessFully")
      queryClient.refetchQueries(["loan"])
      queryClient.refetchQueries(["loanCount"])
    },
    onError: (err, variables, context) => {

      let errorMessage = "Error in Loan Approval/Rejection";

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