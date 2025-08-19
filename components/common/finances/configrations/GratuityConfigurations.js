import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

import DataLoader from "../../../ui/dataLoader";
import UseUpdateGratuityConfiguiration from "../../../../hooks/mutations/finances/gratuityConfiguration";
import { getGratuityConfiguration } from "../../../../hooks/query/finances/gratuity/getGratuityConfiguiration";

export default function GratuityConfigurationForm() {
    const { data: configData, isLoading } = getGratuityConfiguration();
    const gratuityConfigration = UseUpdateGratuityConfiguiration();
    console.log("Data", configData)
    const formik = useFormik({
        initialValues: {
            gratuity_enabled: 0,
            gratuity_percentage: "",
        },
        validationSchema: Yup.object({
            gratuity_enabled: Yup.number().oneOf([0, 1]),
            gratuity_percentage: Yup.number()
                .when("gratuity_enabled", {
                    is: 1,
                    then: (schema) =>
                        schema
                            .required("Gratuity percentage is required")
                            .min(0, "Minimum is 0%")
                            .max(100, "Maximum is 100%"),
                    otherwise: (schema) => schema.notRequired(),
                }),
        }),
        enableReinitialize: true,
        onSubmit: (values) => {
            const formData = new FormData()
            formData.append("gratuity_enabled", values.gratuity_enabled)
            formData.append("gratuity_percentage", values.gratuity_enabled ? Number(values.gratuity_percentage) : 0)
            const id = configData.id
            gratuityConfigration.mutate({ id, formData })

        },
    });

    useEffect(() => {
        if (configData) {
            formik.setValues({
                gratuity_enabled: configData?.gratuity_enabled || 0,
                gratuity_percentage: configData?.gratuity_percentage || "",
            });
        }
    }, [configData]);

    // Toggle handler
    const handleToggle = () => {
        const current = formik.values.gratuity_enabled;
        formik.setFieldValue("gratuity_enabled", current === 1 ? 0 : 1);
        if (current === 1) {
            formik.setFieldValue("gratuity_percentage", ""); // Clear value if disabled
        }
    };

    return (
        <div className="min-h-screen">
            {isLoading ? (
                <DataLoader />
            ) : (
                <div className="p-6 bg-white rounded-lg shadow-md">
                    <h2 className="text-2xl font-semibold mb-6">Gratuity Configuration</h2>

                    <form onSubmit={formik.handleSubmit} className="space-y-6">

                        {/* Gratuity Toggle */}
                        <div className="flex items-center space-x-4">
                            <label className="text-md font-medium">Enable Gratuity</label>
                            <div
                                className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${formik.values.gratuity_enabled ? "bg-green-500" : "bg-gray-300"
                                    }`}
                                onClick={handleToggle}
                            >
                                <div
                                    className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${formik.values.gratuity_enabled ? "translate-x-6" : ""
                                        }`}
                                />
                            </div>
                        </div>

                        {/* Gratuity Percentage */}
                        <div>
                            <label className="block text-md font-medium mb-1">
                                Gratuity Percentage (%)
                            </label>
                            <input
                                type="number"
                                name="gratuity_percentage"
                                min="0"
                                max="100"
                                value={formik.values.gratuity_percentage}
                                onChange={formik.handleChange}
                                disabled={formik.values.gratuity_enabled === 0}
                                className={`w-full border px-4 py-2 rounded-md focus:outline-none ${formik.values.gratuity_enabled === 0 ? "bg-gray-100 cursor-not-allowed" : ""
                                    }`}
                            />
                            {formik.touched.gratuity_percentage &&
                                formik.errors.gratuity_percentage && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {formik.errors.gratuity_percentage}
                                    </p>
                                )}
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={() => formik.resetForm()}
                                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
                            >
                                Reset
                            </button>
                            <button
                                type="submit"
                                className="bg-[#009D9D] text-white px-6 py-2 rounded-md hover:bg-[#007a7a]"
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
