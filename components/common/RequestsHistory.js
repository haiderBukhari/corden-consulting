import React, { useState } from 'react';
import TeamLeaveList from './TeamLeave/TeamLeaveList';

const RequestsHistory = ({ role }) => {
  const [activeTab, setActiveTab] = useState('leave_requests');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <>
      <div className="p-3">
        <TeamLeaveList role={role} />

      </div>
    </>
  );
};

export default RequestsHistory;