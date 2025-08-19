import React from 'react';
import { FaTimes } from 'react-icons/fa';
import { FaCaretRight } from 'react-icons/fa6';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, monthYear ,isInitiating}) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">Confirm Payroll Initiation</h3>
                    <button onClick={onClose}>
                        <FaTimes className="text-red-600 h-5 w-5" />
                    </button>
                </div>
                <p>Are you sure you want to initiate payroll ?</p>
                <div className="flex justify-end mt-4">
                    <button
                        className="bg-secondary text-gray-700 px-4 py-2 mr-2 rounded-md"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="bg-primary flex text-white px-4 py-2 rounded-md"
                        onClick={onConfirm}
                    >
                        <span>
                            {isInitiating ? 'Initiating...' : 'Initiate Payroll Request'}
                        </span>
                        {!isInitiating && <FaCaretRight className="h-6 w-6 text-white" />}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;
