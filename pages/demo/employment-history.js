import React, { useState, useEffect } from 'react';
import Layout from "../../components/layout/layout";
import { ClockIcon, UserGroupIcon, AcademicCapIcon, BriefcaseIcon } from '@heroicons/react/24/outline';

const EmploymentHistory = () => {
  const [userRole, setUserRole] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('all');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Dummy data
  const dummyData = {
    employees: [
      {
        id: 1,
        name: "John Smith",
        jobTitle: "Software Engineer",
        department: "Engineering"
      },
      {
        id: 2,
        name: "Sarah Johnson",
        jobTitle: "HR Manager",
        department: "Human Resources"
      },
      {
        id: 3,
        name: "Mike Wilson",
        jobTitle: "Sales Representative",
        department: "Sales"
      },
      {
        id: 4,
        name: "Lisa Brown",
        jobTitle: "Marketing Specialist",
        department: "Marketing"
      }
    ],
    employmentHistory: {
      "John Smith": [
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
      ],
      "Sarah Johnson": [
        {
          id: 1,
          date: "2022-08-20",
          type: "Hired",
          title: "HR Specialist",
          department: "Human Resources",
          salary: "£40,000",
          description: "Joined as HR Specialist"
        },
        {
          id: 2,
          date: "2023-03-15",
          type: "Promotion",
          title: "HR Manager",
          department: "Human Resources",
          salary: "£55,000",
          description: "Promoted to HR Manager"
        }
      ],
      "Mike Wilson": [
        {
          id: 1,
          date: "2023-03-10",
          type: "Hired",
          title: "Sales Representative",
          department: "Sales",
          salary: "£30,000",
          description: "Joined as Sales Representative"
        },
        {
          id: 2,
          date: "2023-09-01",
          type: "Salary Increase",
          title: "Sales Representative",
          department: "Sales",
          salary: "£35,000",
          description: "Annual salary review - increased"
        }
      ],
      "Lisa Brown": [
        {
          id: 1,
          date: "2023-06-05",
          type: "Hired",
          title: "Marketing Specialist",
          department: "Marketing",
          salary: "£40,000",
          description: "Joined as Marketing Specialist"
        }
      ]
    }
  };

  useEffect(() => {
    const role = localStorage.getItem('role');
    setUserRole(role);
  }, []);

  const getEventIcon = (type) => {
    switch (type) {
      case 'Hired':
        return <UserGroupIcon className="h-5 w-5 text-green-600" />;
      case 'Promotion':
        return <AcademicCapIcon className="h-5 w-5 text-blue-600" />;
      case 'Salary Increase':
        return <BriefcaseIcon className="h-5 w-5 text-yellow-600" />;
      case 'Termination':
        return <ClockIcon className="h-5 w-5 text-red-600" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const getEventColor = (type) => {
    switch (type) {
      case 'Hired':
        return 'border-green-400 bg-green-50';
      case 'Promotion':
        return 'border-blue-400 bg-blue-50';
      case 'Salary Increase':
        return 'border-yellow-400 bg-yellow-50';
      case 'Termination':
        return 'border-red-400 bg-red-50';
      default:
        return 'border-gray-400 bg-gray-50';
    }
  };

  const filteredEmployees = dummyData.employees.filter(emp => 
    selectedEmployee === 'all' || emp.name === selectedEmployee
  );

  const allEvents = Object.entries(dummyData.employmentHistory).flatMap(([employeeName, events]) =>
    events.map(event => ({ ...event, employeeName }))
  ).filter(event => 
    selectedFilter === 'all' || event.type === selectedFilter
  ).sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <Layout title={'Employment History'} subtitle={'View employee career progression and history'}>
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
              <AcademicCapIcon className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Promotions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {allEvents.filter(event => event.type === 'Promotion').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <BriefcaseIcon className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Salary Changes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {allEvents.filter(event => event.type === 'Salary Increase').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <ClockIcon className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Events</p>
                <p className="text-2xl font-bold text-gray-900">{allEvents.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Filter by Employee:</label>
              <select 
                value={selectedEmployee} 
                onChange={(e) => setSelectedEmployee(e.target.value)}
                className="ml-2 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Employees</option>
                {dummyData.employees.map((employee) => (
                  <option key={employee.id} value={employee.name}>{employee.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Filter by Event:</label>
              <select 
                value={selectedFilter} 
                onChange={(e) => setSelectedFilter(e.target.value)}
                className="ml-2 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Events</option>
                <option value="Hired">Hired</option>
                <option value="Promotion">Promotion</option>
                <option value="Salary Increase">Salary Increase</option>
                <option value="Termination">Termination</option>
              </select>
            </div>
          </div>
        </div>

        {/* Employment History Timeline */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Employment History Timeline</h3>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {filteredEmployees.map((employee) => {
                const employeeHistory = dummyData.employmentHistory[employee.name] || [];
                const filteredHistory = selectedFilter === 'all' 
                  ? employeeHistory 
                  : employeeHistory.filter(event => event.type === selectedFilter);
                
                if (filteredHistory.length === 0) return null;

                return (
                  <div key={employee.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <div className="h-10 w-10 rounded-full bg-[#009D9D] flex items-center justify-center">
                        <span className="text-white font-medium text-sm">
                          {employee.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-medium text-gray-900">{employee.name}</h4>
                        <p className="text-sm text-gray-500">{employee.jobTitle} - {employee.department}</p>
                      </div>
                    </div>
                    
                    <div className="relative">
                      {filteredHistory.map((event, index) => (
                        <div key={event.id} className={`relative pl-8 pb-6 ${index !== filteredHistory.length - 1 ? 'border-l-2 border-gray-200' : ''}`}>
                          <div className={`absolute left-0 top-0 w-4 h-4 rounded-full border-2 ${getEventColor(event.type)} flex items-center justify-center`}>
                            {getEventIcon(event.type)}
                          </div>
                          <div className={`ml-4 p-4 rounded-lg ${getEventColor(event.type)}`}>
                            <div className="flex items-center justify-between mb-2">
                              <h5 className="text-sm font-medium text-gray-900">{event.type}</h5>
                              <span className="text-xs text-gray-500">{event.date}</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                            <div className="grid grid-cols-2 gap-4 text-xs">
                              <div>
                                <span className="text-gray-500">Title:</span>
                                <span className="ml-1 font-medium text-gray-900">{event.title}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Department:</span>
                                <span className="ml-1 font-medium text-gray-900">{event.department}</span>
                              </div>
                              <div>
                                <span className="text-gray-500">Salary:</span>
                                <span className="ml-1 font-medium text-gray-900">{event.salary}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Events Summary */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Events</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {allEvents.slice(0, 5).map((event) => (
                <div key={`${event.employeeName}-${event.id}`} className={`border-l-4 pl-4 ${getEventColor(event.type)}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{event.employeeName}</div>
                      <div className="text-sm text-gray-600">{event.type} - {event.title}</div>
                    </div>
                    <div className="text-xs text-gray-500">{event.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EmploymentHistory; 