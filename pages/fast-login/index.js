import Image from 'next/image';

import { useFormik } from 'formik';
import * as yup from "yup";
import React, { useState } from 'react';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import useFastLogin from '../../hooks/mutations/fast-login';
import { successToaster } from '../../utils/toaster';
import ButtonLoader from '../../components/ui/buttonLoader';
import ClockInPage from '../../components/common/fast-login/ClockInPage';

const loginSchema = yup.object({
	employee_id: yup
		.string()
		.required("Valid Employee Id is required.")
});

function FastLogin() {
	const [id, setId] = useState()
	const fastLogin = useFastLogin()
	const [clockInPage, setClockInPage] = useState(false)

	const formik = useFormik({
		initialValues: {
			employee_id: '',
		},
		validationSchema: loginSchema,
		onSubmit: async (values) => {
			fastLogin.mutate(
				{
					employee_id: values.employee_id
				},
				{
					onSuccess: (res) => {
						successToaster(" Fast Login Successfully!")
						setId(values.employee_id)
						setClockInPage(true)
					}
				}
			)
		},
	});

	const handleBackFastLogin = () => {
		setClockInPage(false);
		formik.resetForm();
		setId(null);
	};

	return (
		<>
			{clockInPage ?
				<ClockInPage id={id} setClockInPage={setClockInPage} setId={setId} handleBackFastLogin={handleBackFastLogin} />
				:
				<div className="min-h-screen bg-[#F7F7F7] flex md:justify-center items-center text-default_text">
					<div className="bg-white w-full m-5 md:m-0 md:max-w-xl rounded-3xl shadow-lg shadow-accent">
						<div className="md:my-10 text-default_text">
							<div >
								<div className="flex flex-shrink-0 justify-center px-4">
									<Image src="https://www.cordenconsulting.com/wp-content/uploads/2025/02/CC-logo.png" height={40000} width={40000} alt="logo" className="  py-4 lg:p-0 w-48 lg:w-56 " priority="" />
								</div>
								<p className='text-center  text-base lg:text-lg my-4'> Welcome</p>
								<form onSubmit={formik.handleSubmit} className='my-3 mx-12'>
									<div>
										<div className='space-y-4'>
											<div>
												<label className='m-2 font-semibold'>Employee Id</label>
												<div className="relative mt-1">
													<input
														type="text"
														id="employee_id"
														name="employee_id"
														className="appearance-none relative block w-full px-3 py-2 border border-gray-300 bg-gray-100 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
														placeholder="Employee Id"
														onChange={formik.handleChange}
														onBlur={formik.handleBlur}
														value={formik.values.employee_id}
													/>
													<UserCircleIcon className='h-6 w-6 text-gray-400 absolute right-3 z-10 top-2 cursor-pointer' />
												</div>
												{formik.touched.employee_id && formik.errors.employee_id && (
													<div className='text-sm text-darkred m-2'>{formik.errors.employee_id}</div>
												)}
											</div>
										</div>
										<button type="submit" className="group relative w-full my-4 flex justify-center rounded-2xl py-3 px-4 border border-transparent text-base font-medium text-white bg-[#009D9D] hover:bg-lightblue">
											{fastLogin.isLoading ? <ButtonLoader text={'Logging In...'} /> : "Login"}
										</button>
									</div>
								</form>
							</div>
						</div>
					</div>
				</div>
			}
		</>
	);
}

export default FastLogin;
