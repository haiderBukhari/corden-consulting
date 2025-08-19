import React, { useState, useEffect } from 'react';
import Layout from "../../components/layout/layout";
import { UserCircleIcon, CalendarIcon, MapPinIcon, PhoneIcon, EnvelopeIcon, BriefcaseIcon, CurrencyPoundIcon } from '@heroicons/react/24/outline';

const EmployeeProfiles = () => {
  const [userRole, setUserRole] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);

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
        phone: "+44 123 456 7890",
        address: "123 Tech Street, London, UK",
        manager: "Sarah Johnson",
        timeOffPolicy: "Standard Time Off (25 days)",
        workSchedule: "Monday-Friday, 9:00-17:00",
        bankHolidayPolicy: "Standard Bank Holidays",
        overtimePolicy: "1.5x rate for overtime",
        flexibleWorkingPolicy: "Hybrid work arrangement",
        history: [
          { date: "2023-01-15", action: "Hired", details: "Software Engineer, £45,000" },
          { date: "2023-06-01", action: "Salary Update", details: "Increased to £45,000" },
          { date: "2023-08-15", action: "Policy Update", details: "Assigned Standard Time Off Policy" }
        ]
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
        phone: "+44 123 456 7891",
        address: "456 HR Avenue, Manchester, UK",
        manager: "David Wilson",
        timeOffPolicy: "Flexible Time Off (30 days)",
        workSchedule: "Monday-Friday, 8:30-17:30",
        bankHolidayPolicy: "Standard Bank Holidays",
        overtimePolicy: "1.5x rate for overtime",
        flexibleWorkingPolicy: "Flexible hours",
        history: [
          { date: "2022-08-20", action: "Hired", details: "HR Manager, £55,000" },
          { date: "2023-03-15", action: "Promotion", details: "Promoted to Senior HR Manager" }
        ]
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
        phone: "+44 123 456 7892",
        address: "789 Sales Road, Birmingham, UK",
        manager: "Lisa Brown",
        timeOffPolicy: "Part-Time Time Off (15 days)",
        workSchedule: "Monday-Friday, 9:00-13:00",
        bankHolidayPolicy: "Standard Bank Holidays",
        overtimePolicy: "1.5x rate for overtime",
        flexibleWorkingPolicy: "Standard arrangement",
        history: [
          { date: "2023-03-10", action: "Hired", details: "Sales Representative, £30,000" },
          { date: "2023-11-01", action: "Leave Started", details: "Annual leave until 2023-12-01" }
        ]
      }
    ]
  };

  useEffect(() => {
    const role = localStorage.getItem('role');
    setUserRole(role);
    setSelectedEmployee(dummyData.employees[0]);
  }, []);

  const renderEmployeeProfile = (employee) => (
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center space-x-4">
          <div className="h-16 w-16 rounded-full bg-[#009D9D] flex items-center justify-center">
            <span className="text-white font-medium text-xl">
              {employee.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{employee.name}</h2>
            <p className="text-lg text-gray-600">{employee.jobTitle}</p>
            <div className="flex items-center space-x-4 mt-2">
              <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                employee.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {employee.status}
              </span>
              <span className="text-sm text-gray-500">{employee.department}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <UserCircleIcon className="h-5 w-5 mr-2" />
            Contact Information
          </h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <EnvelopeIcon className="h-4 w-4 text-gray-400 mr-3" />
              <span className="text-sm text-gray-900">{employee.email}</span>
            </div>
            <div className="flex items-center">
              <PhoneIcon className="h-4 w-4 text-gray-400 mr-3" />
              <span className="text-sm text-gray-900">{employee.phone}</span>
            </div>
            <div className="flex items-center">
              <MapPinIcon className="h-4 w-4 text-gray-400 mr-3" />
              <span className="text-sm text-gray-900">{employee.address}</span>
            </div>
          </div>
        </div>

        {/* Job Information */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <BriefcaseIcon className="h-5 w-5 mr-2" />
            Job Information
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Job Title:</span>
              <span className="text-sm font-medium text-gray-900">{employee.jobTitle}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Employment Type:</span>
              <span className="text-sm font-medium text-gray-900">{employee.employmentType}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Hire Date:</span>
              <span className="text-sm font-medium text-gray-900">{employee.hireDate}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Manager:</span>
              <span className="text-sm font-medium text-gray-900">{employee.manager}</span>
            </div>
          </div>
        </div>

        {/* Compensation */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <CurrencyPoundIcon className="h-5 w-5 mr-2" />
            Compensation
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Salary:</span>
              <span className="text-sm font-medium text-gray-900">{employee.salary}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Pay Policy:</span>
              <span className="text-sm font-medium text-gray-900">Monthly</span>
            </div>
          </div>
        </div>

        {/* Leave & Schedule */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <CalendarIcon className="h-5 w-5 mr-2" />
            Leave & Schedule
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Time Off Policy:</span>
              <span className="text-sm font-medium text-gray-900">{employee.timeOffPolicy}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Work Schedule:</span>
              <span className="text-sm font-medium text-gray-900">{employee.workSchedule}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Bank Holiday Policy:</span>
              <span className="text-sm font-medium text-gray-900">{employee.bankHolidayPolicy}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Overtime Policy:</span>
              <span className="text-sm font-medium text-gray-900">{employee.overtimePolicy}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Flexible Working:</span>
              <span className="text-sm font-medium text-gray-900">{employee.flexibleWorkingPolicy}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Employment History */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Employment History</h3>
        <div className="space-y-4">
          {employee.history.map((entry, index) => (
            <div key={index} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                <div className="h-3 w-3 bg-blue-500 rounded-full"></div>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">{entry.action}</span>
                  <span className="text-sm text-gray-500">{entry.date}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">{entry.details}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <Layout title={'Employee Profiles'} subtitle={'View detailed employee information'}>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Employee Profiles</h1>
              <p className="text-gray-600 mt-1">View detailed information for each employee</p>
            </div>
          </div>
        </div>

        {/* Employee Selector */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Select Employee</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {dummyData.employees.map((employee) => (
              <button
                key={employee.id}
                onClick={() => setSelectedEmployee(employee)}
                className={`p-4 border rounded-lg text-left transition-colors ${
                  selectedEmployee?.id === employee.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-[#009D9D] flex items-center justify-center">
                    <span className="text-white font-medium text-sm">
                      {employee.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{employee.name}</div>
                    <div className="text-sm text-gray-500">{employee.jobTitle}</div>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full mt-1 ${
                      employee.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {employee.status}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Employee Profile */}
        {selectedEmployee && renderEmployeeProfile(selectedEmployee)}
      </div>
    </Layout>
  );
};

export default EmployeeProfiles; 