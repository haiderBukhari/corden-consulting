import React from 'react';

const LateClockInModal = ({ lateDuration, reasonForLate, setReasonForLate, handleSubmit, handleClose }) => {

    const calculateHoursMinutes = (lateDuration) => {
        const hours = Math.floor(lateDuration / 60);
        const minutes = lateDuration % 60;

        return hours > 0 ? `${hours}h ${minutes}min` : `${minutes}min`;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
            <div className="bg-white p-4 sm:p-8 rounded-lg shadow-lg w-full max-w-[320px] sm:w-96">
                <h2 className="text-lg sm:text-xl font-semibold mb-4">Late Clock-In</h2>

                {/* Display Late Duration */}
                <p className="mb-2 text-sm sm:text-base">
                    You are <span className="font-bold">{calculateHoursMinutes(lateDuration)} </span> late.
                </p>

                {/* Reason Input */}
                <div className="mb-4">
                    <label htmlFor="late-reason" className="block text-sm font-medium text-default_text">
                        *Please provide a reason for being late :
                    </label>
                    <textarea
                        id="late-reason"
                        value={reasonForLate}
                        onChange={(e) => setReasonForLate(e.target.value)}
                        className="mt-1 block w-full border-gray-300 rounded-md shadow-sm border p-2 sm:p-3 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                        rows="4"
                        required
                        placeholder="Enter your reason here..."
                    ></textarea>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2">
                    <button
                        onClick={handleClose}
                        className="bg-secondary text-white px-4 py-2 rounded-lg hover:bg-secondary/80 w-full sm:w-auto"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={!reasonForLate.trim()}
                        className={`px-4 py-2 rounded-lg w-full sm:w-auto ${
                            reasonForLate.trim() 
                                ? 'bg-primary text-white hover:bg-primary/80' 
                                : 'bg-secondary text-gray-500 cursor-not-allowed'
                        }`}
                    >
                        Submit
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LateClockInModal;
