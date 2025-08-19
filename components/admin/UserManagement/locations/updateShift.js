import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import useUpdateShift from "../../../../hooks/mutations/updateShift";
import UseUpdateIndividualUserShift from "../../../../hooks/mutations/updateIndividualUserShift";

const DAYS_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const EditShiftModal = ({ onClose, shiftData, id, isIndividual = false }) => {
	const updateLocationShift = useUpdateShift();
	const updateIndividualShift = UseUpdateIndividualUserShift();

	const calculateHours = (settings) => {
		let weeklyHours = 0;
		settings.forEach(({ start_time, end_time, day_type }) => {
			if (day_type !== "Off") {
				const start = parseInt(start_time.split(":")[0]);
				const end = parseInt(end_time.split(":")[0]);
				weeklyHours += end - start;
			}
		});
		return { weekly: weeklyHours, monthly: weeklyHours * 4 };
	};

	const [hours, setHours] = useState(calculateHours(shiftData?.timings || []));

	const reorderWeeklySettings = (weeklySettings, firstDay) => {
		const startIndex = DAYS_ORDER.indexOf(firstDay);
		return [...DAYS_ORDER.slice(startIndex), ...DAYS_ORDER.slice(0, startIndex)]
			.map(day => weeklySettings.find(setting => setting.day === day) || { day, start_time: "", end_time: "", day_type: "Off" });
	};

	const formik = useFormik({
		enableReinitialize: true,
		initialValues: {
			shiftName: shiftData?.shift_name || "",
			firstDayOfWeek: shiftData?.first_day_of_week || "Monday",
			weeklySettings: reorderWeeklySettings(shiftData?.timings || [], shiftData?.first_day_of_week || "Monday"),
			isDefault: shiftData?.is_default == 1,  // Add the default shift toggle
			applyToAll: shiftData?.apply_to_all == 1,
		},
		validationSchema: Yup.object({
			shiftName: Yup.string().required("Shift Name is required"),
			firstDayOfWeek: Yup.string().required("First Day of the Week is required"),
			weeklySettings: Yup.array().of(
				Yup.object().shape({
					start_time: Yup.string().required("Start Time is required"),
					end_time: Yup.string().required("End Time is required"),
					day_type: Yup.string().required("Day Type is required"),
				})
			),
		}),
		onSubmit: (values) => {
			const common = {
				first_day_of_week: values.firstDayOfWeek,
				shift_timings: values.weeklySettings,
				contract_hours: hours.monthly,
				apply_to_all: values.applyToAll ? 1 : 0,
			};

			let updatedData, args;

			if (isIndividual) {
				updatedData = { shift_id: shiftData.id, ...common };
				args = { id: id, updatedData };
			} else {
				updatedData = {
					location_id: id,
					shift_name: values.shiftName,
					is_default: values.isDefault ? 1 : 0, // Pass is_default as 1 or 0 to the API
					...common,
				};
				args = { id: shiftData.id, updatedData };
			}
			updater.mutate(
				args,
				{
					onSuccess: () => {
						console.log("Shift updated successfully");
						onClose();
					},
					onError: (error) => {
						console.error("Error updating shift:", error);
					}
				}
			);
		},
	});

	useEffect(() => {
		setHours(calculateHours(formik.values.weeklySettings));
	}, [formik.values.weeklySettings]);

	useEffect(() => {
		formik.setFieldValue(
			"weeklySettings",
			reorderWeeklySettings(formik.values.weeklySettings, formik.values.firstDayOfWeek)
		);
	}, [formik.values.firstDayOfWeek]);

	const updater = isIndividual ? updateIndividualShift : updateLocationShift;

	return (
		<div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
			<div className="bg-white p-6 rounded-lg shadow-lg">
				<h2 className="text-lg font-semibold mb-4">Edit Shift</h2>
				<form onSubmit={formik.handleSubmit}>
					<div className="grid grid-cols-2 gap-2">
						{/* Shift Name */}

						{!isIndividual && (
							<div className="mb-4">
								<label className="block text-sm font-medium">Shift Name</label>
								<input
									type="text"
									name="shiftName"
									className="w-full p-2 border rounded"
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									value={formik.values.shiftName}
								/>
								{formik.touched.shiftName && formik.errors.shiftName && (
									<p className="text-primary text-sm">{formik.errors.shiftName}</p>
								)}
							</div>
						)}

						{/* First Day of the Week Dropdown */}
						<div className="mb-4">
							<label className="block text-sm font-medium">First Day of the Week</label>
							<select
								name="firstDayOfWeek"
								className="w-full p-2 border rounded"
								onChange={formik.handleChange}
								onBlur={formik.handleBlur}
								value={formik.values.firstDayOfWeek}
							>
								{DAYS_ORDER.map(day => (
									<option key={day} value={day}>{day}</option>
								))}
							</select>
							{formik.touched.firstDayOfWeek && formik.errors.firstDayOfWeek && (
								<p className="text-primary text-sm">{formik.errors.firstDayOfWeek}</p>
							)}
						</div>
					</div>

					{/* Weekly Settings */}
					<div>
						<h3 className="font-semibold text-sm mb-2">Weekly Settings</h3>
						{formik.values.weeklySettings.map((setting, index) => (
							<div key={index} className="grid grid-cols-4 gap-2 mb-2">
								<div className="text-sm font-medium">{setting.day}</div>
								<input
									type="time"
									name={`weeklySettings[${index}].start_time`}
									className="border p-1 rounded w-full"
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									value={formik.values.weeklySettings[index].start_time}
								/>
								<input
									type="time"
									name={`weeklySettings[${index}].end_time`}
									className="border p-1 rounded w-full"
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									value={formik.values.weeklySettings[index].end_time}
								/>
								<select
									name={`weeklySettings[${index}].day_type`}
									className="border p-1 rounded w-full"
									onChange={formik.handleChange}
									onBlur={formik.handleBlur}
									value={formik.values.weeklySettings[index].day_type}
								>
									<option value="Full">Full</option>
									<option value="Half">Half</option>
									<option value="Off">Off</option>
								</select>
							</div>
						))}
					</div>

					{/* Total Contracted Hours */}
					<div className="grid grid-cols-2 gap-4 mt-4">
						<div>
							<label>Total Contracted Weekly Hours</label>
							<div className="relative mt-2">
								<input
									type="number"
									readOnly
									disabled
									value={hours.weekly.toFixed(2)}
									className="w-full p-2.5 bg-gray-200 rounded-lg text-sm border"
								/>
							</div>
						</div>
						<div>
							<label>Total Contracted Monthly Hours</label>
							<div className="relative mt-2">
								<input
									type="number"
									readOnly
									disabled
									value={hours.monthly.toFixed(2)}
									className="w-full p-2.5 bg-gray-200 rounded-lg text-sm border"
								/>
							</div>
						</div>
					</div>

					{/* Default Shift Toggle */}
					{!isIndividual && (
						<>
							<div className="my-4 flex space-x-2">
								<label className="block text-base font-medium">Set as Default Shift</label>
								<input
									type="checkbox"
									name="isDefault"
									className="p-2 border rounded"
									onChange={formik.handleChange}
									checked={formik.values.isDefault}
								/>
							</div>
							<div className="my-2 flex space-x-2">
								<label className="block text-base font-medium">Apply settings on all shifts</label>
								<input
									type="checkbox"
									name="applyToAll"
									className="p-2 border rounded"
									onChange={formik.handleChange}
									checked={formik.values.applyToAll}
								/>
							</div>
						</>
					)}

					{/* Buttons */}
					<div className="mt-4 flex justify-end space-x-2">
						<button type="button" className="bg-secondary text-white px-4 py-2 rounded" onClick={onClose}>
							Cancel
						</button>
						<button type="submit" className="bg-primary text-white px-4 py-2 rounded">
							Update
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default EditShiftModal;
