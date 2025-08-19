import React, { useState, useEffect, useRef } from 'react';
import { BsSearch } from 'react-icons/bs';
import { MdFilterList } from 'react-icons/md';
import { PiExport } from "react-icons/pi";
import { useRouter } from 'next/router';
import { DownloadIcon, TrashIcon } from 'lucide-react';
import Image from 'next/image';
import { LiaFileExcel, LiaFilePdf } from 'react-icons/lia';
import EditPayrollModal from './EditPayrollModal';
import { useGetOverallPayslip } from '../../../hooks/query/payroll/getOverallPayslip';
import { handleExportCSV } from '../../../utils/functions';
import UseDeletePayroll from '../../../hooks/mutations/finances/payroll/deletePayroll';
import { useGetOverallPayslipCSV } from '../../../hooks/query/payroll/getOverallPayslipCsv';

export default function PayrollHistoryTable({
  data,
  height,
  title,
  isTableDisabled,
  id

}) {

  const [searchTerm, setSearchTerm] = useState('');
  const [isOpenEditPayroll, setIsOpenEditPayroll] = useState(false);
  const [selectedPayrollData, setSelectedPayrollData] = useState(null);
  const [payslipParams, setPayslipParams] = useState(null);
  const [csvPayslipParams, setCsvPayslipParams] = useState(null);
  const [sortOrder, setSortOrder] = useState('asc');

  const { data: overallPayslipData } = useGetOverallPayslip(payslipParams);
  const { data: overallPayslipExcel } = useGetOverallPayslipCSV(csvPayslipParams);
  const deletePayroll = UseDeletePayroll();

  // Normalize data array
  const normalizedData = Array.isArray(data) && data.length > 0 ? data.flat() : [];

  // Filtering for overview mode: search on status and month.
  const filteredData = normalizedData.filter((item) => {
    const term = searchTerm.trim().toLowerCase();
    return (
      item.status.toLowerCase().includes(term) ||
      item.month.toLowerCase().includes(term)
    );
  }).sort((a, b) => {
    if (sortOrder === 'asc') {
      return parseFloat(a.basic_salary) - parseFloat(b.basic_salary);
    } else {
      return parseFloat(b.basic_salary) - parseFloat(a.basic_salary);
    }
  });

  const handleSortBySalary = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const formatPay = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // For overview, we only need month and year parameters
  const handleSavePayslip = (month, year) => {
    setPayslipParams({ month, year });
  };

  const handleSavePayslipCsv = (month, year) => {
    setCsvPayslipParams({ month, year });
  };

  const handleDeletePayroll = () => {
    deletePayroll.mutate(id);
  };

  useEffect(() => {
    if (overallPayslipData) {
      const url = window.URL.createObjectURL(overallPayslipData);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Overall_Payslip_${payslipParams.month}_${payslipParams.year}.pdf`);
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      setPayslipParams(null);
    }
  }, [overallPayslipData]);

  useEffect(() => {
    if (overallPayslipExcel) {
      const blob = new Blob([overallPayslipExcel], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Overall_Payslip_${csvPayslipParams.month}_${csvPayslipParams.year}.xlsx`);
      document.body.appendChild(link);
      link.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      setCsvPayslipParams(null);
    }
  }, [overallPayslipExcel]);

  return (
    <div>
      {/* Search and Filter */}
      <div className="flex flex-wrap justify-between items-center gap-4 pb-3">
        <div className="relative w-full md:w-auto text-sm">
          <BsSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="pl-10 pr-3 py-2 focus:outline-none border rounded-xl w-full"
          />
        </div>
        <div className="flex gap-2 items-center">
          <button
            onClick={() => handleExportCSV('overview', filteredData)}
            className="py-2 px-4 border rounded-xl flex items-center gap-2 text-sm whitespace-nowrap w-full"
          >
            <PiExport />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className={`border rounded-xl overflow-y-auto relative ${isTableDisabled ? 'opacity-50' : ''}`} style={{ height }}>
        {isOpenEditPayroll && (
          <EditPayrollModal data={selectedPayrollData} onClose={() => setIsOpenEditPayroll(false)} />
        )}
        <div className="flex justify-between items-center sticky top-0 bg-white z-20 p-2">
          <h1 className="text-lg font-light mb-2 mt-1 capitalize">{title}</h1>
        </div>
        <table className="w-full table-auto border-collapse">
          <thead className="border-b bg-white sticky top-[3rem] z-10">
            <tr className="border-gray-200 border-b">
              <th className="text-center px-4 py-3">Month</th>
              <th className="text-center px-4 py-3">Payroll Amount</th>
              <th className="text-center px-4 py-3">Status</th>
              <th className="text-center px-4 py-3">Payslip</th>
              <th className="text-center px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className={`${isTableDisabled ? 'pointer-events-none' : ''}`}>
            {filteredData?.length > 0 ? (
              filteredData.map(dataItem => {
                // Destructure the date to extract day, month, and year
                const [day, month, year] = dataItem?.date.split("-");
                const monthNames = [
                  "January", "February", "March", "April", "May", "June",
                  "July", "August", "September", "October", "November", "December"
                ];
                const monthName = monthNames[parseInt(month) - 1];

                return (
                  <tr key={dataItem.date} className="border-b">
                    <td className="text-center px-4 py-3">{monthName}</td>
                    <td className="text-center px-4 py-3 font-semibold">
                      {formatPay(dataItem.total_amount)}
                    </td>
                    <td className="text-center px-4 py-3">
                      <span className={`px-4 py-3 text-sm rounded-md m-4 w-12 capitalize ${dataItem.status === 'approved' ? 'bg-green-100 text-green-500 border-green-400' : 'bg-orange-100 text-orange-400 border-orange-300'}`}>
                        {dataItem.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 flex space-x-3 justify-center">
                      <button
                        onClick={() => handleSavePayslip(month, year)}
                        className={`p-2 flex items-center text-darkred border bg-white rounded-lg ${dataItem.status !== 'approved' ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={dataItem.status !== 'approved'}
                      >
                        Download PDF <LiaFilePdf className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleSavePayslipCsv(month, year)}
                        className={`p-2 bg-white border text-green-500 flex items-center rounded-lg ${dataItem.status !== 'approved' ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={dataItem.status !== 'approved'}
                      >
                        Download CSV <LiaFileExcel className="h-5 w-5" />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleDeletePayroll(dataItem.id)}
                        className={`p-2 bg-white border text-red-500 flex items-center rounded-lg `}
                        disabled={dataItem.status !== 'approved'}
                      >
                        Delete Payroll <TrashIcon className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-4 text-gray-500">
                  No payouts found!
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
}
