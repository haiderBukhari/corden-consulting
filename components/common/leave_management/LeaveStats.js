import React, { useEffect } from 'react';
import { useLeaveStats } from '../../../hooks/query/getLeaveStats';
import DataLoader from '../../ui/dataLoader';
import { useState } from 'react';
import UpdateIndividualLeaveForm from './UpdatePersonLeaveForm';
import UseUpdateUserLeaveStats from '../../../hooks/mutations/admin/updateUserLeaveStats';
import ApprovalFlowModal from '../../ui/LeaveApprovalFlowModal';

function LeaveStats({ id, role, member, isShowBackButton, user }) {
  // const { data: leaveStatsData, isLoading, isFetching } = useLeaveStats(id);
  const { data: leaveStatsData, isLoading, } = useLeaveStats(id, {
    enabled: !!id, // Ensure the hook only runs if `id` is truthy
  });

  const updateUserLeaveStats = UseUpdateUserLeaveStats();

  const date = new Date();
  const year = date.getFullYear();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isApprovalFlowModal, setIsApprovalFlowModal] = useState(false)
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const openApprovalFlowModal = () => setIsApprovalFlowModal(true);
  const closeApprovalFlowModal = () => setIsApprovalFlowModal(false);

  const cardItems = leaveStatsData ? [
    { cardTitle: 'Annual Leaves', leaves: leaveStatsData.annual_leaves, totalLeaves: leaveStatsData.total_annual_leaves },
    { cardTitle: 'Sick Leaves', leaves: leaveStatsData.sick_leaves, totalLeaves: leaveStatsData.total_sick_leaves },
    { cardTitle: 'Maternity Leaves', leaves: leaveStatsData.maternity_leaves, totalLeaves: leaveStatsData.total_maternity_leaves },
    { cardTitle: 'Paternity Leaves', leaves: leaveStatsData.paternity_leaves, totalLeaves: leaveStatsData.total_paternity_leaves },
    { cardTitle: 'Compassionate Leaves', leaves: leaveStatsData.compassionate_leaves, totalLeaves: leaveStatsData.total_compassionate_leaves },
    // { cardTitle: 'Remaining Leaves', leaves: leaveStatsData.remaining_leaves, totalLeaves: leaveStatsData.total_leaves },
  ] : [];

  const handleSave = (updatedLeaveStats) => {
    setIsSaving(true);
    const formData = {
      annualLeave: updatedLeaveStats?.total_annual_leaves,
      sickLeave: updatedLeaveStats?.total_sick_leaves,
      maternityLeave: updatedLeaveStats?.total_maternity_leaves,
      paternityLeave: updatedLeaveStats?.total_paternity_leaves,
      compassionateLeave: updatedLeaveStats?.total_compassionate_leaves,
    };

    updateUserLeaveStats.mutate(
      { id, formData }, {
      onSuccess: () => {
        setIsSaving(false);
        closeModal();
      },
      onError: () => {
        setIsSaving(false);
      },
    });
  };

  if (isLoading || !id) {
    return <DataLoader />;
  }
  const leaveFlow = {
    team_lead: user?.team_obj ? user?.team_leader : null,
    hr: 'HR',
    manager: user?.reports_to_manager,
    role: user?.role
  }

  return (
    <>
      <div className='flex justify-end space-x-3'>
        {((role === "HR" || role === "team_lead" || role === "manager") && isShowBackButton) && (
          <button
            className="px-4 py-2 bg-primary text-white rounded mb-4"
            onClick={openModal}
          >
            Update Leave Stats
          </button>
        )}
        <div className='flex justify-end'>
          <button
            className="px-4 py-2 bg-primary text-white rounded mb-4"
            onClick={openApprovalFlowModal}
          >
            Leave Approval Flow
          </button>
        </div>

      </div>

      <div className="grid grid-cols-5 gap-3 text-gray-500">
        {cardItems.map((item, index) => (
          <div key={index} className={`w-full bg-white border shadow-sm rounded-lg p-2 ${index === 0 ? '' : 'ml-1'} ${index === cardItems.length - 1 ? '' : 'mr-1'} hover:border-primary hover:shadow hover:shadow-primary`}>
            <div className="flex justify-between mb-4">
              <h6 className="text-base font-medium text-gray-500">{item.cardTitle}</h6>
            </div>
            <div className="flex justify-between items-end">
              <div className="flex items-end">
                <p className="text-lg font-bold text-gray-700" style={{ lineHeight: "1.5rem" }}>{item.leaves}</p>
                <p className="text-sm text-gray-400">/{item.totalLeaves}</p>

              </div>
              {item.cardTitle === "Pending Request" ?
                <p className="text-sm text-gray-400">All Year</p> :
                <p className="text-sm text-gray-400">{year}</p>
              }
            </div>
          </div>
        ))}
      </div>
      <ApprovalFlowModal
        isOpen={isApprovalFlowModal}
        onClose={closeApprovalFlowModal}
        leaveFlow={leaveFlow}
      />
      <UpdateIndividualLeaveForm
        isOpen={isModalOpen}
        onClose={closeModal}
        leaveStatsData={leaveStatsData}
        onSave={handleSave}
        isSaving={isSaving}
        member={member}
      />
    </>
  );
};

export default LeaveStats;
