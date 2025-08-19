import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import ReactDatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import * as Yup from 'yup';
import { successToaster } from '../../../../utils/toaster';
import { ArrowLeft } from 'lucide-react';
import { FaPlus, FaTimes } from 'react-icons/fa';
import UseAddLocationSettings from '../../../../hooks/mutations/admin/addLocationsSettings';
import { UseGetAdminLocationSetting } from '../../../../hooks/query/admin/getAdminLocationSettings';
import DataLoader from '../../../ui/dataLoader';
import ButtonLoader from '../../../ui/buttonLoader';
import { UseGetTimeZone } from '../../../../hooks/query/getTimeZone';

const formatDateForDisplay = (dateStr) => {
	const [year, month, day] = dateStr.split('-');
	return `${day}-${month}-${year}`;
};
export default function SettingForm({ location, setShowSettingPage }) {
	const { id, name } = location

	const { data: locationData, isLoading } = UseGetAdminLocationSetting(id);
	const [holidayCount, setHolidayCount] = useState(0);
	const { data: timeZone } = UseGetTimeZone()
	const updateSettings = UseAddLocationSettings();
	// Function to format date for display (dd/mm/yyyy)
	
	// Function to handle start and end dates in Formik
	const handleDateChange = (e, index, type) => {
		const formattedDate = e.toISOString().split('T')[0]; // Format as yyyy-mm-dd for Formik
		formik.setFieldValue(`holidays[${index}].${type}`, formattedDate);

		const startDate = formik.values.holidays[index].startDate;
		const endDate = formik.values.holidays[index].endDate;

		const daysCount = calculateDaysCount(startDate, endDate);
		formik.setFieldValue(`holidays[${index}].no_of_days`, daysCount);
	};

	// Function to calculate days count
	const calculateDaysCount = (startDate, endDate) => {
		const start = new Date(startDate);
		const end = new Date(endDate);
		return start && end && start <= end ? Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1 : '';
	};

	const addHoliday = () => {
		const newHoliday = { name: '', startDate: '', endDate: '', daysCount: '' };
		formik.setFieldValue('holidays', [...formik.values.holidays, newHoliday]);
		setHolidayCount(holidayCount + 1); // Increment holiday count
	};

	const removeHoliday = (index) => {
		const holidays = formik.values.holidays.filter((_, i) => i !== index);
		formik.setFieldValue('holidays', holidays);
		setHolidayCount(holidays.length); // Update holiday count based on remaining holidays
	};


	const formik = useFormik({
		initialValues: {
			latePolicy: '',
			probationPeriod: '',
			yearlyCalendarStart: '',
			annualLeave: '',
			sickLeave: '',
			next_year_annual_leave_limit: '',
			maternityLeave: '',
			paternityLeave: '',
			compassionateLeave: '',
			firstDayOfWeek: 'Monday',
			time_zone: '',
			holidays: [],
			// weeklySettings: getDefaultWeeklySettings(locationData?.yearlyCalendarStart),
		},
		validationSchema: Yup.object({
			latePolicy: Yup.string().required('Late policy is required'),
			probationPeriod: Yup.string().required('Probation period is required'),
			yearlyCalendarStart: Yup.string().required('Yearly calendar start month is required'),
			annualLeave: Yup.number().required('Annual leave is required'),
			sickLeave: Yup.number().required('Sick leave is required'),
			maternityLeave: Yup.number().required('Maternity leave is required'),
			paternityLeave: Yup.number().required('Paternity leave is required'),
			next_year_annual_leave_limit: Yup.number().required('Annual Leave Limit  is required'),
			compassionateLeave: Yup.number().required('Compassionate leave is required'),
			time_zone: Yup.string().required('Timezone leave is required'),
			// weeklySettings: Yup.array().of(
			// 	Yup.object().shape({
			// 		day: Yup.string().required('Day is required'),
			// 		startTime: Yup.string()
			// 			.matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Start time must be in HH:mm'),

			// 		endTime: Yup.string()
			// 			.matches(/^([01]\d|2[0-3]):([0-5]\d)$/, 'End time must be in HH:mm'),

			// 		dayType: Yup.string().required('Day type is required'),
			// 	})
			// ),

			holidays: Yup.array().of(
				Yup.object().shape({
					name: Yup.string().required('Holiday name is required'),
					startDate: Yup.date().required('Start date is required'),
					endDate: Yup.date()
						.required('End date is required')
						.min(Yup.ref('startDate'), 'End date cannot be before start date'),
					no_of_days: Yup.number().nullable().required('Days count is required'),
				})
			),
		}),
		onSubmit: (values) => {
			const data = {
				id: id,
				data: {
					...values,
					// contract_hours: contractedHours,
					public_holiday_count: holidayCount,
					publicHolidays: values.holidays.map(holiday => ({
						name: holiday.name,
						start_date: formatDateForDisplay(holiday.startDate),
						end_date: formatDateForDisplay(holiday.endDate),
						no_of_days: holiday.no_of_days,
					})),
					time_zone: values.time_zone,
					// weeklySettings: values.weeklySettings.map(setting => ({
					// 	day: setting.day,
					// 	startTime: setting.startTime,
					// 	endTime: setting.endTime,
					// 	dayType: setting.dayType,
					// })),
				},
			};
			updateSettings.mutate(data, {
				onSuccess: () => {
					successToaster('Locations Setting Saved Successfully');
					setShowSettingPage(false);
				},
			});
		},
	});



	useEffect(() => {
		if (locationData) {
			const holidays = locationData?.publicHolidays || [];
			formik.setValues({
				...locationData,
				holidays: holidays,
				// contract_hours: locationData.contract_hours,
				next_year_annual_leave_limit: locationData.next_year_annual_leave_limit,
				time_zone: locationData?.time_zone || '',
				// weeklySettings: reorderWeeklySettings(formik.values.firstDayOfWeek, locationData.weeklySettings || []),
			});
			setHolidayCount(holidays.length); // Set holiday count based on the holidays data
		}
	}, [locationData]);



	return (
		isLoading ?
			<DataLoader />
			:
			(
				<form onSubmit={formik.handleSubmit} className="space-y-6">
					<button
						onClick={() => setShowSettingPage(false)}
						type='button'
						className='flex space-x-2 items-center px-2 py-1 text-white bg-primary rounded-xl mb-3'
					>
						<ArrowLeft className='text-white h-5 w-5' />
						<span>Back</span>
					</button>
					<h2 className='text-lg '>
						Location Name:
						<span className='font-semibold'> {name}</span>
					</h2>
					{/* Standard Settings */}
					<div className="grid grid-cols-3 gap-4">
						<div>
							<label htmlFor="yearlyCalendarStart">Yearly Calendar Start </label>
							<select
								id="yearlyCalendarStart"
								name="yearlyCalendarStart"
								onChange={formik.handleChange}
								value={formik.values.yearlyCalendarStart}
								className="w-full p-2.5 mt-2 rounded-lg  focus:outline-none text-sm border"
							>
								<option value="">Select Month</option>
								{[
									'January', 'February', 'March', 'April', 'May', 'June',
									'July', 'August', 'September', 'October', 'November', 'December'
								].map(month => (
									<option key={month} value={month}>{month}</option>
								))}
							</select>
							{formik.errors.yearlyCalendarStart && formik.touched.yearlyCalendarStart ? (
								<div className="text-darkred">{formik.errors.yearlyCalendarStart}</div>
							) : null}
						</div>
						<div>
							<label htmlFor="latePolicy">Standard Late Policy</label>
							<div className="relative mt-2">
								<input
									id="latePolicy"
									name="latePolicy"
									type="number"
									onChange={formik.handleChange}
									value={formik.values.latePolicy}
									className="w-full p-2.5 rounded-lg focus:outline-none text-sm border  pr-16 " // Added padding on the right for the suffix
								/>
								<div className="absolute inset-y-0 right-0 flex items-center px-3 bg-gray-100  border-gray-300 rounded-r-lg">
									<span className="text-gray-500">mins</span>
								</div>
							</div>
							{formik.errors.latePolicy && formik.touched.latePolicy ? (
								<div className="text-darkred">{formik.errors.latePolicy}</div>
							) : null}
						</div>

						<div>
							<label htmlFor="probationPeriod">Probation Period</label>
							<div className="relative mt-2">
								<input
									id="probationPeriod"
									name="probationPeriod"
									type="number"
									onChange={formik.handleChange}
									value={formik.values.probationPeriod}
									className="w-full p-2.5 rounded-lg focus:outline-none text-sm border pr-20 " // Added padding on the right for the suffix
								/>
								<div className="absolute inset-y-0 right-0 flex items-center px-3 bg-gray-100 border-gray-300 rounded-r-lg">
									<span className="text-gray-500">months</span>
								</div>
							</div>
							{formik.errors.probationPeriod && formik.touched.probationPeriod ? (
								<div className="text-darkred">{formik.errors.probationPeriod}</div>
							) : null}
						</div>

					</div>

					{/* Leaves */}
					<div>
						<h3 className="text-lg font-semibold">Leaves Allocation</h3>
						<div className="grid grid-cols-3 mt-4 gap-4">
							<div>
								<label htmlFor="annualLeave">Annual Leave Allocation</label>
								<input
									id="annualLeave"
									name="annualLeave"
									type="number"
									onChange={formik.handleChange}
									value={formik.values.annualLeave}
									className="w-full p-2.5 mt-2 rounded-lg focus:outline-none text-sm border"
								/>
								{formik.errors.annualLeave && formik.touched.annualLeave ? (
									<div className="text-darkred">{formik.errors.annualLeave}</div>
								) : null}
							</div>
							<div>
								<label htmlFor="sickLeave">Sick Leave</label>
								<input
									id="sickLeave"
									name="sickLeave"
									type="number"
									onChange={formik.handleChange}
									value={formik.values.sickLeave}
									className="w-full p-2.5 mt-2 rounded-lg focus:outline-none text-sm border"
								/>
								{formik.errors.sickLeave && formik.touched.sickLeave ? (
									<div className="text-darkred">{formik.errors.sickLeave}</div>
								) : null}
							</div>
							<div>
								<label htmlFor="maternityLeave">Maternity Leave</label>
								<input
									id="maternityLeave"
									name="maternityLeave"
									type="number"
									onChange={formik.handleChange}
									value={formik.values.maternityLeave}
									className="w-full p-2.5 mt-2 rounded-lg focus:outline-none text-sm border"
								/>
								{formik.errors.maternityLeave && formik.touched.maternityLeave ? (
									<div className="text-darkred">{formik.errors.maternityLeave}</div>
								) : null}
							</div>
							<div>
								<label htmlFor="paternityLeave">Paternity Leave</label>
								<input
									id="paternityLeave"
									name="paternityLeave"
									type="number"
									onChange={formik.handleChange}
									value={formik.values.paternityLeave}
									className="w-full p-2.5 mt-2 rounded-lg focus:outline-none text-sm border"
								/>
								{formik.errors.paternityLeave && formik.touched.paternityLeave ? (
									<div className="text-darkred">{formik.errors.paternityLeave}</div>
								) : null}
							</div>
							<div>
								<label htmlFor="compassionateLeave">Compassionate Leave</label>
								<input
									id="compassionateLeave"
									name="compassionateLeave"
									type="number"
									onChange={formik.handleChange}
									value={formik.values.compassionateLeave}
									className="w-full p-2.5 mt-2 rounded-lg focus:outline-none text-sm border"
								/>
								{formik.errors.compassionateLeave && formik.touched.compassionateLeave ? (
									<div className="text-darkred">{formik.errors.compassionateLeave}</div>
								) : null}
							</div>

						</div>


					</div>

					{/* First Day of the Week  and annual leave limit*/}
					<div className='grid grid-cols-2 gap-3'>

						<div>
							<label htmlFor="next_year_annual_leave_limit">Next Year Annual Leave Limit</label>
							<input
								id="next_year_annual_leave_limit"
								name="next_year_annual_leave_limit"
								type="number"
								onChange={formik.handleChange}
								value={formik.values.next_year_annual_leave_limit}
								className="w-full p-2.5 mt-2 rounded-lg focus:outline-none text-sm border"
							/>
							{formik.errors.next_year_annual_leave_limit && formik.touched.next_year_annual_leave_limit ? (
								<div className="text-darkred">{formik.errors.next_year_annual_leave_limit}</div>
							) : null}
						</div>

						<div>
							<label htmlFor="time_zone"> Time Zone</label>
							<select
								id="time_zone"
								name="time_zone"
								onChange={formik.handleChange}
								value={formik.values.time_zone}
								className="w-full p-2.5 mt-2 rounded-lg focus:outline-none text-sm border"
							>
								{timeZone?.map(zone => (
									<option key={zone.value} value={zone.value}>
										{zone.label}
									</option>
								))}
							</select>
							{formik.errors.time_zone && formik.touched.time_zone ? (
								<div className="text-darkred">{formik.errors.time_zone}</div>
							) : null}
						</div>

					</div>




					<div className="mb-6">
						<h3 className="text-lg font-medium mb-2">Public Holidays</h3>
						<div className="flex items-center mb-4">
							<label className="block text-sm mb-2">Public Holiday Count</label>
							<input
								type="number"
								min="0"
								value={holidayCount}
								onChange={(e) => setHolidayCount(parseInt(e.target.value, 10) || 0)}
								className="border p-2 ml-4 rounded w-16 text-center"
								readOnly
							/>
						</div>

						{formik.values.holidays.map((holiday, index) => (
							<div key={index} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center mb-4 pb-4">
								{/* Holiday input fields */}
								<div>
									<label className="block text-sm mb-1">Holiday Name</label>
									<input
										type="text"
										name={`holidays[${index}].name`}
										value={formik.values.holidays[index].name}
										onChange={formik.handleChange}
										onBlur={formik.handleBlur}
										className="border p-2 rounded w-full"
									/>
									{formik.touched.holidays?.[index]?.name && formik.errors.holidays?.[index]?.name && (
										<div className="text-red-600 text-sm">{formik.errors.holidays[index].name}</div>
									)}
								</div>

								<div>
									<label className="block text-sm mb-1">Start Date</label>
									<ReactDatePicker
									selected={holiday.startDate ? new Date(holiday.startDate) : null}
									onChange={(e) => handleDateChange(e, index, 'startDate')}
									dateFormat="dd/MM/yyyy"
									className="border p-2 rounded w-full"
								  />
									{formik.touched.holidays?.[index]?.startDate && formik.errors.holidays?.[index]?.startDate && (
										<div className="text-red-600 text-sm">{formik.errors.holidays[index].startDate}</div>
									)}
								</div>

								{/* End Date input using react-datepicker */}
								<div>
									<label className="block text-sm mb-1">End Date</label>
									<ReactDatePicker
									selected={holiday.endDate ? new Date(holiday.endDate) : null}
									onChange={(e) => handleDateChange(e, index, 'endDate')}
									dateFormat="dd/MM/yyyy"
									className="border p-2 rounded w-full"
								  />
									{formik.touched.holidays?.[index]?.endDate && formik.errors.holidays?.[index]?.endDate && (
										<div className="text-red-600 text-sm">{formik.errors.holidays[index].endDate}</div>
									)}
								</div>

								<div className='flex space-x-3'>
									<div>
										<label className="block text-sm mb-1">No of Days </label>
										<input
											type="text"
											name={`holidays[${index}].no_of_days`}
											value={formik.values.holidays[index].no_of_days || ''}
											readOnly
											placeholder="Days Count"
											className="border p-2 rounded w-full bg-gray-100"
										/>
									</div>


									<button type="button" onClick={() => removeHoliday(index)} className="ml-2 text-red-600">
										<FaTimes />
									</button>

								</div>
							</div>
						))}

						<button
							type="button"
							onClick={addHoliday}
							className="flex items-center bg-primary text-white px-3 py-2 rounded-xl hover:bg-lightblue"
						>
							<FaPlus className="mr-2" /> Add Holiday
						</button>
					</div>



					{/* Save and Cancel Buttons */}
					<div className="space-x-4 flex justify-end">
						<button type="button" onClick={() => setShowSettingPage(false)} className="bg-secondary px-4 py-2 rounded-lg focus:outline-none">
							Cancel
						</button>
						<button type="submit" className="bg-primary text-white px-6 py-2 rounded-lg focus:outline-none">
							{updateSettings.isLoading ? <ButtonLoader text={'Saving..'} /> : "Save"}
						</button>
					</div>
				</form>
			)

	);
}
