import Image from 'next/image';
import { useFormik } from 'formik';
import * as yup from "yup";
import ButtonLoader from '../components/ui/buttonLoader';
import React, { useState } from 'react';
import { EyeIcon, EyeSlashIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import { useRouter } from 'next/router';
// import useLogin from '../hooks/mutations/login';

const loginSchema = yup.object({
  email: yup
    .string()
    .required("Valid email is required.")
    .email("Please enter a valid email address."),
  password: yup.string().min(8, "Minimum 8 digits").required("Password is required."),
});

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // const login = useLogin()
  // Initialize Formik with your form schema and initial values
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      // Commented out actual login functionality
      // login.mutate(
      //   {
      //     email: values.email,
      //     password: values.password
      //   },
      // )
      
      // Check for specific demo credentials
      if (values.email === 'demo@talo.com' && values.password === '12345678') {
        // Set role in localStorage
        localStorage.setItem('role', 'manager');
        router.push('/demo/dashboard');
      } else if (values.email === 'hr@talo.com' && values.password === '12345678') {
        // HR Manager role
        localStorage.setItem('role', 'hr_manager');
        router.push('/demo/dashboard');
      } else if (values.email === 'business@talo.com' && values.password === '12345678') {
        // Business Manager role
        localStorage.setItem('role', 'business_manager');
        router.push('/demo/dashboard');
      } else {
        // For any other credentials, set as manager by default
        localStorage.setItem('role', 'manager');
        router.push('/demo/dashboard');
      }
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
            <p className='text-center  text-base lg:text-lg my-4'>Welcome</p>

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
                        className="appearance-none relative block w-full px-3 py-2 border border-gray-300 bg-gray-100 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
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
                  <div>
                    <label className='m-2 font-semibold '>Password</label>
                    <div className="relative mt-1">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        className="appearance-none relative block w-full px-3 py-2 border border-gray-300 bg-gray-100 placeholder-gray-500 text-gray-900 rounded-xl focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                        placeholder="Password"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                      />
                      {showPassword ? (
                        <EyeIcon
                          className='text-gray-400 h-6 w-6 absolute right-3 z-10 top-2 cursor-pointer'
                          onClick={() => setShowPassword(false)}
                        />
                      ) : (
                        <EyeSlashIcon
                          className='text-gray-400 h-6 w-6 absolute right-3 z-10 top-2 cursor-pointer'
                          onClick={() => setShowPassword(true)}
                        />
                      )}
                    </div>
                    {formik.touched.password && formik.errors.password && (
                      <div className='text-sm text-darkred m-2'>{formik.errors.password}</div>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="group relative w-full my-4 flex justify-center rounded-2xl py-3 px-4 border border-transparent text-base font-medium text-white bg-[#009D9D] hover:bg-[#006D6D]"
                >
                  Sign in
                </button>
                {/* <div className="flex justify-center">
                  <Link href={'/pass/forgot-password'} className='text-primary hover:text-primary underline cursor-pointer my-2 text-center'>
                    Forgot Password?
                  </Link>
                </div> */}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
