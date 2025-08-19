import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from "../../components/layout/layout";
import { 
  ClipboardDocumentListIcon, 
  ArrowLeftIcon,
  UserIcon,
  ClockIcon,
  DocumentTextIcon,
  CogIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

const AuditLogDetails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [userRole, setUserRole] = useState('');
  const [logDetails, setLogDetails] = useState(null);

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
        category: "employee",
        description: "Salary increase approved for annual review",
        ipAddress: "192.168.1.100",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        sessionId: "sess_123456789",
        relatedRecords: ["EMP-001", "SAL-2023-12"],
        impact: "Medium",
        approvalRequired: false,
        approvedBy: null,
        approvalDate: null
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
        category: "policy",
        description: "New enhanced time off policy with improved benefits",
        ipAddress: "192.168.1.101",
        userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
        sessionId: "sess_123456790",
        relatedRecords: ["POL-2023-001"],
        impact: "High",
        approvalRequired: true,
        approvedBy: "Business Manager",
        approvalDate: "2023-12-08 14:00:00"
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
        category: "system",
        description: "Deactivated intern employment type due to policy changes",
        ipAddress: "192.168.1.100",
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        sessionId: "sess_123456791",
        relatedRecords: ["ET-INT-001"],
        impact: "Low",
        approvalRequired: false,
        approvedBy: null,
        approvalDate: null
      }
    ]
  };

  useEffect(() => {
    const role = localStorage.getItem('role');
    setUserRole(role);

    // Find the log details by ID
    if (id) {
      const log = dummyData.auditLogs.find(log => log.id === parseInt(id));
      setLogDetails(log);
    }
  }, [id]);

  const handleBack = () => {
    router.push('/demo/audit-logs');
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
    if (action.includes('Created')) return <DocumentTextIcon className="h-5 w-5" />;
    if (action.includes('Updated')) return <CogIcon className="h-5 w-5" />;
    if (action.includes('Deleted')) return <ClipboardDocumentListIcon className="h-5 w-5" />;
    if (action.includes('Assigned')) return <UserIcon className="h-5 w-5" />;
    return <DocumentTextIcon className="h-5 w-5" />;
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'High':
        return 'text-red-600 bg-red-100';
      case 'Medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'Low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (!logDetails) {
    return (
      <Layout title={'Audit Log Details'} subtitle={'Loading...'}>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading audit log details...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={'Audit Log Details'} subtitle={'Detailed view of system change'}>
      <div className="max-w-[97%] mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleBack}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Audit Logs
            </button>
          </div>
          <div className="flex items-center space-x-2">
            <ClipboardDocumentListIcon className="h-6 w-6 text-blue-500" />
            <h1 className="text-2xl font-bold text-gray-900">Audit Log Details</h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Primary Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Details */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Change Details</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Action</label>
                    <div className="flex items-center space-x-2">
                      {getActionIcon(logDetails.action)}
                      <span className="text-sm font-medium text-gray-900">{logDetails.action}</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Field</label>
                    <p className="text-sm text-gray-900">{logDetails.field}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Old Value</label>
                    <p className="text-sm text-gray-900">{logDetails.oldValue}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">New Value</label>
                    <p className="text-sm text-gray-900">{logDetails.newValue}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Employee</label>
                    <p className="text-sm text-gray-900">{logDetails.employee}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(logDetails.category)}`}>
                      {logDetails.category}
                    </span>
                  </div>
                </div>
                
                {logDetails.description && (
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <p className="text-sm text-gray-900">{logDetails.description}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Technical Information */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Technical Information</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">IP Address</label>
                    <p className="text-sm text-gray-900 font-mono">{logDetails.ipAddress}</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Session ID</label>
                    <p className="text-sm text-gray-900 font-mono">{logDetails.sessionId}</p>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">User Agent</label>
                    <p className="text-sm text-gray-900 font-mono break-all">{logDetails.userAgent}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Records */}
            {logDetails.relatedRecords && logDetails.relatedRecords.length > 0 && (
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Related Records</h3>
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap gap-2">
                    {logDetails.relatedRecords.map((record, index) => (
                      <span key={index} className="inline-flex px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                        {record}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* User Information */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">User Information</h3>
              </div>
              <div className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <UserIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{logDetails.user}</p>
                    <p className="text-xs text-gray-500">System User</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700">Timestamp</label>
                    <p className="text-sm text-gray-900">{logDetails.timestamp}</p>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700">Impact Level</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getImpactColor(logDetails.impact)}`}>
                      {logDetails.impact}
                    </span>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-700">Approval Required</label>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      logDetails.approvalRequired ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {logDetails.approvalRequired ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Approval Information */}
            {logDetails.approvalRequired && (
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Approval Information</h3>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    {logDetails.approvedBy ? (
                      <>
                        <div>
                          <label className="block text-xs font-medium text-gray-700">Approved By</label>
                          <p className="text-sm text-gray-900">{logDetails.approvedBy}</p>
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700">Approval Date</label>
                          <p className="text-sm text-gray-900">{logDetails.approvalDate}</p>
                        </div>
                        <div className="flex items-center text-green-600">
                          <CheckCircleIcon className="h-4 w-4 mr-1" />
                          <span className="text-xs font-medium">Approved</span>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center text-yellow-600">
                        <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                        <span className="text-xs font-medium">Pending Approval</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  <button className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md">
                    View Related Records
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md">
                    Export Details
                  </button>
                  <button className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md">
                    Report Issue
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AuditLogDetails; 