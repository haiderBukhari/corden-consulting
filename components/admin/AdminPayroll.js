import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { UseGetUsers } from "../../hooks/query/admin/getUserList";
import DataLoader from "../ui/dataLoader";
import UseAddAdminPayrolConfigration from "../../hooks/mutations/admin/addPayrolConfigration";
import { UseGetAdminPayrollConfigration } from "../../hooks/query/admin/getAdminPayroll";

export default function AdminPayrollComponent({ role }) {
  const { data: ConfigrationData, isLoading } = UseGetAdminPayrollConfigration();
  const { data: userList } = UseGetUsers();
  const addPayrollConfigration = UseAddAdminPayrolConfigration();

  const validationSchema = Yup.object({
    cut_off_period: Yup.date().required("Cut-off Period is required"),
    approver_manager_id: Yup.string()
      .required("Approval Manager is required")
      .test(
        "not-same-as-role",
        "Approval Manager cannot have the same value as Role ID",
        (value) => value !== role?.id
      ),
  });

  const formik = useFormik({
    initialValues: {
      cut_off_period: ConfigrationData?.[0]?.cut_off_period || "",
      approver_manager_id: ConfigrationData?.[0]?.configuration_approver || "",
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      const formdata = new FormData();
      formdata.append("cut_off_period", values.cut_off_period);
      formdata.append("configuration_approver", values.approver_manager_id);
      addPayrollConfigration.mutate(formdata);
    },
  });

  return (
    <div className="min-h-screen">
      {isLoading ? (
        <DataLoader />
      ) : (
        <div>
          <div className="p-4 bg-white rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Payroll Configurations</h2>
            <form onSubmit={formik.handleSubmit}>
              {/* Cut-Off Period */}
              <div className="grid grid-cols-3 gap-6 my-4 items-center">
                <div className="mb-4">
                  <label className="block mb-1">Cut-off Period</label>
                  <input
                    type="date"
                    className="p-2 border rounded-lg w-full"
                    name="cut_off_period"
                    value={formik.values.cut_off_period}
                    onChange={formik.handleChange}
                  />
                  {formik.errors.cut_off_period && (
                    <p className="text-primary text-sm">{formik.errors.cut_off_period}</p>
                  )}
                </div>
              </div>

              {/* Approval Manager */}
              <h2 className="font-semibold mt-5">Approval Manager For  Configurations</h2>
              <div className="grid grid-cols-3 gap-6 my-4 items-center">
                <div className="mb-4">
                  <select
                    className="p-2 border rounded-lg w-full"
                    name="approver_manager_id"
                    value={formik.values.approver_manager_id}
                    onChange={formik.handleChange}
                  >
                    <option value="" label="Select approver" />
                    {userList
                      ?.filter((user) => user.role === "manager")
                      .map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name}
                        </option>
                      ))}
                  </select>
                  {formik.errors.approver_manager_id && (
                    <p className="text-primary text-sm">{formik.errors.approver_manager_id}</p>
                  )}
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
        </div>
      )}
    </div>
  );
}
