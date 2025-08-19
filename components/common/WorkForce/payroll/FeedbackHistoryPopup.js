import React from 'react';
import { Check, X, Info } from 'lucide-react';
import { IoCloseCircleOutline } from 'react-icons/io5';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css'; // Import Tooltip CSS

function FeedbackHistoryPopup({ feedbackHistory, onClose, formattedMonthYear }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white rounded-xl p-6 w-3/4 max-w-3xl relative">
        <button
          className="absolute top-2 right-2"
          onClick={onClose} // Close the popup
        >
          <IoCloseCircleOutline className="h-6 w-6 text-gray-600" />
        </button>
        <h2 className="text-lg mb-4">
          <span className="font-semibold">
            {formattedMonthYear} &nbsp;
          </span>
          Payroll History
        </h2>

        {/* Container for scrollable table */}
        <div className="max-h-96 overflow-y-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="border border-gray-300 px-4 py-2">Manager Name</th>
                <th className="border border-gray-300 px-4 py-2">Status</th>
                <th className="border border-gray-300 px-4 py-2">Date</th>
              </tr>
            </thead>
            <tbody>
              {feedbackHistory?.slice()
                .reverse()
                .map((log, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-4 py-2 text-center">{log.manager_name}</td>
                  <td className="border border-gray-300 px-4 py-2 flex items-center justify-center">
                    {log.status === 'Approved' ? (
                      <div className="flex items-center space-x-1">
                        <Check className="text-green-500 h-5 w-5" />
                        <span>Approved</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1">
                        <X className="text_default_text h-5 w-5" />
                        <span>Rejected</span>
                        {log.reason && (
                          <>
                            <Info
                              id={`reason-${index}`}
                              className="text_default_text h-5 w-5 cursor-pointer"
                              data-tooltip-content={log.reason}
                            />
                            <Tooltip
                              anchorId={`reason-${index}`}
                              place="right"
                              className="bg-black-500 text-white text-sm px-2 py-1 rounded"
                            />
                          </>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {new Date(log.date).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default FeedbackHistoryPopup;
