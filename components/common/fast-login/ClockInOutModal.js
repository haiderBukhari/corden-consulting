import React, { useEffect } from 'react';

export default function ClockInOutModal({ message, redirectCountdown, setShowModal }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowModal(false);
    }, redirectCountdown * 1000);

    return () => clearTimeout(timer);
  }, [redirectCountdown, setShowModal]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-grey bg-opacity-75 text-default_text">
      <div className="bg-white p-12 rounded-lg shadow-lg text-center">
        <div className='text-lg mb-2'>{message}</div>
        <p>This page will return to the login screen in &nbsp;
        <span className='text-primary'>{redirectCountdown}</span> 
        &nbsp; {redirectCountdown === 1 ? 'second' : 'seconds'}.</p>
      </div>
    </div>
  );
}
