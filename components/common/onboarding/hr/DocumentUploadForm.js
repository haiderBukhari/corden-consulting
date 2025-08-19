import { useFormik } from "formik";
import * as Yup from "yup";
import { useState, useEffect } from "react";
import { useGetAllDocumentConfiguiration } from "../../../../hooks/query/configuration/onboarding/getDocumentConfigurations";
import DataLoader from "../../../ui/dataLoader";
import useUploadOnboardingDocument from "../../../../hooks/mutations/onboarding/uploadOnbaordingDocument";
import { useGetOnboardingUserDoc } from "../../../../hooks/query/onboarding/getOnbaordingUserDoc";
import { FaFilePdf, FaFileWord, FaFileImage, FaFileExcel } from "react-icons/fa";
import { useRouter } from "next/router";



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

const DocumentUploadForm = ({ onSubmit, user_id, onBack }) => {
  const [initialValues, setInitialValues] = useState(null);
  const [fileUrls, setFileUrls] = useState({});
  const [loadingFiles, setLoadingFiles] = useState(true);
  const [prepopulatedFields, setPrepopulatedFields] = useState(new Set());
  const router = useRouter();
  const userId = router.query.userId || user_id;
  const { data: documentConfiguration, isLoading } = useGetAllDocumentConfiguiration();
  const uploadOnboardingDocument = useUploadOnboardingDocument();
  const { data: UserUploadedDocuments } = useGetOnboardingUserDoc(userId);

  const getFieldName = (docName) => docName.toLowerCase().replace(/\s+/g, "_");
  useEffect(() => {
    const populateFiles = async () => {
      if (!UserUploadedDocuments || !documentConfiguration) return;
  
      const populatedValues = {};
      const populatedUrls = {};
  
      await Promise.all(
        UserUploadedDocuments.map(async (doc) => {
          const fieldName = getFieldName(doc.document_name);
          const filePath = doc.file_path;
  
          // Just extract the file name from the path
          const fileName = filePath.split('/').pop();
  
          populatedValues[fieldName] = fileName; // Just the name
          populatedUrls[fieldName] = filePath;   // Still store full URL if needed
        })
      );
  
      setInitialValues(populatedValues);
      setFileUrls(populatedUrls);
      setLoadingFiles(false);
    };
  
    if (UserUploadedDocuments && documentConfiguration) {
      populateFiles();
    }
  }, [UserUploadedDocuments, documentConfiguration]);
  
  // Validation: required if not present
  const validationSchema = Yup.object(
    documentConfiguration?.reduce((acc, doc) => {
      const fieldName = getFieldName(doc.document_name);
      if (doc.document_type === 'mandatory') {
        acc[fieldName] = Yup.mixed().required(
          `${doc.document_name} is required`
        );
      }
      return acc;
    }, {}) || {}
  );

 
  const formik = useFormik({
    initialValues: initialValues || {},
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      // Only send docs that are present (all are File objects)
      const documents = Object.entries(values)
        .filter(([_, file]) => file)
        .map(([fieldName, file]) => ({
          file,
          name: documentConfiguration.find(doc => getFieldName(doc.document_name) === fieldName)?.document_name || fieldName
        }));
      const apiData = {
        user_id: userId,
        documents
      };
      const formData = new FormData();
      formData.append('user_id', userId);
      documents.forEach((doc, index) => {
        formData.append(`documents[${index}][file]`, doc.file);
        formData.append(`documents[${index}][name]`, doc.name);
      });
      uploadOnboardingDocument.mutate({ data: formData }, {
        onSuccess: () => {
          onSubmit(apiData);
          formik.resetForm();
        },
      });
    },
  });

  console.log("form",formik.values)
  const handleFileChange = (event, fieldName) => {
    const file = event.target.files[0];
    if (file) {
      formik.setFieldValue(fieldName, file);
      setFileUrls((prev) => {
        const newState = { ...prev };
        delete newState[fieldName];
        return newState;
      });
    }
  };

  const handleDelete = (fieldName) => {
    formik.setFieldValue(fieldName, null);
    setFileUrls((prev) => {
      const newState = { ...prev };
      delete newState[fieldName];
      return newState;
    });
  };

  if (isLoading || loadingFiles || !initialValues) {
    return (
      <div className="flex justify-center items-center h-64">
        <DataLoader />
      </div>
    );
  }

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-8">
      <div className="space-y-6 bg-white p-4">
        {documentConfiguration?.map((doc) => {
          const fieldName = getFieldName(doc.document_name);
          const file = formik.values[fieldName];
          const fileUrl = fileUrls[fieldName];
          return (
            <div
              key={doc.id}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-700">
                    {doc.document_name}
                  </label>
                  {doc.document_type === 'mandatory' && (
                    <span className="text-xs text-red-500 font-medium">Required</span>
                  )}
                </div>
                <div className="mt-2">
                  {file ? (
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <div className="flex items-center space-x-3">
                        <div className="text-2xl">
                          {getFileIcon(file.file_path)}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{file.file_path}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {fileUrl && (
                          <a
                            href={fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:text-primary/80 text-sm"
                          >
                            View
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDelete(fieldName)}
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
                      name={fieldName}
                      onChange={(e) => handleFileChange(e, fieldName)}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary/90 transition-colors duration-200 ease-in-out cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    />
                  )}
                  {formik.touched[fieldName] && formik.errors[fieldName] && (
                    <p className="mt-2 text-sm text-red-600">
                      {formik.errors[fieldName]}
                    </p>
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
          disabled={uploadOnboardingDocument.isLoading || !formik.isValid}
          className="px-6 py-2 text-sm font-medium text-white bg-primary rounded-md shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 ease-in-out"
        >
          {uploadOnboardingDocument.isLoading ? 'Processing...' : 'Next Step'}
        </button>
      </div>
    </form>
  );
};

export default DocumentUploadForm; 