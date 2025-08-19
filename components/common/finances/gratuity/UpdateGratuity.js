import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import UseUpdatePayroll from '../../../../hooks/mutations/payroll/updatePayroll';
import UseUpdateGratuity from '../../../../hooks/mutations/finances/updateGratuity';

const validationSchema = Yup.object({
  startingBalance: Yup.number()
    .required('startingBalance is required')
    .min(0, 'startingBalance must be at least $0'),
    reason: Yup.string().required('Add reason')
      

});

const EditGratuitylModal = ({ id, data, onClose }) => {
  const updateGratuity = UseUpdateGratuity();

  const formik = useFormik({
    initialValues: {
      startingBalance: '',
     reason:''
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      const formData = {
        user_id: id,
        new_gratuity_fund: values.startingBalance,
        reason:values.reason

      };

      updateGratuity.mutate({ formData });

      onClose();
    },
  });

  // useEffect(() => {
  //   formik.setValues({
  //     startingBalance: data?.graduity_fund || 0,
     

  //   });
  // }, [data]);

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">Add Gratuity Details</h2>

        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1"> Starting Balance</label>
            <input
              type="number"
              name="startingBalance"
              value={formik.values.startingBalance}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
            {formik.touched.startingBalance && formik.errors.startingBalance ? (
              <div className="text-darkred text-sm mt-1">{formik.errors.startingBalance}</div>
            ) : null}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Add Reason</label>
            <input
              type="string"
              name="reason"
              value={formik.values.reason}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
            {formik.touched.reason && formik.errors.reason ? (
              <div className="text-darkred text-sm mt-1">{formik.errors.reason}</div>
            ) : null}
          </div>


          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 bg-secondary text-white rounded-md"
            >
              Cancel
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
  );
};

export default EditGratuitylModal;
