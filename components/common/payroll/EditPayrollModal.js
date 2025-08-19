import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import UseUpdatePayroll from '../../../hooks/mutations/payroll/updatePayroll';

const validationSchema = Yup.object({
  bonus: Yup.number()
    .required('Bonus is required')
    .min(0, 'Bonus must be at least $0'),
  penalties: Yup.number()
    .required('Penalties are required')
    .min(0, 'Penalties must be at least $0'),
 
});

const EditPayrollModal = ({ data, onClose }) => {
  const updatePayroll = UseUpdatePayroll();

  const formik = useFormik({
    initialValues: {
      bonus: data?.bonus || 0,
      penalties: data?.penalties || 0,
   
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      const formData = {
        bonus: values.bonus,
        penalties: values.penalties,
       
      };

      updatePayroll.mutate({ id: data?.id, formData });

      onClose();
    },
  });

  useEffect(() => {
    formik.setValues({
      bonus: data?.bonus || 0,
      penalties: data?.penalties || 0,
     
    });
  }, [data]);

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-xl font-bold mb-4">Edit Payroll Details</h2>

        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Update Bonus ($)</label>
            <input
              type="number"
              name="bonus"
              value={formik.values.bonus}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
            {formik.touched.bonus && formik.errors.bonus ? (
              <div className="text-darkred text-sm mt-1">{formik.errors.bonus}</div>
            ) : null}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Update Penalties ($)</label>
            <input
              type="number"
              name="penalties"
              value={formik.values.penalties}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
            {formik.touched.penalties && formik.errors.penalties ? (
              <div className="text-darkred text-sm mt-1">{formik.errors.penalties}</div>
            ) : null}
          </div>


          <div className="flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 bg-secondary rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="py-2 px-4 bg-secondary text-white rounded-md"
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPayrollModal;
