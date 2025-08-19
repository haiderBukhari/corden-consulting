import React, { useState } from 'react';
import { FaHourglassHalf, FaCheckCircle } from 'react-icons/fa';
import UserProgressModal from './UserProgressModal'; // Adjust the path if needed

import { UseGetProfile } from '../../../../hooks/query/getProfile';
import { useRouter } from 'next/router';
const VerificationStep = ({ onBack, onComplete, user_id }) => {
  const router = useRouter();
  const userId = router.query.userId || user_id;
  const { data: userData ,refetch } = UseGetProfile(userId);
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);

  const isVerified = userData?.user_onboard == 1 || false; // Assuming backend provides this

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">User Verification</h2>
        <p className="text-gray-600 mt-1">
          Waiting for the new employee to complete their verification steps.
        </p>
      </div>

      <div className="bg-gray-50 p-6 rounded-lg text-center">
        {isVerified ? (
          <>
            <FaCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-800">Verification Complete</h3>
            <p className="text-gray-600 mt-2">
              {userData?.fname} {userData?.lname} has completed the necessary verification.
            </p>
          </>
        ) : (
          <>
            <FaHourglassHalf className="w-16 h-16 text-yellow-500 mx-auto mb-4 animate-spin" />
            <h3 className="text-xl font-medium text-gray-800">Verification Pending</h3>
            <p className="text-gray-600 mt-2">
              The system is waiting for the user to verify their account or complete required tasks.
              This step will automatically complete once verification is confirmed.
            </p>
          </>
        )}
      </div>

      <div className="mt-8 flex justify-between">
        
        <button
          type="button"
          onClick={() => setIsProgressModalOpen(true)}
          className="px-4 py-2 bg-[#009D9D] text-white rounded-md text-sm font-medium hover:bg-[#007a7a]"
        >
          View User Progress
        </button>
        <button
          type="button"
          onClick={() => router.push('/HR/onboarding/dashboard')}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Continue to Dashboard
        </button>
      </div>

      <UserProgressModal
        isOpen={isProgressModalOpen}
        onClose={() => setIsProgressModalOpen(false)}
        user={userData}
        refetch={refetch}
      />
    </div>
  );
};

export default VerificationStep; 