import React, { useState } from 'react';
import {
  Button,
  Typography,
  TextField,
  MenuItem,
  FormControlLabel,
  Switch,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
} from '@mui/material';
import { FaDownload } from 'react-icons/fa';
import { ArrowLeft } from 'lucide-react';
import { useOffboardingDocuments } from '../../../../../hooks/query/documentManagment/offboarding/getOffboardingDocuments';
import { useUploadOffboardingDocument } from '../../../../../hooks/mutations/documentManagment/offboarding/uploadOffboardingDocument';
import { useDownloadOffboardingDocument } from '../../../../../hooks/mutations/documentManagment/offboarding/downloadOffboardingDocument';
import { errorToaster } from '../../../../../utils/toaster';
import DataLoader from '../../../../ui/dataLoader';

const HROffboardingDocuments = ({ employee, onBack }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentType, setDocumentType] = useState('');
  const [requiresAcknowledgment, setRequiresAcknowledgment] = useState(false);
  const [expiryDate, setExpiryDate] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [downloadingDocId, setDownloadingDocId] = useState(null);

  const documentTypes = [
    'Experience Letter',
    'Final Settlement Breakdown',
    'Exit Interview Summary',
    'Clearance Certificates',
    'Tax/Provident Fund Documents',
  ];

  const { data: documents = [], isLoading } = useOffboardingDocuments(employee?.user?.id);
  const uploadMutation = useUploadOffboardingDocument();
  const downloadMutation = useDownloadOffboardingDocument();

  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);
  const handleModalOpen = () => setOpenModal(true);
  const handleModalClose = () => {
    resetForm();
    setOpenModal(false);
  };

  const handleUpload = () => {
    if (!selectedFile || !documentType || !expiryDate) {
      errorToaster('Please fill in all required fields');
      return;
    }

    uploadMutation.mutate(
      {
        documentType,
        requiresAcknowledgment,
        expiryDate,
        userId: employee.user_id,
        file: selectedFile,
      },
      {
        onSuccess: () => {
          handleModalClose();
        },
      }
    );
  };

  const resetForm = () => {
    setSelectedFile(null);
    setDocumentType('');
    setRequiresAcknowledgment(false);
    setExpiryDate('');
  };

  const handleDownload = (docId) => {
    setDownloadingDocId(docId);
    downloadMutation.mutate(docId, {
      onSettled: () => {
        setDownloadingDocId(null);
      }
    });
  };

  return (
    <div className="space-y-4 p-4 md:p-4 min-h-screen">
      <div className='flex justify-between items-center'>
        <div className="flex items-center space-x-4">
          <button onClick={onBack} type='button' className='flex space-x-2 items-center px-2 py-1 text-white bg-primary rounded-xl'>
            <ArrowLeft className='text-white h-5 w-5' />
            <span>Back</span>
          </button>
          <h2 className="text-lg font-medium text-gray-900">
            Uploaded Documents - {`${employee.user?.fname || ''} ${employee.user?.lname || ''}`}
          </h2>
        </div>
        <button onClick={handleModalOpen} type='button' className='flex space-x-2 items-center px-2 py-1 text-white bg-primary rounded-xl'>
          Upload New Document
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-4">
          <DataLoader />
        </div>
      ) : documents.length === 0 ? (
        <div className="text-center py-4 text-gray-500">No documents uploaded yet</div>
      ) : (
        <div className="overflow-x-auto max-h-96 overflow-y-auto">
          <table className="min-w-full table-auto border-collapse bg-white">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50 sticky top-0">
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">File Name</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Uploaded</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Expires</th>
                <th className="px-4 py-2 text-center text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc, idx) => (
                <tr key={doc.id} className={idx !== documents.length - 1 ? 'border-b border-gray-100' : ''}>
                  <td className="px-4 py-3 text-left text-gray-500 text-sm truncate max-w-xs">{doc.file_name}</td>
                  <td className="px-4 py-3 text-left text-gray-500 text-sm">{doc.date}</td>
                  <td className="px-4 py-3 text-left text-gray-500 text-sm">{doc.expires}</td>
                  <td className="px-4 py-3 text-center text-gray-500 text-sm space-x-2">
                    <Tooltip title="Download">
                      <IconButton
                        size="small"
                        onClick={() => handleDownload(doc.id)}
                        disabled={downloadingDocId === doc.id}
                      >
                        <FaDownload className="h-4 w-4" />
                      </IconButton>
                    </Tooltip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}


      <Dialog open={openModal} onClose={handleModalClose} fullWidth maxWidth="sm">
        <DialogTitle>Upload New Document</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3} className="pt-2">
            <TextField 
              select 
              label="Document Type" 
              value={documentType} 
              onChange={(e) => setDocumentType(e.target.value)} 
              fullWidth
              required
            >
              {documentTypes.map((type) => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </TextField>
            <Button variant="outlined" component="label" fullWidth>
              {selectedFile ? selectedFile.name : 'Choose File'}
              <input type="file" hidden onChange={handleFileChange} required />
            </Button>
            <FormControlLabel
              control={
                <Switch
                  checked={requiresAcknowledgment}
                  onChange={(e) => setRequiresAcknowledgment(e.target.checked)}
                />
              }
              label="Requires Acknowledgment"
            />
            <TextField
              type="date"
              label="Expiry Date"
              InputLabelProps={{ shrink: true }}
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              fullWidth
              required
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <button onClick={handleModalClose} className="flex space-x-2 items-center px-4 py-2 text-white bg-secondary rounded-xl">
            Cancel
          </button>
          <button
            variant="contained"
            onClick={handleUpload}
            disabled={!selectedFile || !documentType || !expiryDate || uploadMutation.isLoading}
            className="flex space-x-2 items-center px-4 py-2 text-white bg-primary rounded-xl"
          >
            {uploadMutation.isLoading ? 'Uploading...' : 'Upload'}
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default HROffboardingDocuments;
