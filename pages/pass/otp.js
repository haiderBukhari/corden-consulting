import { useRouter } from 'next/router';
import Image from 'next/image';
import { useFormik } from 'formik';
import * as yup from "yup";
import React, { useState } from 'react';
import UseVerifyOTP from '../../hooks/mutations/verifyOTP';
import UseForgotPassword from '../../hooks/mutations/forgotPassword';
import ButtonLoader from '../../components/ui/buttonLoader';

const otpSchema = yup.object({
	otp: yup.string().required("OTP is required."),
});

function OTPScreen() {
	const router = useRouter();
	const [resend, setResend] = useState(false);
	const { user_id } = router.query;
	const verifyOTP = UseVerifyOTP();
	const forgotPassword = UseForgotPassword();

	const formik = useFormik({
		initialValues: {
			otp: '',
		},
		validationSchema: otpSchema,
		onSubmit: async (values) => {
			verifyOTP.mutate(
				{
					otp: values.otp,
					user_id: user_id,
				},
				{
					onSuccess: (res) => {
						if (res?.data?.status_code === 200) {
							const passwordToken = res?.data?.data?.password_token;
							router.push({
								pathname: "/pass/new-password",
								query: { password_token: passwordToken },
							});
						}
					}
				}
			);
		},
	});

	const handleResend = () => {
    setResend(true);
    forgotPassword.mutate({
      email: router.query.email,
    }, {
      onSuccess: () => {
        setResend(false);
      },
    });
  };

	return (
		<div className="min-h-screen bg-[#F7F7F7] flex md:justify-center items-center text-default_text">
			<div className="bg-white w-full m-5 md:m-0 md:max-w-xl rounded-3xl shadow-xl">
				<div className="md:my-10 text-default_text">
					<div className="flex flex-shrink-0 justify-center px-4">
						<Image src="https://www.cordenconsulting.com/wp-content/uploads/2025/02/CC-logo.png" height={40000} width={40000} alt="logo" className="py-4 lg:p-0 w-48 lg:w-56" priority="" />
					</div>
					<p className='text-center text-base lg:text-lg my-4'>Enter OTP</p>
					<form onSubmit={formik.handleSubmit} className='my-3 mx-12'>
						<div className='space-y-4'>
							<div>
								<label className='m-2 font-semibold'>OTP</label>
								<div className="relative mt-1">
									<input
										type="text"
										id="otp"
										name="otp"
										className="appearance-none relative block w-full px-3 py-2 border border-gray-300 bg-gray-100 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
										placeholder="Enter OTP"
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										value={formik.values.otp}
									/>
								</div>
								{formik.touched.otp && formik.errors.otp && (
									<div className='text-sm text-darkred m-2'>{formik.errors.otp}</div>
								)}
							</div>
						</div>
						<button type="submit" className="group relative w-full my-4 flex justify-center rounded-2xl py-3 px-4 border border-transparent text-base font-medium text-white bg-[#009D9D] hover:bg-lightblue">
							{verifyOTP.isLoading ? <ButtonLoader text={'Verifying OTP...'} /> : "Verify"}
						</button>
					</form>
					<button onClick={handleResend} className="text-blue-600 hover:text-primary text-center w-full mt-4">
						Resend Code
					</button>
					{resend && <p className="text-green-600 text-center mt-2">Code resent successfully!</p>}
				</div>
			</div>
		</div>
	);
}

export default OTPScreen;
