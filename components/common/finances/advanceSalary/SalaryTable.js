import React, { useState } from "react";
import { BsSearch } from "react-icons/bs";
import { PiExport } from "react-icons/pi";
import { useRouter } from "next/router";
import { EyeIcon } from "lucide-react";
import { TbTrashOff } from "react-icons/tb";
import useGetActiveUser from "../../../../hooks/query/getUserFromLocalStorage";

const SalaryTable = ({ data, title, mode }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [filteredLoans, setFilteredLoans] = useState(data);
  const router = useRouter();
  const { data: user } = useGetActiveUser();

  // Filter loans based on search term and status
  const handleFilter = () => {
    let updatedLoans = data;

    if (searchTerm) {
      updatedLoans = updatedLoans.filter((loan) =>
        loan?.early_salary_details?.requestedBy
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
    }

    if (selectedStatus) {
      updatedLoans = updatedLoans.filter(
        (loan) => loan?.early_salary_details?.status === selectedStatus
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
        ,
        "Approval status",
        "Date Requested",
      ],
      ...filteredLoans.map((loan) => [
        loan.requestedBy,
        loan.role,
        loan.position,
        loan.amount,

        loan.status,

        loan.dateRequested,
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

  // Effectively re-filter loans when searchTerm or selectedStatus changes
  React.useEffect(() => {
    handleFilter();
  }, [searchTerm, selectedStatus, data]);

  const statusStyles = {
    approved: "bg-green-100 text-green-800 px-6",
    pending: "bg-yellow-100 text-yellow-800 px-7",
    rejected: "bg-red-100 text-red-800 px-7",
  };

  return (
    <div>
      <h2 className="font-semibold text-xl my-5">{title}</h2>
      <div className="flex flex-wrap justify-between items-center gap-4 py-3">
        <div className="flex-grow md:flex md:items-center md:w-auto">
          <div className="relative w-full ">
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
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
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

      {/* Salary List */}
      <div className="overflow-x-auto border rounded-lg min-h-screen">
        <table className="min-w-full border-collapse bg-white">
          <thead className="bg-gray-100 sticky top-0 z-20">
            <tr>
              <th className="px-2 py-2 border-b text-left text-default_text text-sm">
                Requested By
              </th>

              <th className="px-2 py-2 border-b text-left text-default_text text-sm">
                Amount
              </th>

              <th className="px-2 py-2 border-b text-left text-default_text text-sm">
              Approval status
              </th>
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
             
              <th className="px-2 py-2 border-b text-left text-default_text text-sm">
                Month
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredLoans?.length > 0 ? (
              filteredLoans?.map((loan, index) => (
                <tr
                  onClick={() => {
                    if (loan?.early_salary_details?.id) {
                      router.push(
                        mode === "workforce" ? `/finances/workforce/advance-salary/${loan?.early_salary_details?.id}` : `/finances/advance-salary/${loan?.early_salary_details?.id}`
                      );
                    }
                  }}
                  key={index}
                  className="text-sm text-gray-700 cursor-pointer hover:bg-gray-50"
                >
                  <td className="px-2 py-3 border-b text-default_text">
                    {loan?.early_salary_details?.requested_by}
                  </td>

                  <td className="px-2 py-3 border-b text-default_text">
                    {loan.early_salary_details?.es_amount}
                  </td>

                  <td className="px-2 py-3 border-b ">
                    <span
                      className={`py-2 px-3 rounded-md text-xs capitalize ${
                        statusStyles[loan?.early_salary_details?.status] ||
                        "bg-gray-200 text-default_text"
                      }`}
                    >
                      {loan?.early_salary_details?.status || "N/A"}
                    </span>
                  </td>
                  <td className="px-2 py-3 border-b">
  <span
    className={`py-2 px-3 rounded-md text-xs capitalize
      ${
        loan?.early_salary_details?.payment_status === "Issued to applicant"
          ? "bg-green-100 text-green-700"
          : loan?.early_salary_details?.payment_status === "Upcoming"
          ? "bg-yellow-100 text-yellow-700"
          : "bg-gray-200 text-default_text"
      }
    `}
  >
    {loan?.early_salary_details?.payment_status || "N/A"}
  </span>
</td>

<td className="px-2 py-3 border-b">
  <span
    className={`py-2 px-3 rounded-md text-xs capitalize
      ${
        loan?.early_salary_details?.repayment_status === "Received"
          ? "bg-green-100 text-green-700"
          : loan?.early_salary_details?.repayment_status === "Upcoming"
          ? "bg-yellow-100 text-yellow-700"
          : loan?.early_salary_details?.repayment_status === "Not Received"
          ? "bg-red-100 text-red-700"
          : "bg-gray-200 text-default_text"
      }
    `}
  >
    {loan?.early_salary_details?.repayment_status || "N/A"}
  </span>
</td>

                  <td className="px-2 py-3 border-b text-default_text break-all w-40">
                    {loan.early_salary_details?.reason}
                  </td>

                  <td className="px-2 py-3 border-b text-default_text">
                    {loan.early_salary_details?.created_at}
                  </td>

                  <td className="px-2 py-3 border-b text-default_text">
                    {loan.early_salary_details?.due_date}
                  </td>
                  <td className="px-2 py-3 border-b text-default_text">
                    {loan.early_salary_details?.cut_off_period}
                  </td>
                  <td className="px-2 py-3 border-b text-default_text">
                    {loan.early_salary_details?.month}
                  </td>
                
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  No Salary List found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalaryTable;
