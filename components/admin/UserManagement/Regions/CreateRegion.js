import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import UseCreateLocations from '../../../../hooks/mutations/admin/createLocations';
import { successToaster } from '../../../../utils/toaster';
import { UseGetLocations } from '../../../../hooks/query/admin/getLocations';
import DataLoader from '../../../ui/dataLoader';
import UseCreateRegion from '../../../../hooks/mutations/admin/regions/createRegion';

const CreateRegion = ({ setCreateRegion }) => {
    const createRegion = UseCreateRegion()
    const { data: LocationList, isLoading: isLocationLoading } = UseGetLocations();

    const [selectedLocations, setSelectedLocations] = useState([]);

    const validationSchema = Yup.object().shape({
        regionName: Yup.string().required('Region name is required'),
        locations: Yup.array()
            .min(1, 'Select at least one location')
            .required('Locations are required'),
    });

    const formik = useFormik({
        initialValues: {
            regionName: '',
            locations: [],
        },
        validationSchema,
        onSubmit: (values) => {
            const data = {
                name: values.regionName,
                location_ids: values.locations
            }


            createRegion.mutate(data, {
                onSuccess: () => {
                    successToaster('Region created successfully!');
                    setCreateRegion(false);
                },
            });
        },
    });

    const handleSelectLocation = (locationId) => {
        const updatedLocations = selectedLocations.includes(locationId)
            ? selectedLocations.filter((id) => id !== locationId)
            : [...selectedLocations, locationId];

        setSelectedLocations(updatedLocations);
        formik.setFieldValue('locations', updatedLocations);
    };

    const handleSelectAll = () => {
    // Filter locations where region length is zero
    const allFilteredLocationIds = LocationList
        ?.filter((location) => location.region?.length === 0)
        .map((location) => location.id) || [];

    // Toggle select/deselect based on currently selected locations
    const updatedLocations = selectedLocations.length === allFilteredLocationIds.length ? [] : allFilteredLocationIds;

    setSelectedLocations(updatedLocations);
    formik.setFieldValue('locations', updatedLocations);
};


    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
                <h2 className="text-xl font-semibold mb-4">Create Region</h2>
                <form onSubmit={formik.handleSubmit}>
                    {/* Region Name Field */}
                    <div className="mb-4">
                        <label htmlFor="regionName" className="block mb-2">
                            Region Name
                        </label>
                        <input
                            type="text"
                            id="regionName"
                            name="regionName"
                            value={formik.values.regionName}
                            onChange={formik.handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-primary"
                        />
                        {formik.errors.regionName && formik.touched.regionName && (
                            <div className="text-primary">{formik.errors.regionName}</div>
                        )}
                    </div>

                    {/* Locations Multi-Select */}
                    <div className="mb-4">
                        <label className="block mb-2">Locations</label>
                        {isLocationLoading ? (
                            <div className="flex justify-center items-center ">
                                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
                            </div>
                        ) : (
                            <div className="border border-gray-300 rounded-md p-2">
                                <button
                                    type="button"
                                    onClick={handleSelectAll}
                                    className="mb-2 px-2 py-1 bg-primary text-white rounded-md"
                                >
                                    {selectedLocations.length === (LocationList?.length || 0)
                                        ? 'Deselect All'
                                        : 'Select All'}
                                </button>
                                <div className="max-h-40 overflow-y-auto grid grid-cols-3 gap-3">
                                    {LocationList?.filter((location) => location.region?.length === 0).map((location) => (
                                        <div key={location.id} className="flex items-center mb-2">
                                            <input
                                                type="checkbox"
                                                id={`location-${location.id}`}
                                                value={location.id}
                                                checked={selectedLocations.includes(location.id)}
                                                onChange={() => handleSelectLocation(location.id)}
                                                className="mr-2"
                                            />
                                            <label htmlFor={`location-${location.id}`}>
                                                {location.name}
                                            </label>
                                        </div>
                                    ))}

                                </div>
                                {formik.errors.locations && (
                                    <div className="text-primary mt-2">{formik.errors.locations}</div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={() => setCreateRegion(false)}
                            className="px-4 py-2 bg-secondary text-white rounded-md mr-4"
                        >
                            Discard
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-primary text-white rounded-md"
                        >
                            {createRegion.isLoading ? 'Creating...' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateRegion;
