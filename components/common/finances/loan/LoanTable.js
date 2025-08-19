import React, { useState, useEffect } from "react";
import { BsSearch } from "react-icons/bs";
import { PiExport } from "react-icons/pi";
import { useRouter } from "next/router";
import { formatDatetoMmYY } from "../common/RequestSummary";

const LoanTable = ({ mode, loans, title }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [filteredLoans, setFilteredLoans] = useState(loans || []);
  const router = useRouter();

  const handleFilter = () => {
    let updatedLoans = loans || [];

    if (searchTerm) {
      updatedLoans = updatedLoans.filter((loan) =>
        loan?.loan_details?.requested_by
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    if (selectedStatus) {
      updatedLoans = updatedLoans.filter(
        (loan) => loan?.loan_details?.status === selectedStatus
      );
    }

    setFilteredLoans(updatedLoans);
  };

  // Handle export to CSV
  const handleExportCSV = () => {
    const csvData = [
      [
        "Requested By",
        "Role",
        "Position",
        "Amount",
        "Type",
        "Status",
        "Amount Left",
        "First Payment Date",
      ],
      ...filteredLoans.map((loan) => [
        loan?.loan_details?.requested_by || "N/A",
        loan?.loan_details?.position?.name || "N/A",
        loan?.loan_details?.position?.name || "N/A", // Assuming 'position' is same as 'role'
        loan?.loan_details?.loan_amount || "0.00",
        loan?.loan_details?.type || "N/A",
        loan?.loan_details?.status || "N/A",
        loan?.loan_details?.amount_left || "0.00",
        loan?.loan_details?.first_payment_date || "N/A",
      ]),
    ];

    const csvContent =
      "data:text/csv;charset=utf-8," +
      csvData.map((row) => row.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${title.replace(/\s+/g, "_")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Re-filter loans when searchTerm or selectedStatus changes
  useEffect(() => {
    handleFilter();
  }, [searchTerm, selectedStatus, loans]);

  const statusStyles = {
    Approved: "bg-green-100 text-green-800 px-6",
    Pending: "bg-yellow-100 text-yellow-800 px-6",
    Rejected: "bg-red-100 text-red-800 px-6",
  };

  return (
    <div>
      <h2 className="font-semibold text-xl my-2">{title}</h2>
      <div className="flex flex-wrap justify-between items-center gap-4 py-3">
        <div className="flex-grow md:flex md:items-center md:w-auto">
          <div className="relative w-full">
            <BsSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-default_text" />
            <input
              type="text"
              placeholder="Search By Name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-3 py-2 w-full focus:outline-none border rounded-xl text-sm"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="py-2 px-4 border rounded-xl text-sm"
          >
            <option value="">All Status</option>
            <option value="Approved">Approved</option>
            <option value="Pending">Pending</option>
            <option value="Rejected">Rejected</option>
          </select>
          <button
            onClick={handleExportCSV}
            className="py-2 px-4 border rounded-xl flex items-center gap-2 text-sm whitespace-nowrap"
          >
            <PiExport />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      <div className="overflow-x-auto border rounded-lg">
        <table className="min-w-full border-collapse bg-white">
          <thead className="bg-gray-100 sticky top-0 z-20">
            <tr>
              <th className="px-2 py-2 border-b text-left text-default_text text-sm text-center">
                Requested By
              </th>
              <th className="px-2 py-2 border-b text-left text-default_text text-sm text-center">
                Position
              </th>
              <th className="px-2 py-2 border-b text-left text-default_text text-sm text-center">
                Amount
              </th>
              <th className="px-2 py-2 border-b text-left text-default_text text-sm text-center">
                Type
              </th>

              <th className="px-2 py-2 border-b text-left text-default_text text-sm text-center">
                Status
              </th>
              <th className="px-2 py-2 border-b text-left text-default_text text-sm text-center">
                Reason
              </th>
              <th className="px-2 py-2 border-b text-left text-default_text text-sm text-center">
                Amount Left
              </th>
              <th className="px-2 py-2 border-b text-left text-default_text text-sm text-center">
                First Payment Date
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredLoans.length > 0 ? (
              filteredLoans.map((loan) => (
                <tr
                  key={loan?.loan_details?.id || `loan-${Math.random()}`}
                  className="text-sm text-gray-700 cursor-pointer hover:bg-gray-50"
                  onClick={() => {
                    if (loan?.loan_details?.id) {
                      mode === "workforce" ? router.push(`/finances/workforce/loan/${loan?.loan_details?.id}`) : router.push(`/finances/loan/${loan?.loan_details?.id}`);
                    }
                  }}
                >
                  <td className="px-2 py-3 border-b text-default_text text-center capitalize">
                    {loan?.loan_details?.requested_by || "N/A"}
                  </td>
                  <td className="px-2 py-3 border-b text-default_text text-center">
                    {loan?.loan_details?.position?.name || "N/A"}
                  </td>
                  <td className="px-2 py-3 border-b text-default_text text-center">
                    {loan?.loan_details?.loan_amount
                      ? `$${parseFloat(loan.loan_details.loan_amount).toFixed(
                        2
                      )}`
                      : "$0.00"}
                  </td>
                  <td className="px-2 py-3 border-b text-default_text text-center">
                    {loan?.loan_details?.type || "N/A"}
                  </td>
                  <td className="px-2 py-3 border-b text-center">
                    <span
                      className={`py-2 px-3 rounded-md text-xs ${statusStyles[loan?.loan_details?.status] ||
                        "bg-gray-200 text-default_text"
                        }`}
                    >
                      {loan?.loan_details?.status || "N/A"}
                    </span>
                  </td>
                  <td className="px-2 py-3 border-b text-default_text text-center">
                    {loan?.loan_details?.reason}

                  </td>
                  <td className="px-2 py-3 border-b text-default_text text-center">
                    {loan?.loan_details?.amount_left
                      ? `$${parseFloat(loan.loan_details.amount_left).toFixed(
                        2
                      )}`
                      : "$0.00"}
                  </td>
                  <td className="px-2 py-3 border-b text-default_text text-center">
                    {formatDatetoMmYY(loan?.loan_details?.first_payment_date) || "N/A"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  No loans found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LoanTable;
