import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format, parse, isValid } from 'date-fns';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { IoMdClose } from 'react-icons/io';
import ButtonLoader from './buttonLoader';
import { Tooltip } from 'react-tooltip';
import { MdOutlineDownloadForOffline } from "react-icons/md";
import { useGetMemberDetail } from '../../hooks/query/team_lead/team/getMemberDetail';
import DataLoader from './dataLoader';
import { useLeaveStats } from '../../hooks/query/getLeaveStats';

const leaveTypes = ['annual', 'sick', 'maternity', 'paternity', 'compassionate'];

const parseDateWithFormats = (dateString) => {
  const formats = ['dd-MM-yyyy', 'dd/MM/yyyy'];
  for (const formatString of formats) {
    const parsedDate = parse(dateString, formatString, new Date());
    if (isValid(parsedDate)) {
      return parsedDate;
    }
  }
  return null; // Or handle invalid date appropriately
};

const normalizeSelectedLeave = (selectedLeave) => {
  if (!selectedLeave) return null;
  return {
    id: selectedLeave.leave_id || selectedLeave.id,
    user_id: selectedLeave.user_id,
    start_date: selectedLeave.start_date,
    end_date: selectedLeave.end_date,
    reason: selectedLeave.reason,
    attachment: selectedLeave.attachment,
    attachment_name: selectedLeave.attachment_name,
    no_of_days: selectedLeave.no_of_days,
    day_type: selectedLeave.day_type,
    half_type: selectedLeave.half_type,
    status: selectedLeave.leave_status || selectedLeave.status,
    type: selectedLeave.leave_type || selectedLeave.type,
  };
};

