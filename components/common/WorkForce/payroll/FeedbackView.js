import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { MdDeleteOutline } from 'react-icons/md';
import { CiFloppyDisk } from 'react-icons/ci';


function FeedbackView({ feedbackComments, goBack, mode, onSubmitFeedback, payrollMonth }) {
  const [newFeedback, setNewFeedback] = useState('');

  const handleInputChange = (e) => {
    setNewFeedback(e.target.value);
  };

  const handleSubmit = () => {
    onSubmitFeedback(newFeedback);
  };

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // Convert 24-hour format to 12-hour format
    return `${day} ${month}, ${year} | ${formattedHours}:${minutes} ${period}`;
  };

  // Sort feedback comments by dateTime in descending order (latest first)
  const sortedFeedbackComments = feedbackComments.sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div>
      <div className='flex items-center'>
        <button onClick={goBack} type="button" className="flex space-x-2 items-center px-2 py-1 text-white bg-primary rounded-xl">
          <ArrowLeft className="text-white h-5 w-5" />
          <span>Back</span>
        </button>
        <h2 className="text-lg font-medium ml-3">
          {mode === 'view' ? 'View Feedback' : 'Rejection Feedback'} - {payrollMonth} Payroll Request
        </h2>
      </div>

      <div className="mt-4" style={{ maxHeight: '800px', overflowY: 'auto', paddingRight: '1rem' }}>
        {mode === 'view' && sortedFeedbackComments.length === 0 && (
          <div className="flex justify-center items-center h-full mt-10">
            <p className="text-gray-500 text-lg">No feedback available!</p>
          </div>
        )}
        {mode === 'view' && sortedFeedbackComments.length > 0 && (
          sortedFeedbackComments.map((comment, index) => (
            <div key={index} className="border rounded-xl p-4 mb-4 bg-white shadow-sm">
              <div className="text-lg font-medium text-primary flex justify-between">
                <span>{formatDateTime(comment.date)}</span>
                <span className="text-sm text-gray-500">{comment.managerName}</span>
              </div>
              <p className="text-gray-700 mt-2">{comment.message}</p>
            </div>
          ))
        )}

        {mode === 'edit' && (
          <div>
            <div className="border rounded-xl p-4 mb-4 bg-white shadow-sm">
              <div className="text-lg font-medium text-primary">{formatDateTime(new Date().toISOString())}</div>
              <textarea
                className="w-full mt-2 py-2"
                rows="4"
                placeholder="Type here..."
                value={newFeedback}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex justify-end mt-4 space-x-4">
              <button
                onClick={goBack}
                type="button"
                className="flex items-center justify-center border border-red-400 text-red-400 px-6 py-2 rounded-lg"
              >
                <MdDeleteOutline className='text-base mr-1' />
                Discard
              </button>
              <button
                onClick={handleSubmit}
                type="button"
                className={`flex items-center justify-center bg-primary text-white px-6 py-2 rounded-lg ${newFeedback.trim() ? '' : 'opacity-70 cursor-not-allowed'}`}
                disabled={!newFeedback.trim()}
              >
                <CiFloppyDisk className='text-base mr-1' />
                Submit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default FeedbackView;
