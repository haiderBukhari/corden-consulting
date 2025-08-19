import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FaFilePdf, FaFileWord, FaFileImage, FaFileExcel } from "react-icons/fa";
import { useGetAllDocumentConfiguiration } from '../../../../hooks/query/configuration/onboarding/getDocumentConfigurations';
import { useGetOnboardingUserDoc } from '../../../../hooks/query/onboarding/getOnbaordingUserDoc';
import useUploadOnboardingDocument from '../../../../hooks/mutations/onboarding/uploadOnbaordingDocument';
import DataLoader from '../../../ui/dataLoader';
import { useRouter } from 'next/router';
const getFieldName = (docName) => docName.toLowerCase().replace(/\s+/g, '_');
const getFileIcon = (filePath) => {
  console.log(filePath);
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
const UploadDocumentForm = ({ user_id, onSubmit, onBack }) => {
  const router = useRouter();
  const userId = router.query.userId || user_id;
  const { data: documentConfig, isLoading: isConfigLoading } = useGetAllDocumentConfiguiration();
  const { data: userDocs, isLoading: isUserDocsLoading } = useGetOnboardingUserDoc(userId);
  const uploadMutation = useUploadOnboardingDocument();

  const [prepopulatedFields, setPrepopulatedFields] = useState(new Set());
  const [fileUrls, setFileUrls] = useState({});
  const [initialValues, setInitialValues] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!documentConfig || !userDocs) return;
    const values = {};
    const urls = {};
    const prepop = new Set();
  
    userDocs.forEach(doc => {
      const field = getFieldName(doc.document_name);
      values[field] = doc.file_name || doc.document_name; // don't populate as string, just show existing in fileUrls
      urls[field] = doc.file_path;
      prepop.add(field);
    });
  
    setInitialValues(values);
    setFileUrls(urls);
    setPrepopulatedFields(prepop);
    setLoading(false);
  }, [documentConfig, userDocs]);
  

  const validationSchema = Yup.object(
    (documentConfig || []).reduce((acc, doc) => {
      const field = getFieldName(doc.document_name);
      if (doc.document_type === 'mandatory') {
        acc[field] = Yup.mixed().required(`${doc.document_name} is required`);
      }
      return acc;
    }, {})
  );

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema,
    onSubmit: (values) => {
   
  
      // Filter only actual File instances
      const documents = Object.entries(values)
        .filter(([field, file]) => file instanceof File)
        .map(([field, file]) => ({
          file,
          name:
            documentConfig.find(
              (doc) => getFieldName(doc.document_name) === field
            )?.document_name || field,
        }));
  
      // Show final files to be submitted
      console.log('📄 Final Files to Upload:', documents);
  
      const formData = new FormData();
      formData.append('user_id', userId);
  
      documents.forEach((doc, idx) => {
        formData.append(`documents[${idx}][file]`, doc.file);
        formData.append(`documents[${idx}][name]`, doc.name);
       
      });
  
    
      uploadMutation.mutate({ data: formData }, {
        onSuccess: () => {
          onSubmit && onSubmit();
        }
      });
    },
  });
  

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (
      file &&
      file.type === 'application/pdf' &&
      file.size <= 25 * 1024 * 1024
    ) {
      if (file) {
        formik.setFieldValue(field, file);
        setPrepopulatedFields(prev => {
          const newSet = new Set(prev);
          newSet.delete(field);
          return newSet;
        });
        setFileUrls(prev => {
          const newUrls = { ...prev };
          delete newUrls[field];
          return newUrls;
        });

      }
      else {
        alert('Only PDF files under 25MB are allowed.');
        setSelectedFile(null);
        setSelectedFileName('');
      }
    }
  };


  const handleDelete = (field) => {
    formik.setFieldValue(field, null);
    setPrepopulatedFields(prev => {
      const newSet = new Set(prev);
      newSet.delete(field);
      return newSet;
    });
    setFileUrls(prev => {
      const newUrls = { ...prev };
      delete newUrls[field];
      return newUrls;
    });
  };

  if (isConfigLoading || isUserDocsLoading || loading) {
    return <div className="flex justify-center items-center h-40"><DataLoader /></div>;
  }

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-8">
      <div className="space-y-6 bg-white p-4">
        {(documentConfig || []).map(doc => {
          const field = getFieldName(doc.document_name);
          const file = formik.values[field];
          const fileUrl = fileUrls[field];
          const isPrepop = prepopulatedFields.has(field);
          return (
            <div key={doc.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">{doc.document_name}</label>
                  {doc.document_type === 'mandatory' && (
                    <span className="text-xs text-red-500 font-medium">Required</span>
                  )}
                </div>
                <div className="mt-2">
                  {file ? (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl">
                          {getFileIcon(fileUrl || file.name)}
                        </div>
                        <div>
                          <p className="font-medium">{file.name || file}</p>

                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {fileUrl && (
                          <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 text-sm">View</a>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDelete(field)}
                          className="ml-2 px-3 py-1 text-xs font-medium bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ) : (
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx"
                      name={field}
                      onChange={e => handleFileChange(e, field)}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90 transition-colors duration-200 ease-in-out cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    />
                  )}
                  {formik.touched[field] && formik.errors[field] && (
                    <p className="mt-2 text-sm text-red-600">{formik.errors[field]}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between p-4 bg-gray-50 border-t border-gray-200">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200 ease-in-out"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={uploadMutation.isLoading || !formik.isValid}
          className="px-6 py-2 text-sm font-medium text-white bg-primary rounded-md shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 ease-in-out"
        >
          {uploadMutation.isLoading ? 'Uploading...' : 'Submit'}
        </button>
      </div>
    </form>
  );
};

export default UploadDocumentForm; 