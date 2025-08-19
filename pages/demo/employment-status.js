import React, { useState, useEffect } from 'react';
import Layout from "../../components/layout/layout";
import { UserGroupIcon, CheckCircleIcon, ClockIcon, XCircleIcon } from '@heroicons/react/24/outline';

const EmploymentStatus = () => {
  const [userRole, setUserRole] = useState('');

  // Dummy data
  const dummyData = {
    employees: [
      {
        id: 1,
        name: "John Smith",
        jobTitle: "Software Engineer",
        status: "Active",
        hireDate: "2023-01-15",
        lastStatusChange: "2023-01-15",
        statusReason: "Hired",
        department: "Engineering"
      },
      {
        id: 2,
        name: "Sarah Johnson",
        jobTitle: "HR Manager",
        status: "Active",
        hireDate: "2022-08-20",
        lastStatusChange: "2022-08-20",
        statusReason: "Hired",
        department: "Human Resources"
      },
      {
        id: 3,
        name: "Mike Wilson",
        jobTitle: "Sales Representative",
        status: "On Leave",
        hireDate: "2023-03-10",
        lastStatusChange: "2023-12-01",
        statusReason: "Annual Leave",
        department: "Sales"
      },
      {
        id: 4,
        name: "Lisa Brown",
        jobTitle: "Marketing Specialist",
        status: "Active",
        hireDate: "2023-06-05",
        lastStatusChange: "2023-06-05",
        statusReason: "Hired",
        department: "Marketing"
      },
      {
        id: 5,
        name: "David Lee",
        jobTitle: "Product Manager",
        status: "Active",
        hireDate: "2023-02-14",
        lastStatusChange: "2023-02-14",
        statusReason: "Hired",
        department: "Product"
      },
      {
        id: 6,
        name: "Emma Davis",
        jobTitle: "UX Designer",
        status: "Terminated",
        hireDate: "2023-04-22",
        lastStatusChange: "2023-11-15",
        statusReason: "Resigned",
        department: "Design"
      }
    ]
  };

  useEffect(() => {
    const role = localStorage.getItem('role');
    setUserRole(role);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'On Leave':
        return 'bg-yellow-100 text-yellow-800';
      case 'Terminated':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Active':
        return <CheckCircleIcon className="h-5 w-5 text-green-600" />;
      case 'On Leave':
        return <ClockIcon className="h-5 w-5 text-yellow-600" />;
      case 'Terminated':
        return <XCircleIcon className="h-5 w-5 text-red-600" />;
      default:
        return <UserGroupIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const statusCounts = {
    Active: dummyData.employees.filter(emp => emp.status === 'Active').length,
    'On Leave': dummyData.employees.filter(emp => emp.status === 'On Leave').length,
    Terminated: dummyData.employees.filter(emp => emp.status === 'Terminated').length
  };

  return (
    <Layout title={'Employment Status'} subtitle={'View employee employment status'}>
      <div className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <UserGroupIcon className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Employees</p>
                <p className="text-2xl font-bold text-gray-900">{dummyData.employees.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <CheckCircleIcon className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Employees</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.Active}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <ClockIcon className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">On Leave</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts['On Leave']}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <XCircleIcon className="h-8 w-8 text-red-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Terminated</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.Terminated}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Employment Status Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Employee Employment Status</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hire Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Status Change</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status Reason</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dummyData.employees.map((employee) => (
                  <tr key={employee.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-[#009D9D] flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {employee.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                          <div className="text-sm text-gray-500">{employee.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.jobTitle}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(employee.status)}
                        <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(employee.status)}`}>
                          {employee.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.hireDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.lastStatusChange}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.statusReason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Status Distribution</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-sm text-gray-600">Active</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{statusCounts.Active} employees</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <ClockIcon className="h-5 w-5 text-yellow-600 mr-2" />
                    <span className="text-sm text-gray-600">On Leave</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{statusCounts['On Leave']} employees</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <XCircleIcon className="h-5 w-5 text-red-600 mr-2" />
                    <span className="text-sm text-gray-600">Terminated</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{statusCounts.Terminated} employees</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Recent Status Changes</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="border-l-4 border-yellow-400 pl-4">
                  <div className="text-sm font-medium text-gray-900">Mike Wilson</div>
                  <div className="text-sm text-gray-600">Status changed to On Leave</div>
                  <div className="text-xs text-gray-500">Dec 1, 2023</div>
                </div>
                <div className="border-l-4 border-red-400 pl-4">
                  <div className="text-sm font-medium text-gray-900">Emma Davis</div>
                  <div className="text-sm text-gray-600">Status changed to Terminated</div>
                  <div className="text-xs text-gray-500">Nov 15, 2023</div>
                </div>
                <div className="border-l-4 border-green-400 pl-4">
                  <div className="text-sm font-medium text-gray-900">Lisa Brown</div>
                  <div className="text-sm text-gray-600">Status changed to Active</div>
                  <div className="text-xs text-gray-500">Jun 5, 2023</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EmploymentStatus; 