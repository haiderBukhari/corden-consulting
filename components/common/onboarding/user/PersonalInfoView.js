import React, { useState } from 'react';
import useAcknowledgeUserInfo from '../../../../hooks/mutations/onboarding/acknowledgeUserInfo';
import { UseGetProfile } from '../../../../hooks/query/getProfile';

const PersonalInfoView = ({ userId, onNext, onBack }) => {
  const { data: userData } = UseGetProfile(userId);
  const acknowledgeUserInfo = useAcknowledgeUserInfo();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const renderField = (label, value) => (
    <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
      <dt className="text-sm font-medium leading-6 text-gray-900">{label}</dt>
      <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
        {value || <span className="text-gray-400 italic">Not Provided</span>}
      </dd>
    </div>
  );

  const handleNext = async () => {
    setLoading(true);
    setError(null);
    try {
      await acknowledgeUserInfo.mutateAsync({ userId });
      onNext && onNext();
    } catch (err) {
      setError('Failed to acknowledge info');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Step 2: Review Personal Information</h3>
      <p className="text-sm text-gray-600 mb-6">
        Please review your personal information below. This information was provided during the initial setup.
        If any details are incorrect, please contact HR immediately.
      </p>
      <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
        <dl className="divide-y divide-gray-100">
        <div>
            <h2 className="text-xl font-semibold mb-4">Employee Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
            <p className="text-sm text-gray-500">Full Name</p>
            <p className="font-medium">{userData?.fname} {userData?.lname}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">{userData?.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Phone Number</p>
            <p className="font-medium">{userData?.phone_number}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Next of Kin</p>
            <p className="font-medium">{userData?.next_of_kin}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Kin Contact</p>
            <p className="font-medium">{userData?.kin_contact}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Kin Relation</p>
            <p className="font-medium">{userData?.kin_relation}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Role</p>
            <p className="font-medium">{userData?.role}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Department</p>
            <p className="font-medium">{userData?.department?.departments_name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Position</p>
            <p className="font-medium">{userData?.position?.name}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Branch</p>
            <p className="font-medium">{userData?.branch?.name || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Location</p>
            <p className="font-medium">{userData?.location?.name || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Joining Date</p>
            <p className="font-medium">{userData?.joining_date}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Team</p>
            <p className="font-medium">{userData?.team?.name || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Reports To</p>
            <p className="font-medium">{userData?.reports_to || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Bank Name</p>
            <p className="font-medium">{userData?.bank_name || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Account Number</p>
            <p className="font-medium">{userData?.account_number || 'N/A'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Shift</p>
            <p className="font-medium">{userData?.shift?.shift_name || 'N/A'}</p>
          </div>
         
        </div>
        </div>
        </dl>
      </div>

      <div className="mt-6 border-t border-gray-200 pt-6">
        <div className="relative flex items-start">
          <div className="flex h-6 items-center">
            <input
              id="info-confirmation"
              aria-describedby="info-confirmation-description"
              name="info-confirmation"
              type="checkbox"
              checked={isConfirmed}
              onChange={(e) => setIsConfirmed(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
          </div>
          <div className="ml-3 text-sm leading-6">
            <label htmlFor="info-confirmation" className="font-medium text-gray-900">
              Confirmation
            </label>
            <p id="info-confirmation-description" className="text-gray-500">
              I confirm that the personal details listed above are accurate.
            </p>
          </div>
        </div>
      </div>
      {error && <div className="text-red-600 mt-2">{error}</div>}
      <div className="flex justify-end   mt-8">
       
        <button
          type="button"
          onClick={handleNext}
          disabled={!isConfirmed || loading}
   className="px-6 py-2 text-sm font-medium text-white bg-primary rounded-md shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 ease-in-out"
        >
          {loading ? 'Saving...' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default PersonalInfoView; 