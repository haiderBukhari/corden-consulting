import React, { useState, useRef, useEffect } from 'react';
import { FaTimes, FaEdit, FaUpload, FaSave, FaCheck, FaClipboardCheck } from 'react-icons/fa';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useEditOffboardingStepOne } from '../../../../hooks/mutations/offboarding/editOffBoardingProcessOne';
import { useOffboardingStepTwo } from '../../../../hooks/mutations/offboarding/offBoardingProcessTwo';
import { useOffboardingStepFour } from '../../../../hooks/mutations/offboarding/offBoardingProcessFour';

const OffboardingUserDetail = ({ user, onClose }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    exitType: '',
    lastWorkingDay: null,
    reason: '',
    newAttachments: [],
    checklist: [],
    existingAttachments: [],
    removedAttachmentIds: []
  });
  const fileInputRef = useRef(null);
  const modalContentRef = useRef(null);

  const { mutate: editStepOne, isLoading: isEditingStepOne } = useEditOffboardingStepOne();
  const { mutate: updateChecklist, isLoading: isUpdatingChecklist } = useOffboardingStepTwo();
  const { mutate: confirmOffboarding, isLoading: isConfirming } = useOffboardingStepFour();
  
  // Initialize step 2 if it hasn't been done yet
  const initializeStepTwo = () => {
    if (!user.exit_checklist || user.exit_checklist.length === 0) {
      updateChecklist({
        step: user.id,
        exit_checklist: [] // Initialize with empty checklist
      }, {
        onSuccess: () => {
          // After initializing, set the form data
          setFormData({
            exitType: user.exit_type || '',
            lastWorkingDay: user.last_working_day ? new Date(user.last_working_day) : null,
            reason: user.reason || '',
            newAttachments: [],
            checklist: [],
            existingAttachments: [...(user.attachments || [])],
            removedAttachmentIds: []
          });
        }
      });
    } else {
      // If step 2 is already initialized, just set the form data
      setFormData({
        exitType: user.exit_type || '',
        lastWorkingDay: user.last_working_day ? new Date(user.last_working_day) : null,
        reason: user.reason || '',
        newAttachments: [],
        checklist: user.exit_checklist?.map(item => ({
          id: item.id,
          status: item.status,
          item: item.item
        })) || [],
        existingAttachments: [...(user.attachments || [])],
        removedAttachmentIds: []
      });
    }
  };

  // Handle clicking outside the modal
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalContentRef.current && !modalContentRef.current.contains(event.target)) {
        // Click is outside the modal content
        onClose();
      }
    };

    // Add event listener
    document.addEventListener('mousedown', handleClickOutside);
    
    // Clean up
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);
  
  if (!user) return null;

  const {
    id,
    user: employee,
    user_id,
    emp_id,
    exit_type,
    last_working_day,
    reason,
    attachments,
    exit_checklist,
    status,
    created_at,
    department,
    position,
    manager_id,
    joining_date
  } = user;

  // Initialize the form data when edit button is clicked
  const handleEditClick = () => {
    initializeStepTwo();
    setIsEditing(true);
  };

  const handleBackClick = () => {
    setIsEditing(false);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleChecklistStatusChange = (id, status) => {
    setFormData(prev => ({
      ...prev,
      checklist: prev.checklist.map(item => 
        item.id === id ? { ...item, status } : item
      )
    }));
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFormData(prev => {
      const updatedFiles = [...prev.newAttachments];
      newFiles.forEach(file => {
        updatedFiles.push({
          file: file,
          name: file.name,
          size: file.size,
          preview: URL.createObjectURL(file)
        });
      });
      return { ...prev, newAttachments: updatedFiles };
    });
  };

  const removeFile = (index) => {
    setFormData(prev => {
      const updatedFiles = [...prev.newAttachments];
      if (updatedFiles[index].preview) {
        URL.revokeObjectURL(updatedFiles[index].preview);
      }
      updatedFiles.splice(index, 1);
      return { ...prev, newAttachments: updatedFiles };
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Function to remove existing attachment
  const removeExistingAttachment = (index) => {
    setFormData(prev => {
      const updatedAttachments = [...prev.existingAttachments];
      const removedAttachment = updatedAttachments[index];
      updatedAttachments.splice(index, 1);
      return { 
        ...prev, 
        existingAttachments: updatedAttachments,
        removedAttachmentIds: [...prev.removedAttachmentIds, removedAttachment?.id]
      };
    });
  };

  const saveBasicInfo = () => {
    // Get remaining attachment IDs (excluding removed ones)
    const remainingAttachmentIds = formData.existingAttachments
      .map(attachment => attachment?.id)
      .filter(id => !formData.removedAttachmentIds.includes(id));

    // Prepare new attachment files
    const newAttachmentFiles = formData.newAttachments.map(attachment => ({
      file: attachment?.file,
      name: attachment?.name
    }));

    editStepOne({
      id,
      user_id,
      emp_id: emp_id || '',
      department: department || '',
      position: position || '',
      joining_date,
      manager_id: manager_id || '',
      exit_type: formData.exitType,
      last_working_day: formData.lastWorkingDay instanceof Date ? 
        format(formData.lastWorkingDay, 'MM/dd/yyyy') : formData.lastWorkingDay,
      reason: formData.reason,
      existing_attachment_ids: remainingAttachmentIds,
      attachments: newAttachmentFiles
    }, {
      onSuccess: () => {
        // Don't exit edit mode or reset anything - allow user to continue with other actions
      }
    });
  };

  const saveChecklist = () => {
    // Update only the checklist (Step Two)
    updateChecklist({
      step: id, // Using the offboarding ID for updates
      exit_checklist: formData.checklist.map(item => ({
        id: item.id,
        status: item.status
      }))
    }, {
      onSuccess: () => {
        // Don't exit edit mode or reset anything - allow user to continue with other actions
      }
    });
  };

  const handleConfirm = () => {
    confirmOffboarding(id, {
      onSuccess: () => {
        setIsEditing(false);
        onClose();
      }
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'not_started':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div ref={modalContentRef} className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Offboarding Details {isEditing ? '(Edit Mode)' : ''}
          </h2>
          <div className="flex space-x-4">
            {!isEditing && (
              <button
                onClick={handleEditClick}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark flex items-center space-x-2"
              >
                <FaEdit className="h-4 w-4" />
                <span>Edit</span>
              </button>
            )
            // (
            //   <button
            //     onClick={handleBackClick}
            //     className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 flex items-center space-x-2"
            //   >
            //     <span>Back</span>
            //   </button>
            // )
            }
            {/* <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <FaTimes className="h-6 w-6" />
            </button> */}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Employee Information</h3>
              <div className="mt-2 space-y-2">
                <p className="text-sm text-gray-600 capitalize">
                  <span className="font-medium">Name:</span> {employee?.fname} {employee?.lname}
                </p>
                <p className="text-sm text-gray-600 capitalize">
                  <span className="font-medium">Employee ID:</span> {employee?.employee_id || 'N/A'}
                </p>
                <p className="text-sm text-gray-600 capitalize">
                  <span className="font-medium">Department:</span> {department || 'N/A'}
                </p>
                <p className="text-sm text-gray-600 capitalize">
                  <span className="font-medium">Position:</span> {position || 'N/A'}
                </p>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Offboarding Details</h3>
                {isEditing && (
                  <button
                    onClick={saveBasicInfo}
                    disabled={isEditingStepOne}
                    className="px-3 py-1 bg-[#009D9D] text-white text-sm rounded-md hover:bg-[#007a7a] flex items-center space-x-1 disabled:opacity-50"
                  >
                    <FaSave className="h-3 w-3" />
                    <span>{isEditingStepOne ? 'Saving...' : 'Update Details'}</span>
                  </button>
                )}
              </div>
              <div className="mt-2 space-y-4">
                <p className="text-sm text-gray-600 capitalize">
                  <span className="font-medium">Initiated Date:</span> {format(new Date(created_at), 'MMMM d, yyyy')}
                </p>
                <p className="text-sm text-gray-600 capitalize">
                  <span className="font-medium">Status:</span> 
                  <span className={`ml-2 px-2 py-1 rounded-full text-sm font-bold ${getStatusColor(status)}`}>
                    {status?.replace('_', ' ')}
                  </span>
                </p>
                
                {isEditing ? (
                  <>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-600 w-1/4">Exit Type:</span>
                      <select
                        value={formData.exitType}
                        onChange={(e) => handleChange('exitType', e.target.value)}
                        className="mt-1 block w-3/4 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary p-2"
                      >
                        <option value="">Select Exit Type</option>
                        <option value="resignation">Resignation</option>
                        <option value="termination">Termination</option>
                        <option value="retirement">Retirement</option>
                        <option value="end_of_contract">End Of Contract</option>
                      </select>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-600 w-1/4">Last Working Day:</span>
                      <DatePicker
                        selected={formData.lastWorkingDay}
                        onChange={(date) => handleChange('lastWorkingDay', date)}
                        className="mt-1 block w-3/4 rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary p-2"
                        minDate={new Date()}
                      />
                    </div>
                    
                    <div className="flex space-x-2">
                      <span className="text-sm font-medium text-gray-600 w-1/4 pt-2">Reason:</span>
                      <div className="w-3/4">
                        <textarea
                          value={formData.reason}
                          onChange={(e) => handleChange('reason', e.target.value)}
                          rows={3}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary p-2 resize-y"
                          style={{ minHeight: "40px" }}
                        />
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-sm text-gray-600 capitalize">
                      <span className="font-medium">Exit Type:</span> 
                      <span className="text-base ml-1 font-bold">{exit_type?.replace(/_/g, ' ').replace(/^./, c => c.toUpperCase())}</span>
                    </p>
                    <p className="text-sm text-gray-600 capitalize">
                      <span className="font-medium">Last Working Day:</span> 
                      <span className="text-base ml-1 font-bold">{format(new Date(last_working_day), 'MMMM d, yyyy')}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Reason:</span> 
                      <span className="text-base ml-1 font-bold">{reason || 'N/A'}</span>
                    </p>
                  </>
                )}
              </div>
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Add Attachments</h3>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-3 pb-3">
                      <FaUpload className="w-5 h-5 mb-2 text-gray-500" />
                      <p className="mb-1 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PDF, DOC, DOCX, JPG, PNG</p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      multiple
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    />
                  </label>
                </div>

                <div className="max-h-[120px] overflow-y-auto pr-2">
                  {formData.newAttachments.length > 0 && (
                    <div className="space-y-1">
                      <h4 className="text-sm font-medium text-gray-700">New Attachments</h4>
                      {formData.newAttachments.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-1 bg-gray-50 rounded">
                          <span className="text-sm text-gray-600 truncate max-w-[90%]">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FaTimes className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {formData.existingAttachments.length > 0 && (
                    <div className="space-y-1 mt-2">
                      <h4 className="text-sm font-medium text-gray-700">Existing Attachments</h4>
                      {formData.existingAttachments.map((attachment, index) => (
                        <div key={index} className="flex items-center justify-between p-1 bg-gray-50 rounded">
                          <span className="text-sm text-gray-600 truncate max-w-[80%]">
                            {attachment?.name || (typeof attachment === 'string' ? attachment.split('/').pop() : `${attachment?.file_name}`)}
                          </span>
                          <div className="flex items-center space-x-2">
                            <a 
                              href={attachment?.file_path || (typeof attachment === 'string' ? attachment : '#')} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="text-primary hover:text-primary-dark"
                              download
                            >
                              <FaUpload className="h-3 w-3 rotate-180" />
                            </a>
                            <button
                              type="button"
                              onClick={() => removeExistingAttachment(index)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <FaTimes className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              attachments && attachments.length > 0 && (
                <div className="space-y-2 mt-4">
                  <h3 className="text-lg font-medium text-gray-900">Attachments</h3>
                  <div className="max-h-[120px] overflow-y-auto pr-2">
                    <div className="space-y-1">
                      {attachments.map((attachment, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-sm text-gray-600 truncate max-w-[80%]">
                            {attachment?.file_name || (typeof attachment === 'string' ? attachment.split('/').pop() : `${attachment?.file_name}`)}
                          </span>
                          <a 
                            href={attachment?.file_path || (typeof attachment === 'string' ? attachment : '#')} 
                            download
                            className="flex items-center text-primary hover:underline px-2 py-1 hover:bg-gray-100 rounded"
                          >
                            <FaUpload className="h-3 w-3 rotate-180 mr-1" />
                            <span className="text-xs">Download</span>
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )
            )}
          </div>

          <div>
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Exit Checklist</h3>
            </div>
            <div className="mt-4 flex flex-col">
              <div className="space-y-2 min-h-[100px] max-h-[400px] overflow-y-auto pr-2">
                {isEditing ? (
                  formData.checklist.map((item) => (
                    <div
                      key={item.id}
                      className={`p-4 rounded-lg border ${
                        item.status === 'completed' ? 'bg-green-50 border-green-200' :
                        item.status === 'in_progress' ? 'bg-yellow-50 border-yellow-200' :
                        'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900 truncate max-w-[60%]">{item.item}</p>
                        <select
                          value={item.status}
                          onChange={(e) => handleChecklistStatusChange(item.id, e.target.value)}
                          className={`block pl-3 pr-10 py-1 text-sm border-gray-300 focus:outline-none focus:ring-primary focus:border-primary rounded-md ${
                            item.status === 'completed' ? 'bg-green-100 text-green-800' :
                            item.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}
                        >
                          <option value="not_started">Not Started</option>
                          <option value="in_progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                    </div>
                  ))
                ) : (
                  exit_checklist?.map((item) => (
                    <div
                      key={item.id}
                      className={`p-2 rounded-lg border ${
                        item.status === 'completed' ? 'bg-green-50 border-green-200' :
                        item.status === 'in_progress' ? 'bg-yellow-50 border-yellow-200' :
                        'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{item.item}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                          item.status === 'completed' ? 'bg-green-100 text-green-800' :
                          item.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {item.status?.replace('_', ' ')}
                        </span>
                      </div>
                    </div>
                  ))
                )}
                {!exit_checklist && !formData.checklist.length && (
                  <p className="text-sm text-gray-500">No checklist items available</p>
                )}
              </div>
              {isEditing && (
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={saveChecklist}
                    disabled={isUpdatingChecklist}
                    className="px-3 py-1 bg-teal-600 text-white text-sm rounded-md hover:bg-teal-700 flex items-center space-x-1 disabled:opacity-50"
                  >
                    <FaClipboardCheck className="h-3 w-3" />
                    <span>{isUpdatingChecklist ? 'Saving...' : 'Save Checklist'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          {/* {isEditing && status !== 'completed' && (
            <button
              onClick={handleConfirm}
              disabled={isConfirming}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center space-x-2 disabled:opacity-50"
            >
              <FaCheck className="h-4 w-4" />
              <span>{isConfirming ? 'Confirming...' : 'Confirm Offboarding'}</span>
            </button>
          )} */}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default OffboardingUserDetail; 