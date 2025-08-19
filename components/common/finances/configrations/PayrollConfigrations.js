import React, { useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { UseGetUsers } from "../../../../hooks/query/admin/getUserList";
import ActivityLog from "../common/ActivityLog";
import DataLoader from "../../../ui/dataLoader";
import UseUpdatePayrollConfigration from "../../../../hooks/mutations/finances/payroll/UpdatePayrollConfigration";
import { UseGetPayrollConfigurationData } from "../../../../hooks/query/finances/payroll/getPayrollConfigration";
import DefaultAdminConfigration from "../common/DefaultAdminConfigration";

export default function PayrollConfigrationForm({ role }) {
    const { data: ConfigrationData, isLoading } = UseGetPayrollConfigurationData();
    const { data: userList } = UseGetUsers();
    const updatePayrollConfigration = UseUpdatePayrollConfigration();

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
            default_approvers: [],
        },
        validationSchema,
        enableReinitialize: true,
        onSubmit: (values) => {
            const normalizedApprovers = values.default_approvers.map(approver => ({
                approver_id: Number(approver.approver_id),
                approval_order: approver.approval_order,
            }));

            const data = {
                default_approvers: normalizedApprovers,
            };

            updatePayrollConfigration.mutate(data);
        },
    });

    useEffect(() => {
        if (ConfigrationData) {
            const initialApprovers = ConfigrationData.approvers
                .map((approver, index) => ({
                    approver_id: String(approver.id),
                    approval_order: index + 1,
                }))
                .sort((a, b) => a.approval_order - b.approval_order);

            formik.setValues({
                default_approvers: initialApprovers,
            });
        }
    }, [ConfigrationData]);

    const addApprover = () => {
        const newApprover = { approver_id: "", approval_order: formik.values.default_approvers.length + 1 };
        formik.setValues({
            default_approvers: [...formik.values.default_approvers, newApprover],
        });
    };

    const removeApprover = (approver_id) => {
        const updatedApprovers = formik.values.default_approvers.filter(
            (approver) => approver.approver_id !== approver_id
        );
        formik.setValues({
            default_approvers: updatedApprovers,
        });
    };

    const updateApprover = (order, value) => {
        const updatedApprovers = formik.values.default_approvers.map((approver) =>
            approver.approval_order === order ? { ...approver, approver_id: value } : approver
        );
        formik.setValues({
            default_approvers: updatedApprovers,
        });
    };

    return (
        <div className="min-h-screen">
            {isLoading ? (
                <DataLoader />
            ) : (
                <div>
                    <div className="p-4 bg-white rounded-lg shadow">
                        <h2 className="text-xl font-semibold mb-4">Payroll Configurations</h2>
                        <form onSubmit={formik.handleSubmit}>
                            {/* Approvers Section */}
                            <div className="mb-4">
                                <h2 className="text-lg">Default Approval List</h2>
                                <div className="grid grid-cols-3 gap-6 items-center">
                                    {formik.values.default_approvers.map((approver, index) => {
                                    
                                        const selectedManagers = formik.values.default_approvers
                                            .map((a) => a.approver_id)
                                            .filter((id) => id !== approver.approver_id); // Allow current selection

                                        return (
                                            <div key={index}>
                                                <h2 className="text-sm text-primary mb-2"># Approver {approver.approval_order}</h2>
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <select
                                                        className="p-2 border rounded-xl w-full"
                                                        value={approver.approver_id}
                                                        onChange={(e) => updateApprover(approver.approval_order, e.target.value)}
                                                    >
                                                        <option value="" label="Select approver" />
                                                        {userList
                                                            ?.filter(
                                                                (user) =>
                                                                    user.role === "manager" &&
                                                                    !user?.permissions?.configuration_Approver == 1 &&
                                                                    (!selectedManagers.includes(String(user.id)) || approver.approver_id === String(user.id))
                                                            )
                                                            .map((user) => (
                                                                <option key={user.id} value={user.id}>
                                                                    {user.name}
                                                                </option>
                                                            ))}
                                                    </select>

                                                    {/* Remove button */}
                                                    {formik.values.default_approvers.length > 1 && (
                                                        <button
                                                            type="button"
                                                            className="bg-red-500 text-white px-2 text-xs py-1 rounded-full"
                                                            onClick={() => removeApprover(approver.approver_id)}
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
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                    <DefaultAdminConfigration />
                    <ActivityLog data={ConfigrationData?.activities} />
                </div>
            )}
        </div>
    );
}
