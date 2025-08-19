import React, { useState } from "react";
import { Check, ArrowLeft } from "lucide-react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import Approvers from "../../common/Approvers";

import { formatDateToDdMmYy } from "../../../../../utils/functions";
import { UseGetUsers } from "../../../../../hooks/query/admin/getUserList";

export default function ConfigrationDetailPage({ data, action, onClose, type }) {
    const [reason, setReason] = useState("");
    const status = data.status;
    const { data: userList } = UseGetUsers()
    const approver = userList?.find((user) => user?.id === data?.approver_manager_id)

    const handleApprove = () => {
        const dataConfig = {
            status: "approved",
            reason,
        };
        action.mutate(
            { id: data.id, data: dataConfig },
            {
                onSuccess: () => {
                    onClose();
                },
            }
        );
    };

    const handleReject = () => {
        const dataConfig = {
            status: "rejected",
            reason,
        };
        action.mutate(
            { id: data.id, data: dataConfig },
            {
                onSuccess: () => {
                    onClose();
                },
            }
        );
    };

    // Dynamic Configuration Details Renderer
    const renderDetails = () => {
        if (type === "loan") {
            return (
                <>
                    <div>
                        <h3 className="font-semibold">Cut-off Period:</h3>
                        <p>{formatDateToDdMmYy(new Date(data.cut_off_period))}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold">Payment Type:</h3>
                        <p>{data.repayment_method}</p>
                    </div>
                    {data?.repayment_method === "Percentage" && (
                        <div>
                            <h3 className="font-semibold">Default Percentage:</h3>
                            <p>{data.default_percentage}%</p>
                        </div>
                    )}
                    <div>
                        <h3 className="font-semibold">Default Cap:</h3>
                        <p>{data.default_loan_cap}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold">Requested By :</h3>
                        <p>{data.requested_by}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold">Requested On :</h3>
                        <p>{formatDateToDdMmYy(new Date(data.created_at))}</p>
                    </div>


                </>
            );
        }

        // Default configuration for other types
        return (
            <>
                <div>
                    <h3 className="font-semibold">Requested By :</h3>
                    <p>{data.requested_by}</p>
                </div>
                <div>
                    <h3 className="font-semibold">Requested On :</h3>
                    <p>{formatDateToDdMmYy(new Date(data.created_at))}</p>
                </div>
                <div>
                    <h3 className="font-semibold">Cut-off Period:</h3>
                    <p>{formatDateToDdMmYy(new Date(data.cut_off_period))}</p>
                </div>
            </>
        );
    };

    return (
        <div className="min-h-screen">
            <button
                onClick={() => onClose(true)}
                type="button"
                className="flex space-x-2 items-center px-2 py-1 text-white bg-primary rounded-xl mb-3"
            >
                <ArrowLeft className="text-white h-5 w-5" />
                <span>Back</span>
            </button>
            <div className="p-4 bg-white rounded-lg border mb-4">
                <h2 className="text-xl font-semibold mb-4 capitalize">{`${type} Configuration Approval`}</h2>

                {/* Approvers Section */}
                <div className="mb-6">
                    <Approvers approvers={data.approvers} />
                </div>

                {/* Dynamic Configuration Details */}
                <div className="grid grid-cols-3 gap-6 px-4 ">{renderDetails()}</div>
                <div className="p-4 mb-6 text-base">
                    <div>
                        <h3 className="font-semibold">Configuration Approver :</h3>
                        <p>{approver?.name}</p>
                    </div>
                </div>
                {/* Action Section */}
                {status === "pending" && (
                    <div className="flex flex-col w-full p-4 space-y-4 bg-gray-100 rounded-xl">
                        <textarea
                            name="reason"
                            className="p-4 text-base text-default_text w-full bg-white rounded-2xl border focus:outline-none focus:border-primary"
                            placeholder="Add your reason here..."
                            style={{ height: "6em", resize: "none" }}
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                        />
                        <div className="flex space-x-4 justify-end">
                            <button className="cursor-pointer" onClick={handleReject}>
                                <div className="bg-white shadow-sm px-10 py-3 text-xs my-2 rounded-full">
                                    <XMarkIcon className="h-5 w-5 bg-primary text-white rounded-full p-1" />
                                </div>
                                <p>Reject</p>
                            </button>
                            <button className="cursor-pointer" onClick={handleApprove}>
                                <div className="bg-white shadow-sm px-10 py-3 text-xs my-2 rounded-full">
                                    <Check className="h-5 w-5 bg-green-400 text-white rounded-full p-1" />
                                </div>
                                <p>Approve</p>
                            </button>
                        </div>
                    </div>
                )}

                {status !== "pending" && (
                    <div className="flex flex-col w-full p-4 space-y-4 bg-grey rounded-xl">
                        <textarea
                            name="reason"
                            className="p-4 text-base text-default_text w-full bg-gray-200 rounded-2xl border focus:outline-none focus:border-primary"
                            style={{ height: "6em", resize: "none" }}
                            value={data.reason}
                            disabled
                            readOnly
                        />
                        <div className="flex space-x-4 justify-end">
                            <button
                                className={`cursor-default bg-white flex items-center ${status === "approved" ? "text-green-500" : "text-primary"} py-6 px-14 justify-center border rounded-2xl`}
                            >
                                <p>{status === "approved" ? "Approved" : "Rejected"}</p>
                                {status === "approved" ? (
                                    <Check className="h-5 w-5 ml-2 bg-green-400 text-white rounded-full p-1" />
                                ) : (
                                    <XMarkIcon className="h-5 w-5 ml-2 bg-primary text-white rounded-full p-1" />
                                )}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
