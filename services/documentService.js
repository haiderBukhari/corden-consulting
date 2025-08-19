// Dummy data for required documents
const dummyDocuments = [
  {
    id: 1,
    documentName: "Resume",
    documentType: "PDF, DOC, DOCX",
    isMandatory: true,
    description: "Your current resume or CV",
    maxSize: "5MB"
  },
  {
    id: 2,
    documentName: "ID Proof",
    documentType: "PDF, JPG, PNG",
    isMandatory: true,
    description: "Government-issued ID (passport, driver's license, etc.)",
    maxSize: "2MB"
  },

  {
    id: 3,
    documentName: "Reference Letters",
    documentType: "PDF, DOC, DOCX",
    isMandatory: false,
    description: "Letters of recommendation from previous employers",
    maxSize: "5MB"
  },


];

/**
 * Get all required documents
 * @returns {Promise<Array>} Array of document configurations
 */
export const getDocuments = async () => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Return dummy data
  return dummyDocuments;
};

/**
 * Get a single document configuration by ID
 * @param {number} id - Document ID
 * @returns {Promise<Object>} Document configuration object
 */
export const getDocumentById = async (id) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 400));
  
  // Find document in dummy data
  const document = dummyDocuments.find(doc => doc.id === id);
  
  if (!document) {
    throw new Error(`Document with ID ${id} not found`);
  }
  
  return document;
};

/**
 * Upload a document
 * @param {number} documentId - Document ID
 * @param {File} file - File to upload
 * @returns {Promise<Object>} Uploaded document information
 */
export const uploadDocument = async (documentId, file) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // Find document in dummy data
  const document = dummyDocuments.find(doc => doc.id === documentId);
  
  if (!document) {
    throw new Error(`Document with ID ${documentId} not found`);
  }
  
  // Simulate successful upload
  return {
    id: Math.floor(Math.random() * 1000) + 100,
    documentId,
    fileName: file.name,
    fileSize: file.size,
    fileType: file.type,
    uploadDate: new Date().toISOString(),
    url: "#",
    thumbnail: "https://via.placeholder.com/40?text=DOC"
  };
};

/**
 * Delete an uploaded document
 * @param {number} documentId - Document ID
 * @returns {Promise<boolean>} Success status
 */
export const deleteDocument = async (documentId) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Simulate successful deletion
  return true;
}; 