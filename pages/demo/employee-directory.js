import React, { useState, useEffect } from 'react';
import Layout from "../../components/layout/layout";
import { UsersIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const EmployeeDirectory = () => {
  const [userRole, setUserRole] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Dummy data
  const dummyData = {
    employees: [
      {
        id: 1,
        name: "John Smith",
        jobTitle: "Software Engineer",
        employmentType: "Full-Time",
        workLocation: "London",
        status: "Active",
        hireDate: "2023-01-15",
        salary: "£45,000",
        department: "Engineering",
        email: "john.smith@company.com",
        phone: "+44 123 456 7890"
      },
      {
        id: 2,
        name: "Sarah Johnson",
        jobTitle: "HR Manager",
        employmentType: "Full-Time",
        workLocation: "Manchester",
        status: "Active",
        hireDate: "2022-08-20",
        salary: "£55,000",
        department: "Human Resources",
        email: "sarah.johnson@company.com",
        phone: "+44 123 456 7891"
      },
      {
        id: 3,
        name: "Mike Wilson",
        jobTitle: "Sales Representative",
        employmentType: "Part-Time",
        workLocation: "Birmingham",
        status: "On Leave",
        hireDate: "2023-03-10",
        salary: "£30,000",
        department: "Sales",
        email: "mike.wilson@company.com",
        phone: "+44 123 456 7892"
      },
      {
        id: 4,
        name: "Lisa Brown",
        jobTitle: "Marketing Specialist",
        employmentType: "Contract",
        workLocation: "London",
        status: "Active",
        hireDate: "2023-06-05",
        salary: "£40,000",
        department: "Marketing",
        email: "lisa.brown@company.com",
        phone: "+44 123 456 7893"
      },
      {
        id: 5,
        name: "David Lee",
        jobTitle: "Product Manager",
        employmentType: "Full-Time",
        workLocation: "Edinburgh",
        status: "Active",
        hireDate: "2023-02-14",
        salary: "£60,000",
        department: "Product",
        email: "david.lee@company.com",
        phone: "+44 123 456 7894"
      },
      {
        id: 6,
        name: "Emma Davis",
        jobTitle: "UX Designer",
        employmentType: "Full-Time",
        workLocation: "Bristol",
        status: "Active",
        hireDate: "2023-04-22",
        salary: "£50,000",
        department: "Design",
        email: "emma.davis@company.com",
        phone: "+44 123 456 7895"
      }
    ]
  };

  useEffect(() => {
    const role = localStorage.getItem('role');
    setUserRole(role);
  }, []);

  const filteredEmployees = dummyData.employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout title={'Employee Directory'} subtitle={'Search and view employee information'}>
      <div className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <UsersIcon className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Employees</p>
                <p className="text-2xl font-bold text-gray-900">{dummyData.employees.length}</p>
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
                  {dummyData.employees.filter(emp => emp.status === 'Active').length}
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
                  {dummyData.employees.filter(emp => emp.status === 'On Leave').length}
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
                  {new Set(dummyData.employees.map(emp => emp.department)).size}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search employees by name, job title, or department..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#009D9D]"
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
                <option>Product</option>
                <option>Design</option>
              </select>
              <select className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>All Status</option>
                <option>Active</option>
                <option>On Leave</option>
                <option>Terminated</option>
              </select>
            </div>
          </div>
        </div>

        {/* Employee Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hire Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEmployees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-[#009D9D] flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {employee.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-[#009D9D]">{employee.name}</div>
                          <div className="text-sm text-gray-500">{employee.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.jobTitle}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        employee.status === 'Active' ? 'bg-[#E6F7F7] text-[#006D6D]' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {employee.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.hireDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => {
                          localStorage.setItem('selectedEmployeeId', employee.id);
                          window.location.href = `/demo/employee-profile?id=${employee.id}`;
                        }}
                        className="text-[#009D9D] hover:text-[#006D6D] mr-3"
                      >
                        View Profile
                      </button>
                      {userRole === 'hr_manager' || userRole === 'business_manager' && (
                        <button className="text-[#009D9D] hover:text-[#006D6D]">Edit</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </Layout>
  );
};

export default EmployeeDirectory; 