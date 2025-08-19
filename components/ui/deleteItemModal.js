import React from 'react';
import useGetActiveUser from '../../hooks/query/getUserFromLocalStorage';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const DeleteItemModal = ({ modalVisible, handleDeleteItem, item, closeModal, isCancel,action }) => {
  const { data: user } = useGetActiveUser();

  // Formik setup
  const formik = useFormik({
    initialValues: {
      reason: '',
    },
    validationSchema: Yup.object({
      reason: isCancel ? Yup.string().required('Reason is required') : Yup.string(),
    }),
    onSubmit: (values) => {
      if (isCancel) {
        // Pass reason and user.id when cancelling
        handleDeleteItem(values.reason);
      } else {
        // No reason needed when deleting
        handleDeleteItem();
      }
    },
  });

  return (
    modalVisible && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-96">
          <h2 className="text-xl font-bold mb-4">
            Are you sure you want to {action} this {item}?
          </h2>

          <form onSubmit={formik.handleSubmit}>
            {isCancel && (
              <div className="mb-4">
                <label htmlFor="reason" className="block text-gray-700 font-medium mb-2">
                  Reason<span className="text-darkred">*</span>
                </label>
                <textarea
                  id="reason"
                  name="reason"
                  rows="3"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none ${
                    formik.touched.reason && formik.errors.reason ? 'border-secondary' : 'border-gray-300'
                  }`}
                  value={formik.values.reason}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                ></textarea>
                {formik.touched.reason && formik.errors.reason ? (
                  <p className="text-darkred text-sm mt-1">{formik.errors.reason}</p>
                ) : null}
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="button"
                onClick={closeModal}
                className="py-2 px-4 bg-secondary text-white rounded-md mr-2"
              >
                {isCancel ? 'Discard' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="py-2 px-4 bg-primary text-white rounded-md"
              >
                Confirm
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default DeleteItemModal;
