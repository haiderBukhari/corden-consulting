import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import DataLoader from '../../../ui/dataLoader';
import { useOffboardingConfigurations } from '../../../../hooks/query/offboarding/getOffboardingConfigurations';
import { useCreateOffboardingConfig } from '../../../../hooks/mutations/offboarding/createOffboardingConfig';
import { useUpdateOffboardingConfig } from '../../../../hooks/mutations/offboarding/updateOffboardingConfig';
import useDeleteOffboardingConfig from '../../../../hooks/mutations/offboarding/deleteOffboardingConfig';

const OffboardingChecklistComponent = ({ role }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const { data: checklistItems = [], isLoading: isFetching } = useOffboardingConfigurations();
  const createMutation = useCreateOffboardingConfig();
  const updateMutation = useUpdateOffboardingConfig();
  const deleteMutation = useDeleteOffboardingConfig();

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      type: 'optional',
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required('Item name is required')
        .min(3, 'Item name must be at least 3 characters'),
      description: Yup.string()
        .required('Description is required')
        .min(10, 'Description must be at least 10 characters'),
      type: Yup.string()
        .oneOf(['optional', 'mandatory'], 'Invalid type')
        .required('Type is required'),
    }),
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        if (editingItem) {
          await updateMutation.mutateAsync({ id: editingItem.id, data: values });
        } else {
          await createMutation.mutateAsync(values);
        }
        formik.resetForm();
        setEditingItem(null);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleEdit = (item) => {
    setEditingItem(item);
    formik.setValues({
      name: item.name,
      description: item.description,
      type: item.type,
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteMutation.mutateAsync(id);
    } catch (error) {
      console.log(error);
    }
  };

  if (isFetching) {
    return <DataLoader />;
  }

  return (
    <div className="min-h-screen p-3">
      <div className="p-4 bg-white rounded-lg shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">
          {editingItem ? 'Edit' : 'Add'} Offboarding Checklist Item
        </h2>
        
        <form onSubmit={formik.handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-700">Item Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="e.g., Return Company Assets"
                className={`p-2 border rounded-lg w-full ${formik.touched.name && formik.errors.name ? 'border-red-500' : 'border-gray-300'}`}
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-red-500 text-xs mt-1">{formik.errors.name}</p>
              )}
            </div>

            <div className="flex items-end pb-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="type"
                  name="type"
                  checked={formik.values.type === 'mandatory'}
                  onChange={(e) => formik.setFieldValue('type', e.target.checked ? 'mandatory' : 'optional')}
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label htmlFor="type" className="ml-2 block text-sm font-medium text-gray-700">
                  Mandatory Item
                </label>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block mb-1 text-sm font-medium text-gray-700">Description</label>
            <textarea
              id="description"
              name="description"
              value={formik.values.description}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter item description"
              rows="3"
              className={`p-2 border rounded-lg w-full ${formik.touched.description && formik.errors.description ? 'border-red-500' : 'border-gray-300'}`}
            />
            {formik.touched.description && formik.errors.description && (
              <p className="text-red-500 text-xs mt-1">{formik.errors.description}</p>
            )}
          </div>

          <div className="flex justify-end space-x-4 mt-4">
            {editingItem && (
              <button
                type="button"
                onClick={() => {
                  formik.resetForm();
                  setEditingItem(null);
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="bg-primary text-white px-6 py-2 rounded-lg focus:outline-none hover:bg-primary-dark disabled:opacity-50"
              disabled={isLoading || !formik.isValid || !formik.dirty}
            >
              {isLoading ? <DataLoader size="sm" /> : editingItem ? 'Update Item' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>

      <div className="p-4 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Configured Checklist Items</h2>
        
        {checklistItems.length === 0 ? (
          <p className="text-gray-500">No checklist items configured yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
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
                {checklistItems.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 break-words max-w-xs">
                      {item.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      
                       <span className={`px-4 py-2 inline-flex text-xs leading-5 font-semibold rounded-md ${item.type === 'mandatory' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>{item.type === 'mandatory' ? 'Mandatory' : 'Optional'}</span>
                     
                    </td>
                   
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm   font-medium space-x-3">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleEdit(item)}
                          className="text-white bg-primary rounded-md px-4 py-3"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 hover:text-red-800 disabled:opacity-50  bg-white border border-red-600 rounded-md px-4 py-3"
                        >
                          Delete
                        </button>
                      </div>
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

export default OffboardingChecklistComponent; 