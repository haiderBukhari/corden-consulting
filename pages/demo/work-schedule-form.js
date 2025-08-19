import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from "../../components/layout/layout";
import { 
  ClockIcon, 
  ArrowLeftIcon,
  CheckIcon,
  XMarkIcon,
  CalendarIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

const defaultDepartments = ["Engineering", "Marketing", "Sales", "HR", "Finance", "Operations", "Support"];
const defaultWorkDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const WorkScheduleForm = () => {
  const router = useRouter();
  const { id, mode } = router.query;
  const isEdit = mode === 'edit';
  const [userRole, setUserRole] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    scheduleType: 'fulltime',
    workDays: [],
    startTime: '09:00',
    endTime: '17:00',
    breakTime: '60',
    breakType: 'unpaid',
    breakStartTime: '12:00',
    breakEndTime: '13:00',
    totalWorkingHours: 40,
    gracePeriod: 10,
    overtimeEligible: true,
    rotatingSchedule: false,
    rotationPattern: '',
    remoteDays: [],
    timeZone: 'UTC',
    earliestCheckIn: '08:30',
    latestCheckOut: '17:30',
    autoClockOut: true,
    attendanceRequired: true,
    lateThreshold: 15,
    earlyLeaveThreshold: 15,
    assignedEmployees: [],
    contractDuration: '',
    assignedHolidays: [],
    alertBeforeChange: false,
    status: 'Active',
    employeeCount: 0,
    departments: []
  });

  // Remove dummyData, use localStorage

  // Load existing schedule data for editing
  useEffect(() => {
    if (isEdit && id) {
      const stored = localStorage.getItem('workSchedulesData');
      if (stored) {
        const schedules = JSON.parse(stored);
        const schedule = schedules.find(s => s.id === parseInt(id));
        if (schedule) {
          setFormData({
            name: schedule.name || '',
            description: schedule.description || '',
            scheduleType: schedule.scheduleType || 'fulltime',
            workDays: schedule.workDays || [],
            startTime: schedule.startTime || '09:00',
            endTime: schedule.endTime || '17:00',
            breakTime: schedule.breakTime || '60',
            breakType: schedule.breakType || 'unpaid',
            breakStartTime: schedule.breakStartTime || '12:00',
            breakEndTime: schedule.breakEndTime || '13:00',
            totalWorkingHours: schedule.totalWorkingHours || 40,
            gracePeriod: schedule.gracePeriod || 10,
            overtimeEligible: schedule.overtimeEligible !== undefined ? schedule.overtimeEligible : true,
            rotatingSchedule: schedule.rotatingSchedule || false,
            rotationPattern: schedule.rotationPattern || '',
            remoteDays: schedule.remoteDays || [],
            timeZone: schedule.timeZone || 'UTC',
            earliestCheckIn: schedule.earliestCheckIn || '08:30',
            latestCheckOut: schedule.latestCheckOut || '17:30',
            autoClockOut: schedule.autoClockOut !== undefined ? schedule.autoClockOut : true,
            attendanceRequired: schedule.attendanceRequired !== undefined ? schedule.attendanceRequired : true,
            lateThreshold: schedule.lateThreshold || 15,
            earlyLeaveThreshold: schedule.earlyLeaveThreshold || 15,
            assignedEmployees: schedule.assignedEmployees || [],
            contractDuration: schedule.contractDuration || '',
            assignedHolidays: schedule.assignedHolidays || [],
            alertBeforeChange: schedule.alertBeforeChange || false,
            status: schedule.status || 'Active',
            employeeCount: schedule.employeeCount || 0,
            departments: schedule.departments || []
          });
        }
      }
    }
  }, [isEdit, id]);

  // Load user role
  useEffect(() => {
    const role = localStorage.getItem('role');
    setUserRole(role);
  }, []);

  if (userRole === 'manager') {
    return (
      <Layout title={'Work Schedule'} subtitle={'View Only'}>
        <div className="max-w-2xl mx-auto mt-12 p-8 bg-white rounded-lg shadow text-center">
          <h2 className="text-xl font-bold mb-4">View Only</h2>
          <p className="text-gray-700 mb-4">Managers do not have permission to create or edit work schedules. Please contact HR or a Business Configuration Manager for changes.</p>
          <button
            onClick={() => router.push('/demo/work-schedules')}
            className="mt-4 px-6 py-2 bg-[#009D9D] text-white rounded-md hover:bg-[#007a7a]"
          >
            Back to Work Schedules
          </button>
        </div>
      </Layout>
    );
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDayToggle = (day) => {
    const updatedDays = formData.workDays.includes(day)
      ? formData.workDays.filter(d => d !== day)
      : [...formData.workDays, day];
    handleInputChange('workDays', updatedDays);
  };

  const handleDepartmentToggle = (department) => {
    const updatedDepartments = formData.departments.includes(department)
      ? formData.departments.filter(d => d !== department)
      : [...formData.departments, department];
    handleInputChange('departments', updatedDepartments);
  };



  const handleSubmit = (e) => {
    e.preventDefault();
    let stored = localStorage.getItem('workSchedulesData');
    let schedules = [];
    if (stored) {
      try {
        schedules = JSON.parse(stored);
      } catch {}
    }
    if (mode === 'edit' && id) {
      // Update existing
      schedules = schedules.map(s =>
        String(s.id) === String(id)
          ? {
              ...s,
              ...formData,
              updatedAt: new Date().toISOString().slice(0, 10),
            }
          : s
      );
    } else {
      // Add new
      const newId = schedules.length > 0 ? Math.max(...schedules.map(s => Number(s.id))) + 1 : 1;
      schedules.push({
        ...formData,
        id: newId,
        createdAt: new Date().toISOString().slice(0, 10),
        updatedAt: new Date().toISOString().slice(0, 10),
        employeeCount: 0
      });
    }
    localStorage.setItem('workSchedulesData', JSON.stringify(schedules));
    router.push('/demo/work-schedules');
  };

  const handleCancel = () => {
    router.push('/demo/work-schedules');
  };

  return (
    <Layout title={isEdit ? 'Edit Work Schedule' : 'Add Work Schedule'} subtitle={isEdit ? 'Update work schedule details' : 'Create a new work schedule'}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => router.push('/demo/work-schedules')}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Schedules
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Schedule Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="e.g., Standard 9-5, Night Shift"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Schedule Type *</label>
                <select
                  value={formData.scheduleType}
                  onChange={(e) => setFormData({...formData, scheduleType: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="fulltime">Full-Time</option>
                  <option value="parttime">Part-Time</option>
                  <option value="shift">Shift-Based</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="remote">Remote-Only</option>
                  <option value="flexible">Flexible Hours</option>
                  <option value="rotating">Rotating Shifts</option>
                  <option value="seasonal">Seasonal</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Describe the schedule and any special requirements"
                />
              </div>
            </div>
          </div>

          {/* Working Hours Configuration */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Working Hours Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Time *</label>
                <input
                  type={formData.scheduleType === 'flexible' || formData.scheduleType === 'remote' ? 'text' : 'time'}
                  required
                  value={formData.startTime}
                  onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder={formData.scheduleType === 'flexible' || formData.scheduleType === 'remote' ? 'Flexible' : ''}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Time *</label>
                <input
                  type={formData.scheduleType === 'flexible' || formData.scheduleType === 'remote' ? 'text' : 'time'}
                  required
                  value={formData.endTime}
                  onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder={formData.scheduleType === 'flexible' || formData.scheduleType === 'remote' ? 'Flexible' : ''}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Total Weekly Hours</label>
                <input
                  type="number"
                  min="0"
                  max="168"
                  value={formData.totalWorkingHours}
                  onChange={(e) => setFormData({...formData, totalWorkingHours: parseInt(e.target.value) || 0})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="40"
                />
              </div>
            </div>
          </div>

          {/* Work Days Selection */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Work Days</h3>
            <div className="grid grid-cols-2 md:grid-cols-7 gap-2">
              {defaultWorkDays.map((day) => (
                <label key={day} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.workDays.includes(day)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({...formData, workDays: [...formData.workDays, day]});
                      } else {
                        setFormData({...formData, workDays: formData.workDays.filter(d => d !== day)});
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">{day}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Daily Schedule Configuration */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Daily Schedule Configuration</h3>
            <p className="text-sm text-gray-600 mb-4">Configure start and end times for each work day</p>
            <div className="space-y-4">
              {formData.workDays.map((day) => (
                <div key={day} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-24">
                    <span className="text-sm font-medium text-gray-700">{day}</span>
                  </div>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500">Start Time</label>
                      <input
                        type="time"
                        value={formData.startTime}
                        onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                        className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500">End Time</label>
                      <input
                        type="time"
                        value={formData.endTime}
                        onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                        className="w-full border border-gray-300 rounded-md px-2 py-1 text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
              {formData.workDays.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>Select work days above to configure their schedules</p>
                </div>
              )}
            </div>
          </div>

          {/* Break Configuration */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Break Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Break Duration (minutes)</label>
                <input
                  type="number"
                  min="0"
                  max="240"
                  value={formData.breakTime}
                  onChange={(e) => setFormData({...formData, breakTime: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="60"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Break Type</label>
                <select
                  value={formData.breakType}
                  onChange={(e) => setFormData({...formData, breakType: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="unpaid">Unpaid Break</option>
                  <option value="paid">Paid Break</option>
                  <option value="flexible">Flexible Break</option>
                  <option value="none">No Break</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Break Start Time</label>
                <input
                  type="time"
                  value={formData.breakStartTime}
                  onChange={(e) => setFormData({...formData, breakStartTime: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Break End Time</label>
                <input
                  type="time"
                  value={formData.breakEndTime}
                  onChange={(e) => setFormData({...formData, breakEndTime: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Grace Period (minutes)</label>
              <input
                type="number"
                min="0"
                max="60"
                value={formData.gracePeriod}
                onChange={(e) => setFormData({...formData, gracePeriod: parseInt(e.target.value) || 0})}
                className="w-full max-w-xs border border-gray-300 rounded-md px-3 py-2"
                placeholder="10"
              />
              <p className="mt-1 text-xs text-gray-500">Allowable late entry/early exit</p>
            </div>
          </div>



          {/* Advanced Options */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Advanced Options</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Overtime Eligibility</label>
                  <select
                    value={formData.overtimeEligible ? 'true' : 'false'}
                    onChange={(e) => setFormData({...formData, overtimeEligible: e.target.value === 'true'})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="true">Eligible for Overtime</option>
                    <option value="false">Not Eligible for Overtime</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time Zone</label>
                  <select
                    value={formData.timeZone}
                    onChange={(e) => setFormData({...formData, timeZone: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="UTC">UTC</option>
                    <option value="GMT">GMT</option>
                    <option value="EST">EST (Eastern Time)</option>
                    <option value="PST">PST (Pacific Time)</option>
                    <option value="CET">CET (Central European Time)</option>
                    <option value="IST">IST (Indian Standard Time)</option>
                    <option value="GST">GST (Gulf Standard Time)</option>
                  </select>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contract Duration</label>
                  <input
                    type="text"
                    value={formData.contractDuration}
                    onChange={(e) => setFormData({...formData, contractDuration: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="e.g., 6 months, Permanent, Project-based"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.alertBeforeChange}
                    onChange={(e) => setFormData({...formData, alertBeforeChange: e.target.checked})}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label className="ml-2 text-sm text-gray-700">Alert employees before schedule changes</label>
                </div>
              </div>
            </div>
          </div>

          {/* Rotating Schedule */}
          {formData.rotatingSchedule && (
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Rotating Schedule Configuration</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rotation Pattern</label>
                  <textarea
                    rows={3}
                    value={formData.rotationPattern}
                    onChange={(e) => setFormData({...formData, rotationPattern: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="e.g., Week 1: Morning (6 AM - 2 PM), Week 2: Evening (2 PM - 10 PM), Week 3: Night (10 PM - 6 AM)"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Remote Days Configuration */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Remote Days Configuration</h3>
            <p className="text-sm text-gray-600 mb-4">Select which days employees can work remotely (optional)</p>
            <div className="grid grid-cols-2 md:grid-cols-7 gap-2">
              {defaultWorkDays.map((day) => (
                <label key={day} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={(formData.remoteDays || []).includes(day)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({...formData, remoteDays: [...(formData.remoteDays || []), day]});
                      } else {
                        setFormData({...formData, remoteDays: (formData.remoteDays || []).filter(d => d !== day)});
                      }
                    }}
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">{day} (Remote)</span>
                </label>
              ))}
            </div>
          </div>

          {/* Attendance Settings */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Attendance Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Earliest Check-In</label>
                  <input
                    type="time"
                    value={formData.earliestCheckIn}
                    onChange={(e) => setFormData({...formData, earliestCheckIn: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Latest Check-Out</label>
                  <input
                    type="time"
                    value={formData.latestCheckOut}
                    onChange={(e) => setFormData({...formData, latestCheckOut: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Late Threshold (minutes)</label>
                  <input
                    type="number"
                    min="0"
                    max="120"
                    value={formData.lateThreshold}
                    onChange={(e) => setFormData({...formData, lateThreshold: parseInt(e.target.value) || 0})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="15"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Early Leave Threshold (minutes)</label>
                  <input
                    type="number"
                    min="0"
                    max="120"
                    value={formData.earlyLeaveThreshold}
                    onChange={(e) => setFormData({...formData, earlyLeaveThreshold: parseInt(e.target.value) || 0})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="15"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.autoClockOut}
                    onChange={(e) => setFormData({...formData, autoClockOut: e.target.checked})}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label className="ml-2 text-sm text-gray-700">Auto clock-out at schedule end</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.attendanceRequired}
                    onChange={(e) => setFormData({...formData, attendanceRequired: e.target.checked})}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label className="ml-2 text-sm text-gray-700">Attendance tracking required</label>
                </div>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push('/demo/work-schedules')}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#009D9D] text-white rounded-md hover:bg-[#007a7a]"
            >
              {isEdit ? 'Update Schedule' : 'Create Schedule'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default WorkScheduleForm; 