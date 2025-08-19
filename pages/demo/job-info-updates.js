import React, { useState, useEffect } from 'react';
import Layout from "../../components/layout/layout";
import { 
  UsersIcon, 
  PencilIcon,
  CalendarIcon,
  BriefcaseIcon,
  CheckIcon,
  XMarkIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const JobInfoUpdates = () => {
  const [userRole, setUserRole] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    jobTitle: '',
    employmentType: '',
    hireDate: '',
    effectiveDate: '',
    reason: ''
  });

  // Dummy data
  const dummyData = {
    employees: [
      {
        id: 1,
        name: "John Smith",
        jobTitle: "Software Engineer",
        employmentType: "Full-Time",
        hireDate: "2023-01-15",
        department: "Engineering",
        status: "Active",
        currentJobTitle: "Software Engineer",
        currentEmploymentType: "Full-Time",
        lastUpdate: "2023-01-15"
      },
      {
        id: 2,
        name: "Sarah Johnson",
        jobTitle: "HR Manager",
        employmentType: "Full-Time",
        hireDate: "2022-08-20",
        department: "Human Resources",
        status: "Active",
        currentJobTitle: "HR Manager",
        currentEmploymentType: "Full-Time",
        lastUpdate: "2022-08-20"
      },
      {
        id: 3,
        name: "Mike Wilson",
        jobTitle: "Sales Representative",
        employmentType: "Part-Time",
        hireDate: "2023-03-10",
        department: "Sales",
        status: "On Leave",
        currentJobTitle: "Sales Representative",
        currentEmploymentType: "Part-Time",
        lastUpdate: "2023-03-10"
      },
      {
        id: 4,
        name: "Lisa Brown",
        jobTitle: "Marketing Specialist",
        employmentType: "Contract",
        hireDate: "2023-06-05",
        department: "Marketing",
        status: "Active",
        currentJobTitle: "Marketing Specialist",
        currentEmploymentType: "Contract",
        lastUpdate: "2023-06-05"
      }
    ],
    employmentTypes: [
      "Full-Time",
      "Part-Time", 
      "Contract",
      "Temporary",
      "Internship"
    ]
  };

  useEffect(() => {
    const role = localStorage.getItem('role');
    setUserRole(role);
  }, []);

  const handleEditJobInfo = (employee) => {
    setSelectedEmployee(employee);
    setEditForm({
      jobTitle: employee.currentJobTitle,
      employmentType: employee.currentEmploymentType,
      hireDate: employee.hireDate,
      effectiveDate: new Date().toISOString().split('T')[0],
      reason: ''
    });
    setShowEditModal(true);
  };

  const handleSaveChanges = () => {
    // Here you would implement the "Save & Create New History Line" logic
    console.log('Saving changes with history tracking:', {
      employee: selectedEmployee,
      changes: editForm
    });
    setShowEditModal(false);
    setSelectedEmployee(null);
  };

  return (
    <Layout title={'Job Info Updates'} subtitle={'Update employee job information with history tracking'}>
      <div className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
              <BriefcaseIcon className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Job Changes This Month</p>
                <p className="text-2xl font-bold text-gray-900">2</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <ClockIcon className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Updates</p>
                <p className="text-2xl font-bold text-gray-900">1</p>
              </div>
            </div>
          </div>
        </div>

        {/* Employee Job Info Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Employee Job Information</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Job Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employment Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hire Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Update</th>
                  {userRole === 'business_manager' && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  )}
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
                          <div className="text-sm text-gray-500">{employee.department}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.currentJobTitle}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.currentEmploymentType}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.hireDate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.lastUpdate}</td>
                    {userRole === 'business_manager' && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button 
                            onClick={() => handleEditJobInfo(employee)}
                            className="text-[#009D9D] hover:text-[#006D6D] flex items-center"
                          >
                            <PencilIcon className="h-4 w-4 mr-1" />
                            Edit
                          </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Job Changes */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Job Changes</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="border-l-4 border-blue-400 pl-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">John Smith</div>
                    <div className="text-sm text-gray-600">Software Engineer → Senior Software Engineer</div>
                    <div className="text-xs text-gray-500">Effective: 2023-06-01 | Reason: Promotion</div>
                  </div>
                  <span className="text-xs text-gray-500">2 days ago</span>
                </div>
              </div>
              <div className="border-l-4 border-green-400 pl-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">Sarah Johnson</div>
                    <div className="text-sm text-gray-600">HR Specialist → HR Manager</div>
                    <div className="text-xs text-gray-500">Effective: 2023-03-15 | Reason: Promotion</div>
                  </div>
                  <span className="text-xs text-gray-500">1 week ago</span>
                </div>
              </div>
              <div className="border-l-4 border-yellow-400 pl-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">Mike Wilson</div>
                    <div className="text-sm text-gray-600">Full-Time → Part-Time</div>
                    <div className="text-xs text-gray-500">Effective: 2023-09-01 | Reason: Personal request</div>
                  </div>
                  <span className="text-xs text-gray-500">2 weeks ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Job Info Modal: Only HR Manager and Business Config Manager */}
        {userRole === 'business_manager' && showEditModal && selectedEmployee && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Update Job Information</h3>
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-900">{selectedEmployee.name}</div>
                  <div className="text-sm text-gray-600">{selectedEmployee.department}</div>
                </div>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Job Title</label>
                    <input 
                      type="text" 
                      value={editForm.jobTitle}
                      onChange={(e) => setEditForm({...editForm, jobTitle: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Employment Type</label>
                    <select 
                      value={editForm.employmentType}
                      onChange={(e) => setEditForm({...editForm, employmentType: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      {dummyData.employmentTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                      {/* Only Business Config Manager can add new types (UI for adding not shown here) */}
                      {userRole === 'business_manager' && <option value="new">+ Add New Type</option>}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Effective Date</label>
                    <input 
                      type="date" 
                      value={editForm.effectiveDate}
                      onChange={(e) => setEditForm({...editForm, effectiveDate: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Reason for Change</label>
                    <textarea 
                      value={editForm.reason}
                      onChange={(e) => setEditForm({...editForm, reason: e.target.value})}
                      rows={3}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" 
                      placeholder="e.g., Promotion, Role change, etc."
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowEditModal(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveChanges}
                      className="px-4 py-2 bg-[#009D9D] text-white rounded-md hover:bg-[#007a7a]"
                    >
                      Save & Create History Line
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

export default JobInfoUpdates; 