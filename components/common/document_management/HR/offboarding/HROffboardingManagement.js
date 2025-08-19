import React, { useState, useMemo } from 'react';
import { FaEye } from 'react-icons/fa';
import { FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';
import HROffboardingDocuments from './HROffboardingDocuments';
import { useOffBoardingUsersList } from '../../../../../hooks/query/offboarding/getOffBoardingUsersList';
import DataLoader from '../../../../ui/dataLoader';

export default function HROffboardingManagement() {
  const [search, setSearch] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'asc'
  });

  const { data: employees = [], isLoading } = useOffBoardingUsersList();

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) return <FaSort className="ml-1 text-gray-400" />;
    return sortConfig.direction === 'asc' 
      ? <FaSortUp className="ml-1 text-primary" /> 
      : <FaSortDown className="ml-1 text-primary" />;
  };

  const filtered = useMemo(() => {
    let filteredData = employees.filter(e => {
      const s = search.toLowerCase();
      const fullName = `${e.user?.fname || ''} ${e.user?.lname || ''}`.toLowerCase();
      return fullName.includes(s) || 
             e.position?.toLowerCase().includes(s) || 
             e.department?.toLowerCase().includes(s);
    });

    if (sortConfig.key) {
      filteredData.sort((a, b) => {
        const aValue = new Date(a[sortConfig.key]);
        const bValue = new Date(b[sortConfig.key]);
        
        if (sortConfig.direction === 'asc') {
          return aValue - bValue;
        }
        return bValue - aValue;
      });
    }

    return filteredData;
  }, [employees, search, sortConfig]);

  if (selectedEmployee) {
    return <HROffboardingDocuments employee={selectedEmployee} onBack={() => setSelectedEmployee(null)} />;
  }

  return (
    <div className="space-y-4 p-4 md:p-6 min-h-screen bg-white">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-xl font-semibold">Pending Off-boarding Documents</h2>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search employees…"
          className="border rounded px-3 py-2 w-full md:w-64"
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <DataLoader />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="max-h-[70vh] overflow-y-auto">
            <table className="min-w-full table-auto border-collapse bg-white">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 sticky top-0">
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Employee</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Position</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Department</th>
                  <th 
                    className="px-4 py-2 text-left text-sm font-medium text-gray-600 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('joining_date')}
                  >
                    <div className="flex items-center">
                      Joining Date
                      {getSortIcon('joining_date')}
                    </div>
                  </th>
                  <th 
                    className="px-4 py-2 text-left text-sm font-medium text-gray-600 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('last_working_day')}
                  >
                    <div className="flex items-center">
                      Last Working Day
                      {getSortIcon('last_working_day')}
                    </div>
                  </th>
                  <th className="px-4 py-2 text-center text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((emp, idx) => (
                  <tr key={emp.id} className={idx !== filtered.length - 1 ? 'border-b border-gray-100' : ''}>
                    <td className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                      {`${emp.user?.fname || ''} ${emp.user?.lname || ''}`}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{emp.position}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">{emp.department}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                      {new Date(emp.joining_date).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500 whitespace-nowrap">
                      {new Date(emp.last_working_day).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => setSelectedEmployee(emp)}
                        className="flex items-center text-primary border border-primary rounded px-2 py-1 text-xs mx-auto"
                      >
                        <FaEye className="mr-1" /> View Documents
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && (
              <div className="text-center py-8 text-gray-500">No matching employees</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}