import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { BsChevronDown, BsChevronUp, BsThreeDotsVertical } from "react-icons/bs";
import { IoMdArrowDropright, IoMdClose } from "react-icons/io";
import CreateRequestCalendar from './CreateRequestCalendar';
import useRequestLeave from '../../../hooks/mutations/requestLeave';
import ButtonLoader from '../../ui/buttonLoader';
import { useLeaveStats } from '../../../hooks/query/getLeaveStats';
import { formatDateToDdMmYy } from '../../../utils/functions';
import { useGetMemberDetail } from '../../../hooks/query/team_lead/team/getMemberDetail';
import DataLoader from '../../ui/dataLoader';
import { Tooltip } from 'react-tooltip'

const leaveTypes = ['annual', 'sick', 'maternity', 'paternity', 'compassionate'];

const validationSchema = yup.object({
  startDate: yup.date()
    .required('Start date is required.'),
  endDate: yup.date()
    .required('End date is required.')
    .min(yup.ref('startDate'), 'End date cannot be before start date.'),  // Allowing any date after start date
  type: yup.string().required('Please select a leave type.'),
  reason: yup.string().required('Please add reason for the leave.'),
  attachment: yup.mixed().notRequired(),

  half_type: yup.string().when('day_type', {
    is: 'half',
    then: (schema) => schema.required('Please select half leave type.'),
    otherwise: (schema) => schema.notRequired(),
  }),
});

