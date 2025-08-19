import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { MdDeleteOutline } from "react-icons/md";
import { CiFloppyDisk } from "react-icons/ci";
import ButtonLoader from "../../../ui/buttonLoader";
import UseUpdateRegionVariables from "../../../../hooks/mutations/payroll/updateRegionVariables";
import ModifyRegionVariable from "./ModifyRegionVariable";
import { TbEdit } from "react-icons/tb";
import { UseGetRegionsList } from "../../../../hooks/query/payroll/regions/getRegionsList";
import DataLoader from "../../../ui/dataLoader";

function EditRegion({ region, onDiscard }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const updateRegionVariables = UseUpdateRegionVariables();
  const [editingVariable, setEditingVariable] = useState(null);
  
  const { data: regionsList, isLoading: isLoadingRegions } = UseGetRegionsList();

  const updatedRegion = regionsList?.regions?.find((r) => r.id === region.id) || region;

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      variables: updatedRegion?.variables.map((variable) => ({
        id: variable.id,
        status: variable.status === "Active",
        value: variable.value || "",
      })),
    },
    validationSchema: Yup.object({
      variables: Yup.array().of(
        Yup.object().shape({
          status: Yup.boolean().required(),
          value: Yup.number()
            .required("Value is required")
            .typeError("Value must be a number")
            .positive("Value must be positive"),
        })
      ),
    }),
    onSubmit: (values) => {
      setIsSubmitting(true);

      const data = {
        id: updatedRegion.id,
        variables: {
          variables: values.variables.map((variable) => ({
            id: variable.id,
            status: variable.status ? "Active" : "Inactive",
            value: variable.value,
          })),
        },
      };

      updateRegionVariables.mutate(data, {
        onSuccess: () => {
          setIsSubmitting(false);
          onDiscard();
        },
        onError: () => {
          setIsSubmitting(false);
        },
      });
    },
  });

  if (editingVariable) {
    return (
      <ModifyRegionVariable
        region={updatedRegion}
        variable={editingVariable}
        isEdit={true}
        onDiscard={() => setEditingVariable(null)}
      />
    );
  }

  if (isLoadingRegions) {
    return <DataLoader />;
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-6">{updatedRegion?.name}</h2>
      <form onSubmit={formik.handleSubmit}>
        <div className="grid grid-cols-3 gap-6">
          {formik.values.variables.map((variable, index) => (
            <div
              key={variable.id}
              className={`border p-3 rounded-lg ${
                formik.values.variables[index].status
                  ? "border-primary"
                  : "border-gray-300"
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span
                  className={`text-lg ${
                    formik.values.variables[index].status ? "text-primary" : ""
                  }`}
                >
                  {updatedRegion?.variables[index]?.title}
                </span>
                
                <div className="flex space-x-2">
                  <div
                    onClick={() =>
                      formik.setFieldValue(
                        `variables[${index}].status`,
                        !formik.values.variables[index].status
                      )
                    }
                    className={`relative inline-flex items-center h-6 w-11 cursor-pointer ${
                      formik.values.variables[index].status
                        ? "bg-primary"
                        : "bg-secondary"
                    } rounded-full transition-colors`}
                  >
                    <span
                      className={`absolute left-1 h-4 w-4 bg-white rounded-full transition-transform ${
                        formik.values.variables[index].status
                          ? "translate-x-5"
                          : "translate-x-0"
                      }`}
                    ></span>
                  </div>
                  <TbEdit
                    onClick={() => {
                      const varData = updatedRegion.variables.find(
                        (v) => v.id === variable.id
                      );
                      setEditingVariable(varData);
                    }}
                    className="text-xl cursor-pointer text-gray-600 hover:text-primary"
                  />
                </div>
              </div>

              <input
                type="number"
                name={`variables[${index}].value`}
                value={formik.values.variables[index].value}
                onChange={formik.handleChange}
                className={`w-full border rounded-lg px-4 py-2 border-gray-300  font-semibold ${
                  formik.values.variables[index].status
                    ? "border-primary"
                    : "border-gray-300"
                }`}
              />
              {formik.touched.variables?.[index]?.value &&
                formik.errors.variables?.[index]?.value && (
                  <p className="text-red-500 text-sm mt-1">
                    {formik.errors.variables[index].value}
                  </p>
                )}
            </div>
          ))}
        </div>

        <div className="space-x-4 flex justify-end items-end mt-4">
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
            {isSubmitting ? <ButtonLoader text="Submitting..." /> : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditRegion;
