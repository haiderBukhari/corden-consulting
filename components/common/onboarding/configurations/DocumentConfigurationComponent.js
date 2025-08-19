import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import DataLoader from '../../../ui/dataLoader';
import { useGetAllDocumentConfiguiration } from '../../../../hooks/query/configuration/onboarding/getDocumentConfigurations';  
import UseCreateDocumentConfiguration from '../../../../hooks/mutations/configuration/onboarding/CreateDocumentConfiguiration';
import UseDeleteDocumentConfiguration from '../../../../hooks/mutations/configuration/onboarding/DeleteDocumentConfiguration';
import ButtonLoader from '../../../ui/buttonLoader';
  const DocumentConfigurationComponent = ({ role }) => {
  
  const { data: documentConfigurations, isLoading: documentConfigurationsLoading, refetch } = useGetAllDocumentConfiguiration();
  const createDocumentMutation = UseCreateDocumentConfiguration();
  const deleteDocumentMutation = UseDeleteDocumentConfiguration();

  const formik = useFormik({
    initialValues: {
      documentName: '',
      isMandatory: false,
    },
    validationSchema: Yup.object({
      documentName: Yup.string()
        .required('Document name is required')
        .min(2, 'Document name must be at least 3 characters'),
    }),
    onSubmit: (values) => {
     const formData = new FormData();
     formData.append('document_name', values.documentName);
     formData.append('document_type', values.isMandatory ? 'mandatory' : 'optional');
     createDocumentMutation.mutate(formData, {
      onSuccess: () => {
        refetch();
        formik.resetForm(); 
      }
    });
  }
  });

  const handleDelete = (id) => {
    deleteDocumentMutation.mutate(id, {
      onSuccess: () => {
        refetch();
      }
    });
  };

  return (
    <div className="min-h-screen">
      <div className="p-4 bg-white rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Add New Document </h2>
        <p className="text-sm text-primary my-3">
           Note: (HR) will ask to upload these documents during onboarding process.
          </p>

        <form onSubmit={formik.handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="md:col-span-2">
              <label htmlFor="documentName" className="block mb-1 text-sm font-medium text-gray-700">Document Name</label>
              <input
                type="text"
                id="documentName"
                name="documentName"
                value={formik.values.documentName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="e.g., Employment Contract, NDA"
                className={`p-2 border rounded-lg w-full ${formik.touched.documentName && formik.errors.documentName ? 'border-red-500' : 'border-gray-300'}`}
              />
              {formik.touched.documentName && formik.errors.documentName && (
                <p className="text-red-500 text-xs mt-1">{formik.errors.documentName}</p>
              )}
            </div>

            <div className="flex items-center pb-2">
              <input
                type="checkbox"
                id="isMandatory"
                name="isMandatory"
                checked={formik.values.isMandatory}
                onChange={formik.handleChange}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="isMandatory" className="ml-2 block text-sm font-medium text-gray-700">
                Mandatory
              </label>
            </div>
          </div>
         
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="bg-primary text-white px-6 py-2 rounded-lg focus:outline-none hover:bg-primary-dark disabled:opacity-50"
              disabled={createDocumentMutation.isLoading || !formik.isValid || !formik.dirty}
            >
              {createDocumentMutation.isLoading ?  <ButtonLoader text="Adding Document..."  /> : 'Add Document'}
            </button>
          </div>
        </form>
      </div>

      <div className="p-4 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Configured Document </h2>
        {documentConfigurationsLoading ? (    
          <div className="flex justify-center items-center py-10">
            <DataLoader />
          </div>
        ) : !documentConfigurations || documentConfigurations?.length === 0 ? (
          <p className="text-gray-500">No document  configured yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Document Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {documentConfigurations?.map((doc) => (
                  <tr key={doc.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {doc.document_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {doc.document_type === 'mandatory' ? 
                       <span className="py-2  px-4 inline-flex text-xs leading-5 font-semibold rounded-md bg-red-100 text-red-800">Mandatory</span> : 
                       <span className="py-2  px-4 inline-flex text-xs leading-5 font-semibold rounded-md bg-green-100 text-green-800">Optional</span>
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button 
                        onClick={() => handleDelete(doc.id)}
                        className="text-red-600 hover:text-red-800 disabled:opacity-50  bg-white border border-red-600 rounded-md px-4 py-2 "
                      >
                        {deleteDocumentMutation.isLoading && deleteDocumentMutation.variables === doc.id ? <ButtonLoader text="Deleting..." /> : 'Delete'}
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

export default DocumentConfigurationComponent; 