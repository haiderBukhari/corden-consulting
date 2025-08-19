import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/router";
import { TbEdit } from "react-icons/tb";
import { MdDeleteOutline } from "react-icons/md";
import { CiFloppyDisk } from "react-icons/ci";
import ActivityLog from "../common/ActivityLog";
import ApprovalTimeline from "../common/ApprovalTimeline";
import UseEditLoan from "../../../../hooks/mutations/finances/loan/editLoan";
import ButtonLoader from "../../../ui/buttonLoader";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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

function formatDate(isoDateString) {
  const date = parseDateString(isoDateString);
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const monthName = monthNames[month - 1];
  return `${monthName}, ${year}`;
}

function LoanDetailPage({ mode, role, loanDetails, user, ConfigurationData }) {
  const router = useRouter();
  const { mutate: editLoanMutation, isLoading: isEditLoanLoading } = UseEditLoan();

  const {
    loan_details,
    repayment_schedule = [],
    approval_process = [],
    activity_log = [],
  } = loanDetails || {};

  const [isEditing, setIsEditing] = useState(false);
  const [repaymentData, setRepaymentData] = useState([]);
  const [totalUpcomingBase, setTotalUpcomingBase] = useState(0);
  const [validationMsg, setValidationMsg] = useState("");

  const isApproverOne = ConfigurationData?.approvers?.some(
    (approver) => approver.id === user?.id && approver.approval_order === 1
  );

  useEffect(() => {
    if (repayment_schedule.length) {
      const parsedSchedule = repayment_schedule.map((item) => ({
        ...item,
        amount_due: parseFloat(item.amount_due),
      }));

      parsedSchedule.sort((a, b) => a.id - b.id);

      const upcomingSum = parsedSchedule
        .filter((inst) => inst.status === "Upcoming")
        .reduce((acc, curr) => acc + curr.amount_due, 0);

      setRepaymentData(parsedSchedule);
      setTotalUpcomingBase(upcomingSum);
    }
  }, [repayment_schedule]);

  useEffect(() => {
    if (isEditing) {
      const sumOfUpcoming = repaymentData
        .filter((inst) => inst.status === "Upcoming")
        .reduce((acc, curr) => acc + curr.amount_due, 0);

      if (Math.abs(sumOfUpcoming - totalUpcomingBase) > 0.01) {
        setValidationMsg(
          `The total of upcoming installments ($${sumOfUpcoming.toFixed(
            2
          )}) does not match the required total ($${totalUpcomingBase.toFixed(
            2
          )}). Please adjust the amounts.`
        );
      } else {
        setValidationMsg("");
      }
    } else {
      setValidationMsg("");
    }
  }, [repaymentData, totalUpcomingBase, isEditing]);

  const handleEditLoan = () => {
    setIsEditing(true);
  };

  const handleChangeAmountDue = (changedId, newValue) => {
    const numericValue = parseFloat(newValue) || 0;

    if (numericValue < 0) {
      setValidationMsg("Amount due cannot be negative.");
      return;
    }

    const upcoming = repaymentData.filter((item) => item.status === "Upcoming");
    const nonUpcoming = repaymentData.filter(
      (item) => item.status !== "Upcoming"
    );

    upcoming.sort((a, b) => a.id - b.id);

    const changedIndex = upcoming.findIndex((item) => item.id === changedId);
    if (changedIndex === -1) return;

    const changedInstallment = upcoming[changedIndex];
    changedInstallment.amount_due = numericValue;

    const sumOfBefore = upcoming
      .slice(0, changedIndex)
      .reduce((acc, inst) => acc + inst.amount_due, 0);

    const leftoverForAfter = totalUpcomingBase - (sumOfBefore + numericValue);

    // If leftover for other installments is negative, prevent update and show an error
    if (leftoverForAfter < 0) {
      setValidationMsg(
        `The entered value causes the total upcoming installments to exceed the required total ($${totalUpcomingBase.toFixed(2)}).`
      );
      return;
    }

    setValidationMsg(""); // Clear any existing error messages

    const afterArray = upcoming.slice(changedIndex + 1);
    const countAfter = afterArray.length;

    if (countAfter > 0) {
      const shareEach = leftoverForAfter / countAfter;
      afterArray.forEach((inst) => {
        inst.amount_due = parseFloat(shareEach.toFixed(2));
      });
    }

    const beforeArray = upcoming.slice(0, changedIndex);
    const updatedUpcoming = [...beforeArray, changedInstallment, ...afterArray];

    let updatedData = [...updatedUpcoming, ...nonUpcoming];
    updatedData.sort((a, b) => a.id - b.id);

    setRepaymentData(updatedData);
  };

  const handleDiscard = () => {
    const originalParsed = repayment_schedule.map((item) => ({
      ...item,
      amount_due: parseFloat(item.amount_due),
    }));
    originalParsed.sort((a, b) => a.id - b.id);

    const upcomingSum = originalParsed
      .filter((inst) => inst.status === "Upcoming")
      .reduce((acc, curr) => acc + curr.amount_due, 0);

    setRepaymentData(originalParsed);
    setTotalUpcomingBase(upcomingSum);
    setIsEditing(false);

  };

  const handleSubmit = () => {
    const sumOfUpcoming = repaymentData
      .filter((item) => item.status === "Upcoming")
      .reduce((acc, curr) => acc + curr.amount_due, 0);

    if (Math.abs(sumOfUpcoming - totalUpcomingBase) > 0.01) {
      alert(
        "Please fix the installment amounts so they match the total required."
      );
      return;
    }

    const installmentsPayload = repaymentData
      .filter((item) => item.status === "Upcoming")
      .map((inst) => ({
        repayment_id: inst.id,
        amount_due: inst.amount_due,
      }));

    const formData = {
      installments: installmentsPayload,
    };

    const loanId = loan_details?.id;

    editLoanMutation(
      {
        id: loanId,
        formData: formData,
      },
      {
        onSuccess: () => {
          setIsEditing(false);

        },
      }
    );
  };

  const displayedRepaymentData = isEditing
    ? repaymentData.filter((item) => item.status === "Upcoming")
    : repaymentData;

  const canSubmit = validationMsg === "";

 const generateLoanReceipt = (
  loanDetails,
  repaymentSchedule,
  approvalProcess = [],
  activityLog = []
) => {
  const doc = new jsPDF();
  const margin = 14;
  let currentY = 15;

  doc.setFontSize(16);
  doc.text("Loan Receipt", 105, currentY, { align: "center" });
  currentY += 15;

  doc.setFontSize(11);
  doc.text(`Requested By: ${loanDetails.requested_by}`, margin, currentY += 8);
  doc.text(`Position: ${loanDetails.position?.name || "N/A"}`, margin, currentY += 8);
  doc.text(`Loan Amount: $${loanDetails.loan_amount}`, margin, currentY += 8);
  doc.text(`Type: ${loanDetails.type}`, margin, currentY += 8);
  doc.text(`Status: ${loanDetails.status}`, margin, currentY += 8);
  doc.text(`Reason: ${loanDetails.reason || "N/A"}`, margin, currentY += 8);
  doc.text(`Amount Left: $${loanDetails.amount_left}`, margin, currentY += 8);
  doc.text(`Date Requested: ${loanDetails.date_requested}`, margin, currentY += 8);

  // Repayment Schedule Table
  if (repaymentSchedule?.length > 0) {
    doc.setFont("helvetica", "bold");
    doc.text("Repayment Schedule", margin, currentY += 10);

    autoTable(doc, {
      startY: currentY + 5,
      head: [["Due Date", "Amount Due", "Date Paid", "Status", "Amount Left"]],
      body: repaymentSchedule.map((item) => [
        item.due_date || "-",
        `$${item.amount_due}`,
        item.date_paid || "-",
        item.status || "-",
        `$${item.amount_left}`,
      ]),
      theme: "striped",
      styles: { fontSize: 10 },
      headStyles: {  fillColor: [96, 4, 51] },
    });

    currentY = doc.lastAutoTable.finalY + 10;
  }

  // Approval Timeline Table
  if (approvalProcess?.length > 0) {
    doc.setFont("helvetica", "bold");
    doc.text("Approval Timeline", margin, currentY);

    autoTable(doc, {
      startY: currentY + 5,
      head: [["Approver", "Status", "Date"]],
      body: approvalProcess.map((item) => [
        item?.approver_name || "N/A",
        item?.status || "N/A",
        item?.time_ago || "N/A",
      ]),
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: {  fillColor: [96, 4, 51] },
    });

    currentY = doc.lastAutoTable.finalY + 10;
  }

  // Activity Log Table
  if (activityLog?.length > 0) {
    doc.setFont("helvetica", "bold");
    doc.text("Activity Log", margin, currentY);

    autoTable(doc, {
      startY: currentY + 5,
      head: [["Date", "Time", "Action By", "Action"]],
      body: activityLog.map((log) => {
        const [date, time] = log?.created_at?.split(" ") || ["-", "-"];
        return [
          date,
          time,
          log?.user_name || "N/A",
          log?.action || "-",
        ];
      }),
      theme: "striped",
      styles: { fontSize: 10 },
      headStyles: {  fillColor: [96, 4, 51] },
    });
  }

  doc.save(`Loan_Receipt_${loanDetails.requested_by}.pdf`);
};

  return (
    <div className="p-4 bg-white min-h-screen space-y-8">
      {/* Back button */}
      <button
        onClick={() => router.push(mode === "workforce" ? "/finances/workforce/loan" : "/finances/loan")}
        type="button"
        className="flex space-x-2 items-center px-2 py-1 text-white bg-primary rounded-xl mb-3"
      >
        <ArrowLeft className="text-white h-5 w-5" />
        <span>Back</span>
      </button>
      {loan_details.status.toLowerCase() === "approved" &&
        <div className="flex justify-end ">


          <button
            onClick={() => generateLoanReceipt(loan_details, displayedRepaymentData ,approval_process , activity_log)}
            className="bg-primary hover:bg-primary text-white px-4 py-2 rounded-lg"
          >
            Download Loan Receipt
          </button>
        </div>
      }

      {/* Summary Section */}
      <div className="space-y-2 overflow-x-auto border rounded-xl">
        <table className="w-full min-w-full">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="p-2  text-default_text text-sm text-center">
                Requested By
              </th>
              <th className="p-2  text-default_text text-sm text-center">
                Position
              </th>
              <th className="p-2  text-default_text text-sm text-center">
                Loan Amount
              </th>
              <th className="p-2  text-default_text text-sm text-center">
                Type
              </th>
              <th className="p-2 text-default_text text-sm text-center">
                Status
              </th>
              <th className="p-2 text-default_text text-sm text-center">
                Reason
              </th>
              <th className="p-2  text-default_text text-sm text-center">
                Amount Left
              </th>
              <th className="p-2  text-default_text text-sm text-center">
                Date Requested
              </th>
              {isApproverOne && (
                <th className="p-2  text-default_text text-sm text-center">
                  Action
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {loan_details ? (
              <tr className="border-t">
                <td className="p-2 text-center">{loan_details.requested_by}</td>
                <td className="p-2 text-center">
                  {loan_details.position?.name || "N/A"}
                </td>
                <td className="p-2 text-center">
                  {loan_details.loan_amount
                    ? `$${loan_details.loan_amount}`
                    : "$0.00"}
                </td>
                <td className="p-2 text-center">{loan_details.type}</td>
                <td className="p-2 text-center">
                  <span
                    className={`py-2 px-3 rounded-md ${loan_details.status.toLowerCase() === "approved"
                      ? "bg-green-100 text-green-800 px-6"
                      : loan_details.status.toLowerCase() === "pending"
                        ? "bg-yellow-100 text-yellow-800 px-6"
                        : "bg-red-100 text-red-800 px-6"
                      }`}
                  >
                    {loan_details.status}
                  </span>
                </td>
                <td className="px-2 py-3 border-b text-default_text text-center">
                  {loan_details?.reason}

                </td>
                <td className="p-2 text-center">
                  {loan_details.amount_left
                    ? `$${loan_details.amount_left}`
                    : "$0.00"}
                </td>
                <td className="p-2 text-center">
                  {loan_details.date_requested}
                </td>
                {isApproverOne && (
                  <td className="p-2 flex justify-center">
                    {!isEditing && (
                      <button
                        className="flex items-center justify-center rounded-lg px-2 py-1 border border-primary text-primary text-sm"
                        onClick={handleEditLoan}
                      >
                        <TbEdit className="h-4 w-4" />
                        Edit
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ) : (
              <tr>
                <td colSpan={9} className="text-center p-2 text-gray-500">
                  No loan details available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Repayment Details Section */}
      <div className="space-y-2">
        <h3 className="text-lg">Repayment Details</h3>
        <div className="space-y-2 overflow-x-auto border rounded-xl">
          <table className="w-full min-w-full">
            <thead className="bg-gray-1">
              <tr>
                <th className="p-2 text-center text-default_text text-sm">
                  Due Date
                </th>
                <th className="p-2 text-default_text text-sm text-center">
                  Amount Due
                </th>
                <th className="p-2 text-default_text text-sm text-center">
                  Date Paid
                </th>
                <th className="p-2 text-default_text text-sm text-center">Status</th>
                <th className="p-2 text-default_text text-sm text-center">
                  Amount Left
                </th>
                {/* {isApproverOne && (
                  <th className="p-2 text-default_text text-sm text-center">Action</th>
                )} */}
              </tr>
            </thead>
            <tbody>
              {displayedRepaymentData.length > 0 ? (
                displayedRepaymentData.map((item) => {
                  const canEdit = isEditing && item.status === "Upcoming";

                  return (
                    <tr key={item.id} className="border-t">
                      <td className="p-2 text-center">{formatDate(item.due_date)}</td>
                      <td className="p-2 flex justify-center">
                        {canEdit ? (
                          <input
                            type="number"
                            className="border p-1 w-20 rounded"
                            value={item.amount_due}
                            min={0}
                            onChange={(e) =>
                              handleChangeAmountDue(item.id, e.target.value)
                            }
                          />
                        ) : (
                          `$${item.amount_due}`
                        )}
                      </td>
                      <td className="p-2 text-center">{item.date_paid || "-"}</td>
                      <td className="p-2 text-center">
                        <span
                          className={`py-2 px-4 rounded-xl text-sm ${item.status === "Paid"
                            ? "bg-green-100 text-green-500 border border-green-300"
                            : item.status === "Failed"
                              ? "bg-red-100 text-darkred border border-darkred-300"
                              : item.status === "Pending"
                                ? "bg-orange-100 text-orange-500 border border-orange-300"
                                : item.status === "Upcoming"
                                  ? "bg-gray-200 text-gray-500 border border-gray-300"
                                  : "bg-blue-500 text-white"
                            }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="p-2 text-center">
                        {item.amount_left ? `$${item.amount_left}` : "$0.00"}
                      </td>
                      {/* {isApproverOne && (
                        <td className="p-2 flex justify-center">
                          {canEdit && !isRowOpenForEditing && (
                            <button
                              className="group relative flex items-center justify-center rounded-lg px-2 py-1 border border-primary text-primary text-sm"
                              onClick={() => handleEditRow(item.id)}
                            >
                              <TbEdit className="h-4 w-4" />
                              <span className="ml-1">Edit</span>
                            </button>
                          )}
                        </td>
                      )} */}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="text-center p-2 text-gray-500">
                    No repayment schedule available.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/** If there's a validation message, show it in red */}
        {validationMsg && (
          <p className="text-red-500 text-sm font-medium">{validationMsg}</p>
        )}

        {/* Action Buttons when editing */}
        {isEditing && (
          <div className="space-x-4 flex justify-end items-end">
            <button
              type="button"
              className="flex items-center justify-center border border-secondary text_default_text rounded-xl py-2 px-9 text-sm"
              onClick={handleDiscard}
            >
              <MdDeleteOutline className="text-base mr-1" />
              Discard
            </button>

            <button
              type="submit"
              className="flex items-center justify-center rounded-xl text-center px-9 py-2 bg-primary text-white border text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSubmit}
              disabled={!canSubmit}
            >
              <CiFloppyDisk className="text-base mr-1" />
              {isEditLoanLoading ? <ButtonLoader text={"Submitting...."} /> : "Submit"}
            </button>
          </div>
        )}
      </div>

      {/* Approval Process Section */}
      <div className="space-y-2">
        <h3 className="text-lg">Approval Process</h3>
        <div className="p-8 border rounded-xl">
          <ApprovalTimeline approvalProcessData={approval_process} />
        </div>
      </div>

      {/* Activity Log Section */}
      <div className="space-y-2">
        <ActivityLog data={activity_log} />
      </div>
    </div>
  );
}

export default LoanDetailPage;
