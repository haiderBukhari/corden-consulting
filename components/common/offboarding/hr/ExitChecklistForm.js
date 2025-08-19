import React, { useState, useEffect, useRef } from 'react';
import { FaCheck, FaArrowLeft } from 'react-icons/fa';
import { useOffboardingConfigurations } from '../../../../hooks/query/offboarding/getOffboardingConfigurations';
import DataLoader from '../../../ui/dataLoader';

const ExitChecklistForm = ({ onComplete, onBack, employeeData, initialChecklist = [], isLoading }) => {
  const [checklist, setChecklist] = useState([]);
  const { data: checklistItems = [], isLoading: isLoadingConfig } = useOffboardingConfigurations();
  const isFirstRender = useRef(true);

  // Use initialChecklist if available, otherwise set default from checklistItems
  useEffect(() => {
    if (Array.isArray(initialChecklist) && initialChecklist.length > 0) {
      // If we have initialChecklist data, use it (coming back from step 3)
      setChecklist(initialChecklist);
    } else if (checklistItems.length && checklist.length === 0) {
      // Only set default checklist if we don't have any checklist items yet
      setChecklist(
        checklistItems.map(i => ({
          id: i.id,
          task: i.name,
          status: 'not_started',
          assignedTo: i.type === 'mandatory' ? 'HR' : 'Optional',
          isMandatory: i.type === 'mandatory',
          description: i.description,
        })),
      );
    }
  }, [initialChecklist, checklistItems]);

  // Debugging log to help understand the issue
  useEffect(() => {
    isFirstRender.current = false;
  }, [initialChecklist, checklist]);

  const handleStatusChange = (id, status) => {
    setChecklist(prev => {
      const updated = prev.map(item => {
        if (item.id === id) {
          return {
            ...item,
            status
          };
        }
        return item;
      });
      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onComplete({ checklist });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'not_started':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <FaCheck className="text-green-600" />;
      case 'in_progress':
        return <div className="w-3 h-3 rounded-full bg-yellow-500" />;
      case 'not_started':
        return <div className="w-3 h-3 rounded-full bg-gray-400" />;
      default:
        return <div className="w-3 h-3 rounded-full bg-gray-400" />;
    }
  };

  if (isLoading || isLoadingConfig) {
    return <DataLoader />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-4">
      <div className="bg-white overflow-hidden">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium text-gray-900">Exit Checklist</h3>
          <p className="mt-1 text-sm text-gray-500">
            Complete the following tasks for {employeeData?.fname} {employeeData?.lname}
          </p>
        </div>
        <div className="border-t border-gray-200">
          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-4">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-4 rounded-lg border ${getStatusColor(item.status)
                    }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {getStatusIcon(item.status)}
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">{item.task || item.item}</h4>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <select
                      value={item.status}
                      onChange={(e) => handleStatusChange(item.id, e.target.value)}
                      className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md ${getStatusColor(item.status)
                        }`}
                    >
                      <option value="not_started">Not Started</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
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
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : 'Continue'}
        </button>
      </div>
    </form>
  );
};

export default ExitChecklistForm;