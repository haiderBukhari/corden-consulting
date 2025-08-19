import React, { useState, useMemo } from 'react';

import { BsSearch } from "react-icons/bs"
import { PiExport } from "react-icons/pi"

const EmployeeAcknowledgments = ({ acknowledgedEmployees = [], pendingEmployees = [] }) => {

  const [activeTab, setActiveTab] = useState('acknowledged');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEmployees = useMemo(() => {
    const employees = activeTab === 'acknowledged' ? acknowledgedEmployees : pendingEmployees;
  
    return employees.filter(emp =>
      Object.values(emp).some(value =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      ) ||
      Object.values(emp.user || {}).some(value =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [acknowledgedEmployees, pendingEmployees, activeTab, searchTerm]);
  
  const exportData = filteredEmployees.map(emp => ({
    ...emp,
    acknowledgmentDate: emp.acknowledgmentDate
      ? new Date(emp.acknowledgmentDate).toLocaleDateString()
      : 'Not Acknowledged',
    acknowledged: emp.acknowledged ? 'Acknowledged' : 'Pending',
  }));
  const handleExportCSV = () => {
    const headers = " Employee Name,Employee Email,Acknowledgment Date,Acknowledgment Time,Acknowledgment Status\n";
    const rows = filteredEmployees.map(emp =>
      `${emp.user?.fname + " " + emp.user?.middle_name + " " + emp.user?.lname},${emp.user?.email},${emp.acknowledgmentDate},${emp.acknowledgedTime},${emp.acknowledgement_status}`
    ).join("\n");

    const csvContent = "data:text/csv;charset=utf-8," + headers + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "employee_acknowledgments.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="space-y-6 p-4 bg-white rounded shadow">
      {/* Tabs */}
      <div className="flex space-x-4">
        <button
          onClick={() => setActiveTab('acknowledged')}
          className={`px-4 py-2 rounded-md ${activeTab === 'acknowledged'
              ? 'bg-[#009D9D] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
        >
          Acknowledged ({acknowledgedEmployees.length})
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 rounded-md ${activeTab === 'pending'
              ? 'bg-[#009D9D] text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
        >
          Pending ({pendingEmployees.length})
        </button>
      </div>

      <div className="flex flex-wrap justify-between items-center gap-4 p-3">
        <div className="flex-grow md:flex md:items-center md:w-auto">
          <div className="relative w-full">
            <BsSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text_default_text" />
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
                           className="pl-10 pr-3 py-2 w-full focus:outline-none border rounded-lg"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 items-center">

          <button onClick={handleExportCSV} className="py-2 px-4 border rounded-xl flex items-center gap-2 text-sm whitespace-nowrap">
            <PiExport />
            <span>Export CSV</span>
          </button>
        </div>
      </div>


      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2 border">Employee Name</th>
              <th className="p-2 border">Employee Email</th>
              {
                activeTab === 'acknowledged' && (
                  <>
                    <th className="p-2 border">Acknowledgment Date</th>
                    <th className="p-2 border">Acknowledge Time</th>
                   
                  </>
                )
              }
               <th className="p-2 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((emp, index) => (
              <tr key={index} className="border-t">
                <td className="p-2 border">{emp.user?.fname + " " + emp.user?.middle_name + " " + emp.user?.lname}</td>
                <td className="p-2 border">{emp.user?.email}</td>
                {
                  activeTab === 'acknowledged' && (
                    <>
                      <td className="p-2 border">
                        {emp.acknowledged_at
                          ? new Date(emp.acknowledged_at).toLocaleDateString()
                          : 'Not Acknowledged'}
                </td>
                <td className="p-2 border">
                  {emp.acknowledged_at
                    ? new Date(emp.acknowledged_at).toLocaleTimeString()
                    : 'Not Acknowledged'}
                  </td>
                  </>
                )
              }
                <td className="p-2 border">
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${emp.acknowledgement_status === "Acknowledged"
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                      }`}
                  >
                    {emp.acknowledgement_status === "Acknowledged" ? 'Acknowledged' : 'Pending'}
                  </span>
                </td>
              </tr>
            ))}
            {filteredEmployees.length === 0 && (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  No employees found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmployeeAcknowledgments;
