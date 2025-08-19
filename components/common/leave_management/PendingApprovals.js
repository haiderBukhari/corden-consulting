import React, { useState, useEffect } from 'react';
import { TbEdit } from "react-icons/tb";
import DataLoader from '../../ui/dataLoader';
import { usePendingLeaves } from '../../../hooks/query/getPendingLeaves';
import { Trash } from 'lucide-react';
import UseDeleteLeave from '../../../hooks/mutations/deleteleave';
import useEditLeave from '../../../hooks/mutations/editLeave';
import { useRejectedLeaves } from '../../../hooks/query/getUserRejectedLeaves';
import { useLeaveStats } from '../../../hooks/query/getLeaveStats';
import ButtonLoader from '../../ui/buttonLoader';
import EditLeaveModal from '../../ui/editLeaveModal';
import 'react-tooltip/dist/react-tooltip.css';
import { Tooltip } from 'react-tooltip';
import useGetActiveUser from '../../../hooks/query/getUserFromLocalStorage';
import { useGetMemberDetail } from '../../../hooks/query/team_lead/team/getMemberDetail';
import { useCancelledLeaves } from '../../../hooks/query/getUserCancelledLeaves';
import { EyeIcon } from 'lucide-react';
import { useRouter } from 'next/router';
import DeleteItemModal from '../../ui/deleteItemModal';

