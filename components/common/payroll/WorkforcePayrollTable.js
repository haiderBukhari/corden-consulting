import React, { useState, useEffect } from "react";
import { BsSearch } from "react-icons/bs";
import { EyeIcon } from "lucide-react";
import EditPayrollModal from "./EditPayrollModal";
import { FaRegEdit, FaEye, FaEyeSlash } from "react-icons/fa";
import { handleExportCSV } from "../../../utils/functions";
import Image from "next/image";
import { PiExport } from "react-icons/pi";
import { useGetIndividualPayslip } from "../../../hooks/query/payroll/getIndividualPayslip";
import { UseGetRegions } from "../../../hooks/query/admin/getRegions";
import DataLoader from "../../ui/dataLoader";
import { useRouter } from "next/router";

export const getVariableTextClass = (value) => {
  const strValue = value.toString().trim();
  if (strValue.startsWith('+')) {
    return 'text-green-500';
  } else if (strValue.startsWith('-')) {
    return 'text-red-500';
  }
  return 'text-default_text';
};
const WorkforcePayrollTable = ({
  title,
  isTableDisabled,
  height,
  shouldHideEditColumn,

  userData,
  selectedRegion, // Optional
  setSelectedRegion, // Optional
  refetch, // Optional
  canEdit,
}) => {
  const { data: RegionData, isLoading: isRegionLoading } = UseGetRegions();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [isOpenEditPayroll, setIsOpenEditPayroll] = useState(false);
  const [selectedPayrollData, setSelectedPayrollData] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [showPayrollData, setShowPayrollData] = useState(false);
  const [gratuity, setGratuity] = useState(false)
  const [payslipParams, setPayslipParams] = useState(null);
  const { data: individualPayslipData } = useGetIndividualPayslip(payslipParams);

  const router = useRouter();

  const formatPay = (total_amount) => {
    const formattedTotalAmount = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(total_amount);

    return formattedTotalAmount;
  };
  // Handle region changes only if required
  useEffect(() => {
    if (selectedRegion && refetch) {
      refetch();
    }
  }, [selectedRegion]);

  useEffect(() => {
    if (RegionData?.length > 0 && setSelectedRegion) {
      setSelectedRegion(RegionData[0]?.id);
    }
  }, [RegionData]);

  // Filter data based on search term
  useEffect(() => {
    if (userData) {
      const term = searchTerm.trim().toLowerCase();
      const filtered = userData?.payroll_history?.filter((item) => {
        // Combine first, middle, and last names into a single string and trim extra spaces.
        const fullName = `${item.user?.fname} ${item.user?.middle_name || ""} ${item.user?.lname}`.toLowerCase().trim();
        setGratuity(item.gratuity_enabled === 1)
       
        return (
          fullName.includes(term) ||
          item?.role?.toLowerCase().includes(term) ||
          item?.position?.toLowerCase().includes(term) ||
          item?.department?.toLowerCase().includes(term)
        );
      });
      setFilteredData(filtered);
    }
  }, [searchTerm, userData]);



  // Sort data by salary
  const handleSortBySalary = () => {
    const sortedData = [...filteredData].sort((a, b) => {
      const diff = a.basic_salary - b.basic_salary;
      return sortOrder === "asc" ? diff : -diff;
    });
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    setFilteredData(sortedData);
  };

  useEffect(() => {
    if (individualPayslipData) {
      const url = window.URL.createObjectURL(individualPayslipData);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `Payslip_${payslipParams.month}_${payslipParams.year}.pdf`
      );
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url); // Clean up the URL after download
      document.body.removeChild(link); // Remove the link element after download

      // Clean up
      setPayslipParams(null);
    }
  }, [individualPayslipData]);


  return (
    <>
      {!filteredData || isRegionLoading ? (
        <DataLoader />
      ) : (
        <div>
          <div
            className={`border rounded-xl px-4 relative ${isTableDisabled ? "opacity-50" : ""
              }`}
            style={{
              pointerEvents: isTableDisabled ? "none" : "auto",
            }}
          >
            {isOpenEditPayroll && (
              <EditPayrollModal
                data={selectedPayrollData}
                onClose={() => setIsOpenEditPayroll(false)}
              />
            )}

            <div className="flex space-x-3 items-center sticky top-0 bg-white z-20 p-2">
              <h1 className="text-lg font-light mb-2 mt-1 capitalize">
                {title}
              </h1>
              <button
                onClick={() => setShowPayrollData((prev) => !prev)}
                className="p-2 text-gray-600 hover:text-default_text"
                title={
                  showPayrollData ? "Hide Payroll Data" : "Show Payroll Data"
                }
              >
                {showPayrollData ? (
                  <FaEye className="text-primary h-5 w-5 mt-1" />
                ) : (
                  <FaEyeSlash className="text-primary h-5 w-5 mt-1" />
                )}
              </button>
            </div>

            {RegionData && RegionData?.length > 0 ? (
              <div>
                {RegionData && (
                  <div className="flex px-2 py-1 rounded-lg space-x-2 border border-primary mb-4">
                    {RegionData.map((region) => (
                      <button
                        key={region.id}
                        onClick={() => setSelectedRegion(region.id)}
                        className={`rounded-lg py-3 px-12 shadow-md ${selectedRegion === region.id
                          ? "bg-primary text-white border border-primary"
                          : "text-primary"
                          }`}
                      >
                        {region.name}
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex flex-wrap justify-between items-center gap-4 pb-3">
                  <div className="flex-grow md:flex md:items-center md:w-auto">
                    <div className="relative w-full text-sm">
                      <BsSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                      <input
                        type="text"
                        placeholder="Search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-3 py-2 focus:outline-none border rounded-xl w-full"
                      />
                    </div>
                  </div>
                  <div className="flex space-x-2 items-center">
                    <button
                      onClick={handleSortBySalary}
                      className="py-2 px-2 border rounded-xl flex justify-center  text-sm whitespace-nowrap"
                    >
                      {sortOrder === "asc"
                        ? "Sort by Salary (↓)"
                        : "Sort by Salary (↑)"}
                    </button>

                    <button
                      onClick={() =>
                        handleExportCSV(
                          "staff_directory_upcoming_payroll",
                          filteredData
                        )
                      }
                      className="py-2 px-2 border rounded-xl flex items-center gap-2 text-sm"
                    >
                      <PiExport />
                      <span>Export CSV</span>
                    </button>
                  </div>
                </div>

                <div className="border rounded-md p-2 overflow-x-auto">
                  <div className="relative max-h-[500px] overflow-y-auto">
                    <table className="table-auto min-w-max border-collapse">
                      {/* Table Header (Sticky) */}
                      <thead className="bg-white sticky top-0 shadow-sm z-10">
                        <tr className="border-gray-200 border-b text-sm">
                          <th className="sticky left-0 z-20 bg-white text-left px-2 py-2">Employee</th>
                          {userData?.columns?.map((column) => (
                            <th key={column.key} className="text-left px-2 py-2">
                              {column}
                            </th>
                          ))}
                          <th className="text-center px-2 py-2">
                            Total Additions
                          </th>
                          <th className="text-center px-2 py-2">
                            Total Deductions
                          </th>
                          <th className="text-center px-2 py-2">Net Payout</th>
                          {gratuity &&
                            <th className="text-center px-2 py-2">Grutiuty</th>
                          }
                          <th className="text-center px-2 py-2">Actions</th>
                        </tr>
                      </thead>

                      {/* Table Body (Scrollable) */}
                      <tbody>
                        {filteredData?.length > 0 ? (
                          filteredData.map((row) => (
                            <tr
                              key={row.id}
                              className="border-gray-200 border-b text-sm"
                            >
                              <td className="sticky left-0 z-20 bg-white text-left px-2 py-3">
                                <div className="flex items-center capitalize">
                                  <Image
                                    src={row?.avatar || "/assets/image.svg"}
                                    className="h-8 w-8 rounded-full mr-2"
                                    height={32}
                                    width={32}
                                    alt={`${row?.user?.fname}'s profile`}
                                  />
                                  <div>
                                    {row?.user?.fname}{" "}
                                    {row?.user?.middle_name || ""}{" "}
                                    {row?.user?.lname}
                                  </div>
                                </div>
                              </td>
                              <td className="text-left px-2 py-3">
                                {showPayrollData
                                  ? formatPay(row?.basic_salary)
                                  : "****"}
                              </td>
                              <td className="text-left px-2 py-3 text-green-500">
                                {showPayrollData
                                  ? `+$${row?.bonus}`
                                  : "****"}
                              </td>
                              <td className="text-left px-2 py-3 text-darkred">
                                {showPayrollData
                                  ? `-$${row?.penalties}`
                                  : "****"}
                              </td>
                              <td className="text-left px-2 py-3 text-yellow-500">
                                {showPayrollData
                                  ? `-$${row?.loan || "0.00"}`
                                  : "****"}
                              </td>
                              <td className="text-left px-2 py-3 text-yellow-500">
                                {showPayrollData
                                  ? `-$${row?.early_salary || "0.00"}`
                                  : "****"}
                              </td>

                              {/* Dynamic Variables */}
                              {row?.variables &&
                                Object.entries(row.variables).map(([key, value]) => (
                                  <td
                                    className={`text-left px-2 py-3 ${getVariableTextClass(value)}`}
                                    key={key}
                                  >
                                    {showPayrollData ? `${value}` : "****"}
                                  </td>
                                ))
                              }


                              <td className="text-left px-2 py-3 text-green-500">
                                {showPayrollData
                                  ? `+$${row?.addition}`
                                  : "****"}
                              </td>
                              <td className="text-left px-2 py-3 text-darkred">
                                {showPayrollData
                                  ? `-$${row?.deduction}`
                                  : "****"}
                              </td>
                              <td className="text-left px-2 py-3 text-primary">
                                {showPayrollData
                                  ? formatPay(row?.net_payout)
                                  : "****"}
                              </td>
                              {gratuity &&
                                <td className="text-left px-2 py-3 text-primary">
                                  {showPayrollData
                                    ? row?.monthly_gratuity
                                    : "****"}
                                </td>
                              }
                              <td className="text-center px-2 py-3">
                                <div className="flex justify-center items-center">
                                  <EyeIcon
                                    className="h-7 w-7 pr-2 text-primary cursor-pointer"
                                    onClick={() =>
                                      router.push(
                                        `/finances/workforce/payroll/${row.user.id}/member_payroll/`
                                      )
                                    }
                                  />
                                  {!shouldHideEditColumn && (
                                    <FaRegEdit
                                      className="cursor-pointer text-primary  h-6 w-6 pl-2"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedPayrollData(row);
                                        setIsOpenEditPayroll(true);
                                      }}
                                    />
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan="10"
                              className="text-center p-4 text-gray-500"
                            >
                              No Payroll Info found!
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-center py-4">No Region Found</div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default WorkforcePayrollTable;
