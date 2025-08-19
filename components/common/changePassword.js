import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { PlusCircleIcon } from '@heroicons/react/24/solid';
import ButtonLoader from '../ui/buttonLoader';
import { successToaster } from '../../utils/toaster';
import useUpdatePassword from '../../hooks/mutations/changePassword';

const validationSchema = Yup.object().shape({
  password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
});

export default function ChangePassword({ role }) {
  const changePassword = useUpdatePassword();
  const formik = useFormik({
    validationSchema: validationSchema,
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    onSubmit: (values, { resetForm }) => {
      const formattedData = {
        password: values.password,
        c_password: values.confirmPassword,
      };
      changePassword.mutate(formattedData, {
        onSuccess: () => {
          successToaster("Password Updated Successfully");
          resetForm();
        },
      });
    },
  });

  const generateRandomPassword = () => {
    const randomPassword = Math.random().toString(36).substr(2, 8);
    formik.setFieldValue('password', randomPassword);
    formik.setFieldValue('confirmPassword', '');
  };

  const isButtonDisabled = !formik.values.password || !formik.values.confirmPassword ;

  return (
    <div className="flex items-center mt-6 mx-6 border p-2 rounded-md">
      <div className="bg-white rounded-md w-full overflow-y-auto max-h-[37rem]">
        <div className='flex justify-between p-2'>
          <div>
            <h2 className='font-bold text-lg text-default_text ml-3'>Change Password</h2>
          </div>
        </div>
        <div className='space-y-2 mt-3 text-sm px-5 -ml-3'></div>
        <form onSubmit={formik.handleSubmit} className="p-5">
          <div className="text-default_text flex space-x-4">
            <div className="mb-4 relative">
              <label htmlFor="password" className="block font-semibold">
                Password
              </label>
              <input
                type="text"
                id="password"
                name="password"
                placeholder="Password"
                {...formik.getFieldProps('password')}
                className="w-full rounded-lg bg-[#F0F0F0] border text-default_text border-gray-300 p-2"
              />
              {formik.touched.password && formik.errors.password && (
                <p className="text-darkred">{formik.errors.password}</p>
              )}
              <span
                className="absolute -top-4 right-0 text-primary border border-primary rounded-2xl cursor-pointer px-2 py-1 text-sm"
                onClick={generateRandomPassword}
              >
                Generate
              </span>
            </div>
            <div className="mb-4 relative">
              <label htmlFor="confirmPassword" className="block font-semibold">
                Confirm Password
              </label>
              <input
                type="text"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm Password"
                {...formik.getFieldProps('confirmPassword')}
                className="w-full rounded-lg bg-[#F0F0F0] border text-default_text border-gray-300 p-2"
              />
              {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                <p className="text-darkred">{formik.errors.confirmPassword}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-3 pb-4">
            <button
              type="submit"
              disabled={isButtonDisabled || changePassword.isLoading}
              className={`flex items-center rounded-full text-center px-9 py-2 bg-primary text-white border-2 ${isButtonDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {changePassword.isLoading ? <ButtonLoader text={'Updating...'} /> : "Update Password"}
            </button>
            <button
              type="button"
              className="border border-primary text-primary rounded-3xl py-2 px-9"
              onClick={() => formik.resetForm()}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
