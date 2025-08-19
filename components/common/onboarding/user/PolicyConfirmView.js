import React, { useState, useEffect } from 'react';
import { FaClipboardCheck, FaEye, FaDownload } from 'react-icons/fa';
import DataLoader from '../../../ui/dataLoader';
import useAcknowledgePolicy from '../../../../hooks/mutations/onboarding/useracknowledgePolicy';
import { useGetAllPolicyConfiguiration } from '../../../../hooks/query/configuration/onboarding/getPolicyConfigurationsList';
import { handleDownloadDocument } from '../../../../utils/functions';
import useAcknowledgeIndividualPolicy from '../../../../hooks/mutations/onboarding/acknowledgePolicy';
import useDownloadDocument from '../../../../hooks/mutations/onboarding/downloadDocument';
const PolicyConfirmView = ({ userId, onBack, onComplete }) => {
  const acknowledgePolicy = useAcknowledgePolicy();
  const acknowledgeIndividualPolicy = useAcknowledgeIndividualPolicy();
  const downloadDocument=useDownloadDocument()  
  const { data: policiesData, isLoading } = useGetAllPolicyConfiguiration();
  const [acknowledged, setAcknowledged] = useState({});
  const [currentPolicyIndex, setCurrentPolicyIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isPolicyLoading, setIsPolicyLoading] = useState(false);
  const [filePath, setFilePath] = useState(null);
   
  const currentPolicy = policiesData && policiesData.length > currentPolicyIndex ? policiesData[currentPolicyIndex] : null;
  const isAcknowledged = currentPolicy ? !!acknowledged[currentPolicy.id] : false;
  const isOptional = currentPolicy?.type === 'optional';

  // Handle checkbox change for the current policy
  const handleCheckboxChange = async (isChecked) => {
    if (currentPolicy) {
      setAcknowledged((prev) => ({ ...prev, [currentPolicy.id]: isChecked }));
    }
  };

  const handleNextPolicy = async () => {
    if (!currentPolicy || !isAcknowledged) return;

    setIsPolicyLoading(true);
    try {
      // Call API to acknowledge individual policy
      acknowledgeIndividualPolicy.mutate({
        policy_id: currentPolicy.id,

      },
        {
          onSuccess: () => {
            // Move to next policy
            if (currentPolicyIndex < policiesData.length - 1) {
              setCurrentPolicyIndex(prevIndex => prevIndex + 1);
            }
          }
        }
      );


    } catch (error) {
      console.error('Error acknowledging policy:', error);
      setError('Failed to acknowledge policy. Please try again.');
    } finally {
      setIsPolicyLoading(false);
    }
  };

  // Reset index if policies change
  useEffect(() => {
    setCurrentPolicyIndex(0);
    setAcknowledged({});
  }, [policiesData]);

  // const handleDownloadPolicy = () => {
  //   if (!currentPolicy?.file_path) {
  //     console.error('No file path available for current policy');
  //     return;
  //   }
  
  //   const fullPath = currentPolicy.file_path;
  //   const fileName = fullPath.split('/storage/policies/')[1];
  
  //   if (!fileName) {
  //     console.error('Could not extract file name from URL');
  //     setError('Invalid file path');
  //     return;
  //   }
  
  //   const apiUrl = `https://hr-backend-talo.com/api/policies/${fileName}`;
  
  //   downloadPolicy.mutate(apiUrl, {
  //     onSuccess: (data) => {
  //       if (!(data instanceof Blob)) {
  //         console.error('Invalid blob data received');
  //         return;
  //       }
  
  
  //       // Download the file
  //       const blobUrl = window.URL.createObjectURL(data);
  //       const link = document.createElement('a');
  //       link.href = blobUrl;
  //       link.download = currentPolicy?.name || 'downloaded_file';
  //       document.body.appendChild(link);
  //       link.click();
  
  //       setTimeout(() => {
  //         window.URL.revokeObjectURL(blobUrl);
  //         document.body.removeChild(link);
  //       }, 100);
  //     },
  
  //     onError: (error) => {
  //       console.error('❌ Policy download failed:', error);
  //     }
  //   });
  // };
  


  const handleComplete = async () => {
    if (!isAcknowledged) return;

    setLoading(true);
    setError(null);

    try {
      // Call API to acknowledge all policies
      await acknowledgePolicy.mutateAsync({ userId, policy_id: currentPolicy?.id });
      onComplete && onComplete();
    } catch (error) {
      console.error('Error completing acknowledgment:', error);
      setError('Failed to complete acknowledgment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return <DataLoader />;
  }

  if (!policiesData || policiesData.length === 0) {
    return (
      <div className="text-center p-6 bg-green-50 border border-green-200 rounded-md">
        <FaClipboardCheck className="w-8 h-8 mx-auto mb-3 text-green-600" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Policies to Acknowledge</h3>
        <p className="text-sm text-gray-700 mb-4">There are no policies to acknowledge. You can complete your onboarding now.</p>
        {error && <div className="text-red-600 mt-2">{error}</div>}
        <div className="flex justify-between mt-12">
          <button type="button" onClick={onBack} className="px-6 py-2 text-sm font-medium text-white bg-primary rounded-md shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 ease-in-out">Back</button>
          <button
            type="button"
            onClick={handleComplete}
            disabled={loading}
            className="px-6 py-2 text-sm font-medium text-white bg-primary rounded-md shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 ease-in-out"
          >
            {loading ? 'Submitting...' : 'Complete Onboarding'}
          </button>
        </div>
      </div>
    );
  }

  if (currentPolicyIndex >= policiesData.length) {
    const allAcknowledged = policiesData.every(p => acknowledged[p.id]);
    return (
      <div className="text-center p-6 bg-green-50 border border-green-200 rounded-md">
        <FaClipboardCheck className="w-8 h-8 mx-auto mb-3 text-green-600" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Policies Reviewed</h3>
        {allAcknowledged ? (
          <>
            <p className="text-sm text-gray-700 mb-4">All policies have been acknowledged. You can now complete the onboarding process.</p>
            {error && <div className="text-red-600 mt-2">{error}</div>}
            <div className="flex justify-between mt-8">
              <button type="button" onClick={onBack} className="px-6 py-2 text-sm font-medium text-white bg-primary rounded-md shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 ease-in-out">Back</button>
              <button
                type="button"
                onClick={handleComplete}
                disabled={loading}
                className="px-6 py-2 text-sm font-medium text-white bg-primary rounded-md shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 ease-in-out"
              >
                {loading ? 'Submitting...' : 'Complete Onboarding'}
              </button>
            </div>
          </>
        ) : (
          <p className="text-sm text-gray-600">Please ensure all policies are acknowledged to complete onboarding.</p>
        )}
      </div>
    );
  }

  if (!currentPolicy) {
    return <p className="text-sm text-gray-500">Error displaying policy.</p>;
  }

  if (isPolicyLoading) {
    return <DataLoader />;
  }

  return (
    <div>
      <div className="mb-4 pb-2 border-b">
        <h3 className="text-lg font-medium leading-6 text-gray-900">
          Policy {currentPolicyIndex + 1} of {policiesData.length}
        </h3>
        <p className="text-sm text-gray-600 mt-1">Please review and acknowledge the following policy:</p>
      </div>

      <h4 className="text-md font-semibold capitalize text-gray-800 mb-3">
        {currentPolicy.name}
      </h4>

      {currentPolicy.file_path && (
        <div className="my-4">
          <div className="flex space-x-4 mb-4">
            <a
              href={currentPolicy.file_path}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <FaEye className="w-4 h-4 mr-2" />
              View Policy
            </a>
            <button
              onClick={() => handleDownloadDocument(currentPolicy.file_path , currentPolicy.name , downloadDocument)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
            >
              <FaDownload className="w-4 h-4 mr-2" />
              Download Policy
            </button>
          </div>
          <iframe
            src={currentPolicy.file_path}
            title={currentPolicy.name}
            width="100%"
            height="500px"
            className="border rounded"
          />
        </div>
      )}

      <div className="relative flex items-center mt-4 p-4 border rounded-md bg-white shadow-sm">
        <div className="flex h-6 items-center">
          <input
            id={`policy-ack-${currentPolicy.id}`}
            name={`policy-ack-${currentPolicy.id}`}
            type="checkbox"
            checked={isAcknowledged}
            onChange={(e) => handleCheckboxChange(e.target.checked)}
            className="h-5 w-5 rounded border-gray-400 text-primary focus:ring-primary cursor-pointer"
          />
        </div>
        <div className="ml-3 text-sm leading-6">
          <label htmlFor={`policy-ack-${currentPolicy.id}`} className="font-medium text-gray-900 cursor-pointer">
            {isOptional ? (
              <span>I acknowledge that I have read and understood the {currentPolicy.name} policy (Optional)</span>
            ) : (
              <span className="text-red-600">*I acknowledge that I have read and understood the {currentPolicy.name} policy</span>
            )}
          </label>
        </div>
      </div>

      {!isAcknowledged && !isOptional && (
        <p className="text-xs text-red-600 mt-2 text-center">Please acknowledge this policy to proceed to the next one.</p>
      )}

      {error && <div className="text-red-600 mt-2">{error}</div>}

      <div className="flex justify-end mt-8">
        <div className="flex space-x-4">
          {currentPolicyIndex < policiesData.length - 1 ? (
            <button
              type="button"
              onClick={handleNextPolicy}
              disabled={!isAcknowledged && !isOptional}
              className="px-6 py-2 text-sm font-medium text-white bg-primary rounded-md shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 ease-in-out"
            >
              Next Policy
            </button>
          ) : (
            <button
              type="button"
              onClick={handleComplete}
              disabled={!isAcknowledged && !isOptional}
              className="px-6 py-2 text-sm font-medium text-white bg-primary rounded-md shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 ease-in-out"
            >
              {loading ? 'Submitting...' : 'Complete Onboarding'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PolicyConfirmView; 