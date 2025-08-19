import { useState } from 'react';
import UpcomingLeaves from './UpcomingLeaves';
import PendingApprovals from './PendingApprovals';
import CreateRequestForm from './CreateRequestForm';
import { FaCirclePlus } from "react-icons/fa6";

function RequestLeaveComponent({ role, id, member }) {
  const [showUpcomingLeaves, setShowUpcomingLeaves] = useState(true);

  const resetView = () => {
    setShowUpcomingLeaves(true);
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <div className="w-full mx-auto px-3 flex flex-col">
            {showUpcomingLeaves ? (
              <div className='flex-1 mb-4 flex flex-col'>
                <div className={"w-1/4 mb-4 border rounded-lg p-4 mr-4 hover:border-primary hover:shadow hover:shadow-primary"}>
                  <div className="flex justify-between pb-6">
                    <h6 className="text-base font-medium text-gray-500">Request Time Off</h6>
                    <FaCirclePlus
                      onClick={() => setShowUpcomingLeaves(false)}
                      className="text-primary text-4xl cursor-pointer"
                    />
                  </div>
                </div>
                <div className="flex-1 w-full border rounded-lg p-4">
                  <UpcomingLeaves />
                </div>
              </div>
            ) : (
              <div className="flex-1 mb-4 w-full">
                <CreateRequestForm resetView={resetView} id={id} />
              </div>
            )}

            <div className="flex-1 w-full border rounded-lg p-4">
              <PendingApprovals role={role} id={id} member={member} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RequestLeaveComponent;
