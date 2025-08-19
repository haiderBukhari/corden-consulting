import axios from "axios";
import { useRouter } from "next/router";
import { successToaster, errorToaster } from "../../utils/toaster";
import { useMutation, useQueryClient } from "react-query";

export default function useLogin() {
    const router = useRouter();
    const queryClient = useQueryClient()

    const login = async (data) => {
        return await axios.post(
            `https://hr-backend-talo.com/api/login`,
            data,
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
    };

    return useMutation(login, {
        onSuccess: async (res, variables, context) => {
            localStorage.setItem('authToken', res.data.response.token);
            const data = {
                id: res.data.response.user.id,
                name: res.data.response.user.name,
                email: res.data.response.user.email,
                role: res.data.response.user.role.name,
                avatar: res.data.response.user.avatar,
                timezone: res.data.response.user?.timezone,
                onboard: res.data.response?.user?.user_onboard,
                user_step: res.data.response?.user?.user_step,
                offboarding_status: res.data.response?.user?.user_offboarding_status,
                user_last_working_day: res.data.response?.user?.user_last_working_day
            }

            localStorage.setItem('user', JSON.stringify(data));
            queryClient.refetchQueries(["profile"])
            queryClient.refetchQueries('activeUser');
            const role = res.data.response.user.role.name;
            successToaster("Login Successful")

            if (res.data.response?.user?.user_offboarding_status === 1) {
                router.push('/document-management/user-offboarding-documents');
            } else {
                router.push(`${role}/dashboard`);
            }
        },
        onError: (err) => {
            if (err.response.data.status_code == 403) {
                errorToaster(err.response.data.message)
            }
            else {
                let errorMessage = "Error logging in. ";

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

        }
    })
}