import React, { useState, useEffect } from 'react';
import Layout from "../../components/layout/layout";
import { 
  UsersIcon, 
  CurrencyPoundIcon,
  DocumentTextIcon,
  CalendarIcon,
  ClockIcon,
  CogIcon,
  PencilIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

const CompensationPolicies = () => {
  const [userRole, setUserRole] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showSalaryModal, setShowSalaryModal] = useState(false);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const [editForm, setEditForm] = useState({
    salary: '',
    effectiveDate: '',
    reason: '',
    timeOffPolicy: '',
    bankHolidayPolicy: '',
    overtimePolicy: '',
    flexibleWorkPolicy: ''
  });

  // Dummy data
  const dummyData = {
    employees: [
      {
        id: 1,
        name: "John Smith",
        jobTitle: "Software Engineer",
        department: "Engineering",
        currentSalary: "£45,000",
        payPolicy: "Standard Pay",
        timeOffPolicy: "Standard Time Off",
        bankHolidayPolicy: "Bank Holiday Standard",
        overtimePolicy: "Overtime Policy A",
        flexibleWorkPolicy: "Flexible Working",
        lastSalaryUpdate: "2023-01-15"
      },
      {
        id: 2,
        name: "Sarah Johnson",
        jobTitle: "HR Manager",
        department: "Human Resources",
        currentSalary: "£55,000",
        payPolicy: "Management Pay",
        timeOffPolicy: "Flexible Time Off",
        bankHolidayPolicy: "Bank Holiday Standard",
        overtimePolicy: "Overtime Policy A",
        flexibleWorkPolicy: "Flexible Working",
        lastSalaryUpdate: "2023-03-15"
      },
      {
        id: 3,
        name: "Mike Wilson",
        jobTitle: "Sales Representative",
        department: "Sales",
        currentSalary: "£30,000",
        payPolicy: "Commission Pay",
        timeOffPolicy: "Standard Time Off",
        bankHolidayPolicy: "Bank Holiday Standard",
        overtimePolicy: "Overtime Policy A",
        flexibleWorkPolicy: "Standard Working",
        lastSalaryUpdate: "2023-03-10"
      },
      {
        id: 4,
        name: "Lisa Brown",
        jobTitle: "Marketing Specialist",
        department: "Marketing",
        currentSalary: "£40,000",
        payPolicy: "Standard Pay",
        timeOffPolicy: "Flexible Time Off",
        bankHolidayPolicy: "Custom Holiday Policy",
        overtimePolicy: "Overtime Policy A",
        flexibleWorkPolicy: "Flexible Working",
        lastSalaryUpdate: "2023-06-05"
      }
    ],
    payPolicies: [
      "Standard Pay",
      "Management Pay", 
      "Commission Pay",
      "Performance Pay",
      "Contract Pay"
    ],
    timeOffPolicies: [
      "Standard Time Off",
      "Flexible Time Off",
      "Enhanced Time Off",
      "Contract Time Off"
    ],
    bankHolidayPolicies: [
      "Bank Holiday Standard",
      "Custom Holiday Policy",
      "Flexible Holiday Policy"
    ],
    overtimePolicies: [
      "Overtime Policy A",
      "Overtime Policy B",
      "No Overtime",
      "Flexible Overtime"
    ],
    flexibleWorkPolicies: [
      "Flexible Working",
      "Standard Working",
      "Remote Working",
      "Hybrid Working"
    ]
  };

  useEffect(() => {
    const role = localStorage.getItem('role');
    setUserRole(role);
  }, []);

  const handleEditSalary = (employee) => {
    setSelectedEmployee(employee);
    setEditForm({
      salary: employee.currentSalary.replace('£', '').replace(',', ''),
      effectiveDate: new Date().toISOString().split('T')[0],
      reason: '',
      timeOffPolicy: employee.timeOffPolicy,
      bankHolidayPolicy: employee.bankHolidayPolicy,
      overtimePolicy: employee.overtimePolicy,
      flexibleWorkPolicy: employee.flexibleWorkPolicy
    });
    setShowSalaryModal(true);
  };

  const handleEditPolicies = (employee) => {
    setSelectedEmployee(employee);
    setEditForm({
      salary: employee.currentSalary.replace('£', '').replace(',', ''),
      effectiveDate: new Date().toISOString().split('T')[0],
      reason: '',
      timeOffPolicy: employee.timeOffPolicy,
      bankHolidayPolicy: employee.bankHolidayPolicy,
      overtimePolicy: employee.overtimePolicy,
      flexibleWorkPolicy: employee.flexibleWorkPolicy
    });
    setShowPolicyModal(true);
  };

  const handleSaveSalary = () => {
    console.log('Saving salary update:', {
      employee: selectedEmployee,
      changes: editForm
    });
    setShowSalaryModal(false);
    setSelectedEmployee(null);
  };

  const handleSavePolicies = () => {
    console.log('Saving policy updates:', {
      employee: selectedEmployee,
      changes: editForm
    });
    setShowPolicyModal(false);
    setSelectedEmployee(null);
  };

  return (
    <Layout title={'Compensation & Policies'} subtitle={'Manage employee salaries and policy assignments'}>
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
              <CurrencyPoundIcon className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Avg Salary</p>
                <p className="text-2xl font-bold text-gray-900">£42,500</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <DocumentTextIcon className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Policies</p>
                <p className="text-2xl font-bold text-gray-900">12</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <CalendarIcon className="h-8 w-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Salary Reviews Due</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
            </div>
          </div>
        </div>

        {/* Employee Compensation Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Employee Compensation & Policies</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Salary</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pay Policy</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time Off Policy</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Update</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.currentSalary}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.payPolicy}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.timeOffPolicy}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.lastSalaryUpdate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {userRole !== 'manager' && (
                          <>
                            <button 
                              onClick={() => handleEditSalary(employee)}
                              className="text-[#009D9D] hover:text-[#006D6D] flex items-center"
                            >
                              <CurrencyPoundIcon className="h-4 w-4 mr-1" />
                              Salary
                            </button>
                            <button 
                              onClick={() => handleEditPolicies(employee)}
                              className="text-green-600 hover:text-green-900 flex items-center"
                            >
                              <CogIcon className="h-4 w-4 mr-1" />
                              Policies
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Policy Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Policy Distribution</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Time Off Policies</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Standard Time Off</span>
                      <span className="text-sm font-medium text-gray-900">2 employees</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Flexible Time Off</span>
                      <span className="text-sm font-medium text-gray-900">2 employees</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Pay Policies</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Standard Pay</span>
                      <span className="text-sm font-medium text-gray-900">2 employees</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Management Pay</span>
                      <span className="text-sm font-medium text-gray-900">1 employee</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Commission Pay</span>
                      <span className="text-sm font-medium text-gray-900">1 employee</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Recent Changes</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="border-l-4 border-blue-400 pl-4">
                  <div className="text-sm font-medium text-gray-900">Sarah Johnson</div>
                  <div className="text-sm text-gray-600">Salary updated to £55,000</div>
                  <div className="text-xs text-gray-500">2 days ago</div>
                </div>
                <div className="border-l-4 border-green-400 pl-4">
                  <div className="text-sm font-medium text-gray-900">Lisa Brown</div>
                  <div className="text-sm text-gray-600">Assigned Flexible Time Off policy</div>
                  <div className="text-xs text-gray-500">1 week ago</div>
                </div>
                <div className="border-l-4 border-purple-400 pl-4">
                  <div className="text-sm font-medium text-gray-900">John Smith</div>
                  <div className="text-sm text-gray-600">Updated to Overtime Policy A</div>
                  <div className="text-xs text-gray-500">2 weeks ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Salary Modal */}
        {userRole !== 'manager' && showSalaryModal && selectedEmployee && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Update Salary</h3>
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-900">{selectedEmployee.name}</div>
                  <div className="text-sm text-gray-600">Current: {selectedEmployee.currentSalary}</div>
                </div>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">New Salary (£)</label>
                    <input 
                      type="number" 
                      value={editForm.salary}
                      onChange={(e) => setEditForm({...editForm, salary: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" 
                    />
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
                    <label className="block text-sm font-medium text-gray-700">Reason</label>
                    <textarea 
                      value={editForm.reason}
                      onChange={(e) => setEditForm({...editForm, reason: e.target.value})}
                      rows={3}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" 
                      placeholder="e.g., Annual review, promotion, etc."
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowSalaryModal(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveSalary}
                      className="px-4 py-2 bg-[#009D9D] text-white rounded-md hover:bg-[#007a7a]"
                    >
                      Update Salary
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Edit Policies Modal */}
        {userRole !== 'manager' && showPolicyModal && selectedEmployee && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Update Policies</h3>
                <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-900">{selectedEmployee.name}</div>
                  <div className="text-sm text-gray-600">{selectedEmployee.jobTitle}</div>
                </div>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Time Off Policy</label>
                    <select 
                      value={editForm.timeOffPolicy}
                      onChange={(e) => setEditForm({...editForm, timeOffPolicy: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      {dummyData.timeOffPolicies.map(policy => (
                        <option key={policy} value={policy}>{policy}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Bank Holiday Policy</label>
                    <select 
                      value={editForm.bankHolidayPolicy}
                      onChange={(e) => setEditForm({...editForm, bankHolidayPolicy: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      {dummyData.bankHolidayPolicies.map(policy => (
                        <option key={policy} value={policy}>{policy}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Overtime Policy</label>
                    <select 
                      value={editForm.overtimePolicy}
                      onChange={(e) => setEditForm({...editForm, overtimePolicy: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      {dummyData.overtimePolicies.map(policy => (
                        <option key={policy} value={policy}>{policy}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Flexible Work Policy</label>
                    <select 
                      value={editForm.flexibleWorkPolicy}
                      onChange={(e) => setEditForm({...editForm, flexibleWorkPolicy: e.target.value})}
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      {dummyData.flexibleWorkPolicies.map(policy => (
                        <option key={policy} value={policy}>{policy}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowPolicyModal(false)}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSavePolicies}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                    >
                      Update Policies
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

export default CompensationPolicies; 