import React, { useState, useEffect } from 'react';
import Layout from "../../components/layout/layout";
import { 
  UsersIcon, 
  MagnifyingGlassIcon, 
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CogIcon,
  DocumentTextIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { BuildingOfficeIcon } from '@heroicons/react/24/solid';
import { useRouter } from 'next/router';

const EmployeeManagement = () => {
  const [userRole, setUserRole] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
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
      manager: "Sarah Johnson",
      policies: ["Standard Time Off", "Overtime Policy A"]
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
      manager: "David Wilson",
      policies: ["Flexible Time Off", "Management Pay"]
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
      manager: "Lisa Brown",
      policies: ["Standard Time Off", "Commission Pay"]
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
      manager: "Emma Davis",
      policies: ["Flexible Time Off", "Standard Pay"]
    }
  ];
  const [employees, setEmployees] = useState(defaultEmployees);
  const router = useRouter();

  const departments = ["Engineering", "Human Resources", "Sales", "Marketing", "Finance", "Operations"];
  const employmentTypes = ["Full-Time", "Part-Time", "Contract", "Temporary", "Apprentice"];
  const workLocations = ["London", "Manchester", "Birmingham", "Leeds", "Edinburgh"];
  const statuses = ["Active", "On Leave", "Suspended", "Terminated", "Retired"];

  // Load from localStorage or initialize
  useEffect(() => {
    const role = localStorage.getItem('role');
    setUserRole(role);
    let stored = localStorage.getItem(LOCAL_KEY);
    let parsed = defaultEmployees;
    if (stored) {
      try {
        parsed = JSON.parse(stored);
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
    employee.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase())
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
    <Layout title={'Employee Management'} subtitle={'Full CRUD operations for all employee data'}>
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
              <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                <BuildingOfficeIcon className="h-5 w-5 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Departments</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(employees.map(emp => emp.department)).size}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
                <CogIcon className="h-5 w-5 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Config Changes</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
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
                    placeholder="Search employees by name, job title, department, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#009D9D]"
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <select className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>All Departments</option>
                  {departments.map(dept => (
                    <option key={dept}>{dept}</option>
                  ))}
                </select>
                <select className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>All Status</option>
                  {statuses.map(status => (
                    <option key={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex space-x-2">
              {userRole === 'business_manager' && (
                <>
                                      <button
                      onClick={handleAddEmployee}
                      className="bg-[#009D9D] text-white px-4 py-2 rounded-md hover:bg-[#007a7a] focus:ring-2 focus:ring-[#009D9D] focus:ring-offset-1 flex items-center"
                    >
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Add Employee
                    </button>
                  {selectedEmployees.length > 0 && (
                    <button
                      onClick={() => setShowBulkModal(true)}
                      className="bg-[#009D9D] text-white px-4 py-2 rounded-md hover:bg-[#007a7a]"
                    >
                      Bulk Update ({selectedEmployees.length})
                    </button>
                  )}
                </>
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
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">Salary</th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">Actions</th>
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
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">{employee.salary}</td>
                    <td className="px-3 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-1">
                        {userRole === 'business_manager' && (
                          <>
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
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Add Employee Modal */}

        {/* Edit Employee Modal */}

        {/* Delete Confirmation Modal */}
        {userRole === 'business_manager' && showDeleteModal && deletingEmployee && (
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

        {/* Bulk Update Modal */}
        {userRole === 'business_manager' && showBulkModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-xl w-96 max-w-md mx-4">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Bulk Update ({selectedEmployees.length} employees)</h3>
              </div>
              <div className="p-6">
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Apply Policy</label>
                    <select className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
                      <option>Select Policy</option>
                      <option>Standard Time Off</option>
                      <option>Flexible Working</option>
                      <option>Overtime Policy A</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Update Status</label>
                    <select className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
                      <option>No Change</option>
                      {statuses.map(status => (
                        <option key={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Update Department</label>
                    <select className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
                      <option>No Change</option>
                      {departments.map(dept => (
                        <option key={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowBulkModal(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Apply to {selectedEmployees.length} Employees
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default EmployeeManagement; 