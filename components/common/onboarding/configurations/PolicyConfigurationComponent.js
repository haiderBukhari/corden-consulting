import { useFormik } from 'formik';
import * as Yup from 'yup';
import UseCreatePolicyConfiguration from '../../../../hooks/mutations/configuration/onboarding/CreatePolicyConfiguiration';
import UseDeletePolicyConfiguration from '../../../../hooks/mutations/configuration/onboarding/DeletePolicyConfiguiration';
import { useState } from 'react';
import DataLoader from '../../../ui/dataLoader';
import { useGetAllPolicyConfiguiration } from '../../../../hooks/query/configuration/onboarding/getPolicyConfigurationsList';
import ButtonLoader from '../../../ui/buttonLoader';


const PolicyConfigurationComponent = ({ role }) => {
  
  const { data: policies, isLoading: policiesLoading, refetch } = useGetAllPolicyConfiguiration();
  const createPolicyMutation = UseCreatePolicyConfiguration();
  const deletePolicyMutation = UseDeletePolicyConfiguration();


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
      formData.append('name', values.policyName);
      formData.append('file', values.file);
      formData.append('description', values.description);
      formData.append('type', values.isMandatory ? 'mandatory' : 'optional');

      createPolicyMutation.mutate(formData, {
        onSuccess: () => {
         
          formik.resetForm();
          refetch();
          setSubmitting(false);
        },
        onError: (error) => {
          
          setSubmitting(false);
        }
      });
    },
  });

  const handleDelete = (id) => {
    deletePolicyMutation.mutate(id, {
      onSuccess: () => {
      
        refetch();
      },
      
    });
  };

  const isSubmittingForm = createPolicyMutation.isLoading;

  return (
    <div className="min-h-screen bg-white">
      <div className="p-6 bg-white rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Add New Policy</h2>
        <p className="text-sm text-primary my-3">
            Note: Users will be required to acknowledge this policy during the onboarding process
          </p>

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
                This is a mandatory policy for acknowledgment
              </label>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="inline-flex justify-center items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
              disabled={isSubmittingForm}
            >
              {isSubmittingForm ? <ButtonLoader text="Adding Policy..." /> : 'Add Policy'}
            </button>
          </div>
        </form>
      </div>

      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Configured Policies</h2>
        {policiesLoading ? (
          <div className="flex justify-center items-center py-10">
            <DataLoader />
          </div>
        ) : !policies || policies?.length === 0 ? (
          <p className="text-center text-gray-500 py-10">No policies configured yet.</p>
        ) : 
          policies?.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Policy Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">File Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {policies?.map((policy) => (
                  <tr key={policy.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{policy.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs" title={policy.description}>{policy.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-800">
                        {policy.file_path ? (
                            <p
                            >
                                {policy.file_path.split('/').pop()}
                            </p>
                        ) : (
                            'N/A'
                        )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-4 py-2 inline-flex text-xs leading-5 font-semibold rounded-md ${policy.type === 'mandatory' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                         {policy.type === 'mandatory' ? 'Mandatory' : 'Optional'}
                        </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm   font-medium space-x-3">
                       {policy.file_path && (
                            <a 
                                href={`${policy.file_path}`}
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-white bg-primary rounded-md px-4 py-3"
                                title="View policy file"
                            >
                                View
                            </a>
                       )}
                      <button
                        onClick={() => handleDelete(policy.id)}
                        className="text-red-600 hover:text-red-800 disabled:opacity-50  bg-white border border-red-600 rounded-md px-4 py-3 "
                        disabled={deletePolicyMutation.isLoading && deletePolicyMutation.variables === policy.id}
                        aria-label={`Delete policy ${policy.name}`}
                      >
                        {deletePolicyMutation.isLoading && deletePolicyMutation.variables === policy.id ? <ButtonLoader text="Deleting..." /> : 'Delete'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
        )}
      </div>
    </div>
  );
};

export default PolicyConfigurationComponent; 