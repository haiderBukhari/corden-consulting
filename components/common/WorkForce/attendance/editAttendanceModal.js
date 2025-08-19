import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { convertTo24HourFormat } from "../../../../utils/functions";
import UseEditTeamAttendance from "../../../../hooks/mutations/admin/editTeamAttendance";
import { calculateWorkingHours, formatDateToAmPm } from "../../../../utils/functions";
import { successToaster } from "../../../../utils/toaster";
import ButtonLoader from "../../../ui/buttonLoader";
import UseResetAttendance from "../../../../hooks/mutations/resetAttendance";

const formatDateForInput = (dateStr) => {
  const [day, month, year] = dateStr.split("-");
  return `${day}-${month}-${year}`;
};

const formatDateForDisplay = (dateStr) => {
  const [year, month, day] = dateStr.split("-");
  return `${day}-${month}-${year}`;
};

const validationSchema = yup.object({
  timeIn: yup.string().required("Clock-in time is required"),
  timeOut: yup
    .string()
    .nullable()
    .test(
      "is-after-timeIn",
      "Clock-out time must be after clock-in time",
      function (value) {
        const { timeIn } = this.parent;

        if (!value) return true; // Skip validation if timeOut is empty
        const timeOutDate = new Date(`1970-01-01T${value}`);
        const timeInDate = new Date(`1970-01-01T${timeIn}`);

        return timeOutDate > timeInDate;
      }
    ),
});

export default function EditAttendanceModal({ isOpen, onClose, attendance, refetch }) {
  const editAttendance = UseEditTeamAttendance();
  const resetAttendance = UseResetAttendance();

  const formik = useFormik({
    initialValues: {
      timeIn: attendance ? convertTo24HourFormat(attendance.time_in) : "",
      timeOut:
        attendance && attendance.time_out && attendance.time_out !== "-" && attendance.time_out !== "undefined"
          ? convertTo24HourFormat(attendance.time_out)
          : "", // Set empty for invalid timeOut
      date: attendance ? formatDateForInput(attendance.date) : "",
    },
    validationSchema: validationSchema,

    onSubmit: async (values) => {
      const timeInDate = new Date(`1970-01-01T${values.timeIn}`);
      const timeOutDate = values.timeOut ? new Date(`1970-01-01T${values.timeOut}`) : null;
      const workingHours = timeOutDate
        ? calculateWorkingHours(timeInDate.getTime(), timeOutDate.getTime())
        : null;

      const data = {
        id: attendance.user_id,
        start_time: formatDateToAmPm(values.timeIn),
        end_time: values.timeOut ? formatDateToAmPm(values.timeOut) : "",
        working_hour: workingHours ? workingHours : '',
        date: formatDateForDisplay(values.date),
      };

      editAttendance.mutate(data, {
        onSuccess: () => {
          successToaster("Attendance Edited Successfully!");
          onClose();
        },
      });
    },
  });
 
  useEffect(() => {
    if (attendance) {
      formik.setFieldValue("timeIn", convertTo24HourFormat(attendance.time_in));
      formik.setFieldValue(
        "timeOut",
        attendance.time_out && attendance.time_out !== "-" && attendance.time_out !== "undefined"
          ? convertTo24HourFormat(attendance.time_out)
          : "" // Sanitize invalid timeOut
      );
      formik.setFieldValue("date", formatDateForInput(attendance.date));
    }
  }, [attendance]);

  if (!isOpen) return null;

  const handleReset = () => {
    resetAttendance.mutate(attendance.attendence_id, {
      onSuccess: () => {
        onClose();
      },
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <h2 className="text-xl font-bold">
          Edit Attendance of <span className="capitalize">{attendance?.user_name}</span>
        </h2>

        <p className="text-primary mb-4">Note: Please Enter the Time in {attendance?.timezone}</p>
        <form onSubmit={formik.handleSubmit}>
          <div className="w-full mb-4">
            <label className="block text-sm font-medium mb-1">Date</label>
            <input
              type="text"
              name="date"
              value={formatDateForInput(formik.values.date)}
              readOnly
              className="w-full border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>
          <div className="flex gap-4 mb-4">
            <div className="w-1/2">
              <label className="block text-sm font-medium mb-1">Clock In</label>
              <input
                type="time"
                name="timeIn"
                value={formik.values.timeIn}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
              {formik.touched.timeIn && formik.errors.timeIn ? (
                <div className="text-darkred text-sm mt-1">{formik.errors.timeIn}</div>
              ) : null}
            </div>
            <div className="w-1/2">
              <label className="block text-sm font-medium mb-1">Clock Out</label>
              <input
                type="time"
                name="timeOut"
                value={formik.values.timeOut}
                onChange={(e) => {
                  const { value } = e.target;
                  formik.setFieldValue("timeOut", value);
                  formik.setFieldTouched("timeOut", true);
                }}
                onBlur={formik.handleBlur}
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
              {formik.touched.timeOut && formik.errors.timeOut ? (
                <div className="text-darkred text-sm mt-1">{formik.errors.timeOut}</div>
              ) : null}
            </div>
          </div>
          <div className="flex justify-between">
            <button
              type="button"
              onClick={handleReset}
              disabled={!attendance.attendence_id}
              className="py-2 px-4 bg-[#009D9D] text-white disabled:opacity-40 rounded-md"
            >
              Reset
            </button>
            <div className="flex">
              <button
                type="button"
                onClick={onClose}
                className="py-2 px-4 bg-secondary rounded-md mr-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="py-2 px-4 bg-secondary text-white rounded-md"
              >
                {editAttendance.isLoading ? <ButtonLoader text="Confirming..." /> : "Confirm"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
