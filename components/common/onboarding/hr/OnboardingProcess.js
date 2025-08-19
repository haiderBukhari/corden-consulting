import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import EmployeeOnboardingCreateUser from './EmployeeOnboardingCreateUser';
import DocumentUploadForm from './DocumentUploadForm';
import ReviewConfirmStep from './ReviewConfirmStep';
import VerificationStep from './VerificationStep';
import { FaUserPlus, FaFileUpload, FaPaperPlane, FaUserCheck } from 'react-icons/fa';
import UploadDocumentForm from './UploadDocumentForm';

const OnboardingProcess = () => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(Number(router.query.resumeStep) || 1);
  const [userId, setUserId] = useState(router.query.userId || null);
  const [userData, setUserData] = useState(null);
  const [documentData, setDocumentData] = useState(null);

  // Sync currentStep with URL
  useEffect(() => {
    if (router.isReady) {
      const step = Number(router.query.resumeStep) || 1;
      setCurrentStep(step);
    }
  }, [router.isReady, router.query.resumeStep]);

  // Update URL on step change
  const goToStep = (step, id) => {
    router.replace({
      pathname: '/HR/onboarding/process',
      query: { userId: id, resumeStep: step }
    }, undefined, { shallow: true });
    setCurrentStep(step);
  };

  // Step 1: Employee form submit
  const handleEmployeeSubmit = (data) => {
    setUserData(data);
    if (data.userId) {
      setUserId(data.userId);
      goToStep(2, data.userId);
    }
  };

  // Step 2: Document upload submit
  const handleDocumentSubmit = (data) => {
    setDocumentData(data);
    goToStep(3, userId);
  };

  // Step 3: Review submit
  const handleReviewSubmit = () => {
    goToStep(4, userId);
  };

  // Step navigation
  const handleBack = () => {
    if (currentStep > 1) {
      goToStep(currentStep - 1, userId);
    }
  };

  const steps = [
    {
      id: 1,
      title: 'Employee Information',
      icon: <FaUserPlus className="w-6 h-6" />,
      component: (
        <EmployeeOnboardingCreateUser
          user_id={userId}
          onSubmit={handleEmployeeSubmit}
          initialData={userData}
        />
      ),
    },
    {
      id: 2,
      title: 'Document Upload',
      icon: <FaFileUpload className="w-6 h-6" />,
      component: (
        <UploadDocumentForm
          onSubmit={handleDocumentSubmit}
          onBack={handleBack}
          user_id={userId}
        />
      ),
    },
    {
      id: 3,
      title: 'Review & Confirm',
      icon: <FaPaperPlane className="w-6 h-6" />,
      component: (
        <ReviewConfirmStep
          userData={userData}
          user_id={userId}
          documentData={documentData}
          onBack={handleBack}
          onConfirmAndSend={handleReviewSubmit}
        />
      ),
    },
    {
      id: 4,
      title: 'User Verification',
      icon: <FaUserCheck className="w-6 h-6" />,
      component: (
        <VerificationStep
          user_id={userId}
          userData={userData}
          onBack={handleBack}
          onComplete={() => router.push('/hr/onboarding/dashboard')}
        />
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            New Employee Onboarding {userData?.fname ? `- ${userData.fname} ${userData.lname}` : ''}
          </h1>
          <p className="mt-2 text-gray-600">Complete all steps to onboard a new employee</p>
        </div>
        <div className="mb-8 p-4 bg-white rounded-lg shadow">
          <div className="flex items-start justify-between">
            {steps.map((step, index) => (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center text-center flex-1 px-2">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 shrink-0 mb-2 transition-colors duration-300 ease-in-out ${
                      currentStep >= step.id ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {step.icon}
                  </div>
                  <div className="text-sm font-medium text-gray-900">{step.title}</div>
                </div>
                {index < steps.length - 1 && (
                  <div className="flex-1 mt-5 lg:mt-6 px-1">
                    <div className="relative w-full">
                      <div className={`absolute inset-0 h-1 w-full transition-colors duration-500 ease-in-out ${
                        currentStep > step.id ? 'bg-primary' : 'bg-gray-200'
                      }`} />
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {steps.find((step) => step.id === currentStep)?.component}
        </div>
      </div>
    </div>
  );
};

export default OnboardingProcess; 