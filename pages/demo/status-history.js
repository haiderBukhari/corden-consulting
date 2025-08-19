import React, { useState, useEffect } from 'react';
import Layout from "../../components/layout/layout";
import { 
  UsersIcon, 
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  DocumentTextIcon,
  PencilIcon,
  ChatBubbleLeftIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';

const StatusHistory = () => {
  const [userRole, setUserRole] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const router = useRouter();

  const LOCAL_KEY = 'employeeData';
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const role = localStorage.getItem('role');
    setUserRole(role);
    let stored = localStorage.getItem(LOCAL_KEY);
    let parsed = [];
    if (stored) {
      try {
        parsed = JSON.parse(stored);
      } catch {}
    }
    setEmployees(parsed);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'On Leave':
        return 'bg-yellow-100 text-yellow-800';
      case 'Suspended':
        return 'bg-orange-100 text-orange-800';
      case 'Terminated':
        return 'bg-red-100 text-red-800';
      case 'Retired':
        return 'bg-gray-100 text-gray-800';
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
      case 'Suspended':
        return <ClockIcon className="h-5 w-5 text-orange-600" />;
      case 'Terminated':
        return <XCircleIcon className="h-5 w-5 text-red-600" />;
      case 'Retired':
        return <AcademicCapIcon className="h-5 w-5 text-gray-600" />;
      default:
        return <UsersIcon className="h-5 w-5 text-gray-600" />;
    }
  };

  const handleUpdateStatus = (employee) => {
    router.push(`/demo/status-update?id=${employee.id}`);
  };

  const handleViewHistory = (employee) => {
    router.push(`/demo/status-history-view?id=${employee.id}`);
  };

  const handleSaveStatus = () => {
    console.log('Saving status update:', {
      employee: selectedEmployee,
      changes: editForm
    });
    setShowStatusModal(false);
    setSelectedEmployee(null);
  };

  return (
    <Layout title={'Status & History'} subtitle={'Update employee status and view employment history'}>
      <div className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <UsersIcon className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Employees</p>
                <p className="text-2xl font-bold text-gray-900">{employees.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <CheckCircleIcon className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Employees</p>
                <p className="text-2xl font-bold text-gray-900">{employees.filter(emp => emp.currentStatus === 'Active').length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <ClockIcon className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">On Leave</p>
                <p className="text-2xl font-bold text-gray-900">{employees.filter(emp => emp.currentStatus === 'On Leave').length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <XCircleIcon className="h-8 w-8 text-red-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Terminated</p>
                <p className="text-2xl font-bold text-gray-900">{employees.filter(emp => emp.currentStatus === 'Terminated').length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Employee Status Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Employee Status Overview</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Status Change</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {employees.map((employee) => (
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
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(employee.currentStatus || 'Active')}
                        <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(employee.currentStatus || 'Active')}`}>
                          {employee.currentStatus || 'Active'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.lastStatusChange || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employee.statusReason ? employee.statusReason : '—'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {/* Only Business Config Manager can update status */}
                        {userRole === 'business_manager' && (
                          <button 
                            onClick={() => handleUpdateStatus(employee)}
                            className="text-[#009D9D] hover:text-[#006D6D] flex items-center"
                          >
                            <PencilIcon className="h-4 w-4 mr-1" />
                            Update Status
                          </button>
                        )}
                        {/* All roles can view history */}
                        <button 
                          onClick={() => handleViewHistory(employee)}
                          className="text-green-600 hover:text-green-900 flex items-center"
                        >
                          <DocumentTextIcon className="h-4 w-4 mr-1" />
                          View History
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Status Changes */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Status Changes</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              <div className="border-l-4 border-yellow-400 pl-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">Mike Wilson</div>
                    <div className="text-sm text-gray-600">Active → On Leave</div>
                    <div className="text-xs text-gray-500">Reason: Annual Leave | Notes: Taking annual leave for 2 weeks</div>
                  </div>
                  <span className="text-xs text-gray-500">Dec 1, 2023</span>
                </div>
              </div>
              <div className="border-l-4 border-red-400 pl-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">Emma Davis</div>
                    <div className="text-sm text-gray-600">Active → Terminated</div>
                    <div className="text-xs text-gray-500">Reason: Resigned | Notes: Employee resigned for personal reasons</div>
                  </div>
                  <span className="text-xs text-gray-500">Nov 15, 2023</span>
                </div>
              </div>
              <div className="border-l-4 border-green-400 pl-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-900">Sarah Johnson</div>
                    <div className="text-sm text-gray-600">Active → Active (Promotion)</div>
                    <div className="text-xs text-gray-500">Reason: Promotion | Notes: Promoted to HR Manager</div>
                  </div>
                  <span className="text-xs text-gray-500">Mar 15, 2023</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StatusHistory; 