import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { MdDeleteOutline } from "react-icons/md";
import { CiFloppyDisk } from "react-icons/ci";
import ButtonLoader from "../../../ui/buttonLoader";
import UseAddRegionVariables from "../../../../hooks/mutations/finances/regionVariables/addRegionVariable";
import UseEditRegionVariable from "../../../../hooks/mutations/finances/regionVariables/editRegionVariable";
import UseDeleteRegionVariable from "../../../../hooks/mutations/finances/regionVariables/deleteRegionVariable";

export default function ModifyRegionVariable({ region, onDiscard, isEdit = false, variable }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const addRegionVariable = UseAddRegionVariables();
  const editRegionVariable = UseEditRegionVariable();
  const deleteRegionVariable = UseDeleteRegionVariable();

  const initialValues = isEdit
    ? {
        title: variable?.title,
        mode_of_calculation: variable?.mode_of_calculation,
        variable_type: variable?.variable_type,
        adjustable: variable?.adjustable === 1,
        value: variable?.value,
      }
    : {
        title: "",
        mode_of_calculation: "Percentage",
        variable_type: "Deduction",
        adjustable: true,
        value: "",
      };

    const validationSchema = Yup.object({
      title: Yup.string().required("Title is required"),
      mode_of_calculation: Yup.string()
        .oneOf(["Fixed", "Percentage"])
        .required("Mode of calculation is required"),
      variable_type: Yup.string()
        .oneOf(["Addition", "Deduction"])
        .required("Variable type is required"),
      adjustable: Yup.boolean().required("Adjustable is required"),
      value: Yup.number()
        .typeError("Value must be a number")
        .positive("Value must be positive")
        .required("Value is required"),
    });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      setIsSubmitting(true);

      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("mode_of_calculation", values.mode_of_calculation);
      formData.append("variable_type", values.variable_type);
      formData.append("adjustable", values.adjustable ? 1 : 0);
      formData.append("value", values.value);

      if (isEdit) {
        editRegionVariable.mutate(
          { id: variable?.id, formData },
          {
            onSuccess: () => {
              setIsSubmitting(false);
              onDiscard();
            },
            onError: () => {
              setIsSubmitting(false);
            },
          }
        );
      } else {
        const data = {
          id: region.id,
          formData
        };
        addRegionVariable.mutate(data, {
          onSuccess: () => {
            setIsSubmitting(false);
            onDiscard();
          },
          onError: () => {
            setIsSubmitting(false);
          },
        });
      }
    }
  });

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    deleteRegionVariable.mutate(variable.id, {
      onSuccess: () => {
        setShowDeleteModal(false);
        onDiscard();
      },
      onError: () => {
        setShowDeleteModal(false);
      },
    });
  };

  return (
    <>
      <div className="p-4 bg-white rounded-lg shadow">
        <div className="flex justify-between items-center mb-1">
          <h2 className="text-2xl font-semibold mb-6">
            {isEdit ? `Edit Variable: ${variable.title}` : `Add Variable to ${region.name}`}
          </h2>
          {isEdit && (
            <button
              type="button"
              onClick={handleDeleteClick}
              className="flex items-center justify-center border border-primary text-primary rounded-xl py-2 px-9 text-sm"
            >
              <MdDeleteOutline className="text-base mr-1" />
              Delete
            </button>
          )}
        </div>
        <form onSubmit={formik.handleSubmit}>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label htmlFor="title" className="block mb-1">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
                className="w-full border rounded-lg px-4 py-2 border-gray-300"
              />
              {formik.touched.title && formik.errors.title && (
                <p className="text-red-500 text-sm mt-1">{formik.errors.title}</p>
              )}
            </div>

            <div>
              <label htmlFor="mode_of_calculation" className="block mb-1">
                Mode of Calculation
              </label>
              <select
                id="mode_of_calculation"
                name="mode_of_calculation"
                value={formik.values.mode_of_calculation}
                onChange={formik.handleChange}
                className="w-full border rounded-lg px-4 py-2 border-gray-300"
              >
                <option value="Fixed">Fixed</option>
                <option value="Percentage">Percentage</option>
              </select>
              {formik.touched.mode_of_calculation &&
                formik.errors.mode_of_calculation && (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.mode_of_calculation}
                  </p>
                )}
            </div>

            <div>
              <label htmlFor="variable_type" className="block mb-1">
                Variable Type
              </label>
              <select
                id="variable_type"
                name="variable_type"
                value={formik.values.variable_type}
                onChange={formik.handleChange}
                className="w-full border rounded-lg px-4 py-2 border-gray-300"
              >
                <option value="Addition">Addition</option>
                <option value="Deduction">Deduction</option>
              </select>
              {formik.touched.variable_type && formik.errors.variable_type && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.variable_type}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="adjustable" className="block mb-1">
                Adjustable
              </label>
              <select
                id="adjustable"
                name="adjustable"
                value={formik.values.adjustable}
                onChange={(e) =>
                  formik.setFieldValue("adjustable", e.target.value === "true")
                }
                className="w-full border rounded-lg px-4 py-2 border-gray-300"
              >
                <option value={true}>True</option>
                <option value={false}>False</option>
              </select>
              {formik.touched.adjustable && formik.errors.adjustable && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.adjustable}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="value" className="block mb-1">
                Value
              </label>
              <input
                type="number"
                id="value"
                name="value"
                value={formik.values.value}
                onChange={formik.handleChange}
                className="w-full border rounded-lg px-4 py-2 border-gray-300"
              />
              {formik.touched.value && formik.errors.value && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.value}
                </p>
              )}
            </div>
          </div>

          <div className="space-x-4 flex justify-end items-center mt-4">
            <button
              type="button"
              onClick={onDiscard}
              className="flex items-center justify-center border border-secondary text_default_text rounded-xl py-2 px-9 text-sm"
            >
              <MdDeleteOutline className="text-base mr-1" />
              Discard
            </button>
            <button
              type="submit"
              className="flex items-center justify-center rounded-xl text-center px-9 py-2 bg-primary text-white border text-sm"
            >
              <CiFloppyDisk className="text-base mr-1" />
              {isSubmitting ? (
                <ButtonLoader text="Submitting..." />
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </form>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <span className="text-xl font-semibold">Are you sure you want to delete this variable?</span>
            <div className="flex justify-end mt-4">
              <button
                className="bg-secondary text-default_text px-4 py-2 mr-2 rounded-md"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-primary flex items-center text-white px-4 py-2 rounded-md"
                onClick={handleDeleteConfirm}
              >
                <span>{deleteRegionVariable.isLoading ? "Deleting..." : "Delete"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}