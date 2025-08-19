import React, { useState } from 'react';
import { BsSearch } from 'react-icons/bs';
import { saveAs } from 'file-saver';
import { utils, write } from 'xlsx';
import { MdFilterList } from 'react-icons/md';
import { PiExport } from "react-icons/pi";
import { UseGetUsers } from '../../../../hooks/query/admin/getUserList';
import DataLoader from '../../../ui/dataLoader';
import { useRouter } from 'next/router';
import useGetActiveUser from '../../../../hooks/query/getUserFromLocalStorage';
import { getStatusClasses } from '../../attendance/AttendanceComponent';

const EmployeeListComponent = ({ searchTerm, handleSearchChange }) => {
  const { data: EmployeeList, isLoading } = UseGetUsers();
  const { data: user } = useGetActiveUser()
  const router = useRouter()

  const [filters, setFilters] = useState({
    status: {
      present: false,
      absent: false,
      leave: false
    },

  });

  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

  const handleStatusChange = (statusType, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      status: {
        ...prevFilters.status,
        [statusType]: value
      }
    }));
  };

  const filteredEmployees = EmployeeList?.filter((employee) => {
    const matchesSearchTerm = (
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.team?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.position?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.location?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department?.departments_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee?.todayAttendenceStatus?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (employee?.attendance_percentage + '%').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (employee.leave_counts?.pending_items || '').toString().toLowerCase().includes(searchTerm.toLowerCase())
    );

    const matchesStatus = (
      (filters.status.present && employee.todayAttendenceStatus === 'Present') ||
      (filters.status.absent && employee.todayAttendenceStatus === 'Absent') ||
      (filters.status.leave && employee.todayAttendenceStatus === 'Leave')
    );

    return matchesSearchTerm && (matchesStatus || !filters.status.present && !filters.status.absent && !filters.status.leave);
  });

  const sortedEmployees = filteredEmployees?.sort((a, b) => a.name.localeCompare(b.name));

  const handleExportCSV = () => {
    const exportData = sortedEmployees.map((employee) => ({
      Team: employee.team,
      Name: employee.name,
      Attendance: `${employee.attendance_percentage}%`,
      Role: employee.role,
      Position: employee.position?.name,
      Location: employee.location?.name,
      Status: employee.todayAttendenceStatus
    }));

    const worksheet = utils.json_to_sheet(exportData);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const buffer = write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    saveAs(blob, 'Employee.csv');
  };

  return (
    <div className="overflow-x-auto min-h-screen rounded-lg">
      {isLoading ? (
        <DataLoader />
      ) : (
        EmployeeList && (
          <>
            <div className="flex flex-wrap justify-between items-center gap-4 pb-3">
              <div className="flex-grow md:flex md:items-center md:w-auto">
                <div className="relative w-full">
                  <BsSearch className="absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search By Any Column"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="pl-10 pr-3 py-2 w-full focus:outline-none border rounded-lg"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2 items-center">
                <div className="relative">
                  <button
                    onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                    className="py-2 px-4 border rounded-lg flex items-center gap-2 text-sm whitespace-nowrap"
                  >
                    <MdFilterList />
                    <span>Filter</span>
                  </button>
                  {isFilterDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg p-4 z-50">
                      <div className="mb-2">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={filters.status.present && filters.status.absent && filters.status.leave}
                            onChange={(e) => {
                              const value = e.target.checked;
                              setFilters((prevFilters) => ({
                                ...prevFilters,
                                status: {
                                  present: value,
                                  absent: value,
                                  leave: value
                                }
                              }));
                            }}
                          />
                          <span className="ml-2">Status</span>
                        </label>
                        <div className="ml-4">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={filters.status.present}
                              onChange={(e) => handleStatusChange('present', e.target.checked)}
                            />
                            <span className="ml-2">Only Present</span>
                          </label>
                          <label className="flex items-center mt-1">
                            <input
                              type="checkbox"
                              checked={filters.status.absent}
                              onChange={(e) => handleStatusChange('absent', e.target.checked)}
                            />
                            <span className="ml-2">Only Absent</span>
                          </label>
                          <label className="flex items-center mt-1">
                            <input
                              type="checkbox"
                              checked={filters.status.leave}
                              onChange={(e) => handleStatusChange('leave', e.target.checked)}
                            />
                            <span className="ml-2">Only Leave</span>
                          </label>
                        </div>
                      </div>

                    </div>
                  )}
                </div>
                {sortedEmployees.length > 0 && (
                  <button
                    onClick={handleExportCSV}
                    className="py-2 px-4 border rounded-lg flex items-center gap-2 text-sm whitespace-nowrap"
                  >
                    <PiExport />
                    <span>Export CSV</span>
                  </button>
                )}
              </div>
            </div>
            <div className="overflow-x-auto border rounded-lg overflow-y-auto min-h-screen">
              <table className="min-w-full border-collapse bg-white table-auto">
                <thead className="bg-gray-100 sticky top-0 z-20">
                  <tr className="bg-gray-100 rounded-xl text-left">
                    <th className="px-2 py-2 border-b text-left text-default_text text-sm">Name</th>
                    <th className="px-2 py-2 border-b text-left text-default_text text-sm">Email</th>
                    <th className="px-2 py-2 border-b text-left text-default_text text-sm">Attendance</th>
                    <th className="px-2 py-2 border-b text-left text-default_text text-sm">Department</th>
                    <th className="px-2 py-2 border-b text-left text-default_text text-sm">Role</th>
                    <th className="px-2 py-2 border-b text-left text-default_text text-sm">Position</th>
                    <th className="px-2 py-2 border-b text-left text-default_text text-sm">Team</th>
                    <th className="px-2 py-2 border-b text-left text-default_text text-sm">Location</th>
                    <th className="px-2 py-2 border-b text-left text-default_text text-sm">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedEmployees.map((employee) => (
                    <tr key={employee.id} className='hover:bg-slate-100 cursor-pointer'
                     onClick={() =>
                      router.push(
                        `/workforce/people/${employee.id}/detail-page`
                      )
                    }>
                      <td className="px-2 py-2 border-b text-left text-sm capitalize">{employee.name}</td>
                      <td className="px-2 py-2 border-b text-sm break-all">
                        {employee.email}
                        {/* <div className="bg-primary rounded-full px-2 flex justify-center text-center w-5 text-white">
                          {employee?.leave_counts.pending_items}
                        </div> */}
                      </td>
                      <td className="px-2 py-2 border-b text-left text-sm capitalize">
                        <div
                          className={`border rounded-lg px-2 py-1 w-14 capitalize text-center ${employee?.attendance_percentage >= 90
                            ? 'border-green-300 text-green-400 bg-[#E6FAF0]'
                            : employee?.attendance_percentage <= 75
                              ? 'border-red-300 text-red-400 bg-[#FDE8E8]'
                              : 'border-yellow-400 text-yellow-500 bg-[#FBF5E8]'
                            }`}
                        >
                          {employee?.attendance_percentage}%
                        </div>
                      </td>
                      <td className="px-2 py-2 border-b text-left text-sm capitalize">{employee?.department?.departments_name}</td>
                      <td className="px-2 py-2 border-b text-left text-sm capitalize">{employee?.role === "team_lead" ? employee?.role.replace('_', " ") : employee?.role}</td>
                      <td className="px-2 py-2 border-b text-left text-sm capitalize">{employee?.position?.name}</td>
                      <td className="px-2 py-2 border-b text-left text-sm capitalize">{employee?.team_obj?.team_name}</td>
                      <td className="px-2 py-2 border-b text-left text-sm w-40 capitalize">{employee?.location?.name}</td>
                      <td className=" py-2 pr-2 border-b text-left text-sm capitalize">
                      <span
                        className={`py-2 rounded-md capitalize ${getStatusClasses(employee.todayAttendenceStatus)
                          }`}
                      >
                        {employee.todayAttendenceStatus}
                      </span>
                     
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )
      )}
      {EmployeeList?.length === 0 && (
        <div className="flex justify-center my-24 min-h-screen">No Data</div>
      )}
    </div>
  );
};

export default EmployeeListComponent;
