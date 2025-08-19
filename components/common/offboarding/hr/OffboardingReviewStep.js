import React from 'react';
import { FaCheck, FaTimes, FaArrowLeft } from 'react-icons/fa';
import { format, isValid } from 'date-fns';

const OffboardingReviewStep = ({ offboardingData, onConfirm, onBack }) => {
  const {
    employee,
    exitType,
    lastWorkingDay,
    reason,
    attachments,
    checklist,
  } = offboardingData;

  // Use checklist based on what's available
  const displayChecklist = checklist || [];
  // Use attachments based on what's available
  const displayDocuments = attachments || [];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'in_progress':
        return 'text-yellow-600';
      case 'not_started':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    return status === 'completed' ? (
      <FaCheck className="h-5 w-5 text-green-500" />
    ) : (
      <FaTimes className="h-5 w-5 text-gray-400" />
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return isValid(date) ? format(date, 'MMMM d, yyyy') : 'Invalid date';
  };

  return (
    <div className="space-y-6 p-4">
      <div className="bg-white overflow-hidden">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Review Offboarding Details
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Please review all the information before finalizing the offboarding process.
          </p>
        </div>

        <div className="border-t border-gray-200">
          <dl className="divide-y divide-gray-200">
            <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Employee</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {employee?.fname} {employee?.lname} ({employee?.employee_id || 'N/A'})
              </dd>
            </div>

            <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Manager</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {employee?.reports_to_manager || 'N/A'}
              </dd>
            </div>

            <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Exit Type</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 capitalize">
                {exitType.replace(/_/g, ' ').replace(/^./, c => c.toUpperCase())}
              </dd>
            </div>

            <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Last Working Day</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {formatDate(lastWorkingDay)}
              </dd>
            </div>

            <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Reason for Leaving</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {reason}
              </dd>
            </div>

            <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Attachments</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {displayDocuments.length > 0 ? (
                  <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                    {displayDocuments.map((doc, index) => (
                      <li key={index} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                        <div className="w-0 flex-1 flex items-center">
                          <span className="ml-2 flex-1 w-0 truncate">
                            {doc.file_name || 'File'}
                          </span>
                        </div>
                        <div className="ml-4 flex-shrink-0">
                          <a 
                            href={doc?.file_path || (typeof doc === 'string' ? doc : '#')} 
                            download
                            className="font-medium text-primary hover:text-primary-dark"
                          >
                            Download
                          </a>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-gray-500">No attachments</span>
                )}
              </dd>
            </div>

            <div className="px-4 py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Checklist Status</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {displayChecklist.length > 0 ? (
                  <ul className="border border-gray-200 rounded-md divide-y divide-gray-200">
                    {displayChecklist.map((item) => (
                      <li key={item?.id} className="pl-3 pr-4 py-3 flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          {getStatusIcon(item?.status)}
                          <span className="ml-2">{item?.item}</span>
                          {item?.isMandatory && (
                            <span className="ml-2 text-xs text-red-600">(Mandatory)</span>
                          )}
                        </div>
                        <span className={`ml-2 capitalize ${getStatusColor(item.status)}`}>
                          {item.status.replace('_', ' ')}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-gray-500">No checklist items</span>
                )}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <FaArrowLeft className="mr-2" />
          Back
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Confirm and Continue
        </button>
      </div>
    </div>
  );
};

export default OffboardingReviewStep; 