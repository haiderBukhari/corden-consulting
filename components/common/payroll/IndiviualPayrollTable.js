import React, { useState, useEffect } from "react";
import { BsSearch } from "react-icons/bs";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import EditPayrollModal from "./EditPayrollModal";
import { DownloadIcon } from "lucide-react";

import { handleExportCSV } from "../../../utils/functions";

import { PiExport } from "react-icons/pi";
import { useGetIndividualPayslip } from "../../../hooks/query/payroll/getIndividualPayslip";
import DataLoader from "../../ui/dataLoader";
import { convertMonthToNumber } from "../../../utils/functions";
import { useRouter } from "next/router";
import { getVariableTextClass } from "./WorkforcePayrollTable";

const IndiviualPayrollTable = ({
    title,
    isTableDisabled,
    height,
    id,
    gratuity,
    userData,
}) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filteredData, setFilteredData] = useState([]);
    const [isOpenEditPayroll, setIsOpenEditPayroll] = useState(false);
    const [selectedPayrollData, setSelectedPayrollData] = useState(null);
    const [showPayrollData, setShowPayrollData] = useState(false);

    const [payslipParams, setPayslipParams] = useState(null);
    const { data: individualPayslipData } = useGetIndividualPayslip(payslipParams);



    const formatPay = (total_amount) => {
        const formattedTotalAmount = new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(total_amount);

        return formattedTotalAmount;
    };

    // Filter data based on search term
    useEffect(() => {
        if (!userData?.payroll_history) return;

        const term = searchTerm.trim().toLowerCase();

        if (!term) {
            setFilteredData(userData.payroll_history);
            return;
        }

        const filteredData = userData.payroll_history.filter((historyItem) =>
            JSON.stringify(historyItem).toLowerCase().includes(term.toLowerCase())
        );

        setFilteredData(filteredData);
    }, [searchTerm, userData]);

    const handleSavePayslip = (month, year) => {
        setPayslipParams({ id: id, month, year });
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
            window.URL.revokeObjectURL(url);
            document.body.removeChild(link);

            // Clean up
            setPayslipParams(null);
        }
    }, [individualPayslipData]);


    return (
        <>
            {!filteredData ? (
                <DataLoader />
            ) : (
                <div>
                    <div
                        className={`border rounded-xl overflow-y-auto px-2 relative ${isTableDisabled ? "opacity-50" : ""
                            }`}
                        style={{
                            height: height,
                            pointerEvents: isTableDisabled ? "none" : "auto",
                        }}
                    >
                        {isOpenEditPayroll && (
                            <EditPayrollModal
                                data={selectedPayrollData}
                                onClose={() => setIsOpenEditPayroll(false)}
                            />
                        )}

                        <div className="flex space-x-4 items-center sticky top-0 bg-white z-20 p-2">
                            <h1 className="text-lg font-light mb-2 mt-1 capitalize">
                                {title}
                            </h1>
                            <button
                                onClick={() => setShowPayrollData((prev) => !prev)}
                                className="p-2 text-gray-600 mb-2 hover:text-default_text"
                                title={showPayrollData ? "Hide Payroll Data" : "Show Payroll Data"}
                            >
                                {showPayrollData ? (
                                    <FaEye className="text-primary h-5 w-5 mt-1" />
                                ) : (
                                    <FaEyeSlash className="text-primary h-5 w-5 mt-1" />
                                )}
                            </button>
                        </div>

                        <div>
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
                                    {/* work on exporttttt */}
                                    <button
                                        onClick={() => handleExportCSV("", filteredData)}
                                        className="py-2 px-2 border rounded-xl flex items-center gap-2 text-sm"
                                    >
                                        <PiExport />
                                        <span>Export CSV</span>
                                    </button>
                                </div>
                            </div>

                            {filteredData?.length > 0 ? (
                                filteredData.map((historyItem, index) => {
                                    const columns = JSON?.parse(historyItem?.columns) || [];

                                    return (
                                        <div key={index} className="mb-4">
                                            <h2 className="text-2xl font-bold mb-4">
                                                {historyItem.month}
                                            </h2>

                                            <div className="overflow-x-scroll border rounded-md p-2">
                                                <table className="table-auto min-w-full border-collapse">
                                                    <thead>
                                                        <tr className="text-xs">
                                                            {columns.map((column, colIndex) => (
                                                                <th
                                                                    key={colIndex}
                                                                    className="px-2 py-2 border-b bg-gray-100 text-left"
                                                                >
                                                                    {column}
                                                                </th>
                                                            ))}
                                                            <th className="px-2 py-2 border-b bg-gray-100 text-left">
                                                                Total Additions
                                                            </th>
                                                            <th className="px-2 py-2 border-b bg-gray-100 text-left">
                                                                Total Deductions
                                                            </th>
                                                            <th className="px-2 py-2 border-b bg-gray-100 text-left">
                                                                Net Payout
                                                            </th>
                                                            {gratuity &&
                                                                <th className="px-2 py-2 border-b bg-gray-100 text-left">
                                                                    Grutuity
                                                                </th>
                                                            }
                                                            <th className="px-2 py-2 border-b bg-gray-100 text-left">
                                                                Status
                                                            </th>
                                                            <th className="px-2 py-2 border-b bg-gray-100 text-left">
                                                                Actions
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr className="text-[14px]">
                                                            <td className="text-left px-2 py-3">
                                                                {showPayrollData
                                                                    ? formatPay(historyItem?.payroll?.basic_salary)
                                                                    : "****"}
                                                            </td>
                                                            <td className="text-left px-2 py-3 text-green-500">
                                                                {showPayrollData
                                                                    ? `+$${historyItem?.payroll?.bonus}`
                                                                    : "****"}
                                                            </td>
                                                            <td className="text-left px-2 py-3 text-darkred">
                                                                {showPayrollData
                                                                    ? `-$${historyItem?.payroll?.penalties}`
                                                                    : "****"}
                                                            </td>
                                                            <td className="text-left px-2 py-3 text-yellow-500">
                                                                {showPayrollData
                                                                    ? `-$${historyItem?.payroll?.loan ? historyItem?.payroll?.loan : "0.00"}`
                                                                    : "****"}
                                                            </td>
                                                            <td className="text-left px-2 py-3 text-yellow-500">
                                                                {showPayrollData
                                                                    ? `-$${historyItem?.payroll?.early_salary ? historyItem?.payroll?.early_salary : "0.00"}`
                                                                    : "****"}
                                                            </td>

                                                            {historyItem?.payroll?.variables &&
                                                                Object.entries(
                                                                    historyItem?.payroll.variables
                                                                ).map(([key, value]) => (
                                                                    <td
                                                                        className={`text-left px-2 py-3 ${getVariableTextClass(value)}`}
                                                                        key={key}
                                                                    >
                                                                        {showPayrollData ? `${value}` : "****"}
                                                                    </td>
                                                                ))}

                                                            <td className="text-left px-2 py-3 text-green-500">
                                                                {showPayrollData
                                                                    ? `+$${historyItem?.payroll?.addition}`
                                                                    : "****"}
                                                            </td>
                                                            <td className="text-left px-2 py-3 text-darkred">
                                                                {showPayrollData
                                                                    ? `-$${historyItem?.payroll?.deduction}`
                                                                    : "****"}
                                                            </td>
                                                            <td className="text-left px-2 py-3 text-primary">
                                                                {showPayrollData
                                                                    ? formatPay(historyItem?.payroll?.net_payout)
                                                                    : "****"}
                                                            </td>
                                                            {gratuity &&
                                                                <td className="text-left px-2 py-3 text-primary">
                                                                    {showPayrollData
                                                                        ? `$${historyItem?.payroll?.monthly_gratuity}`
                                                                        : "****"}
                                                                </td>
                                                            }
                                                            <td className="text-left">
                                                                <span
                                                                    className={`px-2 py-3 text-sm rounded-md m-4 w-12 capitalize ${historyItem?.payroll?.status === "approved"
                                                                        ? "bg-green-100 text-green-500 border-green-400"
                                                                        : "bg-orange-100 text-orange-400 border-orange-300"
                                                                        }`}
                                                                >
                                                                    {showPayrollData
                                                                        ? historyItem?.payroll?.status
                                                                        : "****"}
                                                                </span>
                                                            </td>

                                                            <td className="px-4 py-3 flex justify-center">
                                                                <button
                                                                    className={`py-1 px-4 bg-[#F1ECFF] text-sm flex items-center text-primary border border-primary rounded-lg 
                    ${historyItem?.payroll?.status === "approved"
                                                                            ? "opacity-100 cursor-pointer"
                                                                            : "opacity-50 cursor-not-allowed"
                                                                        }`}
                                                                    onClick={() =>
                                                                        handleSavePayslip(

                                                                            convertMonthToNumber(
                                                                                historyItem?.payroll?.month
                                                                            ),
                                                                            historyItem?.payroll?.year
                                                                        )
                                                                    }
                                                                    disabled={
                                                                        historyItem?.payroll?.status !== "approved"
                                                                    }
                                                                >
                                                                    <DownloadIcon className="h-4 w-4 mr-1" />
                                                                    Save
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="text-center text-gray-500 mt-4">
                                    No payroll history available.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default IndiviualPayrollTable;