import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { UseGetUsers } from "../../../../hooks/query/admin/getUserList";
import { successToaster } from "../../../../utils/toaster";
import UseEditLocations from "../../../../hooks/mutations/admin/updateLocations";
import { FaCircleXmark } from "react-icons/fa6";

const EditLocationModal = ({ locationData, setEditLocation }) => {
  const [ipAddresses, setIpAddresses] = useState(
    locationData?.ip_addresses || [""]
  );
  const [isIpEnabled, setIsIpEnabled] = useState(locationData?.ip_restricted); // 1 for enabled, 0 for disabled

  const { data: UserList, isLoading: isLoadingUsers } = UseGetUsers();
  const validationSchema = Yup.object().shape({
    locationName: Yup.string().required("Location name is required"),
    officeManager: Yup.string().required("Office Manager is required"),
    ipAddresses: Yup.array().of(
      Yup.string()
        .nullable() // Allow nullable values
        .matches(
          /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
          "Invalid IP address format"
        )
        .notRequired() // Make it optional
    ),
  });

  const EditLocation = UseEditLocations();

  const formik = useFormik({
    initialValues: {
      locationName: locationData.name,
      officeManager: locationData?.manager_id,
      ipAddresses: ipAddresses,
    },
    validationSchema,
    onSubmit: (values) => {
      const formData = new FormData();
      formData.append("name", values.locationName);
      formData.append("location_id", locationData.id);
      formData.append("location_manager_id", values.officeManager);
      formData.append("ip_status", isIpEnabled); // Add IP status to the form data
      // Filter out empty IP addresses before submitting
      const validIpAddresses = values?.ipAddresses.filter(
        (ip) => ip.trim() !== ""
      );

      // Only append IP addresses if there are valid entries
      if (validIpAddresses.length > 0) {
        validIpAddresses.forEach((ip) => {
          formData.append("ip_addresses[]", ip);
        });
      }

      EditLocation.mutate(formData, {
        onSuccess: () => {
          successToaster("Location updated successfully!");
          setEditLocation(false);
        },
      });
    },
  });

  // Handle adding new IP input field
  const handleAddIpField = () => {
    setIpAddresses([...ipAddresses, ""]);
  };

  // Handle removing an IP input field
  const handleRemoveIpField = (index) => {
    const newIpAddresses = ipAddresses.filter((_, i) => i !== index);
    setIpAddresses(newIpAddresses);
    formik.setFieldValue("ipAddresses", newIpAddresses);
  };

  // Handle IP input change
  const handleIpChange = (index, value) => {
    const newIpAddresses = [...ipAddresses];
    newIpAddresses[index] = value;
    setIpAddresses(newIpAddresses);
    formik.setFieldValue("ipAddresses", newIpAddresses);
  };

  // Handle IP Enable/Disable toggle
  const handleIpToggle = () => {
    setIsIpEnabled((prevState) => (prevState === 1 ? 0 : 1));
  };


  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 max-h-screen  overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
        <h2 className="text-xl font-semibold mb-4">Edit Location</h2>
        <form onSubmit={formik.handleSubmit}>
          {/* Location Name Field */}
          <div className="mb-4">
            <label htmlFor="locationName" className="block mb-2">
              Location Name
            </label>
            <input
              type="text"
              id="locationName"
              name="locationName"
              value={formik.values.locationName}
              onChange={formik.handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-primary"
            />
            {formik.errors.locationName && formik.touched.locationName && (
              <div className="text-darkred">{formik.errors.locationName}</div>
            )}
          </div>
          <div className="mb-4 col-span-2">
            <label htmlFor="officeManager" className="block mb-2">
              Select Office Manager
            </label>
            <select
              id="officeManager"
              name="officeManager"
              value={formik.values.officeManager}
              onChange={formik.handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-primary"
            >
              <option value="" label="Select a Office manager" />
              {UserList?.filter(
                (user) => user.role !== "HR" && user.role !== "Admin"
              ).map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
            {formik.errors.officeManager && formik.touched.officeManager && (
              <div className="text-darkred">{formik.errors.officeManager}</div>
            )}
          </div>
          {/* IP Status Toggle */}
          <div className="mb-4 flex items-center">
            <span className="mr-2">IP Restrictions:</span>
            <div
              className={`relative w-12 h-6 rounded-full cursor-pointer transition-colors duration-300 ${
                isIpEnabled ? "bg-green-500" : "bg-secondary"
              }`}
              onClick={handleIpToggle}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 transform ${
                  isIpEnabled ? "translate-x-6" : "translate-x-0"
                }`}
              ></div>
            </div>
            <span
              className={`ml-2 ${
                isIpEnabled ? "text-green-600" : "text-gray-500"
              }`}
            >
              {isIpEnabled ? "Enabled" : "Disabled"}
            </span>
          </div>

          {/* IP Address Fields */}
          <div className="mb-4">
            <label className="block mb-2">IP Addresses</label>
            <div className="">
              {ipAddresses.map((ip, index) => (
                <div key={index} className="flex items-center mb-2">
                  <div className="w-full">
                    <input
                      type="text"
                      name={`ipAddresses[${index}]`}
                      value={ip}
                      onChange={(e) => handleIpChange(index, e.target.value)}
                      disabled={isIpEnabled === 0} // Disable if IP is disabled
                      className={`w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-primary ${
                        isIpEnabled === 0 ? "bg-gray-100" : ""
                      }`}
                    />
                    {formik.errors.ipAddresses &&
                      formik.touched.ipAddresses &&
                      formik.errors.ipAddresses[index] && (
                        <div className="text-darkred ml-2">
                          {formik.errors.ipAddresses[index]}
                        </div>
                      )}
                  </div>

                  {index > 0 && isIpEnabled === 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveIpField(index)}
                      className="ml-2 px-2 py-1 text_default_text hover:text-opacity-80 focus:outline-none"
                    >
                      <FaCircleXmark className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {isIpEnabled === 1 && (
              <button
                type="button"
                onClick={handleAddIpField}
                className="px-4 py-2 bg-green-500 text-white rounded-md mt-2"
              >
                Add IP Address
              </button>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setEditLocation(false)}
              className="px-4 py-2 bg-secondary text-white rounded-md mr-4"
            >
              Discard
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-white rounded-md"
            >
              {EditLocation.isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLocationModal;
