import React, { useState, useEffect } from 'react';
import DataLoader from '../../ui/dataLoader';
import { UseCurrentUserUpcomingLeaves } from '../../../hooks/query/getCurrentUserUpcomingLeaves';
import { UseGetConfigurations } from '../../../hooks/query/admin/getConfigurations';
import { EyeIcon } from 'lucide-react';
import { useRouter } from 'next/router';
import { useAllApprovedLeaves } from '../../../hooks/query/getAllApprovedLeaves';

function UpcomingLeaves({ id, isWorkforce, isTeamLead }) {
  const { data: currentUserUpcomingLeaves = [], isLoadingCurrentUser } = UseCurrentUserUpcomingLeaves(id);
  const { data: configurations, isLoading: isLoadingConfigurations } = UseGetConfigurations();
  const { data: allApprovedLeaves, isLoading: isLoadingApproved } = useAllApprovedLeaves({ id: id });
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('upcoming');

  const leavesToDisplay = activeTab === 'upcoming' ? currentUserUpcomingLeaves : allApprovedLeaves;

  const getApprovers = (leave) => {
    if (leave?.leave_status !== 'approved') {
      return '';
    }

    const userRole = leave.role;
    const leaveDuration = parseFloat(leave.no_of_days);
    const config_no_of_days = configurations ? parseInt(configurations[0]?.no_of_days, 10) : 0;
    const isTeamMember = leave.user_team === "Yes";

    if (userRole === 'staff') {
      if (isTeamMember) {
        if (leaveDuration >= config_no_of_days) {
          return "Team Lead, HR, Manager";
        } else {
          return "Team Lead, HR";
        }
      } else {
        if (leaveDuration >= config_no_of_days) {
          return "HR, Manager";
        } else {
          return "HR";
        }
      }
    }

    if (userRole === 'team_lead') {
      return "HR and Manager";
    }

    if (userRole === 'HR') {
      return "Manager";
    }

    if (userRole === 'manager') {
      return "HR and Manager";
    }

    return '';
  };

  const handleViewLeave = (leaveId) => {
    const route = isWorkforce
      ? `/workforce/leave/${leaveId}`
      : isTeamLead
        ? `/team_lead/leave/${leaveId}`
        : `/leave_management/leave/${leaveId}`;
    router.push(route);
  };

  const formatDate = (dateString) => {
    if (!dateString) return ''; // Handle undefined or null dates
  
    const dateParts = dateString.split('-');
    if (dateParts[2]?.length === 4) {
      return dateString;
    }
  
    const [year, month, day] = dateParts;
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex space-x-4 border-b mb-4">
        <button
          className={`px-4 py-2 text-sm font-medium ${activeTab === 'upcoming' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming Approved Leaves
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${activeTab === 'approved' ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}
          onClick={() => setActiveTab('approved')}
        >
          Approved Leaves
        </button>
      </div>

      {isLoadingCurrentUser || isLoadingConfigurations || isLoadingApproved ? (
        <DataLoader />
      ) : leavesToDisplay && leavesToDisplay.length > 0 ? (
        <div>
          <div className="overflow-x-auto">
            <div className="max-h-64 overflow-y-auto">
              <table className="min-w-full table-auto border-collapse bg-white">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-2 py-2 text-center text-default_text text-sm">Leave Type</th>
                    <th className="px-2 py-2 text-center text-default_text text-sm">Dates</th>
                    <th className="px-2 py-2 text-center text-default_text text-sm">No. of Days</th>
                    <th className="px-2 py-2 text-center text-default_text text-sm">Day Type</th>
                    {
                      activeTab === "upcoming" && <th className="px-2 py-2 text-center text-default_text text-sm">Approved By</th>
                    }
                    <th className="px-2 py-2 text-center text-default_text text-sm">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {leavesToDisplay.map((leave, index) => (
                    <tr key={index} className={`${index === leavesToDisplay.length - 1 ? '' : 'border-b border-gray-100'}`}>
                      <td className="px-2 py-3 text-center text-gray-500 text-sm capitalize">{activeTab === "upcoming" ? leave?.leave_type : leave?.type}</td>
                      <td className="px-2 py-3 text-center text-gray-500 text-sm">
                        {formatDate(leave?.start_date)} - {formatDate(leave?.end_date)}
                      </td>
                      <td className="px-4 py-3 text-center text-gray-500 text-sm">
                        {parseFloat(leave?.no_of_days) % 1 === 0
                          ? parseInt(leave?.no_of_days, 10)
                          : leave?.no_of_days}
                      </td>
                      <td className="px-2 py-3 text-center text-gray-500 text-sm capitalize">{leave?.day_type}</td>
                      {
                        activeTab === "upcoming" && <td className="px-2 py-3 text-center text-gray-500 text-sm">{getApprovers(leave)}</td>
                      }
                      <td>
                        <div className="flex space-x-2 justify-center items-center">
                          <button
                            className="group relative flex items-center justify-center rounded-md py-1 px-2 border border-primary text-primary text-base font-medium"
                            onClick={() => handleViewLeave(activeTab === "upcoming" ? leave?.leave_id : leave?.id)}
                          >
                            <EyeIcon className='h-4 w-4' />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500 text-center">
          No {activeTab === 'upcoming' ? 'Upcoming Approved' : 'Approved'} Leaves!
        </div>
      )}
    </div>
  );
};

export default UpcomingLeaves;
