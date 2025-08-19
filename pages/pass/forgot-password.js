import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useFormik } from 'formik';
import * as yup from "yup";
import { UserCircleIcon } from '@heroicons/react/24/solid';
import UseForgotPassword from '../../hooks/mutations/forgotPassword';
import ButtonLoader from '../../components/ui/buttonLoader';

const loginSchema = yup.object({
	email: yup
		.string()
		.required("Valid email is required.")
		.email("Please enter a valid email address."),
});

function ForgotPassword() {
	const router = useRouter();
	const forgotPassword = UseForgotPassword();

	const formik = useFormik({
		initialValues: {
			email: '',
		},
		validationSchema: loginSchema,
		onSubmit: async (values) => {
			forgotPassword.mutate({
				email: values.email,
			},
				{
					onSuccess: (res) => {
						const userId = res?.data?.data?.user?.id;
						if (res?.data?.status_code == 200) {
							router.push({
								pathname: "/pass/otp",
								query: { user_id: userId, email: values.email },
							});
						}
					}
				}
			)
		},
	});

	return (
		<div className="min-h-screen bg-[#F7F7F7] flex  md:justify-center items-center text-default_text">
			<div className="bg-white w-full m-5 md:m-0 md:max-w-xl rounded-3xl shadow-xl">
				<div className="md:my-10 text-default_text">
					<div >
						<div className="flex flex-shrink-0 justify-center px-4">
							<Image src="https://www.cordenconsulting.com/wp-content/uploads/2025/02/CC-logo.png" height={40000} width={40000} alt="logo" className="  py-4 lg:p-0 w-48 lg:w-56 " priority="" />
						</div>
						<p className='text-center  text-base lg:text-lg my-4'>Forgot Password</p>

						<form onSubmit={formik.handleSubmit} className='my-3 mx-12'>
							<div>
								<div className='space-y-4'>
									<div>
										<label className='m-2 font-semibold'>Email</label>
										<div className="relative mt-1">
											<input
												type="email"
												id="email"
												name="email"
												className="appearance-none relative block w-full px-3 py-2 border border-gray-300 bg-gray-100 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
												placeholder="Email or Username"
												onChange={formik.handleChange}
												onBlur={formik.handleBlur}
												value={formik.values.email}
											/>
											<UserCircleIcon className='h-6 w-6 text-gray-400 absolute right-3 z-10 top-2 cursor-pointer' />
										</div>
										{formik.touched.email && formik.errors.email && (
											<div className='text-sm text-darkred m-2'>{formik.errors.email}</div>
										)}
									</div>
								</div>

								<button type="submit" className="group relative w-full my-4 flex justify-center rounded-2xl py-3 px-4 border border-transparent text-base font-medium text-white bg-[#009D9D] hover:bg-lightblue">
									{forgotPassword.isLoading ? <ButtonLoader text={'Verifying Email...'} /> : "Next"}
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ForgotPassword;
