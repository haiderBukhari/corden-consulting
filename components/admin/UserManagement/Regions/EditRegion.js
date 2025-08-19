import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { successToaster } from '../../../../utils/toaster';
import { UseGetLocations } from '../../../../hooks/query/admin/getLocations';
import UseUpdateRegion from '../../../../hooks/mutations/admin/regions/updateRegion';

const EditRegion = ({ setEditRegion, regionData }) => {
    const updateRegion = UseUpdateRegion();
    const { data: LocationList, isLoading: isLocationLoading } = UseGetLocations();

    const [selectedLocations, setSelectedLocations] = useState([]);

    // Populate selectedLocations based on regionData.locations
    useEffect(() => {
        if (regionData) {
            setSelectedLocations(regionData.locations.map((loc) => loc.id));
        }
    }, [regionData]);

    // Validation Schema
    const validationSchema = Yup.object().shape({
        regionName: Yup.string().required('Region name is required'),
        locations: Yup.array().min(1, 'Select at least one location').required('Locations are required'),
    });

    // Formik
    const formik = useFormik({
        initialValues: {
            regionName: regionData?.name || '',
            locations: regionData?.locations.map((loc) => loc.id) || [],
        },
        validationSchema,
        onSubmit: (values) => {
            const formData = {
                name: values.regionName,
                location_ids: values.locations
            };

            const data = { id: regionData.id, formData };
            updateRegion.mutate(data, {
                onSuccess: () => {
                    successToaster('Region updated successfully!');
                    setEditRegion(false);
                },
            });
        },
    });

    // Handle single location selection
    const handleSelectLocation = (locationId) => {
        setSelectedLocations((prevSelected) => {
            const updatedLocations = prevSelected.includes(locationId)
                ? prevSelected.filter((id) => id !== locationId)
                : [...prevSelected, locationId];

            formik.setFieldValue('locations', updatedLocations);
            return updatedLocations;
        });
    };

    // Handle select/deselect all locations
    const handleSelectAll = () => {
        if (selectedLocations.length === filteredLocations.length) {
            setSelectedLocations([]); // Deselect all
            formik.setFieldValue('locations', []);
        } else {
            setSelectedLocations(filteredLocations.map((loc) => loc.id)); // Select all
            formik.setFieldValue('locations', filteredLocations.map((loc) => loc.id));
        }
    };

    // Filter locations: Show locations with an empty region array OR already in the current region
    const filteredLocations = LocationList?.filter((location) =>
        location.region.length === 0 || regionData.locations.some((loc) => loc.id === location.id)
    ) || [];

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/3">
                <h2 className="text-xl font-semibold mb-4">Edit Region</h2>
                <form onSubmit={formik.handleSubmit}>
                    {/* Region Name Field */}
                    <div className="mb-4">
                        <label htmlFor="regionName" className="block mb-2">Region Name</label>
                        <input
                            type="text"
                            id="regionName"
                            name="regionName"
                            value={formik.values.regionName}
                            onChange={formik.handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-primary"
                        />
                        {formik.touched.regionName && formik.errors.regionName && (
                            <div className="text-primary">{formik.errors.regionName}</div>
                        )}
                    </div>

                    {/* Locations Multi-Select */}
                    <div className="mb-4">
                        <label className="block mb-2">Locations</label>
                        {isLocationLoading ? (
                            <div className="flex justify-center items-center">
                                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
                            </div>
                        ) : (
                            <div className="border border-gray-300 rounded-md p-2">
                                {filteredLocations.length > 0 ?
                                    <>
                                        <button
                                            type="button"
                                            onClick={handleSelectAll}
                                            className="mb-2 px-2 py-1 bg-primary text-white rounded-md"
                                        >
                                            {selectedLocations.length === filteredLocations.length
                                                ? 'Deselect All'
                                                : 'Select All'}
                                        </button>
                                        <div className="max-h-40 overflow-y-auto grid grid-cols-3 gap-3">
                                            {filteredLocations.map((location) => {
                                                const isChecked = selectedLocations.includes(location.id);
                                                return (
                                                    <div key={location.id} className="flex items-center mb-2">
                                                        <input
                                                            type="checkbox"
                                                            id={`location-${location.id}`}
                                                            value={location.id}
                                                            checked={isChecked}
                                                            onChange={() => handleSelectLocation(location.id)}
                                                            className="mr-2"
                                                        />
                                                        <label htmlFor={`location-${location.id}`}>
                                                            {location.name}
                                                        </label>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </>
                                    : (
                                        <p className="text-gray-500 text-center">No locations available</p>
                                    
                                )}
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
                            onClick={() => setEditRegion(false)}
                            className="px-4 py-2 bg-secondary text-white rounded-md mr-4"
                        >
                            Discard
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-primary text-white rounded-md"
                        >
                            {updateRegion.isLoading ? 'Updating...' : 'Update'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditRegion;
