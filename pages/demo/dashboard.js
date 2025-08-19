import React, { useState, useEffect } from 'react';
import Layout from "../../components/layout/layout";
import { 
  UsersIcon, 
  CalendarIcon, 
  ClockIcon, 
  UserGroupIcon,
  DocumentTextIcon,
  CogIcon,
  ChartBarIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  CakeIcon,
  GiftIcon,
  BuildingOfficeIcon,
  CurrencyPoundIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  ShieldCheckIcon,
  ClipboardDocumentListIcon,
  UserPlusIcon,
  ChartPieIcon
} from '@heroicons/react/24/outline';

const DemoDashboard = () => {
  const [userRole, setUserRole] = useState('');

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
      }
    ],
    policies: [
      { id: 1, name: "Standard Time Off", type: "Time Off Policy", description: "25 days annual leave" },
      { id: 2, name: "Flexible Working", type: "Flexible Work Policy", description: "Hybrid work arrangement" },
      { id: 3, name: "Overtime Policy A", type: "Overtime Policy", description: "1.5x rate for overtime" },
      { id: 4, name: "Bank Holiday Standard", type: "Bank Holiday Policy", description: "Standard bank holidays" }
    ],
    schedules: [
      { id: 1, name: "Standard 9-5", hours: "09:00-17:00", days: "Mon-Fri" },
      { id: 2, name: "Flexible Hours", hours: "Flexible", days: "Mon-Fri" },
      { id: 3, name: "Part-Time", hours: "09:00-13:00", days: "Mon-Fri" }
    ]
  };

  useEffect(() => {
    const role = localStorage.getItem('role');
    setUserRole(role);
  }, []);

  // Manager Dashboard
  const renderManagerDashboard = () => (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-[#66d1d1] to-[#009D9D] p-6 rounded-lg shadow-lg text-white">
          <div className="flex items-center">
            <UsersIcon className="h-8 w-8 text-white" />
            <div className="ml-4">
              <p className="text-sm font-medium text-white">Team Members</p>
              <p className="text-2xl font-bold">{dummyData.employees.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-[#66d1d1] to-[#009D9D]  p-6 rounded-lg shadow-lg text-white">
          <div className="flex items-center">
            <CheckCircleIcon className="h-8 w-8 text-white" />
            <div className="ml-4">
              <p className="text-sm font-medium text-white">Active Members</p>
              <p className="text-2xl font-bold">
                {dummyData.employees.filter(emp => emp.status === 'Active').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-[#66d1d1] to-[#009D9D]  p-6 rounded-lg shadow-lg text-white">
          <div className="flex items-center">
            <CalendarIcon className="h-8 w-8 text-white" />
            <div className="ml-4">
              <p className="text-sm font-medium text-white">On Leave</p>
              <p className="text-2xl font-bold">
                {dummyData.employees.filter(emp => emp.status === 'On Leave').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-[#66d1d1] to-[#009D9D]  p-6 rounded-lg shadow-lg text-white">
          <div className="flex items-center">
            <ClockIcon className="h-8 w-8 text-white" />
            <div className="ml-4">
              <p className="text-sm font-medium text-white">Work Schedules</p>
              <p className="text-2xl font-bold">{dummyData.schedules.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Overview & Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <UserGroupIcon className="h-5 w-5 mr-2 text-blue-500" />
              Team Overview
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {dummyData.employees.map((employee) => (
                <div key={employee.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-blue-600 font-medium">{employee.name.charAt(0)}</span>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{employee.name}</p>
                      <p className="text-sm text-gray-500">{employee.jobTitle}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                    employee.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {employee.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <DocumentTextIcon className="h-5 w-5 mr-2 text-green-500" />
              Recent Activities
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">John Smith updated profile</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Sarah Johnson requested leave</p>
                  <p className="text-xs text-gray-500">4 hours ago</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Mike Wilson clocked out</p>
                  <p className="text-xs text-gray-500">6 hours ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Birthdays & Anniversaries */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <CakeIcon className="h-5 w-5 mr-2 text-pink-500" />
              Upcoming Birthdays
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-pink-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">John Smith</p>
                  <p className="text-sm text-gray-600">Software Engineer</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">Dec 15</p>
                  <p className="text-xs text-gray-500">3 days</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-pink-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Sarah Johnson</p>
                  <p className="text-sm text-gray-600">HR Manager</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">Dec 22</p>
                  <p className="text-xs text-gray-500">10 days</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <GiftIcon className="h-5 w-5 mr-2 text-green-500" />
              Work Anniversaries
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Mike Wilson</p>
                  <p className="text-sm text-gray-600">Sales Representative</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">Dec 10</p>
                  <p className="text-xs text-gray-500">2 years</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Lisa Brown</p>
                  <p className="text-sm text-gray-600">Marketing Specialist</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">Dec 18</p>
                  <p className="text-xs text-gray-500">1 year</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Leave Overview */}
      <div className="bg-white rounded-lg shadow-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <CalendarIcon className="h-5 w-5 mr-2 text-orange-500" />
            Leave Overview (Next 7 Days)
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Mike Wilson</p>
                <p className="text-sm text-gray-600">Annual Leave</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Dec 10 - Dec 15</p>
                <p className="text-xs text-gray-500">5 days</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">David Lee</p>
                <p className="text-sm text-gray-600">Sick Leave</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">Dec 12 - Dec 13</p>
                <p className="text-xs text-gray-500">2 days</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <CogIcon className="h-5 w-5 mr-2 text-blue-500" />
            Quick Actions
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <UsersIcon className="h-6 w-6 text-blue-500 mr-3" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">View Team Directory</p>
                  <p className="text-sm text-gray-500">Browse all team members</p>
                </div>
              </div>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <CalendarIcon className="h-6 w-6 text-green-500 mr-3" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">Leave Calendar</p>
                  <p className="text-sm text-gray-500">View team leave schedule</p>
                </div>
              </div>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <ClockIcon className="h-6 w-6 text-purple-500 mr-3" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">Work Schedules</p>
                  <p className="text-sm text-gray-500">View team schedules</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // HR Manager Dashboard
  const renderHRManagerDashboard = () => (
    <div className="space-y-6">
      {/* HR KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-[#66d1d1] to-[#009D9D]  p-6 rounded-lg shadow-lg text-white">
          <div className="flex items-center">
            <UsersIcon className="h-8 w-8 text-white" />
            <div className="ml-4">
              <p className="text-sm font-medium text-white">Total Employees</p>
              <p className="text-2xl font-bold text-white">{dummyData.employees.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-[#66d1d1] to-[#009D9D] p-6 rounded-lg shadow-lg text-white">
          <div className="flex items-center">
            <UserPlusIcon className="h-8 w-8 text-white" />
            <div className="ml-4">
              <p className="text-sm font-medium text-white">New Hires This Month</p>
              <p className="text-2xl font-bold">3</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-[#66d1d1] to-[#009D9D] p-6 rounded-lg shadow-lg text-white">
          <div className="flex items-center">
            <DocumentTextIcon className="h-8 w-8 text-white" />
            <div className="ml-4">
              <p className="text-sm font-medium text-white">Active Policies</p>
              <p className="text-2xl font-bold">{dummyData.policies.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-[#66d1d1] to-[#009D9D]  p-6 rounded-lg shadow-lg text-white">
          <div className="flex items-center">
            <XCircleIcon className="h-8 w-8 text-white" />
            <div className="ml-4">
              <p className="text-sm font-medium text-white">Terminations</p>
              <p className="text-2xl font-bold">1</p>
            </div>
          </div>
        </div>
      </div>

      {/* Policy Update Reminders */}
      <div className="bg-white rounded-lg shadow-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <ExclamationTriangleIcon className="h-5 w-5 mr-2 text-yellow-500" />
            Policy Update Reminders
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Overtime Policy A</p>
                <p className="text-sm text-gray-600">Review due in 5 days</p>
              </div>
              <button className="text-[#009D9D] hover:text-[#006D6D] text-sm font-medium">Review</button>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Flexible Working Policy</p>
                <p className="text-sm text-gray-600">Update due in 12 days</p>
              </div>
                                <button className="text-[#009D9D] hover:text-[#006D6D] text-sm font-medium">Update</button>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Bank Holiday Policy</p>
                <p className="text-sm text-gray-600">Annual review due in 20 days</p>
              </div>
              <button className="text-[#009D9D] hover:text-[#006D6D] text-sm font-medium">Review</button>
            </div>
          </div>
        </div>
      </div>

      {/* Expiring Contracts Alert */}
      <div className="bg-white rounded-lg shadow-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <XCircleIcon className="h-5 w-5 mr-2 text-red-500" />
            Expiring Contracts Alert
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Lisa Brown</p>
                <p className="text-sm text-gray-600">Contract expires in 15 days</p>
              </div>
              <button className="text-[#009D9D] hover:text-[#006D6D] text-sm font-medium">Renew</button>
            </div>
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">David Lee</p>
                <p className="text-sm text-gray-600">Contract expires in 30 days</p>
              </div>
              <button className="text-[#009D9D] hover:text-[#006D6D] text-sm font-medium">Renew</button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent HR Activities */}
      <div className="bg-white rounded-lg shadow-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <DocumentTextIcon className="h-5 w-5 mr-2 text-indigo-500" />
            Recent HR Activities
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Updated salary for John Smith</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Assigned new policy to Sarah Johnson</p>
                <p className="text-xs text-gray-500">4 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Updated employment status for Mike Wilson</p>
                <p className="text-xs text-gray-500">6 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium text-gray-900">Created new employee record for Emma Davis</p>
                <p className="text-xs text-gray-500">1 day ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <CogIcon className="h-5 w-5 mr-2 text-emerald-500" />
            Quick Actions
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <UserPlusIcon className="h-6 w-6 text-indigo-500 mr-3" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">Add New Employee</p>
                  <p className="text-sm text-gray-500">Create employee record</p>
                </div>
              </div>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <DocumentTextIcon className="h-6 w-6 text-emerald-500 mr-3" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">Manage Policies</p>
                  <p className="text-sm text-gray-500">Update policy assignments</p>
                </div>
              </div>
            </button>
            <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center">
                <CurrencyPoundIcon className="h-6 w-6 text-amber-500 mr-3" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">Compensation</p>
                  <p className="text-sm text-gray-500">Update salaries & benefits</p>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // Business Manager Dashboard
  const renderBusinessManagerDashboard = () => (
    <div className="space-y-6">
      {/* Company-wide Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-[#66d1d1] to-[#009D9D] p-6 rounded-lg shadow-lg text-white">
          <div className="flex items-center">
            <UsersIcon className="h-8 w-8 text-white" />
            <div className="ml-4">
              <p className="text-sm font-medium text-slate-100">Total Headcount</p>
              <p className="text-2xl font-bold">{dummyData.employees.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-[#66d1d1] to-[#009D9D] p-6 rounded-lg shadow-lg text-white">
          <div className="flex items-center">
            <BuildingOfficeIcon className="h-8 w-8 text-white" />
            <div className="ml-4">
              <p className="text-sm font-medium text-violet-100">Departments</p>
              <p className="text-2xl font-bold">{new Set(dummyData.employees.map(emp => emp.department)).size}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-[#66d1d1] to-[#009D9D] p-6 rounded-lg shadow-lg text-white">
          <div className="flex items-center">
            <CheckCircleIcon className="h-8 w-8 text-white" />
            <div className="ml-4">
              <p className="text-sm font-medium text-cyan-100">Active Status</p>
              <p className="text-2xl font-bold">{dummyData.employees.filter(emp => emp.status === 'Active').length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-[#66d1d1] to-[#009D9D] p-6 rounded-lg shadow-lg text-white">
          <div className="flex items-center">
            <CogIcon className="h-8 w-8 text-white" />
            <div className="ml-4">
              <p className="text-sm font-medium text-fuchsia-100">Config Items</p>
              <p className="text-2xl font-bold">24</p>
            </div>
          </div>
        </div>
      </div>

      {/* Business Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <AcademicCapIcon className="h-5 w-5 mr-2 text-slate-500" />
              Employment Types
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-900">Full-Time</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">2 employees</span>
                  <button className="text-[#009D9D] hover:text-[#006D6D] text-sm" onClick={() => window.location.href = '/demo/employment-types'}>Edit</button>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-900">Part-Time</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">1 employee</span>
                  <button className="text-[#009D9D] hover:text-[#006D6D] text-sm" onClick={() => window.location.href = '/demo/employment-types'}>Edit</button>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-900">Contract</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">1 employee</span>
                  <button className="text-[#009D9D] hover:text-[#006D6D] text-sm" onClick={() => window.location.href = '/demo/employment-types'}>Edit</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <ChartBarIcon className="h-5 w-5 mr-2 text-violet-500" />
              System Overview
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Active Policies</span>
                <span className="text-sm font-medium text-gray-900">{dummyData.policies.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Work Schedules</span>
                <span className="text-sm font-medium text-gray-900">{dummyData.schedules.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">System Dropdowns</span>
                <span className="text-sm font-medium text-gray-900">12</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Recent Changes</span>
                <span className="text-sm font-medium text-gray-900">8</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Config Change Logs */}
      <div className="bg-white rounded-lg shadow-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <ClipboardDocumentListIcon className="h-5 w-5 mr-2 text-cyan-500" />
            Recent Configuration Changes
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">New Time Off Policy Created</p>
                <p className="text-sm text-gray-600">By Business Manager - 2 hours ago</p>
              </div>
              <span className="text-xs text-gray-500">Dec 8, 2023</span>
            </div>
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Employment Type Updated</p>
                <p className="text-sm text-gray-600">By Business Manager - 1 day ago</p>
              </div>
              <span className="text-xs text-gray-500">Dec 7, 2023</span>
            </div>
            <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">System Dropdown Added</p>
                <p className="text-sm text-gray-600">By Business Manager - 2 days ago</p>
              </div>
              <span className="text-xs text-gray-500">Dec 6, 2023</span>
            </div>
          </div>
        </div>
      </div>

      {/* Policy Assignment Overview */}
      <div className="bg-white rounded-lg shadow-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <DocumentTextIcon className="h-5 w-5 mr-2 text-fuchsia-500" />
            Policy Assignment Overview
          </h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Most Assigned Policies</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Standard Time Off</span>
                  <span className="text-sm font-medium text-gray-900">4 employees</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Flexible Working</span>
                  <span className="text-sm font-medium text-gray-900">2 employees</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Overtime Policy A</span>
                  <span className="text-sm font-medium text-gray-900">3 employees</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Unassigned Employees</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">No policies assigned</span>
                  <span className="text-sm font-medium text-gray-900">1 employee</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Missing schedules</span>
                  <span className="text-sm font-medium text-gray-900">2 employees</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* System Health & Alerts */}
      <div className="bg-white rounded-lg shadow-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 flex items-center">
            <ShieldCheckIcon className="h-5 w-5 mr-2 text-green-500" />
            System Health & Alerts
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">System Performance</p>
                <p className="text-sm text-gray-600">All systems operational</p>
              </div>
              <span className="text-green-600 text-sm font-medium">✓ Healthy</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Data Backup</p>
                <p className="text-sm text-gray-600">Last backup: 6 hours ago</p>
              </div>
              <span className="text-yellow-600 text-sm font-medium">⚠ Due Soon</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">Security Updates</p>
                <p className="text-sm text-gray-600">All systems up to date</p>
              </div>
              <span className="text-blue-600 text-sm font-medium">✓ Updated</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => {
    switch (userRole) {
      case 'manager':
        return renderManagerDashboard();
      case 'hr_manager':
        return renderHRManagerDashboard();
      case 'business_manager':
        return renderBusinessManagerDashboard();
      default:
        return renderManagerDashboard();
    }
  };

  return (
    <Layout title={'Demo Dashboard'} subtitle={'Overview'}>
      <div className="space-y-6">
        {renderDashboard()}
      </div>
    </Layout>
  );
};

export default DemoDashboard;
