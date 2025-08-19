import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import RequestSummary from "../common/RequestSummary";
import Approvers from "../common/Approvers";
import { MdDeleteOutline } from "react-icons/md";
import { CiFloppyDisk } from "react-icons/ci";
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/router';
import ButtonLoader from "../../../ui/buttonLoader";
import { format, addMonths, setDate } from "date-fns";
import { errorToaster, successToaster } from "../../../../utils/toaster";
import { UseGetUsers } from "../../../../hooks/query/admin/getUserList";
import { UseGetProfile } from "../../../../hooks/query/getProfile";
import { getSalaryConfigrationData } from "../../../../hooks/query/finances/salary/getSalaryConfigrationData";
import UseRequestAdvanceSalary from "../../../../hooks/mutations/finances/salary/RequestAdvanceSalary";
import DataLoader from "../../../ui/dataLoader";

function CreateAdvanceSalary({ user, mode }) {
  const router = useRouter();
  const [showSummary, setShowSummary] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentSalary, setCurrentSalary] = useState(null); // State to store current salary
  const [selectedUserId, setSelectedUserId] = useState();
  
  const { data: UserList } = UseGetUsers();
  const { data: configrationData } = getSalaryConfigrationData();
  const { data: profileData, isProfileLoading } = UseGetProfile(selectedUserId);
  const createSalary = UseRequestAdvanceSalary()

  const [validDueDates, setValidDueDates] = useState([]);
  const [cutoffDate, setCuttOfDate] = useState();

  const isManagerFlow = user.role == 'manager' && mode === "workforce";

  useEffect(() => {
    if (configrationData) {
      setCuttOfDate(configrationData.cut_off_period);
    }
  }, [configrationData]);

  useEffect(() => {
    const calculateDueDates = () => {
      if (!profileData?.current_date) return;
      const applyDate = new Date(profileData?.current_date); // Current date
      let start, end;
      const applyDay = applyDate.getDate();
      const cutoffDay = new Date(cutoffDate).getDate();

      if (applyDay <= cutoffDay) {
        // Same month
        start = new Date(applyDate);
        start.setDate(applyDay + 1); // Start from the next day
        end = setDate(new Date(applyDate), cutoffDay); // Cutoff date in the same month
      } else {
        // Next month
        const nextMonth = addMonths(applyDate, 1);
        start = setDate(nextMonth, 1); // Start from the 1st of next month
        end = setDate(nextMonth, cutoffDay); // Cutoff date in the next month
      }

      // Generate date options between start and end
      const dates = [];
      let current = new Date(start); // Clone to avoid mutating `start`
      while (current <= end) {
        dates.push(new Date(current));
        current.setDate(current.getDate() + 1); // Increment by one day
      }
      setValidDueDates(dates);
    };
    calculateDueDates();
  }, [cutoffDate]);

  const validationSchema = Yup.object({
    advance_salary_amount: Yup.number()
      .positive("Must be positive")
      .required("Advance Salary amount is required")
      .max(
        currentSalary || 0,
        `Advance Salary amount cannot exceed $${currentSalary || 0}`
      )
    ,
    due_date: Yup.date()
      .required("Due date is required")
    ,
    user_requesting: isManagerFlow ? Yup.string().required("User is required") : Yup.string().notRequired(),
    reason: !isManagerFlow ? Yup.string().required("Reason is required") : Yup.string().notRequired(),
  });

  const formik = useFormik({
    initialValues: {
      user_requesting: "",
      advance_salary_amount: "",
      due_date: "",
      reason: "",
    },
    validationSchema,
    onSubmit: (values) => {
      setIsSubmitting(true);
      const userID = isManagerFlow == 'manager' ? values.user_requesting : user.id
      const data = {
        user_id: userID,
        es_amount: values.advance_salary_amount,
        apply_date: new Date().toISOString().split('T')[0],
        due_date: values.due_date,
        reason: values.reason,
        is_manager: isManagerFlow ? 1 : 0,
      }
      createSalary.mutate(data,
        {
          onSuccess: () => {
            successToaster("Advance Salary Created Successfully!");
            mode === "workforce" ? router.push(`/finances/workforce/advance-salary`) : router.push(`/finances/advance-salary`);
          },
          onError: (error) => {
            setIsSubmitting(false);
          },
        }
      )
    },
  });

  useEffect(() => {
    if (formik.values.user_requesting) {
      setSelectedUserId(formik.values.user_requesting)

    }
    if (!isManagerFlow) {
      formik.setFieldValue('user_requesting', user.id)
    }
  }, [formik.values.user_requesting, isManagerFlow]);

  useEffect(() => {
    if (profileData) {
      setCurrentSalary(profileData.current_salary)

    } else {
      setCurrentSalary(0)
    }
  }, [profileData]);

  const handleGenerateSummary = async () => {
    const errors = await formik.validateForm();

    if (Object.keys(errors).length === 0 && formik.dirty) {
      setShowSummary(true);
    } else {
      errorToaster("Please fill in all required fields correctly before generating the summary.");
    }
  };

  const closeSummary = () => {
    setShowSummary(false);
  };

  const selectedUser = UserList?.find((u) => u.id === Number(formik.values.user_requesting));
  const summaryData = {
    userRequestingName: selectedUser ? selectedUser.name : "",
    advanceSalaryAmount: formik.values.advance_salary_amount,
    applyDate: new Date(),
    dueDate: formik.values.due_date,
    reason: formik.values.reason,
  };

  return (
    !configrationData || !profileData ?
      <DataLoader />
      :
      <div className="p-4 bg-white min-h-screen space-y-4">
        <div className="flex justify-between items-center space-y-0 mb-4">
          <button
            onClick={() => router.push(mode === "workforce" ? "/finances/workforce/advance-salary" : "/finances/advance-salary")}
            type='button'
            className='flex space-x-2 items-center px-2 py-1 text-white bg-primary rounded-xl mb-3'
          >
            <ArrowLeft className='text-white h-5 w-5' />
            <span>Back</span>
          </button>
        </div>
        <form onSubmit={formik.handleSubmit}>
          <div className="border p-4 rounded-lg bg-grey mb-7 ">
            <div className="grid grid-cols-3 gap-6 items-start mb-6">
              {isManagerFlow && (
                <div className="mb-4">
                  <label className="block mb-1">User Requesting</label>
                  <select
                    name="user_requesting"
                    className=" border rounded-xl w-full p-3"
                    value={formik.values.user_requesting}
                    onChange={formik.handleChange}
                  >
                    <option value="">Select User</option>
                    {UserList?.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                  {formik.errors.user_requesting && formik.touched.user_requesting && (
                    <p className="text-primary text-sm">{formik.errors.user_requesting}</p>
                  )}
                </div>
              )}

              <div className="mb-4">
                <label className="block mb-1">Current Salary</label>
                <p className="p-3 border rounded-xl bg-gray-100">{`$${currentSalary}`}</p>
              </div>

              <div className="mb-4">
                <label className="block mb-1">Advance Salary Amount</label>
                <input
                  type="number"
                  name="advance_salary_amount"
                  className="border rounded-xl w-full p-3"
                  value={formik.values.advance_salary_amount}
                  onChange={formik.handleChange}
                  disabled={!formik.values.user_requesting && isManagerFlow}
                />
                {(formik.errors.advance_salary_amount || formik.touched.advance_salary_amount) && (
                  <p className="text-primary text-sm">{formik.errors.advance_salary_amount}</p>
                )}
              </div>

              {!isManagerFlow && (
                <div>
                  <label className="block mb-1">Reason</label>
                  <textarea
                    name="reason"
                    className="p-2 border rounded-xl w-full"
                    value={formik.values.reason}
                    onChange={formik.handleChange}
                  />
                  {formik.errors.reason && (
                    <p className="text-primary text-sm">{formik.errors.reason}</p>
                  )}
                </div>
              )}

              <div className="mb-4">
                <label className="block mb-1">Date to Receive Advance Salary</label>
                <select
                  name="due_date"
                  className="p-2 border rounded-xl w-full"
                  value={formik.values.due_date}
                  onChange={formik.handleChange}
                >
                  <option value="">Select Due Date</option>
                  {validDueDates.map((date) => (
                    <option key={date} value={format(date, "yyyy-MM-dd")}>
                      {format(date, "MMMM dd, yyyy")}
                    </option>
                  ))}
                </select>
                {formik.errors.due_date && (
                  <p className="text-primary text-sm">{formik.errors.due_date}</p>
                )}

              </div>
              <div className="mb-4">
                <label className="block mb-1">Advance Salary Due Date</label>
                <p className="p-2 border rounded-xl bg-gray-100">{(new Date(cutoffDate).getDate())}</p>
              </div>
            </div>
          </div>

          {(!currentSalary || !formik.values.user_requesting) &&
            <div className="text-primary py-4 italic mb-4">
              Can&apos;t create advance salary request as the user&apos;s salary is not set
            </div>
          }

          {!showSummary && (
            <button
              type="button"
              onClick={handleGenerateSummary}
              className="bg-primary text-white px-3  py-2 rounded-xl"
            >
              Generate Advance Salary Summary
            </button>
          )}

          <div className="mb-10">
            {showSummary && <RequestSummary salary={true} data={summaryData} onClose={closeSummary} user={user} isManager={isManagerFlow} />}
          </div>

          <Approvers approvers={configrationData?.approvers || []} />

          <div className="space-x-4 flex justify-end items-end mt-4">
            <button
              type='button'
              className='flex items-center justify-center border border-secondary text_default_text rounded-xl py-2 px-9 text-sm'
              onClick={() => formik.resetForm()}
              disabled={isSubmitting}
            >
              <MdDeleteOutline className='text-base mr-1' />
              Discard
            </button>
            <button
              type='submit'
              className='flex items-center justify-center bg-primary text-white rounded-xl py-2 px-9 text-sm disabled:opacity-30'
              disabled={isSubmitting || !currentSalary}
            >
              {isSubmitting ? <ButtonLoader /> : <><CiFloppyDisk className='text-base mr-1' />Save</>}
            </button>
          </div>
        </form>
      </div>
  );
}

export default CreateAdvanceSalary;
