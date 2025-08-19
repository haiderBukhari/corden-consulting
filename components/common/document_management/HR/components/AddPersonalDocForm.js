import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { UseGetUsers } from '../../../../../hooks/query/admin/getUserList';
import useCreateInEmploymentDoc from '../../../../../hooks/mutations/documentManagment/CreateInEmploymentDoc';
import ButtonLoader from '../../../../ui/buttonLoader';
const UserPersonalDocumentForm = ({ onBack, onSuccess, setShowAddDocument }) => {
    const { data: userList } = UseGetUsers();
    const { mutate: createInEmploymentDoc , isLoading: isLoadingCreateInEmploymentDoc } = useCreateInEmploymentDoc();   
    const formik = useFormik({
        initialValues: {
            userId: '',
            documentName: '',
            file: null,
            description: '',
            isMandatory: false,
        },
        validationSchema: Yup.object({
            userId: Yup.string().required('User is required'),
            documentName: Yup.string()
                .required('Document name is required')
                ,
            description: Yup.string().required('Description is required'),
            file: Yup.mixed()
                .required('File is required')
                .test('fileSize', 'File size must be less than 5MB', (value) => {
                    return value && value.size <= 5 * 1024 * 1024;
                })
                .test('fileType', 'Only PDF files are supported', (value) => {
                    return value && value.type === 'application/pdf';
                }),
        }),
        onSubmit: (values, { resetForm }) => {
            const formData = new FormData();
            formData.append('user_id', values.userId);
            formData.append('document_type', 'personal');
            formData.append('title', values.documentName);
            formData.append('file', values.file);
            formData.append('description', values.description);
            formData.append('ack_required', values.isMandatory ? '1' : '0');

            // Replace this with your mutation
            console.log('Form submitted:', values);
            createInEmploymentDoc({ formData },
                {
                    onSuccess: () => {
                        resetForm();
                        onSuccess?.();
                        setShowAddDocument(false);
                    },
                    onError: (error) => {
                        console.error('Error submitting form:', error);
                    }
                }   
            );

          
        },
    });

    return (
        <div className="space-y-6 p-4 min-h-screen bg-white">
            <div className="flex items-center">
                <button onClick={() => setShowAddDocument(false)} type="button" className="flex items-center px-2 py-1 text-white bg-primary rounded-xl mb-3">
                    <ArrowLeft className="h-5 w-5 text-white mr-1" />
                    Back
                </button>
            </div>

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Add Personal Document</h2>

            <form onSubmit={formik.handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* User Dropdown */}
                    <div>
                        <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">Select User</label>
                        <select
                            id="userId"
                            name="userId"
                            value={formik.values.userId}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm ${formik.touched.userId && formik.errors.userId ? 'border-red-500' : 'border-gray-300'}`}
                        >
                            <option value="">-- Select a user --</option>
                            {userList?.map((user) => (
                                <option key={user.id} value={user.id}>{user.name}</option>
                            ))}
                        </select>
                        {formik.touched.userId && formik.errors.userId && (
                            <p className="text-xs text-red-600 mt-1">{formik.errors.userId}</p>
                        )}
                    </div>

                    {/* Document Name */}
                    <div>
                        <label htmlFor="documentName" className="block text-sm font-medium text-gray-700 mb-1">Document Name</label>
                        <input
                            type="text"
                            id="documentName"
                            name="documentName"
                            value={formik.values.documentName}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="e.g., ID Proof, License"
                            className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm ${formik.touched.documentName && formik.errors.documentName ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {formik.touched.documentName && formik.errors.documentName && (
                            <p className="text-xs text-red-600 mt-1">{formik.errors.documentName}</p>
                        )}
                    </div>

                    {/* Document File */}
                    <div className="md:col-span-2">
                        <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">Upload File (PDF)</label>
                        <input
                            type="file"
                            id="file"
                            name="file"
                            onChange={(event) => formik.setFieldValue('file', event.currentTarget.files[0])}
                            onBlur={formik.handleBlur}
                            accept="application/pdf"
                            className={`block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 ${formik.touched.file && formik.errors.file ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {formik.touched.file && formik.errors.file && (
                            <p className="text-xs text-red-600 mt-1">{formik.errors.file}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <input
                            type="text" 
                            id="description"
                            name="description"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="e.g., ID Proof, License"   
                            className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm ${formik.touched.description && formik.errors.description ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {formik.touched.description && formik.errors.description && (
                            <p className="text-xs text-red-600 mt-1">{formik.errors.description}</p>
                        )}
                    </div>  


                    {/* Mandatory Checkbox */}
                    <div className="md:col-span-2 flex items-center mt-2">
                        <input
                            type="checkbox"
                            id="isMandatory"
                            name="isMandatory"
                            checked={formik.values.isMandatory}
                            onChange={formik.handleChange}
                            className="h-4 w-4 text-primary border-gray-300 rounded"
                        />
                        <label htmlFor="isMandatory" className="ml-2 block text-sm text-gray-700">
                            This document is mandatory to acknowledge
                        </label>
                    </div>
                </div>

                <div className="flex justify-end mt-6">
                    <button
                        type="submit"
                        className="inline-flex justify-center items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
                    >
                        {isLoadingCreateInEmploymentDoc ? <ButtonLoader text="Submitting" /> : 'Submit'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default UserPersonalDocumentForm;
