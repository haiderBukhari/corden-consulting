import React, { useState } from 'react';
import { FaFilePdf, FaFileWord, FaFileImage, FaFileExcel, FaPaperPlane } from 'react-icons/fa';
import { successToaster, errorToaster } from '../../../../utils/toaster';
import dynamic from 'next/dynamic';
import ButtonLoader from '../../../ui/buttonLoader';
import { useGetOnboardingUserDoc } from '../../../../hooks/query/onboarding/getOnbaordingUserDoc';
import useSendOnboardingEmail from '../../../../hooks/mutations/onboarding/sendOnboardingEmail';
import { UseGetProfile } from '../../../../hooks/query/getProfile';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });
import 'react-quill/dist/quill.snow.css'; // Import Quill styles
import DataLoader from '../../../ui/dataLoader';
import { useRouter } from 'next/router';
const ReviewConfirmStep = ({ user_id, onBack, onConfirmAndSend }) => {
  const router = useRouter();
  const userId = router.query.userId || user_id;
  const { data: userData, isLoading: isLoadingUser } = UseGetProfile(userId);
  const { data: documentData, isLoading: isLoadingDocument } = useGetOnboardingUserDoc(userId);
  const sendOnboardingEmail = useSendOnboardingEmail();
  const companyName = process.env.NEXT_PUBLIC_COMPANY_NAME || 'Our Company';
  const [emailSubject, setEmailSubject] = useState(`Welcome to ${companyName} - Your Account Details`);
  const [emailHtmlContent, setEmailHtmlContent] = useState('');


  const generateInitialHtml = () => {
    return `
      <p>Dear ${userData?.fname || ''} ${userData?.lname || ''},</p>
      <br />
      <p>Welcome to <strong>Our Company ${companyName}</strong>! We're excited to have you join our team.</p>
      <br />
      <p>Your account has been created with the following details:</p>
      <ul>
        <li><strong>Email:</strong> ${userData?.email || 'N/A'}</li>
        <li><strong>Password:</strong> ${userData?.temp_password || 'N/A'}</li>
        
      </ul>
      <br />
      <p>You can access the HR portal via the following link: <a href="https://hrm-phase2.vercel.app" target="_blank" rel="noopener noreferrer">HR Portal Link</a></p>

    
      <br />
      You will be required to reset your password during the onboarding process.
      <br />
      <p>Please login to your account using the main portal and complete the onboarding steps.</p>
      <br />
      <p>Best regards,</p>
      <p><strong>HR Team</strong></p>
    `;
  };

  React.useEffect(() => {
    setEmailHtmlContent(generateInitialHtml());
  }, [userData]);

  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      ['link'], // Removed image/video for simplicity
      ['clean']
    ],
  };

  const getFileIcon = (filePath) => {
    const extension = filePath?.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FaFilePdf className="text-red-500" />;
      case 'doc':
      case 'docx':
        return <FaFileWord className="text-blue-500" />;
      case 'xls':
      case 'xlsx':
        return <FaFileExcel className="text-green-500" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <FaFileImage className="text-purple-500" />;
      default:
        return <FaFilePdf className="text-gray-500" />;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSendEmail = () => {
    const formData = new FormData();
    formData.append('user_id', userData?.id);
    formData.append('subject', emailSubject);
    formData.append('body', emailHtmlContent);

    // Append document data if available
    if (documentData && documentData.length > 0) {
      documentData.forEach((doc, index) => {
        formData.append(`documents[${index}][id]`, doc.id);
        formData.append(`documents[${index}][name]`, doc.document_name);
        formData.append(`documents[${index}][file_path]`, doc.file_path);
      });
    }

    sendOnboardingEmail.mutate(formData, {
      onSuccess: () => {

        onConfirmAndSend();
      },
      onError: (error) => {
        errorToaster('Failed to send welcome email. Please try again.');
        console.error('Error sending email:', error);
      }
    });
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow">
        {isLoadingUser || isLoadingDocument ? (
          <DataLoader />
        ) : (
          <>
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
                {/* <div>
                  <p className="text-sm text-gray-500">Restricted IP</p>
                  <p className="font-medium">{userData?.is_restricted_IP ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Worker</p>
                  <p className="font-medium">{userData?.is_worker ? 'Yes' : 'No'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Finance Access</p>
                  <p className="font-medium">{userData?.access_finance_section ? 'Yes' : 'No'}</p>
                </div> */}
              </div>
            </div>
          </>

        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Uploaded Documents</h2>
        <div className="space-y-4">
          {documentData && documentData?.length > 0 && documentData?.map((doc, index) => (
            <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="text-2xl">
                  {getFileIcon(doc.file_path)}
                </div>
                <div>
                  <p className="font-medium">{doc.document_name}</p>
                  <p className="text-sm text-gray-500">
                    Uploaded on {formatDate(doc.created_at)}
                  </p>
                </div>
              </div>
              <a
                href={doc.file_path}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80"
              >
                View Document
              </a>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Welcome Email</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Subject</label>
            <input
              type="text"
              value={emailSubject}
              onChange={(e) => setEmailSubject(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Content</label>
            <ReactQuill
              theme="snow"
              value={emailHtmlContent}
              onChange={setEmailHtmlContent}
              modules={quillModules}
              className="min-h-[250px] h-auto"
            />
          </div>
        </div>
      </div>

      <div className="p-3  px-4 flex justify-between  text-sm text-primary border-t border-gray-200 bg-gray-50 rounded-b-lg">
        <p>
          Are you sure you you want to complete the onboarding process and send the welcome email?
        </p>
      </div>
      <div className="p-6 flex justify-between border-t border-gray-200 bg-gray-50 rounded-b-lg">
        <button
          onClick={onBack}
          disabled={sendOnboardingEmail.isLoading}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
        >
          Back
        </button>
        <button
          onClick={handleSendEmail}
          disabled={sendOnboardingEmail.isLoading}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
        >
          {sendOnboardingEmail.isLoading ? (
            <ButtonLoader text="Sending..." />
          ) : (
            <>
              <FaPaperPlane className="w-4 h-4 mr-2" />
              Send Email & Proceed
            </>
          )}
        </button>
      </div>
    </div >
  );
};

export default ReviewConfirmStep;