export default function PendingApprovals({ id, role, member, isWorkforce, isTeamLead }) {
  const { data: profileData, isLoadingProfile } = useGetMemberDetail(id);
  const { data: pendingApprovals = [], isLoading: isLoadingPending } = usePendingLeaves(id);
  const { data: rejectedLeaves = [], isLoading: isLoadingRejected } = useRejectedLeaves(id);
  const { data: cancelledLeaves = [], isLoading: isLoadingCancelled } = useCancelledLeaves(id);
  const router = useRouter();

  const { data: leaveStatsData } = useLeaveStats();
  const { data: user } = useGetActiveUser();

  const deleteLeave = UseDeleteLeave();
  const editLeave = useEditLeave();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [filter, setFilter] = useState('pending');
  const [modalVisible, setModalVisible] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const handleDeleteItem = () => {
    if (deletingId) {
      deleteLeave.mutate(deletingId, {
        onSettled: () => {
          closeModal();
        },
      });
    }
  };

  const handleEdit = (leave) => {
    setSelectedLeave(leave);
    setIsModalOpen(true);
  };

  const openModal = (id) => {
    setDeletingId(id);
    setModalVisible(true);
  };

  const closeModal = () => {
    setDeletingId(null);
    setModalVisible(false);
  };

  const getCurrentApprover = (leave) => {
    let userRole = role; // Default to the current user's role

    // If the current user is viewing someone else's profile
    if (id !== user?.id) {
      userRole = profileData?.role || role; // Fallback to current user's role if profileData is undefined
    }

    if (leave.status !== 'pending') {
      return '';
    }

    const isTeamMember = leave.user_team === "Yes";

    if (userRole === 'staff') {
      if (isTeamMember) {
        if (leave.team_lead_status === 'pending') return 'Team Lead';
        if (leave.hr_status === 'pending' && leave.team_lead_status === 'approved') return 'HR';
        if (leave.manager_status === 'pending' && leave.hr_status === 'approved') return 'Manager';
      } else {
        if (leave.hr_status === 'pending') return 'HR';
        if (leave.manager_status === 'pending' && leave.hr_status === 'approved') return 'Manager';
      }
    }

    if (userRole === 'team_lead') {
      if (leave.hr_status === 'pending') return 'HR';
      if (leave.manager_status === 'pending' && leave.hr_status === 'approved') return 'Manager';
    }

    if (userRole === 'HR') {
      if (leave.manager_status === 'pending') return 'Manager';
    }

    if (userRole === 'manager') {
      if (isTeamMember && leave.team_lead_status === 'pending') return 'Team Lead';
      if (leave.hr_status === 'pending') return 'HR';
      if (leave.manager_status === 'pending') return 'Manager';
    }

    return '';
  };

  const getRejectedBy = (leave) => {
    if (leave.team_lead_status === 'rejected') return 'Team Lead';
    if (leave.hr_status === 'rejected') return 'HR';
    if (leave.manager_status === 'rejected') return 'Manager';
    return '';
  };

  const getReasonOfRejection = (leave) => {
    if (leave?.team_lead_status === 'rejected') {
      return truncateText(leave?.reason_by_team_lead, 20);
    }
    if (leave?.hr_status === 'rejected') {
      return truncateText(leave?.reason_by_hr, 20);
    }
    if (leave?.manager_status === 'rejected') {
      return truncateText(leave?.reason_by_manager, 20);
    }
    return '';
  };

  const count =
    filter === 'pending' ? pendingApprovals.length :
      filter === 'rejected' ? rejectedLeaves.length :
        cancelledLeaves.length;

  const truncateText = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <span className="flex items-center justify-center mb-4">
          <span className="text-lg text-default_text mr-2">
            {filter === 'pending' ? 'Pending Approvals' : filter === 'rejected' ? 'Rejected Approvals' : 'Cancelled Approvals'}
          </span>
          <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary text-white">{count}</span>
        </span>
        <div>
          <button
            onClick={() => setFilter('pending')}
            className={`mr-2 px-4 py-2 rounded ${filter === 'pending' ? 'bg-primary text-white' : 'bg-gray-200 text-default_text'}`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={`mr-2 px-4 py-2 rounded ${filter === 'rejected' ? 'bg-primary text-white' : 'bg-gray-200 text-default_text'}`}
          >
            Rejected
          </button>
          <button
            onClick={() => setFilter('cancelled')}
            className={`px-4 py-2 rounded ${filter === 'cancelled' ? 'bg-primary text-white' : 'bg-gray-200 text-default_text'}`}
          >
            Cancelled
          </button>
        </div>
      </div>

      {isLoadingPending || isLoadingRejected || isLoadingCancelled || isLoadingProfile ? (
        <DataLoader />
      ) : (filter === 'pending' && pendingApprovals.length > 0) ||
        (filter === 'rejected' && rejectedLeaves.length > 0) ||
        (filter === 'cancelled' && cancelledLeaves.length > 0) ? (
        <div className="overflow-x-auto">
          <div className="max-h-96 overflow-y-auto">
            <table className="min-w-full table-auto border-collapse bg-white">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-4 py-2 text-center text-default_text text-sm">Leave Type</th>
                  <th className="px-4 py-2 text-center text-default_text text-sm">Leave Dates</th>
                  <th className="px-4 py-2 text-center text-default_text text-sm">No. of Days</th>
                  <th className="px-4 py-2 text-center text-default_text text-sm">Day Type</th>
                  {filter === 'pending' ? (
                    <>
                      <th className="px-4 py-2 text-center text-default_text text-sm">Pending Approver</th>
                      <th className="px-4 py-2 text-center text-default_text text-sm">Reason</th>
                      {/* <th className="px-4 py-2 text-center text-default_text text-sm">Status</th> */}
                    </>
                  ) : filter === 'rejected' ? (
                    <>
                      <th className="px-4 py-2 text-center text-default_text text-sm">Rejected By</th>
                      <th className="px-4 py-2 text-center text-default_text text-sm">Reason of Rejection</th>
                    </>
                  ) : null}
                  <th className="px-4 py-2 text-center text-default_text text-sm">Date Requested</th>
                  <th className="px-4 py-2 text-center text-default_text text-sm">Action</th>
                </tr>
              </thead>
              <tbody>
                {(filter === 'pending' ? pendingApprovals : filter === 'rejected' ? rejectedLeaves : cancelledLeaves).map((leave, index) => (
                  <tr key={index} className={`${index === (filter === 'pending' ? pendingApprovals : rejectedLeaves).length - 1 ? '' : 'border-b border-gray-100'}`}>
                    <td className="px-4 py-3 text-center text-gray-500 text-sm capitalize">{leave?.type}</td>
                    <td className="px-2 py-3 text-center text-gray-500 text-sm">{(leave?.start_date)} - {(leave?.end_date)}</td>
                    <td className="px-4 py-3 text-center text-gray-500 text-sm">
                      {parseFloat(leave?.no_of_days) % 1 === 0
                        ? parseInt(leave?.no_of_days, 10)
                        : leave?.no_of_days}
                    </td>
                    <td className="px-2 py-3 text-center text-gray-500 text-sm capitalize">{leave?.day_type}</td>
                    {filter === 'pending' ? (
                      <>
                        <td className="px-4 py-3 text-center text-gray-500 text-sm font-medium">{getCurrentApprover(leave)}</td>
                        <td className="px-4 py-3 text-center text-gray-500 text-sm group max-w-xs truncate">
                          <span className="block cursor-pointer truncate" data-tooltip-id={`tooltip-${index}`} data-tooltip-content={leave?.reason}>
                            {truncateText(leave?.reason, 20)}
                          </span>
                          <Tooltip
                            id={`tooltip-${index}`}
                            place="top"
                            type="light"
                            effect="float"
                            className="max-w-xs whitespace-pre-wrap"
                          />
                        </td>
                   
                      </>
                    ) : filter === 'rejected' ? (
                      <>
                        <td className="px-4 py-3 text-center text-gray-500 text-sm font-medium">{getRejectedBy(leave)}</td>
                        <td className="px-4 py-3 text-center text-gray-500 text-sm group max-w-xs truncate">
                          <span className="block cursor-pointer truncate" data-tooltip-id={`tooltip-${index}`} data-tooltip-content={getReasonOfRejection(leave)}>
                            {getReasonOfRejection(leave)}
                          </span>
                          <Tooltip
                            id={`tooltip-${index}`}
                            place="top"
                            type="light"
                            effect="float"
                            className="max-w-xs whitespace-pre-wrap"
                          />
                        </td>
                      </>
                    ) : null}
                    <td className="px-4 py-3 text-center text-gray-500 text-sm">{leave.created_at}</td>
                    <td className="px-4 py-2 text-center text-gray-500 text-sm flex justify-center items-center">
                      <button
                        className="group relative flex items-center justify-center rounded-md py-2 px-4 mr-2 border border-primary text-primary text-base font-medium"
                        onClick={() =>
                          isWorkforce
                            ? router.push(`/workforce/leave/${leave.id}`)
                            : isTeamLead
                              ? router.push(`/team_lead/leave/${leave.id}`)
                              : router.push(`/leave_management/leave/${leave.id}`)
                        }
                      >
                        <EyeIcon className='h-4 w-4' />
                        {/* <span className="text-sm">
                          View
                        </span> */}
                      </button>
                      {filter === 'pending' && (user?.id === id) && (
                        <>
                          {leave.team_lead_status !== 'approved' &&
                            <>
                              <button
                                onClick={() => handleEdit(leave)}
                                className="group relative flex items-center justify-center rounded-md py-2 px-4 mr-2 border border-primary text-primary text-base font-medium"
                              >
                                <TbEdit className='h-4 w-4' />

                              </button>

                              <button
                                onClick={() => openModal(leave.id)}
                                className="group relative flex items-center justify-center rounded-md py-2 px-4 border border-lightred text-lightred text-base font-medium"
                              >
                                <Trash className="text-lightred text-base h-4 w-4" />
                              </button>
                            </>
                          }
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className='text-gray-500 text-center'>
          No {filter === 'pending' ? 'Pending' : filter === 'rejected' ? 'Rejected' : 'Cancelled'} Approvals!
        </div>
      )}

      {isModalOpen &&
        <EditLeaveModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          selectedLeave={selectedLeave}
          leaveStatsData={leaveStatsData}
          editLeave={editLeave}
          member={member}
        />
      }

      <DeleteItemModal
        modalVisible={modalVisible}
        closeModal={closeModal}
        handleDeleteItem={handleDeleteItem}
        item={'leave request'}
        action={'delete'}
      />
    </div>
  );
}
