import React from 'react';
import { FaDownload } from 'react-icons/fa';
import { format, isAfter, subDays, parseISO, isValid, parse } from 'date-fns';
import { successToaster } from '../../../../utils/toaster';
import { useOffboardingDocuments } from '../../../../hooks/query/documentManagment/offboarding/getOffboardingDocuments';
import { useDownloadOffboardingDocument } from '../../../../hooks/mutations/documentManagment/offboarding/downloadOffboardingDocument';
import DataLoader from '../../../ui/dataLoader';

const OffboardingDocumentManagement = ({ userId }) => {
  const { data: documents, isLoading, error } = useOffboardingDocuments(userId);
  const { mutate: downloadDocument, isLoading: isDownloading } = useDownloadOffboardingDocument();

  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    try {
      // If the date is already in MMMM d, yyyy format, return it as is
      if (dateString.match(/^[A-Za-z]+\s+\d{1,2},\s+\d{4}$/)) {
        return dateString;
      }
      
      // Parse DD-MM-YYYY format
      const date = parse(dateString, 'dd-MM-yyyy', new Date());
      
      if (!isValid(date)) {
        return dateString;
      }
      
      return format(date, 'MMMM d, yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return dateString;
    }
  };

  const isDocumentExpired = (expiryDate) => {
    if (!expiryDate) return false;
    try {
      // Parse the date if it's in MMMM d, yyyy format
      const date = parse(expiryDate, 'MMMM d, yyyy', new Date());
      return isAfter(new Date(), date);
    } catch (error) {
      console.error('Error checking document expiry:', error);
      return false;
    }
  };

  const isWithinAccessPeriod = () => {
    try {
      // Get user data from localStorage
      const userData = JSON.parse(localStorage.getItem('user'));
      if (!userData?.user_last_working_day) return false;

      const lastWorkingDay = parseISO(userData.user_last_working_day);
      const thirtyDaysAfterLastWorkingDay = subDays(lastWorkingDay, -30);
      const currentDate = new Date();

      // Check if current date is after last working day but within 30 days
      return isAfter(currentDate, lastWorkingDay) && !isAfter(currentDate, thirtyDaysAfterLastWorkingDay);
    } catch (error) {
      console.error('Error checking access period:', error);
      return false;
    }
  };

  if (isLoading) {
    return <DataLoader />;
  }

  if (error) {
    return <div className="text-red-500">Error loading documents</div>;
  }

  const handleDownload = (documentId) => {
    downloadDocument(documentId);
  };

  const isAccessPeriod = isWithinAccessPeriod();

  return (
    <div className="space-y-6 p-4 md:p-4 bg-white min-h-screen">
      <div className="bg-white rounded-lg shadow">
        <div className="p-4">
          <div className="mb-4 bg-blue-50 text-blue-700 border-l-4 border-blue-400 p-4">
            These documents will be available for 30 days after your account deactivation.
          </div>

          {!documents || documents.length === 0 ? (
            <div className="text-center py-4">
              <p>No documents available</p>
            </div>
          ) : (
            <div className="space-y-4">
              {documents.map((doc) => {
                const isExpired = isDocumentExpired(doc.expires);

                return (
                  <div key={doc.id} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0 mr-4">
                        <h3 className="font-medium text-gray-900 break-words">{doc.file_name}</h3>
                        <p className="text-sm text-gray-500">
                          Uploaded: {formatDate(doc.date)}
                        </p>
                        {doc.expires && (
                          <p className={`text-sm ${isExpired ? 'text-red-500' : 'text-gray-500'}`}>
                            Expires: {formatDate(doc.expires)}
                            {isExpired && ' (Expired)'}
                          </p>
                        )}
                      </div>
                      <div className="flex-shrink-0">
                        <button
                          onClick={() => handleDownload(doc.id)}
                          disabled={isDownloading || !isAccessPeriod}
                          className={`p-2 rounded-full ${
                            isDownloading || !isAccessPeriod
                              ? 'text-gray-400 cursor-not-allowed' 
                              : 'text-primary hover:text-primary/80'
                          }`}
                          title={!isAccessPeriod ? "Documents are only available for 30 days after your last working day" : ""}
                        >
                          <FaDownload />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OffboardingDocumentManagement; 