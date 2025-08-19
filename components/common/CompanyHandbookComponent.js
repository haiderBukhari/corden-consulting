import { useState, useEffect } from 'react';
import DataLoader from "../ui/dataLoader";
import { UseGetCompanyHandbooks } from '../../hooks/query/admin/getCompanyHandbooks';
import UseDeleteCompanyHandbook from '../../hooks/mutations/admin/deleteCompanyHandbook';
import UseSetCurrentCompanyHandbook from '../../hooks/mutations/admin/setCurrentCompanyHandbook';
import UseUploadCompanyHandbook from '../../hooks/mutations/admin/uploadCompanyHandbook';
import ButtonLoader from '../ui/buttonLoader';
import { LuUpload } from "react-icons/lu";
import { IoMdCloudUpload } from "react-icons/io";
import { CiCircleMinus } from "react-icons/ci";
import { successToaster } from '../../utils/toaster';
import DeleteItemModal from '../ui/deleteItemModal';
import CompanyHandbookPage from './ViewCompanyhandbook';
import { EyeIcon } from 'lucide-react';


export default function CompanyHandbookComponent({ isHRDashboard, role }) {
  const [currentHandbook, setCurrentHandbook] = useState(null);
  const [previousHandbooks, setPreviousHandbooks] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [loadingUseCurrentHandbookId, setLoadingUseCurrentHandbookId] = useState(null);
  const [loadingDeleteHandbookId, setLoadingDeleteHandbookId] = useState(null);
  const [inputFileName, setInputFileName] = useState(''); // New for custom file name

  const [modalVisible, setModalVisible] = useState(false);
  const [handbookIdToDelete, setHandbookIdToDelete] = useState(null);

  const { data: companyHandbooks, isLoading: isLoadingCompanyHandbooks } = UseGetCompanyHandbooks();
  const [showPdf, setShowPdf] = useState(false);
  const uploadCompanyHandbook = UseUploadCompanyHandbook();
  const setCurrentCompanyHandbook = UseSetCurrentCompanyHandbook();
  const deleteCompanyHandbook = UseDeleteCompanyHandbook();
;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (
      file &&
      file.type === 'application/pdf' &&
      file.size <= 25 * 1024 * 1024
    ) {
      setSelectedFile(file);
      setSelectedFileName(file.name);
    } else {
      alert('Only PDF files under 25MB are allowed.');
      setSelectedFile(null);
      setSelectedFileName('');
    }
  };

  const handleFileUpload = () => {
    if (selectedFile && inputFileName) {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('name', inputFileName);

      uploadCompanyHandbook.mutate(formData, {
        onSuccess: () => {
          successToaster('Company handbook uploaded successfully!');
          setSelectedFile(null);
          setSelectedFileName('');
          setInputFileName('');
        },
      });
    }
  };


  const handleDeleteItem = () => {
    if (handbookIdToDelete) {
      setLoadingDeleteHandbookId(handbookIdToDelete);
      deleteCompanyHandbook.mutate(handbookIdToDelete, {
        onSuccess: () => {
          successToaster('Company handbook deleted successfully!');
          setLoadingDeleteHandbookId(null);
          closeModal();
        },
        onError: () => {
          setLoadingDeleteHandbookId(null);
          closeModal();
        },
      });
    }
  };

  const handleViewHandbook = (book) => {
    setCurrentHandbook(book)
    setShowPdf(true);


  };
  const openModal = (id) => {
    setHandbookIdToDelete(id);
    setModalVisible(true);
  };

  const closeModal = () => {
    setHandbookIdToDelete(null);
    setModalVisible(false);
  };

  const handleUseCurrent = (id) => {
    setLoadingUseCurrentHandbookId(id);
    setCurrentCompanyHandbook.mutate(id, {
      onSuccess: () => {
        successToaster('Handbook set as current company handbook successfully!');
        setLoadingUseCurrentHandbookId(null);
      },
      onError: () => {
        setLoadingUseCurrentHandbookId(null);
      }
    });
  };


  const formatDate = (dateString) => {
    const options = { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' };
    const formattedDate = new Date(dateString).toLocaleDateString('en-US', options);

    return formattedDate.replace('at', '|');;
  };

  return (
    <>
      {isLoadingCompanyHandbooks ? (
        <DataLoader />
      ) : (
        showPdf ?
          <CompanyHandbookPage setShowPdf={setShowPdf} handbook={currentHandbook} role={role} />
          :

          <div className={`bg-white mx-5 min-h-screen  text-default_text`}>
            {!(role == 'staff' || role == 'manager' || role == 'team_lead') &&
              <div className="grid grid-cols-12">
                <div className="col-span-12 space-y-4">
                  <div className={`grid grid-cols-1  gap-4`}>
                    {

                      <div className="flex flex-col h-full">
                        <p className="mb-4 text-base font-medium">Upload Company Policy</p>

                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleFileUpload();
                          }}
                          className="border p-6 rounded-xl space-y-4 w-full max-w-md"
                        >
                          {/* File Name Field */}
                          <div className="flex flex-col space-y-1">
                            <label className="text-sm font-medium text-gray-700" htmlFor="file-name">File Name</label>
                            <input
                              id="file-name"
                              type="text"
                              placeholder="Enter file name"
                              className="border rounded-md px-3 py-2 text-sm"
                              value={inputFileName}
                              onChange={(e) => setInputFileName(e.target.value)}
                            />
                          </div>

                          {/* File Upload Field */}
                          <div className="flex flex-col space-y-1">
                            <label className="text-sm font-medium text-gray-700">Upload File</label>
                            <div className="border-dashed border-2 rounded-xl p-6 text-center cursor-pointer">
                              <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                                <IoMdCloudUpload className="h-16 w-16 text-indigo-200" />
                                <span className="text-xs font-semibold text-primary">Click to upload PDF</span>
                              </label>
                              <input
                                id="file-upload"
                                type="file"
                                accept=".pdf"
                                onChange={handleFileChange}
                                className="hidden"
                              />
                              <p className="text-xs mt-2 text-gray-500">Supported: PDF | Max size: 25 MB</p>
                            </div>
                            {selectedFileName && <p className="text-xs mt-1 text-gray-700">Selected File: {selectedFileName}</p>}
                          </div>

                          {/* Submit Button */}
                          <div className="pt-2">
                            <button
                              type="submit"
                              disabled={!selectedFile || !inputFileName}
                              className={`w-full flex items-center justify-center rounded-xl px-6 py-2 bg-primary text-white text-sm border ${!selectedFile || !inputFileName ? "cursor-not-allowed opacity-50" : ""}`}
                            >
                              {!uploadCompanyHandbook.isLoading ? <LuUpload className="mr-2" /> : null}
                              {uploadCompanyHandbook.isLoading ? <ButtonLoader text="Saving..." /> : "Save"}
                            </button>
                          </div>
                        </form>
                      </div>


                    }

                  </div>
                </div>
              </div>
            }
            <div>
              <div className="mt-6">
                <p className="mb-4 text-base font-medium"> Company Policy List</p>

                <div className={`${!isHRDashboard ? "min-h-96 mt-4 border rounded-xl p-6" : ""}`}>
                  <div className={`grid grid-cols-1 ${isHRDashboard ? "" : "sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"} gap-5`}>
                    {companyHandbooks && companyHandbooks
                      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                      .map((handbook, index) => (
                        <div key={handbook.id} className="bg-white border rounded-xl p-4 shadow-sm flex flex-col justify-between">
                          {/* Date */}
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-xs text-gray-500">{formatDate(handbook.created_at)}</span>

                          </div>

                          {/* File Info */}
                          <div className="border-dashed border-2 rounded-lg p-4 bg-gray-50 mb-4">
                            <p className="text-sm font-medium mb-1">File name: </p>
                            <p className='text-sm text-primary'>
                              {handbook?.file_name}
                            </p>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex space-x-4">
                            <button
                              type="button"
                              className="flex items-center justify-center w-full rounded-lg px-4 py-2 bg-primary text-white text-xs"
                              onClick={() => handleViewHandbook(handbook)}
                            >

                              <EyeIcon className="mr-1 h-4 w-4" />

                              View

                            </button>
                           { !(role == 'staff' || role == 'manager' || role == 'team_lead') &&
                            <button
                              type="button"
                              className="flex items-center justify-center w-full rounded-lg px-4 py-2 text-primary border border-primary text-xs"
                              onClick={() => openModal(handbook.id)}
                            >
                              {loadingDeleteHandbookId !== handbook.id ? (
                                <CiCircleMinus className="mr-1 text-sm" />
                              ) : null}
                              {loadingDeleteHandbookId === handbook.id ? (
                                <ButtonLoader text="Deleting..." />
                              ) : (
                                "Delete"
                              )}
                            </button>
}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

            </div>
            <DeleteItemModal
              modalVisible={modalVisible}
              closeModal={closeModal}
              handleDeleteItem={handleDeleteItem}
              item="company Policy"
              action="delete"
            />
          </div>
      )}
    </>
  );
}
