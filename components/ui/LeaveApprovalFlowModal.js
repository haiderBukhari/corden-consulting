import React from 'react';

const ApprovalFlowModal = ({ isOpen, onClose, leaveFlow }) => {
  if (!isOpen) return null;

  const steps = [];

  // Build the steps array based on leaveFlow data
  if (leaveFlow.role === 'staff' && leaveFlow.team_lead) {
    steps.push(
      { label: 'Team Lead', name: leaveFlow.team_lead },
      { label: 'HR', name: leaveFlow.hr },
      { label: 'Manager', name: leaveFlow.manager }
    );
  } else if (leaveFlow.role === 'staff' && !leaveFlow.team_lead) {
    steps.push(
      { label: 'HR', name: leaveFlow.hr },
      { label: 'Manager', name: leaveFlow.manager }
    );
  } else if (leaveFlow.role === 'HR') {
    steps.push({ label: 'Manager', name: leaveFlow.manager });
  } else if (leaveFlow.manager) {
    steps.push(
      { label: 'HR', name: leaveFlow.hr },
      { label: 'Manager', name: leaveFlow.manager }
    );
  }

  // Helper function to render the approval timeline
  const renderApprovalTimeline = () => {
    return (
      <div className="flex items-center justify-center w-full">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            {/* Circle with Number */}
            <div className="flex flex-col items-center">
              <div className="h-10 w-10 rounded-full flex items-center justify-center bg-primary text-white font-bold text-lg">
                {index + 1}
              </div>
              {/* Name and Label */}
              <div className="mt-2 text-center px-2" style={{ minWidth: '80px' }}>
                <p className="text-base font-medium break-words">{step.name}</p>
                <p className="text-sm text-gray-500">{step.label}</p>
              </div>
            </div>
            {/* Line connecting to the next circle */}
            {index < steps.length - 1 && (
              <div className="flex items-center">
                <div className="h-0.5 w-32 bg-gray-400" style={{ marginTop: "-40px" }}></div>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">
        {leaveFlow ? (
          <>
            <h2 className="text-2xl font-semibold mb-4 text-center">Approval Flow</h2>
            <div className="flex flex-col items-center mt-8 w-full">
              {renderApprovalTimeline()}
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={onClose}
                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary hover:bg-opacity-40"
              >
                Close
              </button>
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApprovalFlowModal;
