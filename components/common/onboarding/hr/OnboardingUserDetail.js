import React from 'react';
import { format } from 'date-fns';
import { FaTimes, FaCheck, FaClock, FaFileUpload, FaEnvelope, FaUserCheck } from 'react-icons/fa';
import { MdPerson } from 'react-icons/md';

const OnboardingUserDetail = ({ user, onClose }) => {
  const steps = [
    {
      id: 1,
      title: 'Employee Information',
      description: 'Basic details and account setup',
      icon: <MdPerson className="w-5 h-5" />,
      status: user?.employeeInfoCompletedAt ? 'completed' : 'pending',
      completedAt: user?.employeeInfoCompletedAt,
    },
    {
      id: 2,
      title: 'Document Upload',
      description: 'Required documents and forms',
      icon: <FaFileUpload className="w-5 h-5" />,
      status: user?.documentsCompletedAt ? 'completed' :
              (user?.employeeInfoCompletedAt && !user?.documentsCompletedAt) ? 'in_progress' : 'pending',
      completedAt: user?.documentsCompletedAt,
      progress: user?.documentsProgress || 0,
      totalDocuments: user?.totalDocuments || 0,
      uploadedDocuments: user?.uploadedDocuments || 0,
    },
    {
      id: 3,
      title: 'Welcome Email',
      description: 'Send welcome email and credentials',
      icon: <FaEnvelope className="w-5 h-5" />,
      status: user?.welcomeEmailSentAt ? 'completed' :
              (user?.documentsCompletedAt && !user?.welcomeEmailSentAt) ? 'in_progress' : 'pending',
      completedAt: user?.welcomeEmailSentAt,
    },
    {
      id: 4,
      title: 'Verification',
      description: 'Waiting for user verification',
      icon: <FaUserCheck className="w-5 h-5" />,
      status: user?.verificationCompletedAt ? 'completed' :
              (user?.welcomeEmailSentAt && !user?.verificationCompletedAt) ? 'in_progress' : 'pending',
      completedAt: user?.verificationCompletedAt,
    },
    {
      id: 5,
      title: 'Confirmation',
      description: 'Onboarding process finalized',
      icon: <FaCheck className="w-5 h-5" />,
      status: user?.completedAt ? 'completed' :
              (user?.verificationCompletedAt && !user?.completedAt) ? 'in_progress' : 'pending',
      completedAt: user?.completedAt,
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in_progress':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-200';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in_progress':
        return 'In Progress';
      default:
        return 'Pending';
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const completedSteps = steps.filter(step => step.status === 'completed').length;
  const overallProgress = Math.round((completedSteps / steps.length) * 100);

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Onboarding Details</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <FaTimes className="w-5 h-5" />
            </button>
          </div>

          {/* Employee Info */}
          <div className="mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {user?.photo ? (
                  <img src={user.photo} alt={user.fullName} className="w-full h-full object-cover" />
                ) : (
                  <MdPerson className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div>
                <h3 className="text-xl font-medium text-gray-900">{user?.fullName}</h3>
                <p className="text-gray-500">{user?.email}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Start Date: {user?.startDate ? format(new Date(user.startDate), 'MMM dd, yyyy') : 'N/A'}
                </p>
              </div>
            </div>
          </div>

          {/* Overall Progress */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Overall Progress</span>
              <span className="text-sm font-medium text-gray-700">
                {overallProgress}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-primary h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-0">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-start">
                {/* Step Icon and Connector */}
                <div className="flex flex-col items-center mr-4">
                  <div className={`w-10 h-10 rounded-full ${getStatusColor(step.status)} text-white flex items-center justify-center flex-shrink-0`}>
                    {step.icon}
                  </div>
                  {/* Vertical connector line */}
                  {index < steps.length - 1 && (
                    <div className={`w-0.5 flex-grow ${completedSteps > index ? getStatusColor('completed') : 'bg-gray-200'}`}>
                      {/* Ensuring the line has height by adding a min-height */}
                      <div className="min-h-[24px]"></div>
                    </div>
                  )}
                </div>

                {/* Step Content */}
                <div className="flex-1 pb-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{step.title}</h4>
                      <p className="text-sm text-gray-500">{step.description}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(step.status)}`}>
                      {getStatusText(step.status)}
                    </span>
                  </div>

                  {/* Document Upload Progress */}
                  {step.id === 2 && step.status !== 'pending' && (
                    <div className="mt-2">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <span>Documents Uploaded</span>
                        <span>{step.uploadedDocuments} of {step.totalDocuments}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-yellow-500 h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${(step.uploadedDocuments / step.totalDocuments) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Completion Date */}
                  {step.completedAt && (
                    <p className="text-sm text-gray-500 mt-2">
                      Completed on {format(new Date(step.completedAt), 'MMM dd, yyyy')}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Close
            </button>
            {user?.status !== 'Completed' && (
              <button
                onClick={() => {
                  onClose();
                  window.location.href = `/hr/onboarding/${user.id}`;
                }}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90"
              >
                Continue Onboarding
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingUserDetail; 