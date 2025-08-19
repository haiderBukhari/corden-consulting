import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from "../../components/layout/layout";
import { 
  ClockIcon, 
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
  UsersIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

const WorkSchedules = () => {
  const router = useRouter();
  const [userRole, setUserRole] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingSchedule, setDeletingSchedule] = useState(null);
  // Removed modal-related state
  const LOCAL_KEY = 'workSchedulesData';
  const defaultSchedules = [
    {
      id: 1,
      name: "Standard 9-5",
      description: "Standard 9 AM to 5 PM work schedule with 1-hour lunch break",
      scheduleType: "fulltime",
      workDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      startTime: "09:00",
      endTime: "17:00",
      breakTime: "60",
      breakType: "unpaid",
      totalWorkingHours: 40,
      gracePeriod: 10,
      overtimeEligible: true,
      shiftSegments: [],
      rotatingSchedule: false,
      rotationPattern: "",
      holidayOverride: "off",
      remoteDays: [],
      timeZone: "UTC",
      earliestCheckIn: "08:30",
      latestCheckOut: "17:30",
      autoClockOut: true,
      attendanceRequired: true,
      lateThreshold: 15,
      earlyLeaveThreshold: 15,
      assignedEmployees: ["John Smith", "Sarah Johnson", "Michael Brown"],
      contractDuration: "Permanent",
      assignedHolidays: ["Christmas", "New Year", "Easter"],
      alertBeforeChange: false,
      colorTag: "blue",
      status: "Active",
      employeeCount: 15,
      departments: ["Engineering", "Marketing", "Sales"],
      createdAt: "2023-01-01",
      updatedAt: "2023-01-01"
    },
    {
      id: 2,
      name: "Flexible Hybrid",
      description: "Flexible work hours with hybrid remote/office arrangement",
      scheduleType: "hybrid",
      workDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      startTime: "Flexible",
      endTime: "Flexible",
      breakTime: "60",
      breakType: "flexible",
      totalWorkingHours: 40,
      gracePeriod: 15,
      overtimeEligible: true,
      shiftSegments: [],
      rotatingSchedule: false,
      rotationPattern: "",
      holidayOverride: "flexible",
      remoteDays: ["Wednesday", "Friday"],
      timeZone: "UTC",
      earliestCheckIn: "08:00",
      latestCheckOut: "18:00",
      autoClockOut: false,
      attendanceRequired: true,
      lateThreshold: 30,
      earlyLeaveThreshold: 30,
      assignedEmployees: ["Emily Davis", "David Wilson"],
      contractDuration: "Permanent",
      assignedHolidays: ["Christmas", "New Year"],
      alertBeforeChange: true,
      colorTag: "green",
      status: "Active",
      employeeCount: 8,
      departments: ["Engineering", "HR"],
      createdAt: "2023-02-01",
      updatedAt: "2023-02-01"
    },
    {
      id: 3,
      name: "Part-Time Support",
      description: "Part-time work schedule for support staff",
      scheduleType: "parttime",
      workDays: ["Monday", "Tuesday", "Wednesday"],
      startTime: "09:00",
      endTime: "13:00",
      breakTime: "30",
      breakType: "unpaid",
      totalWorkingHours: 12,
      gracePeriod: 5,
      overtimeEligible: false,
      shiftSegments: [],
      rotatingSchedule: false,
      rotationPattern: "",
      holidayOverride: "off",
      remoteDays: [],
      timeZone: "UTC",
      earliestCheckIn: "08:45",
      latestCheckOut: "13:15",
      autoClockOut: true,
      attendanceRequired: true,
      lateThreshold: 10,
      earlyLeaveThreshold: 10,
      assignedEmployees: ["Lisa Anderson"],
      contractDuration: "6 months",
      assignedHolidays: ["Christmas"],
      alertBeforeChange: false,
      colorTag: "purple",
      status: "Active",
      employeeCount: 5,
      departments: ["Sales", "Support"],
      createdAt: "2023-03-01",
      updatedAt: "2023-03-01"
    },
    {
      id: 4,
      name: "Night Shift Operations",
      description: "Night shift schedule for 24/7 operations",
      scheduleType: "shift",
      workDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      startTime: "22:00",
      endTime: "06:00",
      breakTime: "45",
      breakType: "paid",
      totalWorkingHours: 48,
      gracePeriod: 15,
      overtimeEligible: true,
      shiftSegments: [
        { name: "Main Shift", startTime: "22:00", endTime: "06:00" }
      ],
      rotatingSchedule: false,
      rotationPattern: "",
      holidayOverride: "work",
      remoteDays: [],
      timeZone: "UTC",
      earliestCheckIn: "21:30",
      latestCheckOut: "06:30",
      autoClockOut: true,
      attendanceRequired: true,
      lateThreshold: 15,
      earlyLeaveThreshold: 15,
      assignedEmployees: ["James Thompson", "Maria Garcia"],
      contractDuration: "Permanent",
      assignedHolidays: [],
      alertBeforeChange: true,
      colorTag: "red",
      status: "Active",
      employeeCount: 3,
      departments: ["Operations"],
      createdAt: "2023-04-01",
      updatedAt: "2023-04-01"
    },
    {
      id: 5,
      name: "Rotating Shifts",
      description: "Rotating shift schedule for manufacturing team",
      scheduleType: "rotating",
      workDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      startTime: "06:00",
      endTime: "14:00",
      breakTime: "30",
      breakType: "unpaid",
      totalWorkingHours: 40,
      gracePeriod: 10,
      overtimeEligible: true,
      shiftSegments: [
        { name: "Morning Shift", startTime: "06:00", endTime: "14:00" },
        { name: "Afternoon Shift", startTime: "14:00", endTime: "22:00" },
        { name: "Night Shift", startTime: "22:00", endTime: "06:00" }
      ],
      rotatingSchedule: true,
      rotationPattern: "Week 1: Morning (6 AM - 2 PM), Week 2: Afternoon (2 PM - 10 PM), Week 3: Night (10 PM - 6 AM)",
      holidayOverride: "shifted",
      remoteDays: [],
      timeZone: "UTC",
      earliestCheckIn: "05:30",
      latestCheckOut: "14:30",
      autoClockOut: true,
      attendanceRequired: true,
      lateThreshold: 10,
      earlyLeaveThreshold: 10,
      assignedEmployees: ["Robert Chen", "Anna Kim"],
      contractDuration: "Permanent",
      assignedHolidays: ["Christmas", "New Year"],
      alertBeforeChange: true,
      colorTag: "orange",
      status: "Active",
      employeeCount: 12,
      departments: ["Manufacturing", "Quality Control"],
      createdAt: "2023-05-01",
      updatedAt: "2023-06-01"
    },
    {
      id: 6,
      name: "Remote-Only Team",
      description: "Fully remote work schedule for distributed team",
      scheduleType: "remote",
      workDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      startTime: "Flexible",
      endTime: "Flexible",
      breakTime: "60",
      breakType: "flexible",
      totalWorkingHours: 40,
      gracePeriod: 30,
      overtimeEligible: true,
      shiftSegments: [],
      rotatingSchedule: false,
      rotationPattern: "",
      holidayOverride: "flexible",
      remoteDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      timeZone: "UTC",
      earliestCheckIn: "07:00",
      latestCheckOut: "19:00",
      autoClockOut: false,
      attendanceRequired: false,
      lateThreshold: 60,
      earlyLeaveThreshold: 60,
      assignedEmployees: ["Alex Johnson", "Sam Wilson"],
      contractDuration: "Permanent",
      assignedHolidays: ["Christmas", "New Year", "Easter"],
      alertBeforeChange: true,
      colorTag: "green",
      status: "Active",
      employeeCount: 8,
      departments: ["Engineering", "Design"],
      createdAt: "2023-07-01",
      updatedAt: "2023-07-01"
    },
    {
      id: 7,
      name: "Weekend Support",
      description: "Weekend-only schedule for customer support",
      scheduleType: "parttime",
      workDays: ["Saturday", "Sunday"],
      startTime: "10:00",
      endTime: "18:00",
      breakTime: "45",
      breakType: "unpaid",
      totalWorkingHours: 16,
      gracePeriod: 10,
      overtimeEligible: false,
      shiftSegments: [],
      rotatingSchedule: false,
      rotationPattern: "",
      holidayOverride: "off",
      remoteDays: [],
      timeZone: "UTC",
      earliestCheckIn: "09:45",
      latestCheckOut: "18:15",
      autoClockOut: true,
      attendanceRequired: true,
      lateThreshold: 15,
      earlyLeaveThreshold: 15,
      assignedEmployees: [],
      contractDuration: "Seasonal",
      assignedHolidays: [],
      alertBeforeChange: false,
      colorTag: "purple",
      status: "Inactive",
      employeeCount: 0,
      departments: [],
      createdAt: "2023-08-01",
      updatedAt: "2023-08-01"
    },
    {
      id: 8,
      name: "Flexible Hours",
      description: "Flexible work hours with core hours",
      scheduleType: "flexible",
      workDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      startTime: "Flexible",
      endTime: "Flexible",
      breakTime: "60",
      breakType: "flexible",
      totalWorkingHours: 40,
      gracePeriod: 20,
      overtimeEligible: false,
      shiftSegments: [],
      rotatingSchedule: false,
      rotationPattern: "",
      holidayOverride: "flexible",
      remoteDays: ["Monday", "Friday"],
      timeZone: "UTC",
      earliestCheckIn: "07:00",
      latestCheckOut: "20:00",
      autoClockOut: false,
      attendanceRequired: false,
      lateThreshold: 45,
      earlyLeaveThreshold: 45,
      assignedEmployees: ["Tom Wilson", "Jane Smith", "Bob Johnson"],
      contractDuration: "Permanent",
      assignedHolidays: ["Christmas", "New Year", "Easter"],
      alertBeforeChange: true,
      colorTag: "blue",
      status: "Active",
      employeeCount: 8,
      departments: ["Engineering", "Marketing"],
      createdAt: "2023-09-01",
      updatedAt: "2023-09-01"
    },
    {
      id: 9,
      name: "Part-Time",
      description: "Part-time work schedule",
      scheduleType: "parttime",
      workDays: ["Monday", "Tuesday", "Wednesday"],
      startTime: "09:00",
      endTime: "13:00",
      breakTime: "30",
      breakType: "unpaid",
      totalWorkingHours: 12,
      gracePeriod: 5,
      overtimeEligible: false,
      shiftSegments: [],
      rotatingSchedule: false,
      rotationPattern: "",
      holidayOverride: "off",
      remoteDays: [],
      timeZone: "UTC",
      earliestCheckIn: "08:45",
      latestCheckOut: "13:15",
      autoClockOut: true,
      attendanceRequired: true,
      lateThreshold: 10,
      earlyLeaveThreshold: 10,
      assignedEmployees: ["Mary Davis", "John Brown"],
      contractDuration: "6 months",
      assignedHolidays: ["Christmas"],
      alertBeforeChange: false,
      colorTag: "purple",
      status: "Active",
      employeeCount: 5,
      departments: ["Sales", "Support"],
      createdAt: "2023-10-01",
      updatedAt: "2023-10-01"
    },
    {
      id: 10,
      name: "Shift Work",
      description: "Shift-based work schedule",
      scheduleType: "shift",
      workDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      startTime: "06:00",
      endTime: "14:00",
      breakTime: "45",
      breakType: "paid",
      totalWorkingHours: 48,
      gracePeriod: 15,
      overtimeEligible: true,
      shiftSegments: [
        { name: "Morning Shift", startTime: "06:00", endTime: "14:00" }
      ],
      rotatingSchedule: false,
      rotationPattern: "",
      holidayOverride: "work",
      remoteDays: [],
      timeZone: "UTC",
      earliestCheckIn: "05:30",
      latestCheckOut: "14:30",
      autoClockOut: true,
      attendanceRequired: true,
      lateThreshold: 15,
      earlyLeaveThreshold: 15,
      assignedEmployees: ["Mike Wilson", "Sarah Johnson"],
      contractDuration: "Permanent",
      assignedHolidays: ["Christmas", "New Year"],
      alertBeforeChange: true,
      colorTag: "red",
      status: "Active",
      employeeCount: 3,
      departments: ["Operations", "Manufacturing"],
      createdAt: "2023-11-01",
      updatedAt: "2023-11-01"
    },
    {
      id: 11,
      name: "Weekend Only",
      description: "Weekend work schedule",
      scheduleType: "parttime",
      workDays: ["Saturday", "Sunday"],
      startTime: "10:00",
      endTime: "18:00",
      breakTime: "60",
      breakType: "unpaid",
      totalWorkingHours: 16,
      gracePeriod: 10,
      overtimeEligible: false,
      shiftSegments: [],
      rotatingSchedule: false,
      rotationPattern: "",
      holidayOverride: "off",
      remoteDays: [],
      timeZone: "UTC",
      earliestCheckIn: "09:45",
      latestCheckOut: "18:15",
      autoClockOut: true,
      attendanceRequired: true,
      lateThreshold: 15,
      earlyLeaveThreshold: 15,
      assignedEmployees: [],
      contractDuration: "Seasonal",
      assignedHolidays: [],
      alertBeforeChange: false,
      colorTag: "purple",
      status: "Inactive",
      employeeCount: 0,
      departments: [],
      createdAt: "2023-12-01",
      updatedAt: "2023-12-01"
    }
  ];
  const [workSchedules, setWorkSchedules] = useState(defaultSchedules);

  // Load from localStorage or initialize
  useEffect(() => {
    let stored = localStorage.getItem(LOCAL_KEY);
    let parsed = defaultSchedules;
    if (stored) {
      try {
        parsed = JSON.parse(stored);
      } catch {}
    } else {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(defaultSchedules));
    }
    setWorkSchedules(parsed);
  }, []);

  // Helper to update localStorage and state
  const updateSchedules = (newSchedules) => {
    setWorkSchedules(newSchedules);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(newSchedules));
  };

  const departments = ["Engineering", "Marketing", "Sales", "HR", "Finance", "Operations", "Support"];
  const workDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  useEffect(() => {
    const role = localStorage.getItem('role');
    setUserRole(role);
  }, []);

  const handleEditSchedule = (schedule) => {
    router.push(`/demo/work-schedule-form?mode=edit&id=${schedule.id}`);
  };

  const handleDeleteSchedule = (schedule) => {
    setDeletingSchedule(schedule);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    const newSchedules = workSchedules.filter((s) => s.id !== deletingSchedule.id);
    updateSchedules(newSchedules);
    setShowDeleteModal(false);
    setDeletingSchedule(null);
  };

  const handleAddSchedule = () => {
    router.push('/demo/work-schedule-form?mode=create');
  };

  const resetToDefaultData = () => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(defaultSchedules));
    setWorkSchedules(defaultSchedules);
  };

  // Removed handleAddFormChange, handleAddFormSubmit, handleEditFormChange, handleEditFormSubmit

  return (
    <Layout title={'Work Schedules'} subtitle={'Create and manage reusable work schedules'}>
      <div className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <ClockIcon className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Schedules</p>
                <p className="text-2xl font-bold text-gray-900">{workSchedules.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckIcon className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Schedules</p>
                <p className="text-2xl font-bold text-gray-900">
                  {workSchedules.filter(schedule => schedule.status === 'Active').length}
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
                <p className="text-sm font-medium text-gray-600">Total Employees</p>
                <p className="text-2xl font-bold text-gray-900">
                  {workSchedules.reduce((sum, schedule) => sum + schedule.employeeCount, 0)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
                <BuildingOfficeIcon className="h-5 w-5 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Departments</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(workSchedules.flatMap(schedule => schedule.departments)).size}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-teal-100 rounded-full flex items-center justify-center">
                <ClockIcon className="h-5 w-5 text-teal-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Schedule Types</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(workSchedules.map(schedule => schedule.scheduleType)).size}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Work Schedules Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Work Schedules</h3>
              <div className="flex space-x-2">
                {userRole === 'business_manager' && (
                  <button
                    onClick={resetToDefaultData}
                    className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 flex items-center"
                    title="Reset to default sample data"
                  >
                    Reset Data
                  </button>
                )}
                {userRole === 'business_manager' || userRole === 'hr_manager' ? (
                  <button
                    onClick={handleAddSchedule}
                    className="bg-[#009D9D] text-white px-4 py-2 rounded-md hover:bg-[#007a7a] flex items-center"
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add Schedule
                  </button>
                ) : null}
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Work Days</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employees</th>
                  {userRole === 'business_manager' && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {workSchedules.map((schedule) => (
                  <tr key={schedule.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                          schedule.colorTag === 'blue' ? 'bg-blue-100' :
                          schedule.colorTag === 'green' ? 'bg-green-100' :
                          schedule.colorTag === 'orange' ? 'bg-orange-100' :
                          schedule.colorTag === 'red' ? 'bg-red-100' :
                          schedule.colorTag === 'purple' ? 'bg-purple-100' :
                          'bg-gray-100'
                        }`}>
                          <ClockIcon className={`h-4 w-4 ${
                            schedule.colorTag === 'blue' ? 'text-blue-600' :
                            schedule.colorTag === 'green' ? 'text-green-600' :
                            schedule.colorTag === 'orange' ? 'text-orange-600' :
                            schedule.colorTag === 'red' ? 'text-red-600' :
                            schedule.colorTag === 'purple' ? 'text-purple-600' :
                            'text-gray-600'
                          }`} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{schedule.name}</div>
                          {schedule.rotatingSchedule && (
                            <span className="inline-flex px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">
                              Rotating
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-xs truncate">{schedule.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
  schedule.scheduleType === 'fulltime' ? 'bg-[#E6F7F7] text-[#006D6D]' :
  schedule.scheduleType === 'parttime' ? 'bg-[#d9f1f1] text-[#007a7a]' :
  schedule.scheduleType === 'shift' ? 'bg-[#c2ebeb] text-[#006D6D]' :
  schedule.scheduleType === 'hybrid' ? 'bg-[#b3e6e6] text-[#007a7a]' :
  schedule.scheduleType === 'remote' ? 'bg-[#a3e0e0] text-[#006D6D]' :
  schedule.scheduleType === 'rotating' ? 'bg-[#8adcdc] text-[#006D6D]' :
  'bg-gray-100 text-gray-800'
}`}>
                        {schedule.scheduleType?.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex flex-wrap gap-1">
                        {schedule.workDays.map((day, index) => (
                          <span key={index} className="inline-flex px-2 py-1 text-xs bg-[#E6F7F7] text-[#006D6D] rounded-full">
                            {day.slice(0, 3)}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
  schedule.status === 'Active' ? 'bg-[#E6F7F7] text-[#006D6D]' : 
  schedule.status === 'Inactive' ? 'bg-gray-100 text-gray-800' :
  'bg-yellow-100 text-yellow-800'
}`}>
                        {schedule.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{schedule.employeeCount}</td>
                    {userRole === 'business_manager' && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                            <button 
                              onClick={() => handleEditSchedule(schedule)}
                              className="text-[#009D9D] hover:text-[#006D6D]"
                              title="Edit"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => handleDeleteSchedule(schedule)}
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

        {/* Delete Schedule Modal */}
        {userRole === 'business_manager' && showDeleteModal && deletingSchedule && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-xl w-96 max-w-md mx-4">
              <div className="p-6 text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <TrashIcon className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Work Schedule</h3>
                <div className="mb-6">
                  <p className="text-sm text-gray-600">
                    Are you sure you want to delete <strong>{deletingSchedule.name}</strong>?
                  </p>
                  {deletingSchedule.employeeCount > 0 && (
                    <p className="text-xs text-red-500 mt-2">
                      Warning: {deletingSchedule.employeeCount} employees are currently assigned to this schedule.
                    </p>
                  )}
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
                    Delete Schedule
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Removed Add Schedule Modal */}
        {/* Removed Edit Schedule Modal */}
      </div>
    </Layout>
  );
};

export default WorkSchedules; 