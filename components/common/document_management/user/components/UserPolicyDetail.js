import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { FaDownload } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { FaEye } from 'react-icons/fa';
import useAcknowledgeDoc from '../../../../../hooks/mutations/documentManagment/acknowledgeDoc';
import useDownloadDocument from '../../../../../hooks/mutations/onboarding/downloadDocument'; 
import { handleDownloadDocument } from '../../../../../utils/functions';
import ButtonLoader from '../../../../ui/buttonLoader';
const UserPolicyDetail = ({ policy, onBack, type }) => {
  const [isAcknowledged, setIsAcknowledged] = useState(policy.acknowledgement_status === 'Acknowledged');
  const acknowledgeDoc = useAcknowledgeDoc();
  const router = useRouter();
  const downloadDocument=useDownloadDocument()

  const handleAcknowledge = () => {
    setIsAcknowledged(true);
    const formData = new FormData();
    formData.append('document_id', policy.id);
    formData.append('user_id', policy.user_id);
    formData.append('acknowledgement_status', 'Acknowledged');
    acknowledgeDoc.mutate({ formData }, {
      onSuccess: () => {
        onBack();
      }
    })
  };
  const handleDownloadPolicy = () => {
    window.open(policy.downloadUrl, '_blank');
  };

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex space-x-2 items-center px-2 py-1 text-white bg-primary rounded-xl mb-3"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>

      </div>

      {/* Policy Info */}
      <div className="p-6 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-semibold text-gray-900 capitalize">{policy.title}</h2>
        <p className="mt-2 text-gray-600">{policy.description}</p>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <p className="text-sm text-gray-500">Upload Date</p>
            <p className="font-medium">{policy.created_at ? new Date(policy.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''  }</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Uploaded By</p>
            <p className="font-medium">{policy.uploaded_by}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${policy.acknowledgement_status === 'Acknowledged' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
              {policy.acknowledgement_status}
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-500">Expiry Date</p>
            <p className="font-medium">{policy.expiry_date ? new Date(policy.expiry_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : ''  }</p>
          </div>
        </div>
      </div>

      <div className="flex space-x-4 mb-4">
        <a
          href={policy.file_path}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <FaEye className="w-4 h-4 mr-2" />
          View {type === 'policy' ? 'Policy' : 'Document'}
        </a>
        <button
          onClick={() => handleDownloadDocument(policy.file_path, policy.title , downloadDocument)}
          // disabled={downloadPolicy.isLoading}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
        >
          <FaDownload className="w-4 h-4 mr-2" />
          Download
          {/* {downloadPolicy.isLoading ? 'Downloading...' : 'Download Policy'} */}
        </button>
      </div>
      {/* Document Preview */}
      <div className="p-6 bg-white rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Document Preview</h3>
        <iframe
          src={policy.file_path}
          className="w-full h-[600px] border-0"
          title="Policy Document"
        />
      </div>

      {/* Acknowledgment Section */}
      {policy.ack_required && !isAcknowledged && (
        <div className="p-6 bg-white rounded-lg shadow">
          <div className="flex items-start space-x-3">
            <input
              type="checkbox"
              id="acknowledge"
              className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300"

            />
            <div>
              <label htmlFor="acknowledge" className="text-sm font-medium text-gray-700">
                I acknowledge that I have read and understood this {type === 'policy' ? 'policy' : 'document'}
              </label>
              <p className="mt-1 text-sm text-gray-500">
                By checking this box, you confirm that you have read and understood the {type === 'policy' ? 'policy' : 'document'}.
              </p>
            </div>
          </div>
          <div className='mt-4 flex justify-end'   >
            <button
              onClick={handleAcknowledge}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-[#007a7a]"
            >
              {acknowledgeDoc.isLoading ? <ButtonLoader text='Acknowledging...' /> : 'Acknowledge'}
            </button>
          </div>
        </div>


      )}

      {/* Acknowledgment Confirmation */}
      {isAcknowledged && (
        <div className="p-4 bg-green-50 rounded-lg">
          <p className="text-green-800">
            You have acknowledged this {type === 'policy' ? 'policy' : 'document'} on {new Date().toLocaleDateString()}
          </p>
        </div>
      )}
    </div>
  );
};

export default UserPolicyDetail; 