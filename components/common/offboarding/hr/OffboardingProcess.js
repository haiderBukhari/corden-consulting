import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import OffboardingInitiationForm from './OffboardingInitiationForm';
import ExitChecklistForm from './ExitChecklistForm';
import OffboardingReviewStep from './OffboardingReviewStep';
import { FaUserMinus, FaClipboardCheck, FaPaperPlane, FaUserCheck } from 'react-icons/fa';
import { format, isValid } from 'date-fns';
import { useOffboardingStepOne } from '../../../../hooks/mutations/offboarding/offBoardingProcessOne';
import { useOffboardingStepTwo } from '../../../../hooks/mutations/offboarding/offBoardingProcessTwo';
import { useOffboardingStepFour } from '../../../../hooks/mutations/offboarding/offBoardingProcessFour';
import { useEditOffboardingStepOne } from '../../../../hooks/mutations/offboarding/editOffBoardingProcessOne';
import { useOffboardingReviewDetails } from '../../../../hooks/query/offboarding/getOffboardingProcessThreeDetails';
import DataLoader from '../../../ui/dataLoader';

const OffboardingProcess = ({ initialData = null }) => {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(Number(router.query.resumeStep) || 1);
  const [offboardingId, setOffboardingId] = useState(router.query.offboardingId || null);
  const [isEditing, setIsEditing] = useState(false);
  const [offboardingData, setOffboardingData] = useState({
    employee: null,
    exitType: '',
    lastWorkingDay: '',
    reason: '',
    attachments: [],
    checklist: [],
    status: 'pending'
  });

  // Initial review data fetch
  const { data: initialReviewData, isLoading: isLoadingInitialReview } = useOffboardingReviewDetails(
    initialData?.id || offboardingId
  );

  // Separate review data fetch for step 3
  const { data: reviewStepData, isLoading: isLoadingReviewStep } = useOffboardingReviewDetails(
    currentStep === 3 ? offboardingId : null
  );

  // Use resumeStep from URL to determine which step to show
  useEffect(() => {
    if (router.isReady) {
      const step = Number(router.query.resumeStep) || 1;
      setCurrentStep(step);
      // If we have an offboardingId, we're in edit mode
      if (router.query.offboardingId) {
        setIsEditing(true);
      }
    }
  }, [router.isReady, router.query.resumeStep, router.query.offboardingId]);

  // Update state when initial review data is loaded
  useEffect(() => {
    if (initialReviewData) {
      setOffboardingData({
        employee: {
          ...initialReviewData.user,
          department: {
            departments_name: initialReviewData.department,
            id: initialReviewData.user.department_id
          },
          position: {
            name: initialReviewData.position,
            id: initialReviewData.user.position_id
          },
          manager_id: initialReviewData.manager_id,
          reports_to_manager: initialReviewData.manager ? `${initialReviewData.manager.fname} ${initialReviewData.manager.lname}` : null
        },
        exitType: initialReviewData.exit_type,
        lastWorkingDay: initialReviewData.last_working_day,
        reason: initialReviewData.reason,
        attachments: initialReviewData.attachments || [],
        checklist: initialReviewData.exit_checklist || [],
        status: initialReviewData.offboarding_status,
        notifyManager: initialReviewData.notify_manager ?? true,
        notifyFinance: initialReviewData.notify_finance ?? true
      });
      setOffboardingId(initialReviewData.id);
    }
  }, [initialReviewData, isEditing]);

  // Update state when review step data is loaded (for step 3)
  useEffect(() => {
    if (currentStep === 3 && reviewStepData) {
      setOffboardingData({
        employee: {
          ...reviewStepData.user,
          department: {
            departments_name: reviewStepData.department,
            id: reviewStepData.user.department_id
          },
          position: {
            name: reviewStepData.position,
            id: reviewStepData.user.position_id
          },
          manager_id: reviewStepData.manager_id,
          reports_to_manager: reviewStepData.manager ? `${reviewStepData.manager.fname} ${reviewStepData.manager.lname}` : null
        },
        exitType: reviewStepData.exit_type,
        lastWorkingDay: reviewStepData.last_working_day,
        reason: reviewStepData.reason,
        attachments: reviewStepData.attachments || [],
        checklist: reviewStepData.exit_checklist || [],
        status: reviewStepData.offboarding_status,
        notifyManager: reviewStepData.notify_manager ?? true,
        notifyFinance: reviewStepData.notify_finance ?? true
      });
    }
  }, [currentStep, reviewStepData]);

  const { mutate: submitStepOne, isLoading: isSubmittingStepOne } = useOffboardingStepOne();
  const { mutate: editStepOne, isLoading: isEditingStepOne } = useEditOffboardingStepOne();
  const { mutate: submitStepTwo, isLoading: isSubmittingStepTwo } = useOffboardingStepTwo();
  const { mutate: submitStepFour, isLoading: isSubmittingStepFour } = useOffboardingStepFour();

  const handleStepComplete = (stepData) => {
    if (currentStep === 1) {
      const stepOneData = {
        user_id: stepData.employee.id,
        emp_id: stepData.employee.employee_id || '',
        department: stepData.employee.department?.departments_name || '',
        position: stepData.employee.position?.name || '',
        joining_date: stepData.employee.date_of_joining,
        manager_id: stepData.employee.manager_id || '',
        exit_type: stepData.exitType,
        last_working_day: format(new Date(stepData.lastWorkingDay), 'MM/dd/yyyy'),
        reason: stepData.reason,
        attachments: stepData.attachments || [],
        existing_attachment_ids: stepData.existing_attachment_ids || [],
        notifyManager: stepData.notifyManager,
        notifyFinance: stepData.notifyFinance
      };

      if (isEditing) {
        // If editing, use edit mutation
        editStepOne({
          ...stepOneData,
          id: offboardingId
        }, {
          onSuccess: () => {
            setOffboardingData(prev => ({ ...prev, ...stepData }));
            // Move to step 2
            router.replace({
              pathname: '/HR/offboarding/process',
              query: { 
                offboardingId,
                resumeStep: 2
              }
            }, undefined, { shallow: true });
          }
        });
      } else {
        // If new, use create mutation
        submitStepOne(stepOneData, {
          onSuccess: (response) => {
            setOffboardingId(response.response.id);
            setOffboardingData(prev => ({ ...prev, ...stepData }));
            // Move to step 2
            router.replace({
              pathname: '/HR/offboarding/process',
              query: { 
                offboardingId: response.response.id,
                resumeStep: 2
              }
            }, undefined, { shallow: true });
          }
        });
      }
    } else if (currentStep === 2) {
      // Step 2: Exit Checklist
      const updatedChecklist = stepData.checklist.map(item => ({
        id: item.id,
        status: item.status
      }));

      setOffboardingData(prev => ({
        ...prev,
        checklist: stepData.checklist,
        exit_checklist: stepData.checklist
      }));

      submitStepTwo({
        step: offboardingId,
        exit_checklist: updatedChecklist
      }, {
        onSuccess: () => {
          // Move to step 3
          router.replace({
            pathname: '/HR/offboarding/process',
            query: { 
              offboardingId,
              resumeStep: 3
            }
          }, undefined, { shallow: true });
        }
      });
    } else if (currentStep === 3) {
      // Step 3: Review - just move to next step
      setOffboardingData(prev => ({ ...prev, ...stepData }));
      // Move to step 4
      router.replace({
        pathname: '/HR/offboarding/process',
        query: { 
          offboardingId,
          resumeStep: 4
        }
      }, undefined, { shallow: true });
    } else if (currentStep === 4) {
      // Step 4: Last Day Confirmation
      submitStepFour({
        offboardingId
      }, {
        onSuccess: () => {
          router.push('/HR/offboarding/dashboard');
        }
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      // If going back to step 1, we need to ensure we're in edit mode
      if (currentStep === 2) {
        setIsEditing(true);
      }
      // Go back to previous step
      router.replace({
        pathname: '/HR/offboarding/process',
        query: { 
          offboardingId,
          resumeStep: currentStep - 1
        }
      }, undefined, { shallow: true });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return isValid(date) ? format(date, 'MMMM d, yyyy') : 'Invalid date';
  };

  if (isLoadingInitialReview) {
    return <DataLoader />;
  }

  const steps = [
    {
      id: 1,
      title: 'Employee Information',
      icon: <FaUserMinus className="w-6 h-6" />,
      component: (
        <OffboardingInitiationForm
          onComplete={handleStepComplete}
          isSubmittingStepOne={isSubmittingStepOne || isEditingStepOne}
          initialData={offboardingData}
          isEditing={isEditing}
        />
      )
    },
    {
      id: 2,
      title: 'Exit Checklist',
      icon: <FaClipboardCheck className="w-6 h-6" />,
      component: (
        <ExitChecklistForm
          onComplete={handleStepComplete}
          onBack={handleBack}
          employeeData={offboardingData.employee}
          initialChecklist={offboardingData.checklist}
          isSubmittingStepTwo={isSubmittingStepTwo}
          isLoading={isSubmittingStepTwo}
        />
      )
    },
    {
      id: 3,
      title: 'Review & Confirm',
      icon: <FaPaperPlane className="w-6 h-6" />,
      component: (
        <OffboardingReviewStep
          offboardingData={offboardingData}
          onConfirm={handleStepComplete}
          onBack={handleBack}
          isLoading={isLoadingReviewStep}
        />
      )
    },
    {
      id: 4,
      title: 'Last Day Confirmation',
      icon: <FaUserCheck className="w-6 h-6" />,
      component: (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Confirm Last Working Day</h2>
          <p className="text-gray-600 mb-4">
            Please confirm that you want to proceed with the offboarding process for {offboardingData.employee?.fname} {offboardingData.employee?.lname} on {formatDate(offboardingData.lastWorkingDay)}. The employee will be deactivated from the app and will no longer be able to access the application.
          </p>
          <div className="flex justify-between">
            <button
              onClick={handleBack}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={isSubmittingStepFour}
            >
              Back
            </button>
            <button
              onClick={() => handleStepComplete(offboardingData)}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-50"
              disabled={isSubmittingStepFour}
            >
              {isSubmittingStepFour ? 'Confirming...' : 'Confirm'}
            </button>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditing ? 'Edit' : 'New'} Employee Offboarding {offboardingData.employee?.fname ? `- ${offboardingData.employee.fname} ${offboardingData.employee.lname}` : ''}
          </h1>
          <p className="mt-2 text-gray-600">Complete all steps to offboard an employee</p>
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

export default OffboardingProcess; 