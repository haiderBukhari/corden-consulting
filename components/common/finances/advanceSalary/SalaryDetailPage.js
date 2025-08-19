import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/router";
import ActivityLog from "../common/ActivityLog";
import ApprovalTimeline from "../common/ApprovalTimeline";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
function SalaryDetailPage({ role, SalaryDetail, mode }) {
  const router = useRouter();

  const {
    early_salary_details,
    approval_process = [],
    activity_log = [],
  } = SalaryDetail || {};



  const downloadSalaryReceipt = () => {
    const doc = new jsPDF();
    const margin = 15;
    let currentY = 20;

    doc.setFontSize(18);
    doc.text("Advance Salary Receipt", 105, currentY, { align: "center" });

    currentY += 10;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Advance Salary Details", margin, currentY);

    currentY += 6;

    // 2-column layout for salary details
    const salaryData = [
      ["Month", early_salary_details?.month || "N/A"],
      ["Requested By", early_salary_details?.requested_by || "N/A"],
      ["Amount", `$${early_salary_details?.amount_requested || "0.00"}`],
      ["Approval Status", early_salary_details?.status || "N/A"],
      ["Payment  Status", early_salary_details?.payment_status || "N/A"],
      ["Repayment  Status", early_salary_details?.repayment_status || "N/A"],
      ["Reason", early_salary_details?.reason || "N/A"],
      ["Applied Date", early_salary_details?.created_at || "N/A"],
      ["Advance Salary Received Date", early_salary_details?.due_date || "N/A"],
    ];

    autoTable(doc, {
      startY: currentY + 2,
      head: [],
      body: salaryData,
      theme: "plain",
      styles: {
        fontSize: 11,
        cellPadding: 3,
      },
      columnStyles: {
        0: { fontStyle: "bold", textColor: "#333", halign: "left" },
        1: { textColor: "#000", halign: "left" },
      },
    });

    currentY = doc.lastAutoTable.finalY + 10;

    // Approval Timeline Table
    if (approval_process?.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.text("Approval Timeline", margin, currentY);

      autoTable(doc, {
        startY: currentY + 5,
        head: [["Approver", "Status", "Date"]],
        body: approval_process.map((item) => [
          item?.approver_name || "N/A",
          item?.status || "N/A",
          item?.time_ago || "N/A",
        ]),
        theme: "grid",
        styles: { fontSize: 10 },
        headStyles: { fillColor: [53, 68, 68] },
      });

      currentY = doc.lastAutoTable.finalY + 10;
    }

    // Activity Log Table
    if (activity_log?.length > 0) {
      doc.setFont("helvetica", "bold");
      doc.text("Activity Log", margin, currentY);

      autoTable(doc, {
        startY: currentY + 5,
        head: [["Date", "Time", "Action By", "Action"]],
        body: activity_log.map((log) => {
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
        headStyles: { fillColor: [53, 68, 68] },
      });
    }

    doc.save(`Advance_Salary_Receipt_${early_salary_details?.requested_by || "User"}.pdf`);
  };

  const statusStyles = {
    approved: "bg-green-100 text-green-800 px-6",
    pending: "bg-yellow-100 text-yellow-800 px-6",
    rejected: "bg-red-100 text-red-800 px-6",
  };

  return (
    <div className="p-4 bg-white min-h-screen space-y-8">
      {/* Back button */}
      <button
        onClick={() => router.push(mode === "workforce" ? "/finances/workforce/advance-salary" : "/finances/advance-salary")}
        type="button"
        className="flex space-x-2 items-center px-2 py-1 text-white bg-primary rounded-xl mb-3"
      >
        <ArrowLeft className="text-white h-5 w-5" />
        <span>Back</span>
      </button>
      {early_salary_details?.status == 'approved' &&
        <div className="flex justify-end ">


          <button
            onClick={downloadSalaryReceipt}
            className="bg-primary hover:bg-primary text-white px-4 py-2 rounded-lg"
          >
            Download Receipt
          </button>
        </div>
      }
      {/* Summary Section */}
      <div className="space-y-2 overflow-x-auto border rounded-xl">
        <table className="w-full min-w-full">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-2 py-2 border-b text-left text-default_text text-sm">Requested By</th>
              <th className="px-2 py-2 border-b text-left text-default_text text-sm">Amount</th>
              <th className="px-2 py-2 border-b text-left text-default_text text-sm">Approval Status</th>
              <th className="px-2 py-2 border-b text-left text-default_text text-sm">
                Payment status
              </th>
              <th className="px-2 py-2 border-b text-left text-default_text text-sm">
                Repayment status
              </th>
              <th className="px-2 py-2 border-b text-left text-default_text text-sm">
                Reason
              </th>
              <th className="px-2 py-2 border-b text-left text-default_text text-sm">
                Applied Date
              </th>
              <th className="px-2 py-2 border-b text-left text-default_text text-sm">
                Advance Salary Received  Date
              </th>

              <th className="px-2 py-2 border-b text-left text-default_text text-sm">
              Due Date
              </th>


              <th className="px-2 py-2 border-b text-left text-default_text text-sm">Month</th>
            </tr>
          </thead>
          <tbody>
            {early_salary_details ? (
              <tr className="text-sm text-gray-700 cursor-pointer hover:bg-gray-50"
              >
                <td className="px-2 py-3 border-b text-default_text">{early_salary_details?.requested_by}</td>
                <td className="px-2 py-3 border-b text-default_text">{early_salary_details?.amount_requested}</td>
                <td className="px-2 py-3 border-b ">
                  <span
                    className={`py-2 px-3 rounded-md text-xs capitalize ${statusStyles[early_salary_details?.status] ||
                      "bg-gray-200 text-default_text"
                      }`}
                  >
                    {early_salary_details?.status || "N/A"}
                  </span>
                </td>
                <td className="px-2 py-3 border-b">
                  <span
                    className={`py-2 px-3 rounded-md text-xs capitalize
      ${early_salary_details?.payment_status === "Issued to applicant"
                        ? "bg-green-100 text-green-700"
                        : early_salary_details?.payment_status === "Upcoming"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-200 text-default_text"
                      }
    `}
                  >
                    {early_salary_details?.payment_status || "N/A"}
                  </span>
                </td>

                <td className="px-2 py-3 border-b">
                  <span
                    className={`py-2 px-3 rounded-md text-xs capitalize
      ${early_salary_details?.repayment_status === "Received"
                        ? "bg-green-100 text-green-700"
                        : early_salary_details?.repayment_status === "Upcoming"
                          ? "bg-yellow-100 text-yellow-700"
                          : early_salary_details?.repayment_status === "Not Received"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-200 text-default_text"
                      }
    `}
                  >
                    {early_salary_details?.repayment_status || "N/A"}
                  </span>
                </td>

                <td className="px-2 py-3 border-b text-default_text">{early_salary_details?.reason}</td>
                <td className="px-2 py-3 border-b text-default_text">{early_salary_details?.created_at}</td>
                <td className="px-2 py-3 border-b text-default_text">{early_salary_details?.due_date}</td>
                <td className="px-2 py-3 border-b text-default_text">{early_salary_details?.cut_off_period}</td>
                <td className="px-2 py-3 border-b text-default_text">{early_salary_details?.month}</td>
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

export default SalaryDetailPage;