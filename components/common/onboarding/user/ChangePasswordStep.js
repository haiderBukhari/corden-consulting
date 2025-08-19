import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import useLoginChangePassword from '../../../../hooks/mutations/onboarding/LoginChangePassword';

const ChangePasswordStep = ({ userId, onNext }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState(null);
  const changePassword = useLoginChangePassword();

  const validationSchema = Yup.object({
    newPassword: Yup.string()
      .required('New password is required')
      .min(8, 'Password must be at least 8 characters'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
      .required('Confirm password is required'),
  });

  const formik = useFormik({
    initialValues: {
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: async (values) => {
      setError(null);
      try {
        await changePassword.mutateAsync({
          userId,
          password: values.newPassword,
          password_confirmation: values.confirmPassword,
        });
        if (onNext) onNext();
      } catch (err) {
        setError(err?.message || 'Failed to change password.');
      }
    },
    validateOnChange: true,
    validateOnBlur: true,
  });

  return (
    <div className="max-w-md mx-auto">
      <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Create Your New Password</h3>
      <p className="text-sm text-gray-600 mb-6">
        For security, please set a new password for your account.
      </p>
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {/* New Password Field */}
        <div className="relative">
          <label
            htmlFor="newPasswordStep"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            New Password
          </label>
          <input
            id="newPasswordStep"
            name="newPassword"
            type={showPassword ? 'text' : 'password'}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.newPassword}
            className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm ${
              formik.touched.newPassword && formik.errors.newPassword
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-primary focus:border-primary'
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 top-7"
          >
            {/* {showPassword ? (
              <AiOutlineEyeInvisible className="h-5 w-5" />
            ) : (
              <AiOutlineEye className="h-5 w-5" />
            )} */}
          </button>
          {formik.touched.newPassword && formik.errors.newPassword && (
            <p className="mt-1 text-sm text-red-600">{formik.errors.newPassword}</p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div className="relative">
          <label
            htmlFor="confirmPasswordStep"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Confirm New Password
          </label>
          <input
            id="confirmPasswordStep"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.confirmPassword}
            className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none sm:text-sm ${
              formik.touched.confirmPassword && formik.errors.confirmPassword
                ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300 focus:ring-primary focus:border-primary'
            }`}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 top-7"
          >
            {/* {showConfirmPassword ? (
              <AiOutlineEyeInvisible className="h-5 w-5" />
            ) : (
              <AiOutlineEye className="h-5 w-5" />
            )} */}
          </button>
          {formik.touched.confirmPassword && formik.errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{formik.errors.confirmPassword}</p>
          )}
        </div>

        {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={changePassword.isLoading || !formik.isValid}
            className="px-6 py-2 text-sm font-medium text-white bg-primary rounded-md shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 ease-in-out"
          >
            {changePassword.isLoading ? 'Saving...' : 'Next'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePasswordStep; 