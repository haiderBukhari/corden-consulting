import React, { useState, useEffect } from 'react';
import { UseGetUsers } from '../../../../hooks/query/admin/getUserList';
import { FaUpload, FaTimes, FaExclamationTriangle, FaSpinner } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';
import { errorToaster } from '../../../../utils/toaster';

const OffboardingInitiationForm = ({ onComplete, isSubmittingStepOne, initialData = null, isEditing = false }) => {
  const [formData, setFormData] = useState({
    employee: initialData?.employee || null,
    exitType: initialData?.exitType || '',
    lastWorkingDay: initialData?.lastWorkingDay ? new Date(initialData.lastWorkingDay) : null,
    reason: initialData?.reason || '',
    attachments: initialData?.attachments?.map(a => ({
      id: a.id,
      name: a.file_name,
      file_path: a.file_path,
      preview: a.file_path
    })) || [],
    existing_attachment_ids: initialData?.attachments?.map(a => a.id) || [],
    notifyManager: initialData?.notifyManager ?? true,
    notifyFinance: initialData?.notifyFinance ?? true
  });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const fileInputRef = React.useRef(null);
  const { data: employees, isLoading } = UseGetUsers();

  useEffect(() => {    
    if (showConfirmModal && !isSubmittingStepOne && formData._isSubmitting) {
      setFormData(prev => ({ ...prev, _isSubmitting: false }));
      setShowConfirmModal(false);
    }
  }, [showConfirmModal, isSubmittingStepOne]);

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        employee: initialData.employee || null,
        exitType: initialData.exitType || '',
        lastWorkingDay: initialData.lastWorkingDay ? new Date(initialData.lastWorkingDay) : null,
        reason: initialData.reason || '',
        attachments: initialData.attachments?.map(a => ({
          id: a.id,
          name: a.file_name,
          file_path: a.file_path,
          preview: a.file_path
        })) || [],
        existing_attachment_ids: initialData.attachments?.map(a => a.id) || [],
        notifyManager: initialData.notifyManager ?? true,
        notifyFinance: initialData.notifyFinance ?? true
      });
    }
  }, [initialData]);

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    setFormData(prev => {
      const updatedFiles = [...prev.attachments];
      newFiles.forEach(file => {
        updatedFiles.push({
          file: file,
          name: file.name,
          size: file.size,
          preview: URL.createObjectURL(file)
        });
      });
      return { ...prev, attachments: updatedFiles };
    });
  };

  const removeFile = (index) => {
    setFormData(prev => {
      const updatedFiles = [...prev.attachments];
      const removedFile = updatedFiles[index];
      
      // If it's an existing file (has an id), remove it from existing_attachment_ids
      if (removedFile.id) {
        const updatedIds = prev.existing_attachment_ids.filter(id => id !== removedFile.id);
        return { 
          ...prev, 
          attachments: updatedFiles.filter((_, i) => i !== index),
          existing_attachment_ids: updatedIds
        };
      }
      
      // If it's a new file, just remove it from attachments
      if (removedFile.preview && !removedFile.file_path) {
        URL.revokeObjectURL(removedFile.preview);
      }
      return { 
        ...prev, 
        attachments: updatedFiles.filter((_, i) => i !== index)
      };
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
        
    // Reset validation errors
    const errors = {};
    let hasErrors = false;
    
    // Validate required fields
    if (!formData.employee) {
      errors.employee = 'Please select an employee';
      hasErrors = true;
    }
    
    if (!formData.exitType) {
      errors.exitType = 'Please select an exit type';
      hasErrors = true;
    }
    
    if (!formData.lastWorkingDay) {
      errors.lastWorkingDay = 'Please select the last working day';
      hasErrors = true;
    }
    
    if (!formData.reason) {
      errors.reason = 'Please provide a reason for leaving';
      hasErrors = true;
    }
    
    setValidationErrors(errors);
    
    if (hasErrors) {
      errorToaster('Please fill in all required fields');
      return;
    }

    setShowConfirmModal(true);
  };

  const confirmSubmission = () => {
    setFormData(prev => ({ ...prev, _isSubmitting: true }));
    
    // Separate new attachments from existing ones
    const newAttachments = formData.attachments.filter(a => !a.id);
    
    onComplete({
      ...formData,
      attachments: newAttachments,
      existing_attachment_ids: formData.existing_attachment_ids,
      initiatedDate: new Date()
    });
  };

  // Cleanup preview URLs when component unmounts
  useEffect(() => {
    return () => {
      formData.attachments.forEach(file => {
        if (file.preview && !file.file_path) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [formData.attachments]);

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Employee</label>
            <select
              className={`mt-1 block w-full rounded-md ${validationErrors.employee ? 'border-red-500 ring-red-500' : 'border-gray-300'} shadow-sm focus:border-primary focus:ring-primary p-2`}
              value={formData.employee?.id || ''}
              onChange={(e) => {
                const selectedEmployee = employees?.find(emp => emp.id === parseInt(e.target.value));
                setFormData(prev => ({ ...prev, employee: selectedEmployee }));
                if (validationErrors.employee) {
                  setValidationErrors(prev => ({ ...prev, employee: undefined }));
                }
              }}
              required
            >
              <option value="">Select Employee</option>
              {employees?.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.fname} {emp.lname}
                </option>
              ))}
            </select>
            {validationErrors.employee && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.employee}</p>
            )}
          </div>

          {formData.employee && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Employee ID</label>
                <input
                  type="text"
                  value={formData.employee.employee_id || 'N/A'}
                  readOnly
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm  p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Department</label>
                <input
                  type="text"
                  value={formData.employee.department?.departments_name || 'N/A'}
                  readOnly
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Position</label>
                <input
                  type="text"
                  value={formData.employee.position?.name || 'N/A'}
                  readOnly
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Joining Date</label>
                <input
                  type="text"
                  value={formData.employee.date_of_joining || 'N/A'}
                  readOnly
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm p-2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Manager</label>
                <input
                  type="text"
                  value={formData.employee.reports_to_manager || 'N/A'}
                  readOnly
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm p-2"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Exit Type</label>
            <select
              className={`mt-1 block w-full rounded-md ${validationErrors.exitType ? 'border-red-500 ring-red-500' : 'border-gray-300'} shadow-sm focus:border-primary focus:ring-primary p-2`}
              value={formData.exitType}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, exitType: e.target.value }));
                if (validationErrors.exitType) {
                  setValidationErrors(prev => ({ ...prev, exitType: undefined }));
                }
              }}
              required
            >
              <option value="">Select Exit Type</option>
              <option value="resignation">Resignation</option>
              <option value="termination">Termination</option>
              <option value="retirement">Retirement</option>
              <option value="end_of_contract">End of Contract</option>
            </select>
            {validationErrors.exitType && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.exitType}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Last Working Day</label>
            <DatePicker
              selected={formData.lastWorkingDay}
              onChange={(date) => {
                setFormData(prev => ({ ...prev, lastWorkingDay: date }));
                if (validationErrors.lastWorkingDay) {
                  setValidationErrors(prev => ({ ...prev, lastWorkingDay: undefined }));
                }
              }}
              className={`mt-1 block w-full rounded-md ${validationErrors.lastWorkingDay ? 'border-red-500 ring-red-500' : 'border-gray-300'} shadow-sm focus:border-primary focus:ring-primary p-2`}
              minDate={new Date()}
              required
            />
            {validationErrors.lastWorkingDay && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.lastWorkingDay}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Reason for Leaving</label>
            <textarea
              className={`mt-1 block w-full rounded-md ${validationErrors.reason ? 'border-red-500 ring-red-500' : 'border-gray-300'} shadow-sm focus:border-primary focus:ring-primary p-2`}
              rows={3}
              value={formData.reason}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, reason: e.target.value }));
                if (validationErrors.reason) {
                  setValidationErrors(prev => ({ ...prev, reason: undefined }));
                }
              }}
              required
            />
            {validationErrors.reason && (
              <p className="mt-1 text-sm text-red-600">{validationErrors.reason}</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-medium text-gray-700">Attachments</label>
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <FaUpload className="w-8 h-8 mb-4 text-gray-500" />
                <p className="mb-2 text-sm text-gray-500">
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

          {formData.attachments.length > 0 && (
            <div className="space-y-2">
              {formData.attachments.map((file, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTimes />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-primary focus:ring-primary"
              checked={formData.notifyManager}
              onChange={(e) => setFormData(prev => ({ ...prev, notifyManager: e.target.checked }))}
            />
            <span className="ml-2 text-sm text-gray-600">Notify Manager</span>
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              className="rounded border-gray-300 text-primary focus:ring-primary"
              checked={formData.notifyFinance}
              onChange={(e) => setFormData(prev => ({ ...prev, notifyFinance: e.target.checked }))}
            />
            <span className="ml-2 text-sm text-gray-600">Notify Finance</span>
          </label>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            {isEditing ? 'Update' : 'Submit'}
          </button>
        </div>
      </form>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <div 
            className="bg-white rounded-lg p-6 max-w-md w-full"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="mb-4 flex items-center text-amber-500">
              <FaExclamationTriangle className="h-6 w-6 mr-2" />
              <h3 className="text-lg font-medium text-gray-900">
                {isEditing ? 'Confirm Offboarding Update' : 'Confirm Offboarding Initiation'}
              </h3>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                {isEditing 
                  ? `Are you sure you want to update the offboarding process for ${formData.employee?.fname} ${formData.employee?.lname}?`
                  : `Are you sure you want to initiate the offboarding process for ${formData.employee?.fname} ${formData.employee?.lname}?`
                }
              </p>
              
              <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                <p className="text-sm text-blue-700">
                  {isEditing
                    ? 'The changes will be saved and you can continue with the offboarding process.'
                    : 'You will be able to edit these details later after the offboarding process is created.'
                  }
                </p>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <p><span className="font-medium">Exit Type:</span> {formData.exitType.replace(/_/g, ' ').replace(/^./, c => c.toUpperCase())}</p>
                <p><span className="font-medium">Last Working Day:</span> {format(new Date(formData.lastWorkingDay), 'MMMM d, yyyy')}</p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowConfirmModal(false);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                disabled={isSubmittingStepOne}
              >
                Cancel
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  confirmSubmission();
                }}
                disabled={isSubmittingStepOne}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark flex items-center justify-center disabled:opacity-70"
              >
                {isSubmittingStepOne ? (
                  <>
                    <FaSpinner className="animate-spin h-4 w-4 mr-2" />
                    <span>{isEditing ? 'Updating...' : 'Submitting...'}</span>
                  </>
                ) : (
                  isEditing ? "Confirm and Update" : "Confirm and Continue"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OffboardingInitiationForm; 