const EditLeaveModal = ({ isModalOpen, setIsModalOpen, selectedLeave, leaveStatsData, editLeave, member, userID }) => {
  const normalizedLeave = normalizeSelectedLeave(selectedLeave);

  const { data: leaveStats, isLoading: isLoadingStats } = useLeaveStats(userID);
  const { data: fetchedMember, isLoading: isLoadingMember } = useGetMemberDetail(normalizedLeave?.user_id);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [selectedDocumentName, setSelectedDocumentName] = useState('');
  const [isHalfLeaveEnabled, setIsHalfLeaveEnabled] = useState(false);
  const [originalTotalDays, setOriginalTotalDays] = useState(0);
  const [hasUserChangedDates, setHasUserChangedDates] = useState(false);
  const [halfDays, setHalfDays] = useState([]);
  const [isHalfDaySelected, setIsHalfDaySelected] = useState(false);
  const [publicHolidays, setPublicHolidays] = useState([]);

  const memberData = member || fetchedMember;
  const leaveStatsUserData = leaveStatsData || leaveStats;

  const offDays = memberData?.shift_settings
    .filter(setting => setting.day_type === 'Off')
    .map(setting => setting.day);

  const isDayOff = (date) => {
    const dayName = format(date, 'EEEE');
    return offDays?.includes(dayName);
  };

  const isPublicHoliday = (date) => {
    return publicHolidays.some(
      holidayDate => holidayDate.toDateString() === date.toDateString()
    );
  };

  const validationSchema = yup.object({
    startDate: yup.date().required('Start date is required'),
    endDate: yup.date()
      .required('End date is required')
      .min(yup.ref('startDate'), 'End date cannot be before start date'),
    leaveType: yup.string().required('Leave type is required'),
    reason: yup.string().required('Please add reason for the leave.'),
    half_type: yup.string().when('day_type', {
      is: 'half',
      then: (schema) => schema.required('Please select half leave type.'),
      otherwise: (schema) => schema.notRequired(),
    }),
  });

  const initialValues = {
    startDate: normalizedLeave ? parseDateWithFormats(normalizedLeave.start_date) || new Date() : new Date(),
    endDate: normalizedLeave ? parseDateWithFormats(normalizedLeave.end_date) || new Date() : new Date(),
    leaveType: normalizedLeave?.type || '',
    reason: normalizedLeave?.reason || '',
    numDays: 0,
    day_type: normalizedLeave?.day_type || 'full',
    half_type: normalizedLeave?.half_type || '',
    isHalfDayFromSettings: normalizedLeave?.isHalfDayFromSettings || false,
    errorMessage: '',
    // attachment: null,
  };

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema,
    onSubmit: (values) => {
      const formattedStartDate = format(values.startDate, 'dd-MM-yyyy');
      const formattedEndDate = format(values.endDate, 'dd-MM-yyyy');

      const formData = new FormData();
      formData.append('leave_id', normalizedLeave.id);
      formData.append('start_date', formattedStartDate);
      formData.append('end_date', formattedEndDate);
      formData.append('type', values.leaveType);
      formData.append('reason', values.reason);
      formData.append('day_type', values.day_type);
      formData.append('half_type', values.half_type);

      if (selectedDocument) {
        formData.append('attachment', selectedDocument);
      }

      editLeave.mutate(formData, {
        onSuccess: () => {
          setIsModalOpen(false);
        }
      });
    }
  });

  useEffect(() => {
    if (memberData && memberData?.shift_settings) {
      const halfDaysArray = memberData?.shift_settings
        .filter(setting => setting.day_type === 'Half')
        .map(setting => setting.day);
      setHalfDays(halfDaysArray);
    }
  }, [memberData]);

  useEffect(() => {
    if (memberData && memberData.location && memberData.location.public_holidays) {
      const holidays = [];

      memberData.location.public_holidays.forEach(holiday => {
        const start = new Date(holiday.start_date);
        const end = new Date(holiday.end_date);

        let currentDate = new Date(start);
        while (currentDate <= end) {
          holidays.push(new Date(currentDate));
          currentDate.setDate(currentDate.getDate() + 1);
        }
      });

      setPublicHolidays(holidays);
    }
  }, [memberData]);

  useEffect(() => {
    if (normalizedLeave && memberData) {
      const originalStartDate = parseDateWithFormats(normalizedLeave.start_date) || new Date();
      const originalEndDate = parseDateWithFormats(normalizedLeave.end_date) || new Date();
      const originalDayType = normalizedLeave.day_type || 'full';

      const totalDays = calculateTotalDays(originalStartDate, originalEndDate, originalDayType);
      setOriginalTotalDays(totalDays);
    }
  }, [normalizedLeave, memberData]);

  useEffect(() => {
    if (normalizedLeave && !selectedDocument) {
      if (normalizedLeave.attachment_name) {
        setSelectedDocumentName(normalizedLeave.attachment_name);
      } else {
        setSelectedDocumentName('');
      }
    }
  }, [normalizedLeave, selectedDocument]);

  useEffect(() => {
    if (formik.values.startDate && formik.values.endDate && memberData && leaveStatsUserData) {
      const isSingleDay = formik.values.startDate.toDateString() === formik.values.endDate.toDateString();
      setIsHalfLeaveEnabled(isSingleDay && !isHalfDaySelected);

      if (!isSingleDay && formik.values.day_type === 'half') {
        formik.setFieldValue('half_type', '');
        formik.setFieldValue('day_type', 'full');
      }

      // Always recalculate totalDays based on current formik values
      const totalDays = calculateTotalDays(formik.values.startDate, formik.values.endDate, formik.values.day_type);
      formik.setFieldValue('numDays', totalDays);

      const remainingBalance = getAdjustedRemainingBalance(formik.values.leaveType, totalDays);
      formik.setFieldValue('errorMessage', remainingBalance < 0 ? 'Selected days exceed the remaining balance.' : '');
    }
  }, [
    formik.values.startDate,
    formik.values.endDate,
    formik.values.day_type,
    formik.values.leaveType,
    memberData,
    leaveStatsUserData,
  ]);

  const getAdjustedRemainingBalance = (type, newTotalDays) => {
    if (!leaveStatsUserData) return 0;

    const allowedKey = `allowed_${type}_leaves`;
    const allowedLeaves = parseFloat(leaveStatsUserData[allowedKey] || 0);

    if (type === normalizedLeave.type) {
      // Leave type hasn't changed
      return allowedLeaves + originalTotalDays - newTotalDays;
    } else {
      // Leave type has changed
      return allowedLeaves - newTotalDays;
    }
  };

  const calculateTotalDays = (startDate, endDate, dayType) => {
    let totalDays = 0;
    let currentDate = new Date(startDate);

    const offDays = memberData?.shift_settings
      .filter(setting => setting.day_type === 'Off')
      .map(setting => setting.day);

    const halfDaysFromSettings = memberData?.shift_settings
      .filter(setting => setting.day_type === 'Half')
      .map(setting => setting.day);

    while (currentDate <= endDate) {
      const dayName = currentDate.toLocaleString('default', { weekday: 'long' });

      if (!offDays?.includes(dayName) && !isPublicHoliday(currentDate)) {
        let dayValue = 1; // Assume full day by default

        if (halfDaysFromSettings?.includes(dayName)) {
          dayValue = 0.5; // Half day from settings
        }

        if (currentDate.toDateString() === startDate.toDateString()) {
          // Apply user-selected day_type to the start date only
          if (formik.values.day_type === 'half') {
            dayValue = 0.5;
          }
        }

        totalDays += dayValue;
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    return totalDays;
  };

  const handleFileChange = (event) => {
    const file = event.currentTarget.files[0];
    if (file) {
      setSelectedDocument(file);
      setSelectedDocumentName(file.name);
    }
  };

  const handleFileRemove = () => {
    setSelectedDocument(null);
    setSelectedDocumentName('');
  };

  const handleStartDateChange = (date) => {
    formik.setFieldValue('startDate', date);
    setHasUserChangedDates(true);

    const dayName = date.toLocaleString('default', { weekday: 'long' });

    const isHalfDay = halfDays.includes(dayName);

    setIsHalfDaySelected(isHalfDay);
    setIsHalfLeaveEnabled(!isHalfDay);

    if (isHalfDay) {
      formik.setFieldValue('day_type', 'half');
      formik.setFieldValue('half_type', 'first_half');
      formik.setFieldValue('isHalfDayFromSettings', true);
    } else {
      formik.setFieldValue('day_type', 'full');
      formik.setFieldValue('half_type', '');
      formik.setFieldValue('isHalfDayFromSettings', false);
    }
  };

  const handleEndDateChange = (date) => {
    formik.setFieldValue('endDate', date);
    setHasUserChangedDates(true);

    const dayName = date.toLocaleString('default', { weekday: 'long' });

    const isHalfDay = halfDays.includes(dayName);

    setIsHalfDaySelected(isHalfDay);
    setIsHalfLeaveEnabled(!isHalfDay);

    if (isHalfDay) {
      formik.setFieldValue('day_type', 'half');
      formik.setFieldValue('half_type', 'first_half');
      formik.setFieldValue('isHalfDayFromSettings', true);
    } else {
      formik.setFieldValue('day_type', 'full');
      formik.setFieldValue('half_type', '');
      formik.setFieldValue('isHalfDayFromSettings', false);
    }
  };

  if (isLoadingMember || isLoadingStats) {
    return <DataLoader />
  }

  return (
    isModalOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white py-8 px-12 rounded-lg shadow-lg w-8/12">
          <h2 className="text-2xl mb-4">Edit Leave</h2>
          <form onSubmit={formik.handleSubmit}>
            {/* First row */}
            <div className="mb-4 flex space-x-4">
              {/* Start Date */}
              <div className="w-1/4">
                <label className="block text-gray-700 mb-2">Start Date</label>
                <DatePicker
                  selected={formik.values.startDate}
                  onChange={handleStartDateChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                  dateFormat="dd-MM-yyyy"
                  filterDate={(date) => !isDayOff(date) && !isPublicHoliday(date)}
                  dayClassName={(date) => {
                    const dayName = format(date, 'EEEE');
                    if (halfDays.includes(dayName)) {
                      return 'bg-indigo-400 text-white rounded-full'; // Half days
                    } else if (isPublicHoliday(date)) {
                      return 'bg-green-600 text-white rounded-full'; // Public holidays
                    } else {
                      return undefined;
                    }
                  }}
                />
                {formik.touched.startDate && formik.errors.startDate ? (
                  <div className="text-darkred text-sm">{formik.errors.startDate}</div>
                ) : null}
              </div>

              {/* End Date */}
              <div className="w-1/4">
                <label className="block text-gray-700 mb-2">End Date</label>
                <DatePicker
                  selected={formik.values.endDate}
                  onChange={handleEndDateChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                  dateFormat="dd-MM-yyyy"
                  filterDate={(date) => !isDayOff(date) && !isPublicHoliday(date)}
                  dayClassName={(date) => {
                    const dayName = format(date, 'EEEE');
                    if (halfDays.includes(dayName)) {
                      return 'bg-indigo-400 text-white rounded-full'; // Half days
                    } else if (isPublicHoliday(date)) {
                      return 'bg-green-400 text-white rounded-full'; // Public holidays
                    } else {
                      return undefined;
                    }
                  }}
                />
                {formik.touched.endDate && formik.errors.endDate ? (
                  <div className="text-darkred text-sm">{formik.errors.endDate}</div>
                ) : null}
              </div>

              {/* Reason */}
              <div className="w-2/4">
                <label className="block text-gray-700 mb-2">Reason</label>
                <textarea
                  value={formik.values.reason}
                  onChange={formik.handleChange}
                  name="reason"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                  rows="3"
                />
                {formik.touched.reason && formik.errors.reason ? (
                  <div className="text-darkred text-sm">{formik.errors.reason}</div>
                ) : null}
              </div>
            </div>

            {/* Second row */}
            <div className="mb-4 flex space-x-4">
              {/* Leave Type */}
              <div className="w-1/3">
                <label className="block text-gray-700 mb-2">Leave Type</label>
                <select
                  value={formik.values.leaveType}
                  onChange={(e) => formik.setFieldValue('leaveType', e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                >
                  {leaveTypes.map((leave) => (
                    <option key={leave} value={leave}>
                      {leave.charAt(0).toUpperCase() + leave.slice(1)} Leave
                    </option>
                  ))}
                </select>
                {formik.touched.leaveType && formik.errors.leaveType ? (
                  <div className="text-darkred text-sm">{formik.errors.leaveType}</div>
                ) : null}
              </div>

              {/* Number of Days */}
              <div className="w-1/3">
                <label className="block text-gray-700 mb-2">Number of Days</label>
                <input
                  type="text"
                  value={formik.values.numDays}
                  readOnly
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                />
                {formik.values.errorMessage && hasUserChangedDates && (
                  <p className="text-darkred text-sm mt-1">
                    {formik.values.errorMessage}
                  </p>
                )}
              </div>

              {/* Remaining Balance */}
              <div className="w-1/3">
                <label className="block text-gray-700 mb-2">Remaining Balance</label>
                {formik.values.leaveType ? (
                  <div
                    className={`${getAdjustedRemainingBalance(formik.values.leaveType, formik.values.numDays) < 0
                      ? 'text-darkred'
                      : ''
                      }`}
                  >
                    <input
                      type="text"
                      value={getAdjustedRemainingBalance(formik.values.leaveType, formik.values.numDays)}
                      readOnly
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
                    />
                    {getAdjustedRemainingBalance(formik.values.leaveType, formik.values.numDays) < 0 && (
                      <span className="text_default_text">
                        Leaves exceed the limit
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">Select leave type</div>
                )}
              </div>
            </div>

            {/* Third row */}
            <div className="mb-4 flex space-x-4">
              {/* Attachment */}
              <div className="w-1/3">
                <label className="block text-gray-700 mb-2">Attachment</label>
                <div className="flex items-center">
                  {normalizedLeave.attachment && (
                    <a
                      href={normalizedLeave.attachment}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline mr-2"
                    >
                      <MdOutlineDownloadForOffline
                        data-tooltip-id="my-tooltip"
                        data-tooltip-content="Download Current Attachment"
                        className="cursor-pointer h-5 w-5 bg-primary text-white rounded-full"
                      />
                    </a>
                  )}
                  <Tooltip id="my-tooltip" place="right" type="light" effect="float" />

                  <label className="block w-32 text-center text-xs text-gray-500 cursor-pointer py-2 px-4 rounded-full bg-primary text-white flex-shrink-0">
                    <input
                      type="file"
                      id="fileInput"
                      onChange={handleFileChange}
                      accept=".doc,.docx,.pdf,.jpeg,.png"
                      className="hidden"
                    />
                    Choose file
                  </label>

                  <div className="text-xs text-gray-700 ml-2">
                    {selectedDocumentName ? (
                      <div className="flex items-center break-all">
                        {selectedDocumentName}
                        <IoMdClose
                          className="ml-2 cursor-pointer"
                          onClick={handleFileRemove}
                        />
                      </div>
                    ) : (
                      'No file chosen!'
                    )}
                  </div>
                </div>
              </div>

              {/* Half Leave Toggle */}
              <div className="w-1/3">
                <div className="flex flex-col justify-start mb-4">
                  <label className="block text-gray-700 mb-2">Half Leave</label>
                  <label
                    data-tooltip-id="halfLeaveTooltip"
                    data-tooltip-content={
                      !isHalfLeaveEnabled
                        ? isHalfDaySelected
                          ? "Half leave is not applicable because the selected day is already a half day."
                          : "Half leave is only valid for a single day selection."
                        : ""
                    }
                    htmlFor="halfLeaveToggle"
                    className={`cursor-pointer w-12 h-6 flex items-center rounded-full p-1 transition-colors 
                      ${formik.values.day_type === 'half' ? 'bg-green-500' : 'bg-secondary'}
                      ${isHalfLeaveEnabled ? 'opacity-100' : 'opacity-50 cursor-not-allowed'}`
                    }
                  >
                    <input
                      type="checkbox"
                      className="hidden"
                      id="halfLeaveToggle"
                      checked={formik.values.day_type === 'half'}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        formik.setFieldValue('day_type', isChecked ? 'half' : 'full');
                        if (!isChecked) {
                          formik.setFieldValue('half_type', '');
                        }
                      }}
                      disabled={!isHalfLeaveEnabled} // Disable if not a single day
                    />
                    <div
                      className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform ${formik.values.day_type === 'half' ? 'translate-x-6' : ''}`}
                    ></div>
                  </label>
                  <Tooltip id="halfLeaveTooltip" place="top" effect="solid" />
                </div>
              </div>

              {/* Conditional Dropdown */}
              <div className="w-1/3">
                {formik.values.day_type === 'half' && !formik.values.isHalfDayFromSettings && (
                  <div className="">
                    <label className="block text-gray-700 mb-2">Half Leave Type</label>
                    <select
                      value={formik.values.half_type}
                      onChange={(e) => {
                        formik.setFieldValue('half_type', e.target.value);
                      }}
                      className="w-full border text-sm bg-white rounded-2xl p-2"
                    >
                      <option value="" disabled>Select...</option>
                      <option value="first_half">First Half</option>
                      <option value="second_half">Second Half</option>
                    </select>
                    {formik.touched.half_type && formik.errors.half_type ? (
                      <div className="text-xs text-darkred mt-1">{formik.errors.half_type}</div>
                    ) : null}
                  </div>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 mr-2 bg-secondary text-gray-700 rounded-md"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-lightblue-dark disabled:bg-gray-400"
                disabled={formik.values.errorMessage !== '' && hasUserChangedDates}
              >
                {editLeave.isLoading ? <ButtonLoader text={'Saving...'} /> : 'Save'}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default EditLeaveModal;
