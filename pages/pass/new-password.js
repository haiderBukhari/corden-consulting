import { useRouter } from 'next/router';
import Image from 'next/image';
import { useFormik } from 'formik';
import * as yup from "yup";
import React, { useState } from 'react';
import { EyeIcon } from '@heroicons/react/24/solid';
import UseResetPassword from '../../hooks/mutations/resetPassword';
import ButtonLoader from '../../components/ui/buttonLoader';

const loginSchema = yup.object({
	password: yup.string().min(8, "Minimum 8 digits").required("Password is required."),
	confirmPassword: yup.string()
		.oneOf([yup.ref('password'), null], 'Passwords must match') // Ensure that confirmPassword matches password
		.required('Please confirm your password'),
});

function NewPassword() {
	const [showPassword1, setShowPassword1] = useState(false);
	const [showPassword2, setShowPassword2] = useState(false);
	const router = useRouter();
  const { password_token } = router.query;
  const resetPassword = UseResetPassword();

	const formik = useFormik({
		initialValues: {
			password: '',
			confirmPassword: '',
		},
		validationSchema: loginSchema,
		onSubmit: async (values) => {
      resetPassword.mutate({
        password: values.password,
				c_password: values.confirmPassword,
        token: password_token,
      }, {
        onSuccess: (res) => {
          router.push("/");
        }
      });
    },
	});

	return (
		<div className="min-h-screen bg-[#F7F7F7] flex md:justify-center items-center text-default_text">
			<div className="bg-white w-full m-5 md:m-0 md:max-w-xl rounded-3xl shadow-xl">
				<div className="md:my-10 text-default_text">
					<div>
						<div className="flex flex-shrink-0 justify-center px-4">
							<Image src="https://www.cordenconsulting.com/wp-content/uploads/2025/02/CC-logo.png" height={40000} width={40000} alt="logo" className="py-4 lg:p-0 w-48 lg:w-56 " priority="" />
						</div>
						<p className='text-center font-semibold lg:text-lg my-4'>Create New Password</p>
						<form onSubmit={formik.handleSubmit} className='my-3 mx-12'>
							<div>
								<div className='space-y-4'>

									<div>
										<label className='m-2  text-base font-semibold'> Enter New Password</label>
										<div className="relative mt-1">
											<input
												type={showPassword1 ? "text" : "password"}
												id="password"
												name="password"
												className="appearance-none relative block w-full px-3 py-2 border border-gray-300 bg-gray-100 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
												placeholder="New Password"
												onChange={formik.handleChange}
												onBlur={formik.handleBlur}
												value={formik.values.password}
											/>
											<EyeIcon
												className='text-gray-400 h-6 w-6 absolute right-3 z-10 top-2 cursor-pointer'
												onClick={() => setShowPassword1(prevState => !prevState)}
											/>
										</div>
										{formik.touched.password && formik.errors.password && (
											<div className='text-sm text-darkred m-2'>{formik.errors.password}</div>
										)}
									</div>
									<div>
										<label className='m-2 text-base  font-semibold'>Confirm New Password</label>
										<div className="relative mt-1">
											<input
												type={showPassword2 ? "text" : "password"}
												id="confirmPassword"
												name="confirmPassword"
												className="appearance-none relative block w-full px-3 py-2 border border-gray-300 bg-gray-100 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
												placeholder="Confirm New Password"
												onChange={formik.handleChange}
												onBlur={formik.handleBlur}
												value={formik.values.confirmPassword}
											/>
											<EyeIcon
												className='text-gray-400 h-6 w-6 absolute right-3 z-10 top-2 cursor-pointer'
												onClick={() => setShowPassword2(prevState => !prevState)}
											/>
										</div>
										{formik.touched.confirmPassword && formik.errors.confirmPassword && (
											<div className='text-sm text-darkred m-2'>{formik.errors.confirmPassword}</div>
										)}
									</div>
								</div>
								<button
									type="submit"
									className="group relative w-full my-4 flex justify-center rounded-2xl py-3 px-4 border border-transparent text-base font-medium text-white bg-[#009D9D] hover:bg-lightblue"
								>
									{resetPassword.isLoading ? <ButtonLoader text={'Confirming...'} /> : "Confirm"}
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}

export default NewPassword;
