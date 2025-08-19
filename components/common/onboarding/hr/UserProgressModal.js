import React from 'react';
import { FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { useEffect } from 'react';

// Status Icon Component (Moved here)
const StatusIcon = ({ status }) => {
    return status
      ? <FaCheckCircle className="text-green-500 h-5 w-5" title="Completed" />
      : <FaTimesCircle className="text-red-500 h-5 w-5" title="Pending" />;
};

// Renamed and Enhanced Modal
const UserProgressModal = ({ isOpen, onClose, user, refetch }) => {

    useEffect(() => {
        if (isOpen && user) {
          refetch();
        }
      }, [isOpen, user, refetch]);
      
      if (!isOpen || !user) return null;
      
    const stepLabels = [
        "Password Set",
        "Personal Info Reviewed",
        "Documents Reviewed",
        "Policies Acknowledged"
    ];

    const userStep = user?.user_step; // 1-based index
    const isOnboardingComplete = user?.user_onboard === 1 && userStep >= 4;

    // If onboarding is complete, mark all steps as completed
    const progressItems = stepLabels.map((label, idx) => ({
        label,
        status: isOnboardingComplete ? true : idx < (userStep - 1),
        key: label.replace(/\s+/g, '').toLowerCase()
    }));

    // If onboarding is complete, set currentStepIndex to -1 (all done)
    const currentStepIndex = isOnboardingComplete ? -1 : userStep - 1;
    const currentStepLabel = isOnboardingComplete
      ? "All Steps Completed"
      : stepLabels[currentStepIndex] || "All Steps Completed";

    const completedSteps = progressItems.filter(item => item.status).length;
    const totalSteps = progressItems.length;
    const progressPercentage = isOnboardingComplete
      ? 100
      : totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

    return (
        // Overlay
        <div className="fixed -inset-10 bg-black bg-opacity-60 z-40 flex justify-center items-center p-4 transition-opacity duration-300 ease-in-out">
            {/* Modal Content - Added animation class */}
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full z-50 transform transition-all duration-300 ease-in-out scale-95 opacity-0 animate-modal-scale-in">
                 {/* Header */}
                 <div className="flex justify-between items-center p-5 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">Onboarding Progress: {user.name}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 text-3xl font-light leading-none"
                        aria-label="Close modal"
                    >
                        &times;
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-5">
                    {/* Progress Bar */}
                    <div>
                        <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                            <span className="text-sm font-medium text-blue-700">{progressPercentage}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                            <div
                                className="bg-[#009D9D] h-2.5 rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${progressPercentage}%` }}
                            ></div>
                        </div>
                         {currentStepIndex !== -1 && (
                            <p className="text-xs text-gray-500 mt-1">Next Step: {currentStepLabel}</p>
                        )}
                         {currentStepIndex === -1 && (
                             <p className="text-xs text-green-600 mt-1 font-medium">Onboarding Completed!</p>
                         )}
                    </div>

                    {/* Step List */}
                    <div className="space-y-3">
                         <h3 className="text-md font-semibold text-gray-700 border-t pt-4">Progress Details:</h3>
                         {progressItems.map((item, index) => (
                            <div
                                key={item.label}
                                className={`flex items-center justify-between p-3 rounded-md border transition-colors duration-200 ${
                                    index === currentStepIndex ? 'bg-blue-50 border-blue-300 shadow-sm' : 'bg-gray-50' // Highlight current step
                                } ${item.status ? 'border-green-200' : 'border-gray-200'}`}
                            >
                                <span className={`text-sm font-medium ${
                                     index === currentStepIndex ? 'text-blue-800' : item.status ? 'text-gray-500 line-through' : 'text-gray-700' // Style text based on status
                                }`}>
                                    {index + 1}. {item.label}
                                </span>
                                <StatusIcon status={item.status} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 text-right bg-gray-50 rounded-b-lg">
                    <button
                        onClick={onClose}
                        className="px-5 py-2 bg-gray-600 text-white rounded-md text-sm font-medium hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
                    >
                        Close
                    </button>
                </div>

                {/* Animation style */}
                 <style jsx>{`
                    @keyframes modal-scale-in {
                      from { transform: scale(0.9); opacity: 0; }
                      to { transform: scale(1); opacity: 1; }
                    }
                    .animate-modal-scale-in {
                      animation: modal-scale-in 0.3s ease-out forwards;
                    }
                `}</style>
            </div>
        </div>
    );
};

export default UserProgressModal; 