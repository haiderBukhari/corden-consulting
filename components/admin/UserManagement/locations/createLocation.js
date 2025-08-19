import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import UseCreateLocations from '../../../../hooks/mutations/admin/createLocations';
import { successToaster } from '../../../../utils/toaster';
import { UseGetUsers } from '../../../../hooks/query/admin/getUserList';
import { FaCircleXmark } from 'react-icons/fa6';

const CreateLocationModal = ({ setCreateLocation }) => {

    const createLocation = UseCreateLocations();

    // State for handling dynamic IP address input fields
    const [ipAddresses, setIpAddresses] = useState(['']);

     const { data: UserList, isLoading: isLoadingUsers } = UseGetUsers();
    const validationSchema = Yup.object().shape({
        locationName: Yup.string().required('Location name is required'),
        officeManager:Yup.string().required("Office Manager is required"),
        ipAddresses: Yup.array().of(
            Yup.string()
            .nullable() // Allow nullable values
            .matches(
                /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
                'Invalid IP address format'
            )
            .notRequired() // Make it optional
        ),
    });

    const formik = useFormik({
        initialValues: {
            locationName: '',
            officeManager:'',
            ipAddresses: ipAddresses,
        },
        validationSchema,
        onSubmit: (values) => {
            const formData = new FormData();
            formData.append("name", values.locationName);
            formData.append("location_manager_id", values.officeManager);
            // Append each IP address as ip_addresses[]
            values.ipAddresses.forEach((ip) => {
                formData.append("ip_addresses[]", ip);
            });

            createLocation.mutate(formData, {
                onSuccess: () => {
                    successToaster("Location created successfully!");
                    setCreateLocation(false);
                }
            });
        },
    });

    // Handle adding new IP input field
    const handleAddIpField = () => {
        setIpAddresses([...ipAddresses, '']);
    };

    // Handle removing an IP input field
    const handleRemoveIpField = (index) => {
        const newIpAddresses = ipAddresses.filter((_, i) => i !== index);
        setIpAddresses(newIpAddresses);
        formik.setFieldValue('ipAddresses', newIpAddresses);
    };

    // Handle IP input change
    const handleIpChange = (index, value) => {
        const newIpAddresses = [...ipAddresses];
        newIpAddresses[index] = value;
        setIpAddresses(newIpAddresses);
        formik.setFieldValue('ipAddresses', newIpAddresses);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                <h2 className="text-xl font-semibold mb-4">Create Location</h2>
                <form onSubmit={formik.handleSubmit}>
                    {/* Location Name Field */}
                    <div className="mb-4">
                        <label htmlFor="locationName" className="block mb-2">Location Name</label>
                        <input
                            type="text"
                            id="locationName"
                            name="locationName"
                            value={formik.values.locationName}
                            onChange={formik.handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-primary"
                        />
                        {formik.errors.locationName && formik.touched.locationName && (
                            <div className="text-primary">{formik.errors.locationName}</div>
                        )}
                    </div>
                    <div className="mb-4 col-span-2">
                            <label htmlFor="officeManager" className="block mb-2">Select Office Manager</label>
                            <select
                                id="officeManager"
                                name="officeManager"
                                value={formik.values.officeManager}
                                onChange={formik.handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-primary"
                            >
                                <option value="" label="Select a Office manager" />
                                {UserList?.filter(user => user.role !== 'HR' && user.role !== 'Admin' ).map(user => (
                                    <option key={user.id} value={user.id}>
                                        {user.name}
                                    </option>
                                ))}
                            </select>
                            {formik.errors.officeManager && formik.touched.officeManager && (
                                <div className="text-primary">{formik.errors.officeManager}</div>
                            )}
                        </div>

                    {/* IP Address Fields */}
                    <div className="mb-4">
                        <label className="block mb-2">IP Addresses</label>
                        {ipAddresses.map((ip, index) => (
                            <div key={index} className="flex items-center mb-2">
                                <div className='w-full'>
                                    <input
                                        type="text"
                                        name={`ipAddresses[${index}]`}
                                        value={ip}
                                        onChange={(e) => handleIpChange(index, e.target.value)}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-primary"
                                    />
                                    {formik.errors.ipAddresses && formik.touched.ipAddresses && formik.errors.ipAddresses[index] && (
                                        <div className="text-primary ml-2">{formik.errors.ipAddresses[index]}</div>
                                    )}
                                </div>
                                {/* Show remove (×) button for all except the first IP field */}
                                {index > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveIpField(index)}
                                        className="ml-2 px-2 py-1 text_default_text hover:text-opacity-80 focus:outline-none"
                                    >
                                        <FaCircleXmark className='h-5 w-5' />
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={handleAddIpField}
                            className="px-4 py-2 bg-green-500 text-white rounded-md mt-2"
                        >
                            Add IP Address
                        </button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={() => setCreateLocation(false)}
                            className="px-4 py-2 bg-secondary text-white rounded-md mr-4"
                        >
                            Discard
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-primary text-white rounded-md"
                        >
                            {createLocation.isLoading ? 'Creating...' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateLocationModal;
