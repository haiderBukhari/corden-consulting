import React, { useState, useEffect } from 'react';
import Layout from "../../components/layout/layout";
import { 
  UserCircleIcon, 
  BriefcaseIcon, 
  CurrencyPoundIcon, 
  CalendarIcon,
  ClockIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

const EmployeeProfile = () => {
  const [userRole, setUserRole] = useState('');
  const [employeeId, setEmployeeId] = useState(null);

  // Dummy data
  const dummyData = {
    employee: {
      id: 1,
      name: "John Smith",
      email: "john.smith@company.com",
      phone: "+44 123 456 7890",
      address: "123 Main Street, London, UK",
      jobTitle: "Software Engineer",
      department: "Engineering",
      hireDate: "2023-01-15",
      employmentType: "Full-Time",
      workLocation: "London",
      status: "Active",
      salary: "£45,000",
      manager: "Sarah Johnson",
      timeOffPolicy: "Standard Time Off",
      workSchedule: "Standard 9-5",
      bankHolidayPolicy: "Bank Holiday Standard",
      overtimePolicy: "Overtime Policy A",
      flexibleWorkingPolicy: "Flexible Working",
      careerHistory: [
        {
          id: 1,
          date: "2023-01-15",
          type: "Hired",
          title: "Software Engineer",
          department: "Engineering",
          salary: "£45,000",
          description: "Joined as Software Engineer"
        },
        {
          id: 2,
          date: "2023-06-01",
          type: "Promotion",
          title: "Senior Software Engineer",
          department: "Engineering",
          salary: "£55,000",
          description: "Promoted to Senior Software Engineer"
        }
      ]
    }
  };

  useEffect(() => {
    const role = localStorage.getItem('role');
    setUserRole(role);
    
    // Get employee ID from URL params or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id') || localStorage.getItem('selectedEmployeeId');
    setEmployeeId(id);
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

  return (
    <Layout title={'Employee Profile'} subtitle={'View detailed employee information'}>
      <div className="space-y-6">
        {/* Employee Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-16 w-16 rounded-full bg-[#009D9D] flex items-center justify-center">
                <span className="text-white font-medium text-xl">
                  {dummyData.employee.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div className="ml-6">
                <h1 className="text-2xl font-bold text-gray-900">{dummyData.employee.name}</h1>
                <p className="text-lg text-gray-600">{dummyData.employee.jobTitle}</p>
                <p className="text-sm text-gray-500">{dummyData.employee.department}</p>
              </div>
            </div>
            <div className="text-right">
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(dummyData.employee.status)}`}>
                {dummyData.employee.status}
              </span>
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <UserCircleIcon className="h-5 w-5 mr-2 text-blue-500" />
              Basic Information
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-2">Contact Information</h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-500">Email:</span>
                    <span className="ml-2 text-sm font-medium text-gray-900">{dummyData.employee.email}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Phone:</span>
                    <span className="ml-2 text-sm font-medium text-gray-900">{dummyData.employee.phone}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Address:</span>
                    <span className="ml-2 text-sm font-medium text-gray-900">{dummyData.employee.address}</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-2">Job Information</h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-500">Job Title:</span>
                    <span className="ml-2 text-sm font-medium text-gray-900">{dummyData.employee.jobTitle}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Department:</span>
                    <span className="ml-2 text-sm font-medium text-gray-900">{dummyData.employee.department}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Manager:</span>
                    <span className="ml-2 text-sm font-medium text-gray-900">{dummyData.employee.manager}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Compensation */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <CurrencyPoundIcon className="h-5 w-5 mr-2 text-green-500" />
              Compensation
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-2">Salary Information</h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-500">Current Salary:</span>
                    <span className="ml-2 text-sm font-medium text-gray-900">{dummyData.employee.salary}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Employment Type:</span>
                    <span className="ml-2 text-sm font-medium text-gray-900">{dummyData.employee.employmentType}</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-2">Work Location</h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-500">Location:</span>
                    <span className="ml-2 text-sm font-medium text-gray-900">{dummyData.employee.workLocation}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Hire Date:</span>
                    <span className="ml-2 text-sm font-medium text-gray-900">{dummyData.employee.hireDate}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Leave & Schedule */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2 text-orange-500" />
              Leave & Schedule
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-2">Leave Policies</h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-500">Time Off Policy:</span>
                    <span className="ml-2 text-sm font-medium text-gray-900">{dummyData.employee.timeOffPolicy}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Bank Holiday Policy:</span>
                    <span className="ml-2 text-sm font-medium text-gray-900">{dummyData.employee.bankHolidayPolicy}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Overtime Policy:</span>
                    <span className="ml-2 text-sm font-medium text-gray-900">{dummyData.employee.overtimePolicy}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Flexible Working:</span>
                    <span className="ml-2 text-sm font-medium text-gray-900">{dummyData.employee.flexibleWorkingPolicy}</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-600 mb-2">Work Schedule</h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-500">Schedule:</span>
                    <span className="ml-2 text-sm font-medium text-gray-900">{dummyData.employee.workSchedule}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Employment History */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <AcademicCapIcon className="h-5 w-5 mr-2 text-purple-500" />
              Employment History
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {dummyData.employee.careerHistory.map((event, index) => (
                <div key={event.id} className={`border-l-4 pl-4 ${
                  event.type === 'Hired' ? 'border-green-400 bg-green-50' :
                  event.type === 'Promotion' ? 'border-blue-400 bg-blue-50' :
                  'border-gray-400 bg-gray-50'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="text-sm font-medium text-gray-900">{event.type}</h5>
                      <p className="text-sm text-gray-600">{event.description}</p>
                      <p className="text-xs text-gray-500">{event.title} - {event.department}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{event.salary}</p>
                      <p className="text-xs text-gray-500">{event.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <BriefcaseIcon className="h-5 w-5 mr-2 text-blue-500" />
              Quick Actions
            </h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <DocumentTextIcon className="h-6 w-6 text-blue-500 mr-3" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">View Documents</p>
                    <p className="text-sm text-gray-500">Access employee documents</p>
                  </div>
                </div>
              </button>
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <CalendarIcon className="h-6 w-6 text-green-500 mr-3" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Leave History</p>
                    <p className="text-sm text-gray-500">View leave records</p>
                  </div>
                </div>
              </button>
              <button className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <ClockIcon className="h-6 w-6 text-purple-500 mr-3" />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">Attendance</p>
                    <p className="text-sm text-gray-500">View attendance records</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EmployeeProfile; 