import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import DataLoader from '../ui/dataLoader';
import useUpdateConfigurations from '../../hooks/mutations/admin/updateConfigurations';
import { CiFloppyDisk } from "react-icons/ci";
import ButtonLoader from '../ui/buttonLoader';
import { successToaster } from '../../utils/toaster';
import { formatDateToDdMmYy } from '../../utils/functions';
import { UseGetConfigurations } from '../../hooks/query/admin/getConfigurations';
const formatDate = (dateStr) => {
  const [day, month, year] = dateStr.split('-');
  return `${year}-${month}-${day}`;
};

function ConfigurationsComponent({ role }) {

  const [isPrefixEditable, setIsPrefixEditable] = useState(true);

  const [isIpRestricted, setIsIpRestricted] = useState(1);

  const updateConfigurations = useUpdateConfigurations();

  const { data: configurations, isLoading: isLoadingConfigurations } = UseGetConfigurations();

  const initialValues = {
    daysForLeaveToManager: '',
    totalLeaves: '',
    finance_email: '',
    report_email: '',
    report_date: '',
  };

  const formik = useFormik({
    initialValues,
    validationSchema: Yup.object().shape({
      daysForLeaveToManager: Yup.number()
        .min(1, 'Must be at least 1 day')
        .max(365, 'Cannot exceed 365 days')
        .test('compare-leaves', 'Days for manager approval cannot exceed total leaves', function (value) {
          const { totalLeaves } = this.parent;
          if (value && totalLeaves && value > totalLeaves) {
            return false;
          }
          return true;
        }),
      totalLeaves: Yup.number()
        .required('Required')
        .min(1, 'Must be at least 1 leave')
        .max(365, 'Cannot exceed 365 leaves'),
      finance_email: Yup.string()
        .email('Invalid email address')
        .required('Finance email is required'),
      report_email: Yup.string()
        .email('Invalid email address'),
       
      report_date: Yup.date()
       
    }),
    onSubmit: async (values, { resetForm }) => {
      const formData = new FormData();
      if (values.daysForLeaveToManager) {
        formData.append('no_of_days', values.daysForLeaveToManager);
      }
      if (values.totalLeaves) {
        formData.append('total_leaves', values.totalLeaves);
      }
      if (values.finance_email) {
        formData.append('finance_email', values.finance_email);
      }
      if (values.report_email) {
        formData.append('report_email', values.report_email);
      }
      if (values.report_date) {
        formData.append('report_date', formatDateToDdMmYy(new Date(values.report_date)));
      }

      // Append IP restriction state
      formData.append('ip_restricted', isIpRestricted);

      updateConfigurations.mutate(formData, {
        onSuccess: () => {
          successToaster('Configurations updated successfully!');
          resetForm();
        }
      });
    },
  });

  useEffect(() => {
    if (configurations && configurations.length > 0) {
      // const { no_of_days, total_leaves, finance_email, is_restricted } = configurations[0];
      const { no_of_days, total_leaves, finance_email, is_restricted, report_email, report_date } = configurations[0];
      formik.setFieldValue('daysForLeaveToManager', no_of_days);
      formik.setFieldValue('totalLeaves', total_leaves);
      formik.setFieldValue('finance_email', finance_email);
      formik.setFieldValue('report_email', report_email || '');
      formik.setFieldValue('report_date', report_date? formatDate(report_date): '');

      setIsIpRestricted(is_restricted);
    
    }
  }, [configurations]);

  // Handle IP restriction toggle
  const handleIpToggle = () => {
    setIsIpRestricted((prevState) => (prevState === 1 ? 0 : 1));
  };

  return (
    <div>
      {isLoadingConfigurations ? (
        <DataLoader />
      ) : (
        <div className='text-default_text min-h-screen'>
          <form onSubmit={formik.handleSubmit} className='mx-4 space-y-4  '>
            <div className='grid grid-cols-2 gap-4 '>
              {/* Existing form fields */}

              <div>
                <label htmlFor='totalLeaves' className='block text-base'>
                  Total Leaves (Days)
                </label>
                <input
                  type='number'
                  id='totalLeaves'
                  name='totalLeaves'
                  placeholder='Enter total leaves'
                  value={formik.values.totalLeaves}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full p-2 rounded-lg px-3  text-sm border ${formik.touched.totalLeaves && formik.errors.totalLeaves ? 'border-secondary' : 'border-gray-300'}`}
                />
                {formik.touched.totalLeaves && formik.errors.totalLeaves && (
                  <div className='text-darkred text-sm'>{formik.errors.totalLeaves}</div>
                )}
              </div>

              <div>
                <label htmlFor='daysForLeaveToManager' className='block text-base'>
                  Leave for Manager Approval (Days)
                </label>
                <input
                  type='number'
                  id='daysForLeaveToManager'
                  name='daysForLeaveToManager'
                  placeholder='Enter number of days'
                  value={formik.values.daysForLeaveToManager}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full p-2 border rounded-lg px-3  text-sm ${formik.touched.daysForLeaveToManager && formik.errors.daysForLeaveToManager ? 'border-secondary' : 'border-gray-300'}`}
                />
                {formik.touched.daysForLeaveToManager && formik.errors.daysForLeaveToManager && (
                  <div className='text-darkred text-sm'>{formik.errors.daysForLeaveToManager}</div>
                )}
              </div>

              <div>
                <label htmlFor="finance_email" className="block text-base">
                  Finance Email
                </label>
                <input
                  type="email"
                  id="finance_email"
                  placeholder="Enter Email"
                  name="finance_email"
                  value={formik.values.finance_email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full p-2 rounded-lg px-3  text-sm border ${formik.touched.finance_email && formik.errors.finance_email ? 'border-secondary' : 'border-gray-300'}`}
                />
                {formik.touched.finance_email && formik.errors.finance_email && (
                  <div className="text-darkred text-sm">{formik.errors.finance_email}</div>
                )}
              </div>
              {/* New IP Restriction Toggle */}

              <div className='flex items-center space-x-4'>
                <label htmlFor='ip_restriction' className='block text-base'>
                  All IP Restriction
                </label>
                <div
                  className={`relative w-12 h-6 rounded-full cursor-pointer transition-colors duration-300 ${isIpRestricted ? 'bg-green-500' : 'bg-secondary'}`}
                  onClick={handleIpToggle}
                >
                  <div
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 transform ${isIpRestricted ? 'translate-x-6' : 'translate-x-0'}`}
                  ></div>
                </div>
                <span className={`ml-2 ${isIpRestricted ? 'text-green-600' : 'text-gray-500'}`}>
                  {isIpRestricted ? 'Enabled' : 'Disabled'}
                </span>

              </div>
            </div>
            <h2 className='text-primary '>
              Note: Every Month Attendance/Leave Report (PDF) will be sent to this email on this Date
            </h2>
            <div className='grid grid-cols-2 gap-3 '>
              {/* Add new Report Email field */}
              <div>
                <label htmlFor="report_email" className="block text-base">
                  Report Email
                </label>
                <input
                  type="email"
                  id="report_email"
                  placeholder="Enter Report Email"
                  name="report_email"
                  value={formik.values.report_email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full p-2 rounded-lg px-3  text-sm border ${formik.touched.report_email && formik.errors.report_email ? 'border-secondary' : 'border-gray-300'}`}
                />
                {formik.touched.report_email && formik.errors.report_email && (
                  <div className="text-darkred text-sm">{formik.errors.report_email}</div>
                )}
              </div>

              {/* Add new Report Date field */}
              <div>
                <label htmlFor="report_date" className="block text-base">
                  Report Date
                </label>
                <input
                  type="date"
                  id="report_date"
                  placeholder="Select Report Date"
                  name="report_date"
                  value={formik.values.report_date}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full p-2 rounded-lg px-3  text-sm border ${formik.touched.report_date && formik.errors.report_date ? 'border-secondary' : 'border-gray-300'}`}
                />
                {formik.touched.report_date && formik.errors.report_date && (
                  <div className="text-darkred text-sm">{formik.errors.report_date}</div>
                )}
              </div>
            </div>


            {/* Save button */}
            <div className="flex justify-end space-x-3 pt-6 pb-4">
              <button
                type="submit"
                className="flex items-center justify-center rounded-lg px-3  px-9 py-2 bg-primary text-white text-sm disabled:opacity-40"
              >
                <CiFloppyDisk className='text-base mr-1' />
                {updateConfigurations.isLoading ? <ButtonLoader text={'Saving...'} /> : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default ConfigurationsComponent;
