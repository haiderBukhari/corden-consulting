import React, { useState } from 'react';
import { FaFilePdf, FaEye, FaDownload } from 'react-icons/fa'; // Added icons
import useAcknowledgeDocument from '../../../../hooks/mutations/onboarding/acknowledgeDocument';
import { useGetOnboardingUserDoc } from '../../../../hooks/query/onboarding/getOnbaordingUserDoc';
import DataLoader from '../../../ui/dataLoader';
const DocumentConfirmView = ({ userId, onNext, onBack }) => {
  const { data: documents, isLoading } = useGetOnboardingUserDoc(userId);
  const acknowledgeDocument = useAcknowledgeDocument();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleNext = async () => {
    setLoading(true);
    setError(null);
    try {
      await acknowledgeDocument.mutateAsync({ userId });
      onNext && onNext();
    } catch (err) {
      setError('Failed to acknowledge documents');
    } finally {
      setLoading(false);
    }
  };
  const handleDownload = (filePath, fileName) => {
    const link = document.createElement('a');
    link.href = filePath;
    link.setAttribute('download', fileName); // may not always work cross-origin
    link.setAttribute('target', '_blank'); // fallback to open in new tab
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };


  return (
    <div>
      <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Step 3: Document Review & Acknowledgment</h3>
      <p className="text-sm text-gray-600 mb-6">
        Please review and download the documents listed below. These are required as part of your onboarding.
      </p>
      {isLoading?
       <DataLoader />:
      documents && documents.length > 0 ? (
        <div className="border border-gray-200 rounded-md">
          <ul className="divide-y divide-gray-200">
            {documents.map((doc) => (
              <li key={doc.id} className="flex items-center justify-between p-4 hover:bg-gray-50">
                <div className="flex items-center space-x-3">
                  <FaFilePdf className="w-6 h-6 text-red-500 flex-shrink-0" /> {/* Adjust icon based on file type if needed */}
                  <span className="text-sm font-medium text-gray-800 truncate" title={doc.document_name}>{doc.document_name}</span>
                </div>
                {/* View and Download Buttons */}
                <div className="flex items-center space-x-2 ml-4">
                  <a
                    href={doc.file_path} // Ensure this URL points to the actual document
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-3 py-1 border cursor-pointer border-gray-300 rounded-md shadow-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary"
                    title={`View ${doc.document_name}`}
                  >
                    <FaEye className="w-3 h-3 mr-1.5" />
                    View & Download
                  </a>
                  {/* <button
                    type="button"
                    onClick={() => handleDownload(doc.file_path, doc.document_name)}
                    className="inline-flex items-center px-3 py-1 cursor-pointer border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary"
                    title={`Download ${doc.document_name}`}
                  >
                    <FaDownload className="w-3 h-3 mr-1.5" />
                    Download
                  </button> */}

                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-center text-sm text-gray-500 py-6">No documents are currently available for review.</p>
      )}

      {/* Confirmation Checkbox */}
      <div className="mt-6 border-t border-gray-200 pt-6">
        <div className="relative flex items-start">
          <div className="flex h-6 items-center">
            <input
              id="docs-confirmation"
              aria-describedby="docs-confirmation-description"
              name="docs-confirmation"
              type="checkbox"
              checked={isConfirmed}
              onChange={(e) => setIsConfirmed(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"

            />
          </div>
          <div className="ml-3 text-sm leading-6">
            <label htmlFor="docs-confirmation" className={`font-medium ${!documents || documents.length === 0 ? 'text-gray-400' : 'text-gray-900'}`}>
              Confirmation
            </label>
            <p id="docs-confirmation-description" className="text-gray-500">
              I confirm that I have reviewed and downloaded the documents listed above.
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

export default DocumentConfirmView; 