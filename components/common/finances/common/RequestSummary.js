// RequestSummary.jsx
import React from "react";
import PropTypes from "prop-types";
import { formatDateToDdMmYy } from "../../../../utils/functions";
import { useRouter } from "next/router";

// Helper to format day with suffix (st, nd, rd, th)
function getDaySuffix(day) {
  if (day > 3 && day < 21) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

// Helper to get month name from a month number (1-based)
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function parseDateString(dateString) {
  const [dayString, monthString, yearString] = dateString.split("-");

  const day = parseInt(dayString, 10);
  const month = parseInt(monthString, 10) - 1;
  const year = parseInt(yearString, 10);

  return new Date(year, month, day);
}

export function formatDatetoMmYY(isoDateString) {
  const date = parseDateString(isoDateString);

  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const suffix = getDaySuffix(day);
  const monthName = monthNames[month - 1];
  return `${monthName}, ${year}`;
}

function RequestSummary({ data, onClose, user, isNewRequest, salary ,isManager }) {
  const router = useRouter();

  let applicantName = data.userRequestingName;
  if (!applicantName && user && user.name) {
    applicantName = user.name;
  }

  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.getMonth() + 1;
  const currentYear = currentDate.getFullYear();
  const formattedCurrentDate = `${currentDay}${getDaySuffix(currentDay)} ${monthNames[currentMonth - 1]
    }, ${currentYear}`;


  // Handle advance salary specifics
  const requestType = salary ? "Advance Salary" : "Loan";

  // Determine layout based on isNewRequest
  const isTwoColumnLayout = !isNewRequest;

  return (
    <div className="border p-4 rounded-xl bg-white mb-4 w-full space-y-4">
      {/* Header Section */}
      <div>
        <h3 className="text-base font-semibold text-primary">
          {applicantName} applied for a {requestType} Request
        </h3>
        <p className="text-sm text-gray-600">{formattedCurrentDate}</p>
        <hr className="my-2" />
      </div>

      {/* Conditional Layout */}
      {isTwoColumnLayout ? (
        // Two-Column Layout
        <div className="flex flex-col md:flex-row md:space-x-6">
          {/* Left Column: Summary Details */}
          <div className="md:w-1/3 border rounded-xl p-3">
            <p className="font-semibold mb-2">Details</p>
            <div className="space-y-2 text-sm">
              {salary ? (
                <>
                  <div className="flex justify-between">
                    <span>Amount</span>
                    <span className="font-semibold text-green-500">
                      ${Number(data.advanceSalaryAmount).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Applying Date</span>
                    <span className="font-semibold">
                      {data.applyDate
                        ? formatDateToDdMmYy(new Date(data.applyDate))
                        : "Not Specified"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Due Date</span>
                    <span className="font-semibold">
                      {data.dueDate
                        ? formatDateToDdMmYy(new Date(data.dueDate))
                        : "Not Specified"}
                    </span>
                  </div>
                  {!isManager &&
                    <div className="flex justify-between">
                      <span>Reason</span>
                      <span className="font-semibold">{data.reason}</span>
                    </div>
                  }

                  {data.error && (
                    <p className="text-red-500 text-sm">
                      {data.error.advance_salary_amount}
                    </p>
                  )}
                </>
              ) : (
                (data.details || []).map((detail, index) => (
                  <div className="flex justify-between" key={index}>
                    <span>{detail.label}</span>
                    <span className="font-semibold">
                      {detail.formatter
                        ? detail.formatter(detail.value)
                        : detail.format === "currency"
                          ? `$${Number(detail.value).toLocaleString()}`
                          : detail.format === "date"
                            ? formatDatetoMmYY(detail.value)
                            : detail.value}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex space-x-4">
              {!isNewRequest && (
                <button
                  onClick={onClose}
                  className="bg-primary text-white px-4 py-2 rounded text-sm hover:bg-primary transition duration-200"
                >
                  Close Summary
                </button>
              )}

              {isNewRequest && data?.id && (
                <button
                  onClick={() => {
                    router.push(`/finances/loan/${data.id}`);
                  }}
                  className="bg-primary text-white px-4 py-2 rounded text-sm hover:bg-primary transition duration-200"
                >
                  View Details
                </button>
              )}
            </div>
          </div>

          {/* Right Column: Repayment Schedule */}
          {data.requestType === "Loan" && data.repayment_schedule && (
            <div className="md:w-2/3 border rounded-xl p-3">
              <p className="font-semibold mb-2">Repayment Schedule</p>
              <div className="overflow-y-auto max-h-52">
                <table className="min-w-full table-fixed border">
                  <thead className="sticky top-0 bg-white z-10">
                    <tr>
                      <th className="px-4 py-2 border text-sm text-center">
                        Due Date
                      </th>
                      <th className="px-4 py-2 border text-sm text-center">
                        Due ($)
                      </th>
                      <th className="px-4 py-2 border text-sm text-center">
                        Percentage (%)
                      </th>
                      <th className="px-4 py-2 border text-sm text-center">
                        Left ($)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.repayment_schedule.map((repayment, index) => (
                      <tr key={repayment.id || index}>
                        <td className="px-4 py-2 border text-sm text-center">
                          {formatDatetoMmYY(repayment.due_date)}
                        </td>
                        <td className="px-4 py-2 border text-sm text-center">
                          {Number(repayment.amount_due).toFixed(2)}
                        </td>
                        <td className="px-4 py-2 border text-sm text-center">
                          {repayment.percentage}
                        </td>
                        <td className="px-4 py-2 border text-sm text-center">
                          {repayment.amount_left}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : (
        // Single-Column Layout
        <div className="flex flex-col">
          {/* Summary Details */}
          <div className="border rounded-xl p-3">
            <p className="font-semibold mb-2">Details</p>
            <div className="space-y-2 text-sm">
              {
                (data.details || []).map((detail, index) => (
                  <div className="flex justify-between" key={index}>
                    <span>{detail.label}</span>
                    <span className="font-semibold">
                      {
                        detail.formatter
                          ? detail.formatter(detail.value)
                          : detail.format === "currency"
                            ? `$${Number(detail.value).toLocaleString()}`
                            : detail.format === "date"
                              ? (salary ? detail.value : formatDatetoMmYY(detail.value))
                              : detail.value
                      }
                    </span>
                  </div>
                ))
              }
            </div>
            {/* Action Buttons */}
            <div className="mt-4 flex space-x-4">
              {!isNewRequest && (
                <button
                  onClick={onClose}
                  className="bg-red-500 text-white px-4 py-2 rounded text-sm hover:bg-red-600 transition duration-200"
                >
                  Close Summary
                </button>
              )}

              {isNewRequest && data?.id && !salary && (
                <button
                  onClick={() => {
                    router.push(`/finances/loan/${data.id}`);
                  }}
                  className="bg-primary text-white px-4 py-2 rounded text-sm hover:bg-primary-dark transition duration-200"
                >
                  View Details
                </button>
              )}
            </div>
          </div>

          {/* Repayment Schedule (Optional for Single-Column) */}
          {data.requestType === "Loan" && data.repayment_schedule && (
            <div className="border rounded-xl p-3 mt-4">
              <p className="font-semibold mb-2">Repayment Schedule</p>
              <div className="overflow-y-auto max-h-48">
                <table className="min-w-full table-fixed border">
                  <thead className="sticky top-0 bg-white z-10">
                    <tr>
                      <th className="px-4 py-2 border text-sm text-center">
                        Due Date
                      </th>
                      <th className="px-4 py-2 border text-sm text-center">
                        Due ($)
                      </th>
                      <th className="px-4 py-2 border text-sm text-center">
                        Percentage (%)
                      </th>
                      <th className="px-4 py-2 border text-sm text-center">
                        Left ($)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.repayment_schedule.map((repayment, index) => (
                      <tr key={repayment.id || index}>
                        <td className="px-4 py-2 border text-sm text-center">
                          {formatDatetoMmYY(repayment.due_date)}
                        </td>
                        <td className="px-4 py-2 border text-sm text-center">
                          {Number(repayment.amount_due).toFixed(2)}
                        </td>
                        <td className="px-4 py-2 border text-sm text-center">
                          {repayment.percentage}
                        </td>
                        <td className="px-4 py-2 border text-sm text-center">
                          {repayment.amount_left}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

RequestSummary.propTypes = {
  data: PropTypes.shape({
    userRequestingName: PropTypes.string,
    requestType: PropTypes.string.isRequired,
    advanceSalaryAmount: PropTypes.string, // For advance salary
    applyDate: PropTypes.string, // For advance salary
    dueDate: PropTypes.string, // For advance salary
    reason: PropTypes.string, // For advance salary
    details: PropTypes.arrayOf(
      PropTypes.shape({
        label: PropTypes.string.isRequired,
        value: PropTypes.any.isRequired,
        format: PropTypes.string,
        formatter: PropTypes.func,
      })
    ),
    repayment_schedule: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number,
        due_date: PropTypes.string.isRequired,
        amount_due: PropTypes.string.isRequired,
        percentage: PropTypes.number.isRequired,
        date_paid: PropTypes.string,
        amount_left: PropTypes.string.isRequired,
      })
    ),
    error: PropTypes.object, // For error handling
  }).isRequired,
  onClose: PropTypes.func,
  user: PropTypes.shape({
    name: PropTypes.string,
  }),
  isNewRequest: PropTypes.bool,
  salary: PropTypes.bool, // Indicates if it's an advance salary request
};

export default RequestSummary;
