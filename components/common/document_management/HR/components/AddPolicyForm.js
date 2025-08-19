import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/router';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import ButtonLoader from '../../../../ui/buttonLoader';
import useCreateInEmploymentDoc from '../../../../../hooks/mutations/documentManagment/CreateInEmploymentDoc';
const AddPolicyForm = ({ onBack, setShowAddPolicy, onSuccess }) => {
  const addPolicyMutation = useCreateInEmploymentDoc();
  const formik = useFormik({
    initialValues: {
      policyName: '',
      file: null,
      description: '',
      isMandatory: false,
    },
    validationSchema: Yup.object({
      policyName: Yup.string()
        .required('Policy name is required')
        .min(3, 'Policy name must be at least 3 characters'),
      file: Yup.mixed()
        .required('File is required')
        .test('fileSize', 'File size must be less than 5MB', (value) => {
          if (!value) return true;
          return value.size <= 5000000;
        })
        .test('fileType', 'Unsupported file format', (value) => {
          if (!value) return true;
          return ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(value.type);
        }),
      description: Yup.string()
        .required('Description is required')
        .min(10, 'Description must be at least 10 characters'),
    }),
    onSubmit: (values, { setSubmitting }) => {
      const formData = new FormData();
   
      formData.append('document_type', 'policy');
      formData.append('title', values.policyName);
      formData.append('file', values.file);
      formData.append('description', values.description);
      formData.append('ack_required', values.isMandatory ? '1' : '0');

      addPolicyMutation.mutate({formData}, {
        onSuccess: () => {

          formik.resetForm();
              // refetch();
              setShowAddPolicy(false);
              // setSubmitting(false);
        },
        onError: (error) => {

          // setSubmitting(false);
        }
      });
    },
  });

  const handleDelete = (id) => {
    // deletePolicyMutation.mutate(id, {
    //   onSuccess: () => {

    //     refetch();
    //   },

    // });
  };

  // const isSubmittingForm = createPolicyMutation.isLoading;


  return (
    <div className="space-y-6 p-4 min-h-screen  ">
      <div className="flex items-center">
        <button onClick={() => setShowAddPolicy(false)} type='button' className='flex space-x-2 items-center px-2 py-1 text-white bg-primary rounded-xl  mb-3'>
          <ArrowLeft className='text-white h-5 w-5' />
          <span>Back</span>
        </button>
      </div>

      <div className="py-5">
        <div className="">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Add New Policy</h2>

          <form onSubmit={formik.handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="policyName" className="block text-sm font-medium text-gray-700 mb-1">Policy Name</label>
                <input
                  type="text"
                  id="policyName"
                  name="policyName"
                  value={formik.values.policyName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="e.g., Company Code of Conduct"
                  className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm ${formik.touched.policyName && formik.errors.policyName ? 'border-red-500' : 'border-gray-300'}`}
                />
                {formik.touched.policyName && formik.errors.policyName && (
                  <p className="mt-1 text-red-600 text-xs">{formik.errors.policyName}</p>
                )}
              </div>

              <div>
                <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">Policy File</label>
                <input
                  type="file"
                  id="file"
                  name="file"
                  onChange={(event) => {
                    formik.setFieldValue('file', event.currentTarget.files[0]);
                  }}
                  onBlur={formik.handleBlur}
                  accept=".pdf"
                  className={`block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 ${formik.touched.file && formik.errors.file ? 'border-red-500' : 'border-gray-300'}`}
                />
                {formik.touched.file && formik.errors.file && (
                  <p className="mt-1 text-red-600 text-xs">{formik.errors.file}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">Supported formats: PDF </p>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Provide a brief summary of the policy"
                  rows="3"
                  className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm ${formik.touched.description && formik.errors.description ? 'border-red-500' : 'border-gray-300'}`}
                />
                {formik.touched.description && formik.errors.description && (
                  <p className="mt-1 text-red-600 text-xs">{formik.errors.description}</p>
                )}
              </div>

              <div className="flex items-center md:col-span-2">
                <input
                  type="checkbox"
                  id="isMandatory"
                  name="isMandatory"
                  checked={formik.values.isMandatory}
                  onChange={formik.handleChange}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="isMandatory" className="ml-2 block text-sm text-gray-700">
                  This is a mandatory policy for all employees
                </label>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <button
                type="submit"
                className="inline-flex justify-center items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                // disabled={isSubmittingForm}
              >
                Add Policy
                {/* {isSubmittingForm ? <ButtonLoader text="Adding Policy..." /> : 'Add Policy'} */}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPolicyForm;
