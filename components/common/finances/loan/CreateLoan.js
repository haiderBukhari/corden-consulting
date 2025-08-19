import React, { useState, useEffect, useMemo } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import RequestSummary from "../common/RequestSummary";
import Approvers from "../common/Approvers";
import { MdDeleteOutline } from "react-icons/md";
import { CiFloppyDisk } from "react-icons/ci";
import ButtonLoader from "../../../ui/buttonLoader";
import { errorToaster } from "../../../../utils/toaster";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/router";
import { getLoanConfigrationData } from "../../../../hooks/query/finances/loan/getLoanConfigrationData";
import { UseGetUsers } from "../../../../hooks/query/admin/getUserList";
import UseCreateLoanRequest from "../../../../hooks/mutations/finances/loan/createLoanRequest";
import DataLoader from "../../../ui/dataLoader";
import 'react-datepicker/dist/react-datepicker.css';

function CreateLoan({ user, mode }) {
  const router = useRouter();
  const [showSummary, setShowSummary] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [defaultType, setDefaultType] = useState("");
  const [selectedUserSalary, setSelectedUserSalary] = useState(0);
  const [selectedMonthOption, setSelectedMonthOption] = useState("");

  const { data: ConfigurationData, isLoading: isConfigLoading } = getLoanConfigrationData();
  const { data: userList, isLoading: isUsersLoading } = UseGetUsers();
  const createLoan = UseCreateLoanRequest();

  const normalizedUserRole = user?.role?.toLowerCase();
  const repaymentMethod = ConfigurationData?.repayment_method?.toLowerCase() || defaultType.toLowerCase();
  const isPercentage = repaymentMethod === "percentage";

  const isManager = normalizedUserRole === "manager";
  const isManagerFlow = isManager && mode === "workforce";

  const monthOptions = useMemo(() => {
    if (!ConfigurationData) return [];
  
    const options = [];
    const now = new Date();

    const cutOffDay = new Date(ConfigurationData.cut_off_period).getDate();
  
    let startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  
    if (now.getDate() > cutOffDay) {
      startDate.setMonth(startDate.getMonth() + 1);
    }
  
    for (let i = 0; i < 12; i++) {
      const d = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1);
      const month = d.getMonth() + 1;
      const year = d.getFullYear();
      const label = d.toLocaleString("default", { month: "long", year: "numeric" });
      options.push({ month, year, label });
    }
    return options;
  }, [ConfigurationData]);  

  const handleMonthChange = (e) => {
    const value = e.target.value;
    if (!value) {
      formik.setFieldValue("first_payment_date", null);
      setSelectedMonthOption("");
      return;
    }
    const [year, month] = value.split("-").map(Number);
    const cutOffDay = ConfigurationData
      ? new Date(ConfigurationData.cut_off_period).getDate()
      : 27;
    const newDate = new Date(year, month - 1, cutOffDay);
    formik.setFieldValue("first_payment_date", newDate);
    setSelectedMonthOption(value);
  };

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return `${String(d.getDate()).padStart(2, "0")}-${String(
      d.getMonth() + 1
    ).padStart(2, "0")}-${d.getFullYear()}`;
  };

  const generateRepaymentSchedule = (
    loanAmount,
    repaymentMethod,
    repaymentValue,
    terms,
    monthlyInstallment,
    firstPaymentDate
  ) => {
    const schedule = [];
    let amountLeft = loanAmount;
    const startDate = new Date(firstPaymentDate);

    for (let i = 0; i < terms; i++) {
      const dueDate = new Date(startDate);
      dueDate.setMonth(dueDate.getMonth() + i);

      // Calculate amount_due and amount_left
      let amountDue = monthlyInstallment;
      if (i === terms - 1) {
        amountDue = parseFloat(amountLeft.toFixed(2));
      }

      const rawPercentage = (amountDue / loanAmount) * 100;
      const percentage = parseFloat(rawPercentage.toFixed(3))
      amountLeft -= amountDue;

      schedule.push({
        id: i + 1,
        due_date: `${String(dueDate.getDate()).padStart(2, "0")}-${String(
          dueDate.getMonth() + 1
        ).padStart(2, "0")}-${dueDate.getFullYear()}`,
        amount_due: amountDue.toFixed(2),
        percentage: parseFloat(percentage),
        date_paid: null,
        amount_left: amountLeft > 0 ? amountLeft.toFixed(2) : "0.00",
      });
    }

    return schedule;
  };

  const formik = useFormik({
    initialValues: {
      user_requesting: "",
      loan_amount: "",
      repaymentValue: "",
      reason: "",
      first_payment_date: null,
    },
    validationSchema: useMemo(() => {
      return Yup.object({
        user_requesting: isManagerFlow
          ? Yup.string().required("User is required for manager flow")
          : Yup.string().notRequired(),

        loan_amount: Yup.number()
          .typeError("Loan amount must be a number")
          .positive("Must be positive")
          .required("Loan amount is required")
          .test("maxLoanCheck", "Amount too high", function (value) {
            const { user_requesting } = this.parent;

            // 1) If manager:
            if (isManagerFlow) {
              // Must have user_requesting
              if (!user_requesting) {
                return this.createError({
                  message:
                    "Please select a user to determine the maximum loan amount.",
                });
              }
              // Find the selected user
              const selected = userList?.find(
                (u) => u.id === Number(user_requesting)
              );
              if (!selected) {
                return this.createError({
                  message: "Selected user not found in user list.",
                });
              }
              const cap = parseFloat(ConfigurationData?.default_loan_cap) || 0;
              const salary = parseFloat(selected?.current_salary) || 0;
              const maxLoan = cap * salary;

              if (maxLoan > 0 && value > maxLoan) {
                return this.createError({
                  message: `Loan amount cannot exceed $${maxLoan.toLocaleString()}.`,
                });
              }
              return true;
            }

            // 2) Otherwise (non-manager)
            const cap = parseFloat(ConfigurationData?.default_loan_cap) || 0;
            const salary = parseFloat(user?.current_salary) || 0;
            const maxLoan = cap * salary;
            if (maxLoan > 0 && value > maxLoan) {
              return this.createError({
                message: `Loan amount cannot exceed $${maxLoan.toLocaleString()}.`,
              });
            }
            return true;
          })
          .test("monthlyRepaymentCheck", function (value) {
            const { repaymentValue } = this.parent;

            if (!value || !repaymentValue) return true;

            let monthlyInstallment = 0;
            let minLoanAmount = 0;

            if (isPercentage) {
              // For percentage-based repayment
              const salary = getUserSalary(this.parent);
              const percentage = parseFloat(repaymentValue) || 0;
              monthlyInstallment = salary * (percentage / 100);
              minLoanAmount = monthlyInstallment + 1; // Ensuring monthly repayment < loan amount
            } else {
              // For term-based repayment
              const terms = parseFloat(repaymentValue) || 1;
              monthlyInstallment = value / terms;
              minLoanAmount = monthlyInstallment + 1; // Ensuring monthly repayment < loan amount
            }

            if (monthlyInstallment >= value) {
              return this.createError({
                message: `Monthly repayment of $${monthlyInstallment.toFixed(
                  2
                )} exceeds or equals the loan amount of $${value.toFixed(
                  2
                )}. Minimum loan amount should be at least $${minLoanAmount.toFixed(
                  2
                )}.`,
              });
            }

            return true;
          })
          .test("minLoanAmount", function (value) {
            if (!value) return true;

            let minLoanAmount = 0;

            if (isPercentage) {
              const salary = getUserSalary(this.parent);
              const percentage = getDefaultPercentage();
              minLoanAmount = salary * (percentage / 100) + 1;
            } else {
              minLoanAmount = 1;
            }

            if (value < minLoanAmount) {
              return this.createError({
                message: `Minimum loan amount for your salary is $${minLoanAmount.toLocaleString()}. You entered $${value.toFixed(
                  2
                )}.`,
              });
            }

            return true;
          }),

        repaymentValue: isPercentage
          ? isManagerFlow
            ? Yup.number()
              .typeError("Percentage must be a number")
              .positive("Must be positive")
              .required("Percentage is required")
              .min(1, "Percentage must be between 1 and 100")
              .max(100, "Percentage must be between 1 and 100")
            : Yup.number()
          : isManagerFlow
            ? Yup.number()
              .typeError("Term must be a number")
              .positive("Must be positive")
              .required("Term is required")
            : Yup.number(),

        first_payment_date: Yup.date()
          .nullable()
          .required("First payment date is required")
          .min(new Date(new Date().setHours(0, 0, 0, 0)), "Date must be today or in the future"),

        reason:
          !isManagerFlow
            ? Yup.string().required("Reason is required")
            : Yup.string().notRequired(),
      });
    }, [normalizedUserRole, ConfigurationData, userList, user, isPercentage, isManagerFlow]),

    onSubmit: async (values) => {
      setIsSubmitting(true);

      if (!selectedUserSalary) {
        errorToaster(
          "This user does not have a set salary. You cannot request a loan."
        );
        setIsSubmitting(false);
        return;
      }

      let monthly_installment, terms;

      // Compute monthly_installment / terms based on new requirements
      if (repaymentMethod === "term") {
        terms = Number(values.repaymentValue);
        monthly_installment = Number(values.loan_amount) / terms;
      } else if (repaymentMethod === "percentage") {
        const salary =
          isManagerFlow
            ? parseFloat(
              userList?.find((u) => u.id === Number(values.user_requesting))
                ?.current_salary
            ) || 0
            : parseFloat(user?.current_salary) || 0;
        const percentage =
          isManagerFlow
            ? Number(values.repaymentValue)
            : Number(ConfigurationData?.default_percentage);
        monthly_installment = salary * (percentage / 100);
        terms = Math.ceil(Number(values.loan_amount) / monthly_installment);
      } else {
        errorToaster("Invalid repayment method configuration.");
        setIsSubmitting(false);
        return;
      }

      if (monthly_installment >= Number(values.loan_amount)) {
        errorToaster("Monthly repayment must be less than the loan amount.");
        setIsSubmitting(false);
        return;
      }

      const firstPaymentDate = values.first_payment_date
        ? `${values.first_payment_date.getFullYear()}-${String(
          values.first_payment_date.getMonth() + 1
        ).padStart(2, "0")}-${String(
          values.first_payment_date.getDate()
        ).padStart(2, "0")}`
        : null;

      // Determine user_id
      const userId = isManagerFlow ? Number(values.user_requesting) : user?.id;

      if (!userId) {
        errorToaster("Invalid user selection.");
        setIsSubmitting(false);
        return;
      }

      const formData = new FormData();

      const obj = {
        user_id: userId,
        loan_amount: Number(values.loan_amount),
        first_payment_date: firstPaymentDate,
        repayment_method: repaymentMethod.charAt(0).toUpperCase() + repaymentMethod.slice(1),
        monthly_installment: Number(monthly_installment.toFixed(2)),
        terms,
        reason: !isManagerFlow ? values.reason : '',
        is_manager: isManagerFlow ? 1 : 0,
        ...(repaymentMethod === "percentage" && {
          percentage:
            isManagerFlow
              ? Number(values.repaymentValue)
              : ConfigurationData?.default_percentage,
        }),
      };

      for (const [key, value] of Object.entries(obj)) {
        formData.append(key, value);
      }

      // Generate Repayment Schedule
      const repayment_schedule = generateRepaymentSchedule(
        Number(values.loan_amount),
        repaymentMethod,
        Number(values.repaymentValue),
        terms,
        Number(monthly_installment.toFixed(2)),
        firstPaymentDate
      );

      // Update summaryData to include repayment_schedule
      formik.setFieldValue("repayment_schedule", repayment_schedule);

      // Create loan
      createLoan.mutate(formData, {
        onSuccess: () => {
          mode === "workforce" ?
            router.push(`/finances/workforce/loan`) :
            router.push(`/finances/loan`);
        },
        onError: (error) => {
          setIsSubmitting(false);
        },
      });
    },
  });

  useEffect(() => {
    if (isManagerFlow && formik.values.user_requesting) {
      const foundUser = userList?.find(
        (u) => u.id === Number(formik.values.user_requesting)
      );
      const salary = foundUser?.current_salary || 0;
      setSelectedUserSalary(salary);

      // If no salary, force-close the summary
      if (!salary) {
        setShowSummary(false);
      }
    } else if (!isManagerFlow) {
      const salary = user?.current_salary || 0;
      setSelectedUserSalary(salary);
      formik.setFieldValue('user_requesting', user.id)
      // If no salary, force-close the summary
      if (!salary) {
        setShowSummary(false);
      }
    } else {
      // Manager but no user selected yet
      setSelectedUserSalary(0);
      setShowSummary(false);
    }
  }, [normalizedUserRole, formik?.values?.user_requesting, userList, user, isManagerFlow]);

  useEffect(() => {
    if (ConfigurationData?.repayment_method) {
      setDefaultType(ConfigurationData.repayment_method);
    }
  }, [ConfigurationData]);

  useEffect(() => {
    if (ConfigurationData) {
      if (isPercentage) {
        formik.setFieldValue(
          "repaymentValue",
          isManagerFlow
            ? ConfigurationData.default_percentage || ""
            : ConfigurationData.default_percentage || ""
        );
      } else {
        formik.setFieldValue(
          "repaymentValue",
          ConfigurationData.default_terms || ""
        );
      }
    }
  }, [ConfigurationData, normalizedUserRole, isPercentage]);

  const { monthly_installment, terms } = useMemo(() => {
    let installment = 0;
    let term = 0;

    if (repaymentMethod === "term") {
      term = Number(formik.values.repaymentValue);
      installment = term > 0 ? Number(formik.values.loan_amount) / term : 0;
    } else if (repaymentMethod === "percentage") {
      const salary =
        isManagerFlow
          ? parseFloat(
            userList?.find(
              (u) => u.id === Number(formik.values.user_requesting)
            )?.current_salary
          ) || 0
          : parseFloat(user?.current_salary) || 0;
      const percentage =
        isManagerFlow
          ? Number(formik.values.repaymentValue)
          : Number(ConfigurationData?.default_percentage);
      installment = salary * (percentage / 100); // Updated Calculation
      term =
        installment > 0
          ? Math.ceil(Number(formik.values.loan_amount) / installment)
          : 0;
    }
    return { monthly_installment: installment, terms: term };
  }, [
    repaymentMethod,
    formik.values.loan_amount,
    formik.values.repaymentValue,
    ConfigurationData,
    normalizedUserRole,
    selectedUserSalary,
  ]);

  const handleGenerateSummary = async () => {
    const errors = await formik.validateForm();
    if (Object.keys(errors).length === 0 && formik.dirty) {
      setShowSummary(true);
    } else {
      errorToaster(
        "Please fill in all required fields correctly before generating the summary."
      );
    }
  };

  const closeSummary = () => setShowSummary(false);

  const selectedUser = isManagerFlow
    ? userList?.find((u) => u.id === Number(formik.values.user_requesting))
    : user;

  // Generate repayment schedule based on current form values
  const repaymentSchedule = useMemo(() => {
    if (
      !formik.values.loan_amount ||
      !formik.values.first_payment_date ||
      !formik.values.repaymentValue
    ) {
      return [];
    }

    const loanAmount = Number(formik.values.loan_amount);
    const repaymentValue = Number(formik.values.repaymentValue);
    let calculatedTerms = terms;
    let calculatedMonthlyInstallment = monthly_installment;

    if (repaymentMethod === "term") {
      calculatedTerms = repaymentValue;
      calculatedMonthlyInstallment = loanAmount / calculatedTerms;
    } else if (repaymentMethod === "percentage") {
      const salary =
        isManagerFlow
          ? parseFloat(
            userList?.find(
              (u) => u.id === Number(formik.values.user_requesting)
            )?.current_salary
          ) || 0
          : parseFloat(user?.current_salary) || 0;
      calculatedMonthlyInstallment = salary * (repaymentValue / 100); // Updated Calculation
      calculatedTerms =
        calculatedMonthlyInstallment > 0
          ? Math.ceil(loanAmount / calculatedMonthlyInstallment)
          : 0;
    }

    const firstPaymentDate = formik.values.first_payment_date
      ? `${formik.values.first_payment_date.getFullYear()}-${String(
        formik.values.first_payment_date.getMonth() + 1
      ).padStart(2, "0")}-${String(
        formik.values.first_payment_date.getDate()
      ).padStart(2, "0")}`
      : null;

    return generateRepaymentSchedule(
      loanAmount,
      repaymentMethod,
      repaymentValue,
      calculatedTerms,
      calculatedMonthlyInstallment,
      firstPaymentDate
    );
  }, [
    formik.values.loan_amount,
    formik.values.repaymentValue,
    formik.values.first_payment_date,
    repaymentMethod,
    monthly_installment,
    terms,
    normalizedUserRole,
    userList,
    user,
  ]);

  const summaryData = useMemo(() => {
    const percentageLabel = isPercentage
      ? isManagerFlow
        ? `${formik.values.repaymentValue}%`
        : `${ConfigurationData?.default_percentage}%`
      : null;

    return {
      userRequestingName: selectedUser ? selectedUser.name : "",
      requestType: "Loan",
      details: [
        {
          label: "Amount",
          value: formik.values.loan_amount,
          format: "currency",
        },
        isPercentage
          ? {
            label: "Deduction Percentage",
            value: percentageLabel,
          }
          : {
            label: "Term (Months)",
            value: terms || 0,
          },
        {
          label: "Repayment Method",
          value:
            ConfigurationData?.repayment_method ||
            defaultType.charAt(0).toUpperCase() + defaultType.slice(1),
        },
        {
          label: "Monthly Installment",
          value: monthly_installment?.toFixed(2) || 0,
          format: "currency",
        },
        {
          label: "Terms",
          value: terms || 0,
        },
      ].filter(Boolean),
      repayment_schedule: repaymentSchedule, // Include the repayment schedule
    };
  }, [
    selectedUser,
    repaymentMethod,
    formik.values.loan_amount,
    formik.values.repaymentValue,
    ConfigurationData,
    monthly_installment,
    terms,
    normalizedUserRole,
    isPercentage,
    defaultType,
    repaymentSchedule,
  ]);

  // Define this at the top of your CreateLoan.jsx file
  const getUserSalary = (formikValues) => {
    if (isManagerFlow) {
      const selectedUser = userList?.find(
        (u) => u.id === Number(formikValues.user_requesting)
      );
      return selectedUser ? parseFloat(selectedUser.current_salary) : 0;
    } else {
      return parseFloat(user?.current_salary) || 0;
    }
  };

  const getDefaultPercentage = () => {
    return parseFloat(ConfigurationData?.default_percentage) || 0;
  };

  if (isConfigLoading || isUsersLoading) {
    return <DataLoader />;
  }

  return (
    <div className="p-4 bg-white min-h-screen space-y-4">
      <div className="flex justify-between items-center space-y-0 mb-4">
        <button
          onClick={() => router.push(mode === "workforce" ? "/finances/workforce/loan" : "/finances/loan")}
          type="button"
          className="flex space-x-2 items-center px-2 py-1 text-white bg-primary rounded-xl mb-3"
        >
          <ArrowLeft className="text-white h-5 w-5" />
          <span>Back</span>
        </button>
        <span className="text-base text-primary font-semibold">
          {`Note: Repayment Method is set to "${defaultType}"`}
        </span>
      </div>

      <form onSubmit={formik.handleSubmit}>
        <div className="border p-4 rounded-lg bg-grey mb-4">
          {/* FIRST ROW */}
          <div className="grid grid-cols-4 gap-6 items-start mb-6">
            {/* Manager sees user dropdown */}
            {isManagerFlow && (
              <div className="mb-4">
                <label className="block mb-1 ">User Requesting</label>
                <select
                  name="user_requesting"
                  className="p-3 border rounded-xl w-full"
                  value={formik.values.user_requesting}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="">Select User</option>
                  {userList?.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
                {formik.errors.user_requesting &&
                  formik.touched.user_requesting && (
                    <p className="text-red-500 text-sm">
                      {formik.errors.user_requesting}
                    </p>
                  )}
              </div>
            )}

            {/* Loan Amount */}
            <div className="mb-4">
              <label className="block mb-1">Loan Amount</label>
              <input
                type="number"
                name="loan_amount"
                className={`border rounded-xl w-full p-2 ${isManagerFlow &&
                    !formik.values.user_requesting
                    ? "bg-gray-200 cursor-not-allowed"
                    : ""
                  }`}
                placeholder="Enter loan amount"
                value={formik.values.loan_amount}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                disabled={
                  isManagerFlow &&
                  !formik.values.user_requesting
                }
              />
              {formik.errors.loan_amount && formik.touched.loan_amount && (
                <p className="text-red-500 text-sm">
                  {formik.errors.loan_amount}
                </p>
              )}
            </div>

            {(selectedUserSalary ||
              (isManagerFlow &&
                formik.values.user_requesting)) && (
                <div className="mb-4">
                  <label className="block mb-1">Current Salary</label>
                  <p className="p-2 border rounded-xl bg-gray-100">
                    {`$${selectedUserSalary.toLocaleString()}`}
                  </p>
                </div>
              )}

            {/* Repayment Type (read-only) */}
            <div className="mb-4">
              <label className="block mb-1">Type</label>
              <input
                type="text"
                className="border rounded-xl w-full p-2 bg-gray-100"
                value={
                  ConfigurationData?.repayment_method ||
                  defaultType.charAt(0).toUpperCase() + defaultType.slice(1)
                }
                readOnly
              />
            </div>

            {/* Reason for non-managers */}
            {!isManagerFlow && (
              <div>
                <label className="block mb-1">Reason</label>
                <textarea
                  name="reason"
                  className="border rounded-xl w-full p-3"
                  placeholder="Enter your reason for requesting this loan"
                  value={formik.values.reason}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.errors.reason && formik.touched.reason && (
                  <p className="text-red-500 text-sm">{formik.errors.reason}</p>
                )}
              </div>
            )}
          </div>

          {/* SECOND ROW */}
          <div className="grid grid-cols-3 gap-6 items-start">
            {/* Repayment Value */}
            <div className="mb-4">
              <label className="block mb-1">
                {isPercentage ? "Deduction Percentage" : "Term (Months)"}
              </label>

              {isPercentage ? (
                isManagerFlow ? (
                  <input
                    type="number"
                    name="repaymentValue"
                    className="p-2 border rounded-xl w-full"
                    placeholder="e.g., 25"
                    value={formik.values.repaymentValue}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                ) : (
                  <input
                    type="number"
                    name="repaymentValue"
                    className="p-2 border rounded-xl w-full bg-gray-100 cursor-not-allowed"
                    value={ConfigurationData?.default_percentage || 0}
                    readOnly
                  />
                )
              ) :
                <input
                  type="number"
                  name="repaymentValue"
                  className="p-2 border rounded-xl w-full"
                  placeholder="e.g., 5"
                  value={formik.values.repaymentValue}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              }

              {/* Display appropriate error messages */}
              {formik.errors.repaymentValue &&
                formik.touched.repaymentValue && (
                  <p className="text-red-500 text-sm">
                    {formik.errors.repaymentValue}
                  </p>
                )}
            </div>

            <div className="col-span-2">
              <div className="grid grid-cols-2 gap-6 items-end">
                <div>
                  <label className="block mb-1">First Payment Month</label>
                  <select
                    value={selectedMonthOption}
                    onChange={handleMonthChange}
                    className="p-2 border rounded-xl w-full"
                  >
                    <option value="">Select Month</option>
                    {monthOptions.map((option) => (
                      <option
                        key={`${option.year}-${option.month}`}
                        value={`${option.year}-${option.month}`}
                      >
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block mb-1">Cut-off Date</label>
                  <input
                    type="text"
                    readOnly
                    value={
                      formik.values.first_payment_date
                        ? formatDate(formik.values.first_payment_date)
                        : ""
                    }
                    className="p-2 border rounded-xl w-full bg-gray-100"
                    placeholder="Cut-off Date"
                  />
                </div>
                {formik.errors.first_payment_date && formik.touched.first_payment_date && (
                  <p className="text-red-500 text-sm">
                    {formik.errors.first_payment_date}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Generate Loan Summary Button (Hide if summary is shown) */}
        {(!selectedUserSalary || !formik.values.user_requesting) ?
            (
              <div className="mb-4">
                <span className="text-darkred italic">
                  Loan cannot be created because the salary is not set.
                </span>
              </div>
            ) : (
              <div>
                {!showSummary && (
                  <div className="mb-4">
                    <button
                      type="button"
                      onClick={handleGenerateSummary}
                      className={`bg-primary text-white px-3 py-2 rounded-xl ${!selectedUserSalary ? "cursor-not-allowed" : ""
                        }`}
                      disabled={!selectedUserSalary}
                    >
                      Generate Loan Summary
                    </button>
                  </div>
                )}
              </div>
            )
          
        }

        {/* Summary */}
        {showSummary && (
          <div className="mb-10">
            <RequestSummary
              data={summaryData}
              onClose={closeSummary}
              user={user}
              isNewRequest={false}
              salary={false} // Pass false since it's a loan
            />
          </div>
        )}

        {/* Approvers */}
        <Approvers approvers={ConfigurationData?.approvers || []} />

        {/* Action Buttons */}
        <div className="space-x-4 flex justify-end items-end mt-4">
          <button
            type="button"
            onClick={() => formik.resetForm()}
            disabled={isSubmitting}
            className="flex items-center justify-center border border-secondary text_default_text rounded-xl py-2 px-9 text-sm"
          >
            <MdDeleteOutline className="text-base mr-1" />
            Discard
          </button>

          <button
            type="submit"
            disabled={isSubmitting || !selectedUserSalary}
            className={`flex items-center justify-center rounded-xl text-center px-9 py-2 bg-primary text-white border text-sm ${!selectedUserSalary ? "cursor-not-allowed" : ""
              }`}
          >
            <CiFloppyDisk className="text-base mr-1" />
            {isSubmitting ? <ButtonLoader text="Submitting..." /> : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateLoan;
