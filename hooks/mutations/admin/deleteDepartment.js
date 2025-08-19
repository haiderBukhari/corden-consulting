import axios from "axios";
import { useMutation, useQueryClient } from "react-query";
import { errorToaster, successToaster } from "../../../utils/toaster";

export default function UseDeleteDepartment() {
    const queryClient = useQueryClient()

    const deletePosition = async (id) => {

        const authToken = localStorage.getItem('authToken');

        if (!authToken) {
            throw new Error('No authentication token found.');
        }

        return await axios.delete(
            `https://hr-backend-talo.com/api/admin/department/delete/${id}`,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${authToken}`,
                },
            }
        );
    };

    return useMutation(deletePosition, {
        onSuccess: async (res, variables, context) => {
            successToaster("Department Deleted Succesfully!")
            queryClient.refetchQueries(['departments'])
        },
        onError: (err, variables, context) => {
            let errorMessage = "Error in Deleting Team";

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