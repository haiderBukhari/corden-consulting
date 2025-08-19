import React, { useState, useEffect, useMemo, useRef } from 'react';
import ChangePasswordStep from './ChangePasswordStep';
import PersonalInfoView from './PersonalInfoView';
import DocumentConfirmView from './DocumentConfirmView';
import PolicyConfirmView from './PolicyConfirmView';
import { FaUserAlt, FaFileAlt, FaClipboardCheck, FaLock } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { UseGetProfile } from '../../../../hooks/query/getProfile';

const stepIds = ['password', 'info', 'docs', 'policy'];
const stepNumberToId = { 1: 'password', 2: 'info', 3: 'docs', 4: 'policy' };

const stepsMeta = [
  {
    id: 'password',
    title: 'Set Password',
    icon: <FaLock className="w-5 h-5" />,
  },
  {
    id: 'info',
    title: 'Personal Info',
    icon: <FaUserAlt className="w-5 h-5" />,
  },
  {
    id: 'docs',
    title: 'Documents',
    icon: <FaFileAlt className="w-5 h-5" />,
  },
  {
    id: 'policy',
    title: 'Policy Review',
    icon: <FaClipboardCheck className="w-5 h-5" />,
  },
];

const getStepIdFromProp = (step) => {
  if (!step) return undefined;
  if (typeof step === 'number') return stepNumberToId[step];
  if (typeof step === 'string' && stepIds.includes(step)) return step;
  return undefined;
};

const UserOnboardingContainer = ({ user,  onComplete, Step }) => {
  const router = useRouter();
  const { data: userData } = UseGetProfile(router.query.userId || user?.id)
  const current_Step = userData?.user_step || Step
  const userId = router.query.userId || user?.id;
  const initialStepSet = useRef(false);
  console.log(current_Step);

  useEffect(() => {
    if (current_Step == 4 && userData?.user_onboard == 1) {
      onComplete()
    }
  }, [current_Step])

  const [currentStepId, setCurrentStepId] = useState(() => {
    // First check URL parameter
    if (typeof window !== 'undefined') {
      const urlStep = new URLSearchParams(window.location.search).get('resumeStep');
      if (urlStep && stepIds.includes(urlStep)) {
        initialStepSet.current = true;
        return urlStep;
      }
    }

    // Then check current_Step from props or userData
    const propStepId = getStepIdFromProp(current_Step);
    if (propStepId) {
      initialStepSet.current = true;
      return propStepId;
    }

    // Default to first step
    initialStepSet.current = true;
    return stepIds[0];
  });

  // Update URL when current_Step changes
  useEffect(() => {
    if (router.isReady && current_Step) {
      const stepId = getStepIdFromProp(current_Step);
      if (stepId && stepId !== currentStepId) {
        goToStep(stepId);
      }
    }
  }, [current_Step, router.isReady]);

  // On first mount, if the URL does not match the initial step, update it
  useEffect(() => {
    if (router.isReady && !initialStepSet.current) {
      const urlStep = router.query.resumeStep;
      if (
        currentStepId && // we have a step
        (!urlStep || urlStep !== currentStepId) // URL does not match
      ) {
        goToStep(currentStepId);
      }
      initialStepSet.current = true;
    }
  }, [router.isReady]);

  // Sync with URL changes (always trust the URL after first mount)
  useEffect(() => {
    if (router.isReady) {
      const urlStep = router.query.resumeStep;
      if (urlStep && stepIds.includes(urlStep) && urlStep !== currentStepId) {
        setCurrentStepId(urlStep);
      }
    }
  }, [router.isReady, router.query.resumeStep]);

  // Navigation callbacks
  const goToStep = (stepId) => {
    router.replace({
      pathname: router.pathname,
      query: { userId, resumeStep: stepId }
    }, undefined, { shallow: true });
    setCurrentStepId(stepId);
  };
  const handleNext = () => {
    const idx = stepIds.indexOf(currentStepId);
    if (idx < stepIds.length - 1) goToStep(stepIds[idx + 1]);
  };
  const handleBack = () => {
    const idx = stepIds.indexOf(currentStepId);
    if (idx > 0) goToStep(stepIds[idx - 1]);
  };

  // Steps definition
  const steps = useMemo(() => [
    {
      ...stepsMeta[0],
      component: <ChangePasswordStep userId={userId} onNext={handleNext} />,
    },
    {
      ...stepsMeta[1],
      component: <PersonalInfoView userId={userId} onNext={handleNext} onBack={handleBack} />,
    },
    {
      ...stepsMeta[2],
      component: <DocumentConfirmView userId={userId} onNext={handleNext} onBack={handleBack} />,
    },
    {
      ...stepsMeta[3],
      component: <PolicyConfirmView userId={userId} onBack={handleBack} onComplete={onComplete} />,
    },
  ], [userId, currentStepId]);

  const currentStepIndex = steps.findIndex(step => step.id === currentStepId);
  const currentStep = steps[currentStepIndex];

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 md:p-10 w-full max-w-6xl mx-auto my-10">
      <div>
        <div className='flex justify-end my-4 '>
          <button className='bg-red-500 text-white px-4 py-2 rounded-md' onClick={() => {
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            localStorage.removeItem('endTime');
            router.push('/');
          }}>  Logout</button>
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
            Welcome Aboard!
          </h2>
          <p className="text-gray-600 mb-10 text-center">
            Please complete the following steps to finalize your onboarding.
          </p>
        </div>

      </div>
      {/* Stepper UI */}
      <div className="mb-8 p-4 bg-white rounded-lg shadow">
        <div className="flex items-start justify-between">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center text-center flex-1 px-2">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full lg:h-12 lg:w-12 shrink-0 mb-2 transition-colors duration-300 ease-in-out ${currentStepIndex >= index ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
                    }`}
                >
                  {step.icon}
                </div>
                <div className="text-sm font-medium text-gray-900">{step.title}</div>
              </div>
              {index < steps.length - 1 && (
                <div className="flex-1 mt-5 lg:mt-6 px-1">
                  <div className="relative w-full">
                    <div className={`absolute inset-0 h-1 w-full transition-colors duration-500 ease-in-out ${currentStepIndex > index ? 'bg-primary' : 'bg-gray-200'
                      }`} />
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      {/* Render Current Step Component */}
      <div className="mb-8 pt-6 min-h-[300px]">
        {currentStep?.component}
      </div>
    </div>
  );
};

export default UserOnboardingContainer;