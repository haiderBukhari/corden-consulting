import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import UseCreateShift from "../../../../hooks/mutations/createShift";

const AddShiftModal = ({ onClose, id }) => {
    const createShift = UseCreateShift();

    const defaultSettings = [
        { day: "Monday", startTime: "08:00", endTime: "18:00", dayType: "Full" },
        { day: "Tuesday", startTime: "08:00", endTime: "18:00", dayType: "Full" },
        { day: "Wednesday", startTime: "08:00", endTime: "19:00", dayType: "Full" },
        { day: "Thursday", startTime: "08:00", endTime: "15:00", dayType: "Half" },
        { day: "Friday", startTime: "08:00", endTime: "15:00", dayType: "Off" },
        { day: "Saturday", startTime: "08:00", endTime: "18:00", dayType: "Full" },
        { day: "Sunday", startTime: "08:00", endTime: "18:00", dayType: "Full" },
    ];

    // Function to reorder week based on the selected first day
    const reorderWeek = (firstDay) => {
        const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
        const startIndex = daysOfWeek.indexOf(firstDay);
        return [...daysOfWeek.slice(startIndex), ...daysOfWeek.slice(0, startIndex)]
            .map(day => defaultSettings.find(setting => setting.day === day));
    };

    const calculateHours = (settings) => {
        let weeklyHours = 0;
        settings.forEach(({ startTime, endTime, dayType }) => {
            if (dayType !== "Off") {
                const start = parseInt(startTime.split(":")[0]);
                const end = parseInt(endTime.split(":")[0]);
                weeklyHours += end - start;
            }
        });
        const monthlyHours = weeklyHours * 4;
        return { weekly: weeklyHours, monthly: monthlyHours };
    };

    const [hours, setHours] = useState(calculateHours(defaultSettings));

    const formik = useFormik({
        initialValues: {
            shiftName: "",
            firstDayOfWeek: "Monday",
            weeklySettings: reorderWeek("Monday"),
            isDefault: false, // Added default value for isDefault
            applyToAll: false,
        },
        validationSchema: Yup.object({
            shiftName: Yup.string().required("Shift Name is required"),
        }),
        onSubmit: (values) => {
            const { weekly, monthly } = calculateHours(values.weeklySettings);

            const formattedData = {
                location_id: id,
                shift_name: values.shiftName,
                contract_hours: monthly,
                first_day_of_week: values.firstDayOfWeek,
                is_default: values.isDefault ? 1 : 0, // Passing is_default flag (1 or 0)
                apply_to_all: values.applyToAll ? 1 : 0,
                shift_timings: values.weeklySettings.map(setting => ({
                    day: setting.day,
                    start_time: setting.startTime,
                    end_time: setting.endTime,
                    day_type: setting.dayType,
                })),
            };

            console.log("Formatted Shift Data:", formattedData);

            createShift.mutate(formattedData, {
                onSuccess: () => {
                    console.log("Shift created successfully");
                    onClose();
                },
                onError: (error) => {
                    console.error("Error creating shift:", error);
                }
            });
        },
    });

    // Reorder the weekly settings when firstDayOfWeek changes
    useEffect(() => {
        formik.setFieldValue("weeklySettings", reorderWeek(formik.values.firstDayOfWeek));
    }, [formik.values.firstDayOfWeek]);

    useEffect(() => {
        setHours(calculateHours(formik.values.weeklySettings));
    }, [formik.values.weeklySettings]);

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-900 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <h2 className="text-lg font-semibold mb-4">Add Shift</h2>
                <form onSubmit={formik.handleSubmit}>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <div>
                            <label className="block text-sm font-medium">Shift Name</label>
                            <input
                                type="text"
                                name="shiftName"
                                className="w-full p-2 border rounded-lg"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.shiftName}
                            />
                            {formik.touched.shiftName && formik.errors.shiftName && (
                                <p className="text-primary text-sm">{formik.errors.shiftName}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="firstDayOfWeek">First Day of the Week</label>
                            <select
                                id="firstDayOfWeek"
                                name="firstDayOfWeek"
                                onChange={formik.handleChange}
                                value={formik.values.firstDayOfWeek}
                                className="w-full p-2 border rounded-lg"
                            >
                                {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(day => (
                                    <option key={day} value={day}>{day}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold text-sm mb-2">Weekly Settings</h3>
                        {formik.values.weeklySettings.map((setting, index) => (
                            <div key={index} className="grid grid-cols-4 gap-2 mb-2">
                                <div className="text-sm">{setting.day}</div>
                                <input
                                    type="time"
                                    name={`weeklySettings[${index}].startTime`}
                                    className="border p-1 rounded w-full"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.weeklySettings[index].startTime}
                                />
                                <input
                                    type="time"
                                    name={`weeklySettings[${index}].endTime`}
                                    className="border p-1 rounded w-full"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.weeklySettings[index].endTime}
                                />
                                <select
                                    name={`weeklySettings[${index}].dayType`}
                                    className="border p-1 rounded w-full"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.weeklySettings[index].dayType}
                                >
                                    <option value="Full">Full</option>
                                    <option value="Half">Half</option>
                                    <option value="Off">Off</option>
                                </select>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                            <label htmlFor="weeklycontractedHours">Total Contracted Weekly Hours</label>
                            <div className="relative mt-2">
                                <input
                                    id="weeklycontractedHours"
                                    type="number"
                                    readOnly
                                    disabled
                                    value={hours.weekly}
                                    className="w-full p-2.5 bg-gray-200 rounded-lg text-sm border pr-16"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="contractedHours">Total Contracted Monthly Hours</label>
                            <div className="relative mt-2">
                                <input
                                    id="contractedHours"
                                    type="number"
                                    readOnly
                                    disabled
                                    value={hours.monthly}
                                    className="w-full p-2.5 bg-gray-200 rounded-lg text-sm border pr-16"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 space-y-2">
                        <label className="flex items-center text-sm">
                            <input
                                type="checkbox"
                                name="isDefault"
                                className="mr-2"
                                onChange={formik.handleChange}
                                checked={formik.values.isDefault}
                            />
                            Set as Default Shift
                        </label>
                        <label className="flex items-center text-sm">
                            <input
                                type="checkbox"
                                name="applyToAll"
                                className="mr-2"
                                onChange={formik.handleChange}
                                checked={formik.values.applyToAll}
                            />
                            Apply settings on all shifts
                        </label>
                    </div>


                    <div className="mt-4 flex justify-end space-x-2">
                        <button type="button" className="bg-secondary px-4 py-2 rounded text-white" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                            Save
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddShiftModal;
