import React, { useState, useEffect } from 'react';
import Layout from "../../components/layout/layout";
import { CalendarIcon, DocumentTextIcon, UserGroupIcon, ClockIcon } from '@heroicons/react/24/outline';

const TimeOffLeavePolicies = () => {
  const [userRole, setUserRole] = useState('');

  // Dummy data
  const dummyData = {
    employees: [
      {
        id: 1,
        name: "John Smith",
        jobTitle: "Software Engineer",
        timeOffPolicy: "Standard Time Off",
        bankHolidayPolicy: "Bank Holiday Standard",
        annualLeaveDays: 25,
        usedLeaveDays: 15,
        remainingLeaveDays: 10
      },
      {
        id: 2,
        name: "Sarah Johnson",
        jobTitle: "HR Manager",
        timeOffPolicy: "Flexible Time Off",
        bankHolidayPolicy: "Bank Holiday Standard",
        annualLeaveDays: 30,
        usedLeaveDays: 8,
        remainingLeaveDays: 22
      },
      {
        id: 3,
        name: "Mike Wilson",
        jobTitle: "Sales Representative",
        timeOffPolicy: "Standard Time Off",
        bankHolidayPolicy: "Bank Holiday Standard",
        annualLeaveDays: 25,
        usedLeaveDays: 20,
        remainingLeaveDays: 5
      },
      {
        id: 4,
        name: "Lisa Brown",
        jobTitle: "Marketing Specialist",
        timeOffPolicy: "Flexible Time Off",
        bankHolidayPolicy: "Custom Holiday Policy",
        annualLeaveDays: 28,
        usedLeaveDays: 12,
        remainingLeaveDays: 16
      }
    ],
    policies: [
      {
        id: 1,
        name: "Standard Time Off",
        type: "Time Off Policy",
        description: "25 days annual leave with standard bank holidays",
        annualLeaveDays: 25,
        bankHolidays: "Standard UK Bank Holidays"
      },
      {
        id: 2,
        name: "Flexible Time Off",
        type: "Time Off Policy",
        description: "30 days annual leave with flexible scheduling",
        annualLeaveDays: 30,
        bankHolidays: "Standard UK Bank Holidays"
      },
      {
        id: 3,
        name: "Bank Holiday Standard",
        type: "Bank Holiday Policy",
        description: "Standard UK bank holidays",
        bankHolidays: "New Year's Day, Good Friday, Easter Monday, Early May Bank Holiday, Spring Bank Holiday, Summer Bank Holiday, Christmas Day, Boxing Day"
      },
      {
        id: 4,
        name: "Custom Holiday Policy",
        type: "Bank Holiday Policy",
        description: "Custom bank holiday arrangement",
        bankHolidays: "Flexible bank holiday arrangement"
      }
    ]
  };

  useEffect(() => {
    const role = localStorage.getItem('role');
    setUserRole(role);
  }, []);

  return (
    <Layout title={'Time Off & Leave Policies'} subtitle={'View employee leave policies and entitlements'}>
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
              <CalendarIcon className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Leave Days</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dummyData.employees.reduce((sum, emp) => sum + emp.annualLeaveDays, 0)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <ClockIcon className="h-8 w-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Used Leave Days</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dummyData.employees.reduce((sum, emp) => sum + emp.usedLeaveDays, 0)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <DocumentTextIcon className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Policies</p>
                <p className="text-2xl font-bold text-gray-900">{dummyData.policies.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Employee Leave Policies */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Employee Leave Policies</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Off Policy</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bank Holiday Policy</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Annual Leave</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Used</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remaining</th>
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
                          <div className="text-sm text-gray-500">{employee.jobTitle}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.timeOffPolicy}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.bankHolidayPolicy}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.annualLeaveDays} days</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.usedLeaveDays} days</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        employee.remainingLeaveDays > 10 ? 'bg-green-100 text-green-800' : 
                        employee.remainingLeaveDays > 5 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {employee.remainingLeaveDays} days
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Policy Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Time Off Policies</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {dummyData.policies.filter(policy => policy.type === 'Time Off Policy').map((policy) => (
                  <div key={policy.id} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">{policy.name}</h4>
                    <p className="text-sm text-gray-600 mb-3">{policy.description}</p>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Annual Leave Days:</span>
                      <span className="font-medium text-gray-900">{policy.annualLeaveDays} days</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Bank Holiday Policies</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {dummyData.policies.filter(policy => policy.type === 'Bank Holiday Policy').map((policy) => (
                  <div key={policy.id} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">{policy.name}</h4>
                    <p className="text-sm text-gray-600 mb-3">{policy.description}</p>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium text-gray-900">Holidays:</span> {policy.bankHolidays}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Leave Usage Summary */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Leave Usage Summary</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {dummyData.employees.reduce((sum, emp) => sum + emp.annualLeaveDays, 0)}
                </div>
                <div className="text-sm text-gray-600">Total Annual Leave Days</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {dummyData.employees.reduce((sum, emp) => sum + emp.usedLeaveDays, 0)}
                </div>
                <div className="text-sm text-gray-600">Total Used Leave Days</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {dummyData.employees.reduce((sum, emp) => sum + emp.remainingLeaveDays, 0)}
                </div>
                <div className="text-sm text-gray-600">Total Remaining Leave Days</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TimeOffLeavePolicies; 