const CreateRequestForm = ({ resetView, id }) => {
  const { data: leaveStatsData, isLoading: isLeaveStatsLoading } = useLeaveStats();
  const { data: member, isLoading: isLoadingMember } = useGetMemberDetail(id);
  const requestLeave = useRequestLeave();
  const [isTypeSelected, setIsTypeSelected] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [selectedDocumentName, setSelectedDocumentName] = useState('');
  const [isHalfLeaveEnabled, setIsHalfLeaveEnabled] = useState(false);
  const [halfType, setHalfType] = useState('');
  const [isHalfDaySelected, setIsHalfDaySelected] = useState(false);
  const [publicHolidays, setPublicHolidays] = useState([]);
  const [isHalfLeaveVisible, setIsHalfLeaveVisible] = useState(false);

  const formik = useFormik({
    initialValues: {
      startDate: new Date(new Date().setHours(24, 0, 0, 0)), // Setting initial start date to tomorrow
      endDate: new Date(new Date().setHours(24, 0, 0, 0)),  // Setting initial end date to tomorrow
      type: '',
      reason: '',
      numDays: 0,
      day_type: 'full',
      half_type: '',
      isHalfDayFromSettings: false,
      errorMessage: '',
      attachment: null
    },
    validationSchema,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values, { setSubmitting }) => {
      const formData = new FormData();
      formData.append("start_date", formatDateToDdMmYy(values.startDate));
      formData.append("end_date", formatDateToDdMmYy(values.endDate));
      formData.append("reason", values.reason);
      formData.append("type", values.type);
      formData.append("day_type", values.day_type);
      formData.append("half_type", values.half_type);

      // if (values.day_type === 'half' && values.half_type) {
      //   formData.append("half_type", values.half_type);
      // }

      if (selectedDocument) {
        formData.append("attachment", selectedDocument);
      }

      requestLeave.mutate(formData, {
        onSuccess: () => {
          resetView();
        },
        onSettled: () => {
          setSubmitting(false);
        }
      });
    }
  });

  const getRemainingBalance = (type) => {
    if (!leaveStatsData) return 0;

    const allowedKey = `allowed_${type}_leaves`; // Access the allowed leave balance

    return parseFloat(leaveStatsData[allowedKey] || 0); // Ensure it's parsed as a number
  };

  useEffect(() => {
    if (member && member.location && member.location.public_holidays) {
      const holidays = [];

      member.location.public_holidays.forEach(holiday => {
        const start = new Date(holiday.start_date);
        const end = new Date(holiday.end_date);

        let currentDate = new Date(start);
        while (currentDate <= end) {
          holidays.push(new Date(currentDate)); // Add the date to the array
          currentDate.setDate(currentDate.getDate() + 1); // Move to next day
        }
      });

      setPublicHolidays(holidays);
    }
  }, [member]);

  useEffect(() => {
    if (formik.values.startDate && formik.values.endDate) {
      const totalDays = calculateTotalDays(
        formik.values.startDate,
        formik.values.endDate,
        formik.values.day_type
      );

      formik.setFieldValue('numDays', totalDays);

      const remainingBalance = getRemainingBalance(formik.values.type);
      if (remainingBalance < totalDays) {
        formik.setFieldValue(
          'errorMessage',
          'Selected days exceed the remaining balance.'
        );
      } else {
        formik.setFieldValue('errorMessage', '');
      }

      // Check if start and end dates are the same (single day)
      const isSingleDay = formik.values.startDate.toDateString() === formik.values.endDate.toDateString();

      // Get the day name of the selected date
      const dayName = formik.values.startDate.toLocaleString('default', { weekday: 'long' });

      // Get half-day settings
      const halfDaysFromSettings = member?.shift_settings
        .filter(setting => setting.day_type === 'Half')
        .map(setting => setting.day);

      // Check if the selected day is a half day
      const isHalfDayFromSettings = halfDaysFromSettings?.includes(dayName);

      // Determine if half-day toggle should be enabled
      const enableHalfDay = isSingleDay && !isHalfDayFromSettings;

      setIsHalfDaySelected(isHalfDayFromSettings);
      setIsHalfLeaveEnabled(enableHalfDay);

      // Update the form state for half-day settings if applicable
      if (isSingleDay && isHalfDayFromSettings) {
        formik.setFieldValue('day_type', 'half');
        formik.setFieldValue('half_type', 'first_half');
        formik.setFieldValue('isHalfDayFromSettings', true);
      } else {
        formik.setFieldValue('isHalfDayFromSettings', false);
      }
      // Manage half leave visibility
      const isPublicHolidayInRange = isPublicHolidayRange(
        formik.values.startDate,
        formik.values.endDate
      );
      if (totalDays > 1 || isPublicHolidayInRange || isHalfDayFromSettings) {
        setIsHalfLeaveVisible(false);
      } else {
        setIsHalfLeaveVisible(true);
      }
    }
  }, [
    formik.values.startDate,
    formik.values.endDate,
    formik.values.day_type,
    leaveStatsData,
    member,
  ]);

  const isPublicHoliday = (date) => {
    return publicHolidays.some(
      holidayDate => holidayDate.toDateString() === date.toDateString()
    );
  };

  const isPublicHolidayRange = (startDate, endDate) => {
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
      if (isPublicHoliday(currentDate)) {
        return true; // Return true if any of the dates is a public holiday
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return false; // Return false if no public holidays in the range
  };

  // Helper function to calculate total days excluding off days
  const calculateTotalDays = (startDate, endDate, dayType) => {
    let totalDays = 0;
    let currentDate = new Date(startDate);

    const offDays = member?.shift_settings
      .filter(setting => setting.day_type === 'Off')
      .map(setting => setting.day);

    const halfDaysFromSettings = member?.shift_settings
      .filter(setting => setting.day_type === 'Half')
      .map(setting => setting.day); // Get names of half days


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

  const handleDateChange = (range) => {
    formik.setFieldValue('startDate', range.startDate);
    formik.setFieldValue('endDate', range.endDate);

    const isSingleDay = range.startDate.toDateString() === range.endDate.toDateString();

    // Get the day name of the selected date
    const dayName = range.startDate.toLocaleString('default', { weekday: 'long' });

    // Get the half days from member's location settings
    const halfDays = member?.shift_settings
      .filter(setting => setting.day_type === 'Half')
      .map(setting => setting.day);

    // Check if the selected day is a half day
    const isHalfDay = halfDays?.includes(dayName);

    // Update state variables
    setIsHalfDaySelected(isHalfDay);

    // Set the half leave toggle based on whether it's a single day and not a half day
    setIsHalfLeaveEnabled(isSingleDay && !isHalfDay);

    if (isHalfDay) {
      // Automatically set day_type to 'half' when the selected day is a half day
      formik.setFieldValue('day_type', 'half');
      formik.setFieldValue('half_type', 'first_half');
      formik.setFieldValue('isHalfDayFromSettings', true);
    } else {
      formik.setFieldValue('day_type', 'full');
      formik.setFieldValue('half_type', '');
      formik.setFieldValue('isHalfDayFromSettings', false);
    }
    setHalfType('');

    // Manually trigger validation
    formik.setFieldTouched('startDate', true, true);
    formik.setFieldTouched('endDate', true, true);
    formik.validateForm();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && (['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png'].includes(file.type) && file.size <= 25 * 1024 * 1024)) {
      setSelectedDocument(file);
      setSelectedDocumentName(file.name);
      formik.setFieldValue('attachment', file);
    } else {
      alert('Invalid file type or size. Only Doc, Docx, PDF, JPEG, PNG files are allowed and max size is 25 MB.');
      setSelectedDocument(null);
      setSelectedDocumentName('');
      formik.setFieldValue('attachment', null);
    }
  };

  const handleFileRemove = () => {
    setSelectedDocument(null);
    setSelectedDocumentName('');
    formik.setFieldValue('attachment', null);
    document.getElementById('fileInput').value = '';
  };

  if (isLoadingMember || isLeaveStatsLoading) {
    return <DataLoader />;
  }

  return (
    <form onSubmit={formik.handleSubmit} className="grid grid-cols-4 gap-4">
      <div className="col-span-1 bg-gray-100 rounded-2xl p-4 flex flex-col justify-between h-full">
        <div className="flex justify-between items-center mb-4">
          <label className="block font-medium text-default_text">Summary</label>
        </div>

        <div className="flex-grow flex flex-col justify-between">
          <div className="w-full max-w-xs mx-auto">
            <div className="text-sm font-bold text-default_text">Select Leave Type</div>
            <div className={`rounded-2xl relative border mt-2 ${isOpen ? 'border-primary' : ''}`}>
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`flex justify-between items-center w-full bg-white px-2 py-2 text-left text-sm cursor-default focus:outline-none text-default_text ${isOpen ? 'rounded-t-2xl' : 'rounded-2xl'}`}
              >
                <span className='capitalize'>
                  {formik.values.type === "" ? "Select here" : `${formik.values.type} leave`}
                </span>

                <span>
                  {isOpen ?
                    <BsChevronUp className="h-4 w-4" /> :
                    <BsChevronDown className="h-4 w-4" />
                  }
                </span>
              </button>
              {isOpen && (
                <div className="absolute w-full bg-white rounded-b-2xl shadow z-10">
                  <ul className="rounded-b-md">
                    {leaveTypes.map((leave, index) => (
                      <li
                        key={index}
                        className={`px-4 py-2 text-sm text-default_text cursor-pointer capitalize
                            ${index === leaveTypes.length - 1
                            ? 'hover:bg-primary hover:rounded-b-2xl hover:text-white'
                            : 'hover:bg-primary hover:rounded-md-2xl hover:text-white'}`
                        }
                        onClick={() => {
                          formik.setFieldValue('type', leave);
                          setIsOpen(false);
                          setIsTypeSelected(true);
                        }}
                      >
                        {leave} leave
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            {formik.touched.type && formik.errors.type ? (
              <div className="text-xs text-darkred mt-1">{formik.errors.type}</div>
            ) : null}
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <div className="text-sm font-bold text-default_text">Requested Dates</div>
            <div className="text-sm text-gray-700">{`${formik.values.startDate.toLocaleString('default', { month: 'short' })} ${formik.values.startDate.getDate()} - ${formik.values.endDate.toLocaleString('default', { month: 'short' })} ${formik.values.endDate.getDate()}`}</div>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <div className="text-sm font-bold text-default_text">Total Day(s)</div>
            <div className="text-sm text-gray-600">{formik.values.numDays}</div>
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <div className="text-sm font-bold text-default_text">Remaining Balance</div>

            {formik.values.type ? (
              <div className={`text-sm ${formik.values.numDays > getRemainingBalance(formik.values.type) ? "text-darkred font-bold" : "text-gray-600"}`}>
                {getRemainingBalance(formik.values.type) - formik.values.numDays}

                {formik.values.numDays > getRemainingBalance(formik.values.type) && (
                  <span className="text-darkred font-bold ml-2">
                    (Leaves exceed the limit)
                  </span>
                )}
              </div>
            ) : (
              <div className="text-sm text-default_text">Select leave type</div>
            )}
          </div>
        </div>
      </div>

      <div className="col-span-3 bg-gray-100 rounded-2xl p-4">
        <div className="grid grid-cols-5 gap-4">
          <div className="col-span-3">
            <label className="block font-medium text-default_text">Time Off Request</label>
            <div
              className={`relative mt-4 ${!isTypeSelected ? "cursor-not-allowed opacity-50" : ""}`}
              style={{ pointerEvents: isTypeSelected ? 'auto' : 'none' }}
            >
              <CreateRequestCalendar
                onDateChange={handleDateChange}
                member={member}
                initialStartDate={formik.values.startDate}
                initialEndDate={formik.values.endDate}
              />
            </div>
            {formik.touched.startDate && formik.errors.startDate ? (
              <div className="text-xs text-darkred mt-1">{formik.errors.startDate}</div>
            ) : null}
            {formik.touched.endDate && formik.errors.endDate ? (
              <div className="text-xs text-darkred mt-1">{formik.errors.endDate}</div>
            ) : null}
          </div>

          <div className="col-span-2 flex flex-col justify-between">
            <div>
              <div className="flex-1 flex flex-col justify-center">
                <label className="block font-medium text-default_text">Reason/Comments</label>
                <div className="flex items-center mt-4">
                  <textarea
                    name="reason"
                    className={`p-2 text-xs text-gray-600 w-full bg-gray0 rounded-2xl border focus:outline-none focus:border-primary ${!isTypeSelected ? "cursor-not-allowed" : "cursor-pointer"}`}
                    placeholder="Enter comments"
                    style={{ height: "8em", resize: "none" }}
                    value={formik.values.reason}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    disabled={!isTypeSelected}
                  ></textarea>
                </div>
                {formik.touched.reason && formik.errors.reason ? (
                  <div className="text-xs text-darkred mt-1">{formik.errors.reason}</div>
                ) : null}
              </div>

              {/* Attachment Section */}
              <div className={`w-full mt-2 ${!isTypeSelected ? "cursor-not-allowed" : "cursor-pointer"}`}>
                <label className="block font-medium text-default_text mb-2">Attachment</label>
                <div className="flex items-center mb-4">
                  <label className={`block w-32 text-center text-xs text-default_text ${!isTypeSelected ? "cursor-not-allowed" : "cursor-pointer"} mr-4 py-2 px-4 rounded-full text-sm font-normal bg-primary text-white flex-shrink-0`}>
                    <input
                      type="file"
                      id="fileInput"
                      onChange={handleFileChange}
                      accept=".doc,.docx,.pdf,.jpeg,.png"
                      className="hidden"
                      disabled={!isTypeSelected}
                    />
                    Choose file
                  </label>
                  <div className={`text-xs text-gray-700 flex items-center`}>
                    {selectedDocumentName ? (
                      <div className="flex items-center break-all">
                        {selectedDocumentName}
                        <IoMdClose
                          className="ml-2 cursor-pointer"
                          onClick={handleFileRemove}
                        />
                      </div>
                    ) : (
                      "No file chosen!"
                    )}
                  </div>
                </div>
                {formik.touched.attachment && formik.errors.attachment ? (
                  <div className="text-xs text-darkred mt-1">{formik.errors.attachment}</div>
                ) : null}
              </div>

              {/* Half Leave Toggle Section */}
              <div className={`mt-4 ${isHalfLeaveVisible ? '' : 'hidden'}`}>
                <div className="flex items-center justify-start space-x-4 mb-4">
                  <label className="block font-medium text-default_text">Half Leave</label>
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
                          setHalfType(''); // Reset half_type when toggled off
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

                {/* Half Leave Type Selection */}
                {formik.values.day_type === 'half' && !formik.values.isHalfDayFromSettings && (
                  <div className="mt-2">
                    <label className="block font-medium text-default_text mb-2">Half Leave Type</label>
                    <select
                      value={halfType}
                      onChange={(e) => {
                        setHalfType(e.target.value);
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

            <button
              type="submit"
              className="flex items-center justify-center w-full px-4 py-2 mt-4 bg-primary text-xs text-white rounded-lg hover:bg-lightblue-dark disabled:bg-gray-400"
              style={{ position: 'relative' }}
              disabled={
                formik.isSubmitting ||
                !formik.values.type ||
                formik.values.numDays > getRemainingBalance(formik.values.type) ||
                (formik.values.day_type === 'half' && !formik.values.half_type && !formik.values.isHalfDayFromSettings) ||
                formik.values.numDays === 0
              }
            >
              {formik.isSubmitting || requestLeave.isLoading ? (
                <ButtonLoader text={'Submitting...'} />
              ) : (
                <div>
                  <span>Submit</span>
                  <span style={{ position: 'absolute', right: '1rem' }}>
                    <IoMdArrowDropright className="h-4 w-4" />
                  </span>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default CreateRequestForm;
