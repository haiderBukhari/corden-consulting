import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { UseGetUsers } from "../../../../hooks/query/admin/getUserList";
import ActivityLog from "../common/ActivityLog";
import DefaultAdminConfigration from "../common/DefaultAdminConfigration";
import DataLoader from "../../../ui/dataLoader";
import { getSalaryConfigrationData } from "../../../../hooks/query/finances/salary/getSalaryConfigrationData";
import UseUpdateSalaryConfigration from "../../../../hooks/mutations/finances/salary/updateSalaryConfigrationApproval";

export default function AdvanceSalaryConfigrationForm({ role }) {
  const { data: ConfigrationData, isLoading } = getSalaryConfigrationData();
  const { data: userList } = UseGetUsers();
  const updateSalaryConfigration = UseUpdateSalaryConfigration();

  const validationSchema = Yup.object({
    default_approvers: Yup.array()
      .of(
        Yup.object({
          approver_id: Yup.string().required("Approver is required"),
          approval_order: Yup.number().required("Approver order is required"),
        })
      )
      .min(1, "At least one approver is required"),


  });

  const formik = useFormik({
    initialValues: {


      default_approvers: [], // Approvers with approver_id and approval_order
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      const normalizedApprovers = values.default_approvers.map(approver => ({
        approver_id: Number(approver.approver_id), // Ensure approver_id is a string
        approval_order: approver.approval_order,
      }));

      const data = {

        default_approvers: normalizedApprovers, // Include default_approvers in submit data
      };

      updateSalaryConfigration.mutate(data);
    },
  });

  useEffect(() => {
    if (ConfigrationData) {
      const initialApprovers = ConfigrationData.approvers
        .map((approver, index) => ({
          approver_id: String(approver.id),
          approval_order: index + 1, // Automatically increment approver_order
        }))
        .sort((a, b) => a.approval_order - b.approval_order); // Sort by approver_order

      formik.setValues({


        default_approvers: initialApprovers, // Set the approvers with approver_id and approver_order
      });
    }
  }, [ConfigrationData]);

  const addApprover = () => {
    const newApprover = { approver_id: "", approval_order: formik.values.default_approvers.length + 1 };
    formik.setValues({
      ...formik.values,
      default_approvers: [...formik.values.default_approvers, newApprover],
    });
  };

  const removeApprover = (approver_id) => {
    const updatedApprovers = formik.values.default_approvers.filter(
      (approver) => approver.approver_id !== approver_id
    );
    formik.setValues({
      ...formik.values,
      default_approvers: updatedApprovers,
    });
  };

  const updateApprover = (id, value) => {
    const updatedApprovers = formik.values.default_approvers.map((approver) =>
      approver.approver_id === id ? { ...approver, approver_id: value } : approver
    );
    formik.setValues({
      ...formik.values,
      default_approvers: updatedApprovers,
    });
  };

  return (
    <div className="min-h-screen">
      {isLoading ?
        <DataLoader />
        :

        <div>
          <div className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Advance Salary Configurations</h2>
            <form onSubmit={formik.handleSubmit}>
              {/* Approvers Section */}
              <div className="mb-4">
                <h2 className="text-lg">Default Approval List</h2>
                <div className="grid grid-cols-3 gap-6 items-center">
                  {formik.values.default_approvers.map(({ approver_id, approval_order }, index) => {
                    // Get a list of selected approvers (excluding current approver for that row)
                    const selectedApprovers = formik.values.default_approvers
                      .filter((_, i) => i !== index) // Exclude current row
                      .map((approver) => approver.approver_id);

                    return (
                      <div key={index}>
                        <h2 className="text-sm text-primary mb-2"># Approver {approval_order}</h2>
                        <div className="flex items-center space-x-2 mb-2">
                          <select
                            className="p-2 border rounded-xl w-full"
                            value={approver_id}
                            onChange={(e) => updateApprover(approver_id, e.target.value)}
                          >
                            <option value="" label="Select approver" />
                            {userList
                              ?.filter((user) =>
                                user.role === "manager" &&
                                !user?.permissions?.configuration_Approver == 1 &&
                                !selectedApprovers.includes(String(user.id)) // Exclude already selected approvers
                              )
                              .map((user) => (
                                <option key={user.id} value={user.id}>
                                  {user.name}
                                </option>
                              ))}
                          </select>

                          {formik.values.default_approvers.length > 1 && (
                            <button
                              type="button"
                              className="bg-red-500 text-white px-2 text-xs py-1 rounded-full"
                              onClick={() => removeApprover(approver_id)}
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  <button
                    type="button"
                    className="border-primary border text-primary px-3 m-3 py-2 rounded-xl"
                    onClick={addApprover}
                  >
                    Add More
                  </button>
                </div>
              </div>

              {/* Buttons */}
              <div className="space-x-4 flex justify-end items-end">
                <button
                  type="button"
                  onClick={() => formik.resetForm()}
                  className="bg-secondary text-white px-4 py-2 rounded-lg"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  className="bg-primary text-white px-6 py-2 rounded-lg focus:outline-none"
                >
                  Save
                </button>
              </div>
            </form>
          </div>

          <DefaultAdminConfigration />

          <ActivityLog data={ConfigrationData?.activities} />
        </div>
      }
    </div>
  );
}
