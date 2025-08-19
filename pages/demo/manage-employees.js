import React, { useState, useEffect } from 'react';
import Layout from "../../components/layout/layout";
import { 
  UsersIcon, 
  MagnifyingGlassIcon, 
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';

const ManageEmployees = () => {
  const [userRole, setUserRole] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingEmployee, setDeletingEmployee] = useState(null);
  const LOCAL_KEY = 'employeeData';
  const defaultEmployees = [
    {
      id: 1,
      name: "John Smith",
      jobTitle: "Software Engineer",
      department: "Engineering",
      status: "Active",
      hireDate: "2023-01-15",
      email: "john.smith@company.com",
      phone: "+44 123 456 7890",
      salary: "£45,000",
      employmentType: "Full-Time",
      workLocation: "London",
      currentStatus: "Active",
      lastStatusChange: "2023-01-15",
      statusReason: "Hired",
      history: [
        {
          id: 1,
          date: "2023-01-15",
          status: "Active",
          reason: "Hired",
          notes: "Initial hire as Software Engineer"
        }
      ]
    },
    {
      id: 2,
      name: "Sarah Johnson",
      jobTitle: "HR Manager",
      department: "Human Resources",
      status: "Active",
      hireDate: "2022-08-20",
      email: "sarah.johnson@company.com",
      phone: "+44 123 456 7891",
      salary: "£55,000",
      employmentType: "Full-Time",
      workLocation: "Manchester",
      currentStatus: "Active",
      lastStatusChange: "2023-03-15",
      statusReason: "Promotion",
      history: [
        {
          id: 1,
          date: "2022-08-20",
          status: "Active",
          reason: "Hired",
          notes: "Initial hire as HR Specialist"
        },
        {
          id: 2,
          date: "2023-03-15",
          status: "Active",
          reason: "Promotion",
          notes: "Promoted to HR Manager"
        }
      ]
    },
    {
      id: 3,
      name: "Mike Wilson",
      jobTitle: "Sales Representative",
      department: "Sales",
      status: "On Leave",
      hireDate: "2023-03-10",
      email: "mike.wilson@company.com",
      phone: "+44 123 456 7892",
      salary: "£30,000",
      employmentType: "Part-Time",
      workLocation: "Birmingham",
      currentStatus: "On Leave",
      lastStatusChange: "2023-12-01",
      statusReason: "Annual Leave",
      history: [
        {
          id: 1,
          date: "2023-03-10",
          status: "Active",
          reason: "Hired",
          notes: "Initial hire as Sales Representative"
        },
        {
          id: 2,
          date: "2023-12-01",
          status: "On Leave",
          reason: "Annual Leave",
          notes: "Taking annual leave for 2 weeks"
        }
      ]
    },
    {
      id: 4,
      name: "Lisa Brown",
      jobTitle: "Marketing Specialist",
      department: "Marketing",
      status: "Active",
      hireDate: "2023-06-05",
      email: "lisa.brown@company.com",
      phone: "+44 123 456 7893",
      salary: "£40,000",
      employmentType: "Contract",
      workLocation: "London",
      currentStatus: "Active",
      lastStatusChange: "2023-06-05",
      statusReason: "Hired",
      history: [
        {
          id: 1,
          date: "2023-06-05",
          status: "Active",
          reason: "Hired",
          notes: "Initial hire as Marketing Specialist"
        }
      ]
    }
  ];
  const [employees, setEmployees] = useState(defaultEmployees);
  const router = useRouter();

  // Load from localStorage or initialize
  useEffect(() => {
    const role = localStorage.getItem('role');
    setUserRole(role);
    let stored = localStorage.getItem(LOCAL_KEY);
    let parsed = defaultEmployees;
    if (stored) {
      try {
        parsed = JSON.parse(stored);
        // Patch missing status/history fields for legacy data
        parsed = parsed.map(e => ({
          ...e,
          currentStatus: e.currentStatus || e.status || 'Active',
          lastStatusChange: e.lastStatusChange || e.hireDate || '',
          statusReason: e.statusReason || '',
          history: Array.isArray(e.history) ? e.history : [
            {
              id: 1,
              date: e.hireDate || '',
              status: e.status || 'Active',
              reason: e.statusReason || 'Hired',
              notes: 'Initial record'
            }
          ]
        }));
      } catch {}
    } else {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(defaultEmployees));
    }
    setEmployees(parsed);
  }, []);

  // Helper to update localStorage and state
  const updateEmployees = (newEmployees) => {
    setEmployees(newEmployees);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(newEmployees));
  };

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectEmployee = (employeeId) => {
    if (selectedEmployees.includes(employeeId)) {
      setSelectedEmployees(selectedEmployees.filter(id => id !== employeeId));
    } else {
      setSelectedEmployees([...selectedEmployees, employeeId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedEmployees.length === filteredEmployees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(filteredEmployees.map(emp => emp.id));
    }
  };

  const handleEditEmployee = (employee) => {
    router.push(`/demo/employee-form?mode=edit&id=${employee.id}`);
  };

  const handleDeleteEmployee = (employee) => {
    setDeletingEmployee(employee);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    const newEmployees = employees.filter(emp => emp.id !== deletingEmployee.id);
    updateEmployees(newEmployees);
    setShowDeleteModal(false);
    setDeletingEmployee(null);
  };

  const handleAddEmployee = () => {
    router.push('/demo/employee-form?mode=create');
  };

  return (
    <Layout title={'Manage Employees'} subtitle={'Add, edit, and manage employee records'}>
      <div className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <UsersIcon className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Employees</p>
                <p className="text-2xl font-bold text-gray-900">{employees.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <UsersIcon className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Employees</p>
                <p className="text-2xl font-bold text-gray-900">
                  {employees.filter(emp => emp.status === 'Active').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <UsersIcon className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">On Leave</p>
                <p className="text-2xl font-bold text-gray-900">
                  {employees.filter(emp => emp.status === 'On Leave').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                <UsersIcon className="h-5 w-5 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Departments</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(employees.map(emp => emp.department)).size}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search employees by name, job title, or department..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <select className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>All Departments</option>
                  <option>Engineering</option>
                  <option>Human Resources</option>
                  <option>Sales</option>
                  <option>Marketing</option>
                </select>
                <select className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>All Status</option>
                  <option>Active</option>
                  <option>On Leave</option>
                  <option>Terminated</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-2">
              {/* Only HR Manager and Business Config Manager can add or bulk update */}
              {(userRole === 'hr_manager' || userRole === 'business_manager') && (
                <button
                  onClick={handleAddEmployee}
                  className="bg-[#009D9D] text-white px-4 py-2 rounded-md hover:bg-[#007a7a] flex items-center"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Employee
                </button>
              )}
              {(userRole === 'hr_manager' || userRole === 'business_manager') && selectedEmployees.length > 0 && (
                <button
                  onClick={() => setShowBulkModal(true)}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  Bulk Update ({selectedEmployees.length})
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Employee Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-8">
                    <input
                      type="checkbox"
                      checked={selectedEmployees.length === filteredEmployees.length && filteredEmployees.length > 0}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">Employee</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Job Title</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-32">Department</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Status</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Hire Date</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Salary</th>
                  {userRole === 'business_manager' && (
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-3 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedEmployees.includes(employee.id)}
                        onChange={() => handleSelectEmployee(employee.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-[#009D9D] flex items-center justify-center">
                          <span className="text-white font-medium text-xs">
                            {employee.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900 truncate cursor-pointer hover:underline" onClick={() => router.push(`/demo/employee-profile?id=${employee.id}`)}>{employee.name}</div>
                          <div className="text-xs text-gray-500 truncate">{employee.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 truncate">{employee.jobTitle}</td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900 truncate">{employee.department}</td>
                    <td className="px-3 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        employee.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {employee.status}
                      </span>
                    </td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">{employee.hireDate}</td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">{employee.salary}</td>
                    {userRole === 'business_manager' && (
                      <td className="px-3 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-1">
                          <button 
                            onClick={() => handleEditEmployee(employee)}
                            className="text-[#009D9D] hover:text-[#006D6D]"
                            title="Edit"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteEmployee(employee)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Delete Confirmation Modal: Only HR Manager and Business Config Manager */}
        {(userRole === 'hr_manager' || userRole === 'business_manager') && showDeleteModal && deletingEmployee && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-xl w-96 max-w-md mx-4">
              <div className="p-6 text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <TrashIcon className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Employee</h3>
                <div className="mb-6">
                  <p className="text-sm text-gray-600">
                    Are you sure you want to delete <strong>{deletingEmployee.name}</strong>?
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    This action cannot be undone.
                  </p>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Delete Employee
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ManageEmployees; 