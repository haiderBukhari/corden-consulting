import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from "../../components/layout/layout";
import { 
  ClipboardDocumentListIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
  EyeIcon,
  UserIcon,
  ClockIcon,
  DocumentTextIcon,
  CogIcon
} from '@heroicons/react/24/outline';

const AuditLogs = () => {
  const router = useRouter();
  const [userRole, setUserRole] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Dummy data
  const dummyData = {
    auditLogs: [
      {
        id: 1,
        user: "Business Manager",
        action: "Updated Employee",
        field: "Salary",
        oldValue: "£45,000",
        newValue: "£48,000",
        employee: "John Smith",
        timestamp: "2023-12-08 14:30:25",
        category: "employee"
      },
      {
        id: 2,
        user: "HR Manager",
        action: "Created Policy",
        field: "New Policy",
        oldValue: "N/A",
        newValue: "Enhanced Time Off Policy",
        employee: "N/A",
        timestamp: "2023-12-08 13:45:12",
        category: "policy"
      },
      {
        id: 3,
        user: "Business Manager",
        action: "Updated Employment Type",
        field: "Status",
        oldValue: "Active",
        newValue: "Inactive",
        employee: "Intern",
        timestamp: "2023-12-08 12:20:45",
        category: "system"
      },
      {
        id: 4,
        user: "HR Manager",
        action: "Assigned Policy",
        field: "Policy Assignment",
        oldValue: "Standard Time Off",
        newValue: "Flexible Time Off",
        employee: "Sarah Johnson",
        timestamp: "2023-12-08 11:15:30",
        category: "policy"
      },
      {
        id: 5,
        user: "Business Manager",
        action: "Updated Work Location",
        field: "Location",
        oldValue: "London",
        newValue: "Manchester",
        employee: "Mike Wilson",
        timestamp: "2023-12-08 10:30:15",
        category: "employee"
      },
      {
        id: 6,
        user: "Business Manager",
        action: "Created Employment Type",
        field: "New Type",
        oldValue: "N/A",
        newValue: "Apprentice",
        employee: "N/A",
        timestamp: "2023-12-08 09:45:22",
        category: "system"
      },
      {
        id: 7,
        user: "HR Manager",
        action: "Updated Employee",
        field: "Department",
        oldValue: "Sales",
        newValue: "Marketing",
        employee: "Lisa Brown",
        timestamp: "2023-12-08 08:20:10",
        category: "employee"
      },
      {
        id: 8,
        user: "Business Manager",
        action: "Deleted Policy",
        field: "Policy Removal",
        oldValue: "Old Overtime Policy",
        newValue: "Deleted",
        employee: "N/A",
        timestamp: "2023-12-07 16:45:33",
        category: "policy"
      },
      {
        id: 9,
        user: "Business Manager",
        action: "Updated System Dropdown",
        field: "Work Locations",
        oldValue: "Edinburgh",
        newValue: "Inactive",
        employee: "N/A",
        timestamp: "2023-12-07 15:30:18",
        category: "system"
      },
      {
        id: 10,
        user: "HR Manager",
        action: "Bulk Update",
        field: "Policy Assignment",
        oldValue: "Various",
        newValue: "Standard Time Off",
        employee: "5 employees",
        timestamp: "2023-12-07 14:15:45",
        category: "bulk"
      }
    ]
  };

  useEffect(() => {
    const role = localStorage.getItem('role');
    setUserRole(role);
  }, []);

  const filteredLogs = dummyData.auditLogs.filter(log => {
    const matchesSearch = 
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.field.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || log.category === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  const handleViewDetails = (log) => {
    router.push(`/demo/audit-log-details?id=${log.id}`);
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'employee':
        return 'bg-blue-100 text-blue-800';
      case 'policy':
        return 'bg-green-100 text-green-800';
      case 'system':
        return 'bg-purple-100 text-purple-800';
      case 'bulk':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getActionIcon = (action) => {
    if (action.includes('Created')) return <DocumentTextIcon className="h-4 w-4" />;
    if (action.includes('Updated')) return <CogIcon className="h-4 w-4" />;
    if (action.includes('Deleted')) return <ClipboardDocumentListIcon className="h-4 w-4" />;
    if (action.includes('Assigned')) return <UserIcon className="h-4 w-4" />;
    return <DocumentTextIcon className="h-4 w-4" />;
  };

  return (
    <Layout title={'Audit Logs'} subtitle={'Track all system changes and modifications'}>
      <div className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <ClipboardDocumentListIcon className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Logs</p>
                <p className="text-2xl font-bold text-gray-900">{dummyData.auditLogs.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <UserIcon className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Employee Changes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dummyData.auditLogs.filter(log => log.category === 'employee').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                <DocumentTextIcon className="h-5 w-5 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Policy Changes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dummyData.auditLogs.filter(log => log.category === 'policy').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
                <CogIcon className="h-5 w-5 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">System Changes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dummyData.auditLogs.filter(log => log.category === 'system').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search logs by user, action, employee, or field..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#009D9D]"
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <FunnelIcon className="h-5 w-5 text-gray-400" />
                <select 
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Categories</option>
                  <option value="employee">Employee Changes</option>
                  <option value="policy">Policy Changes</option>
                  <option value="system">System Changes</option>
                  <option value="bulk">Bulk Operations</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Audit Logs Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Field</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                          <UserIcon className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{log.user}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getActionIcon(log.action)}
                        <span className="ml-2 text-sm text-gray-900">{log.action}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.field}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{log.employee}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(log.category)}`}>
                        {log.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {log.timestamp && log.timestamp.includes(' ')
                        ? (<span><span>{log.timestamp.split(' ')[0]}</span><br/><span className="text-xs text-gray-500">{log.timestamp.split(' ')[1]}</span></span>)
                        : log.timestamp}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        onClick={() => handleViewDetails(log)}
                        className="text-[#009D9D] hover:text-[#006D6D] flex items-center"
                        title="View Details"
                      >
                        <EyeIcon className="h-4 w-4 mr-1" />
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>


      </div>
    </Layout>
  );
};

export default AuditLogs; 