import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { Check } from 'lucide-react';
import UseUpdateLeaveOnBehalfOf from '../../hooks/mutations/updateOnBehalfOf';
export default function ApproveLeaveModal({ isOpen, onClose, role, leaveId }) {
    const [reason, setReason] = useState('');
    const updateOnBehalfOf = UseUpdateLeaveOnBehalfOf()
    const handleApprove = (status) => {

        const formData = new FormData()
        formData.append('status', status)
        formData.append('reason', reason)
        formData.append('on_behalf_of', role == 'Team Lead' ? 'team_lead' : 'manager')
        for (let pair of formData.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }

        updateOnBehalfOf.mutate( 
            { id: leaveId, formData },
            {
                onSuccess: () => {
                    onClose()
                }
            })


    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
                {/* Close Icon */}
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
                    <XMarkIcon className="h-6 w-6" />
                </button>
                <h2 className="text-lg font-bold mb-4">
                    Approve Leave on behalf of {role}
                </h2>
                <textarea
                    name="reason"
                    className={`p-4 text-base text-default_text w-full rounded-2xl border focus:outline-none focus:border-primary cursor-text bg-white`}

                    style={{ height: "6em", resize: "none" }}
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Enter reason"

                ></textarea>

                <div className="flex justify-end space-x-4">
                    <button
                        onClick={() => handleApprove('approved')}
                        className="items-center flex text-default_text border bg-white shadow-sm px-4 py-3 text-sm my-2 rounded-full"
                    >
                        <Check className="h-5 w-5 bg-green-400 mr-2 text-white rounded-full p-1" />

                        Approve
                    </button>
                    <button
                        onClick={() => handleApprove('rejected')}
                        className="items-center flex text-default_text border bg-white shadow-sm px-4 py-3 text-sm my-2 rounded-full"
                    >
                        <div> <XMarkIcon className="h-5 w-5 bg-red-400 text-white rounded-full p-1 mr-2" /></div>
                        Reject
                    </button>

                </div>
            </div>
        </div>
    );
}
