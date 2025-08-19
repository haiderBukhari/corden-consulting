import React from 'react';

const ClockOutConfirmModal = ({ modalVisible,  handleClockOut, item ,closeModal }) => {

  return (
    modalVisible && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-[320px] sm:w-96 text-default_text">
          <h2 className="text-lg sm:text-xl font-bold mb-4">Are you sure you want to Clock Out {item}?</h2>
          
          <div className="flex flex-col sm:flex-row justify-end gap-2">
            <button
              onClick={closeModal}
              className="py-2 px-4 bg-secondary rounded-md w-full sm:w-auto"
            >
              Cancel
            </button>
            <button
              onClick={handleClockOut}
              className="py-2 px-4 bg-primary text-white rounded-md w-full sm:w-auto"
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default ClockOutConfirmModal;
