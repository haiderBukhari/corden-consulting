import React from 'react';
import TotalTeamMembersCard from '../../common/attendance/TotalTeamMembersCard';
import CurrentTeamLeaves from '../../common/CurrentTeamLeaves';
import Approvals from './Approvals';
import UpcomingLeavesTeamDashboard from './UpcomingLeavesTeamDashboard';
import TeamPerformanceChart from './TeamPerformanceChart';
import TeamMembers from './TeamMembers';
import DataLoader from '../../ui/dataLoader';
import { useMemberStats } from '../../../hooks/query/team_lead/team/getMembersStats';
import { useMemberLeaves } from '../../../hooks/query/team_lead/team/getMembersLeaves';
import { useAllTeamMembers } from '../../../hooks/query/team_lead/team/getTeamMembers';
import { UseAllUpcomingLeaves } from '../../../hooks/query/getUpcomingLeaves';

export default function TeamDashboard({ role, totalStaffCount, allMembersStatsManager, allUsers, managerPendingApprovals, approvedLeaves }) {
  const { data: allMembersStats = [], isLoading } = useMemberStats();
  const { data: allMemberPendingLeaves = [], isLoadingMemberPendingLeaves, isErrorMemberPendingLeaves, errorMemberPendingLeaves } = useMemberLeaves('pending');

  // const { data: allMemberUpcomingLeaves = [], isLoadingMemberUpcomingLeaves, isErrorMemberUpcomingLeaves, errorMemberUpcomingLeaves } = useMemberLeaves('approved');
  const { data: teamMembers = [], isLoadingTeamMember, isErrorTeamMember, errorTeamMember } = useAllTeamMembers();
  const { data: upcomingLeaves = [], isLoadingUpcomingLeaves } = UseAllUpcomingLeaves();

  return (
    <>
      {isLoading || isLoadingMemberPendingLeaves || isLoadingTeamMember || isLoadingUpcomingLeaves ? (
        <DataLoader />
      ) : (
        <div className={`${role !== "manager" && "bg-white mx-3 min-h-screen"}`}>
          <div className="grid grid-cols-12 gap-4">
            {/* Left Panel - Stacks on top on smaller screens */}
            <div className="col-span-12 md:col-span-3 space-y-4 flex flex-col">
              <TotalTeamMembersCard allMembersStats={allMembersStats} role={role} totalStaffCount={totalStaffCount} />
              <CurrentTeamLeaves allMembersStats={role === "manager" ? allMembersStatsManager : allMembersStats} isBorder="border rounded-lg" role={role}/>
              <div className="flex-grow">
                <Approvals allMemberPendingLeaves={role === "manager" ? managerPendingApprovals : allMemberPendingLeaves} maxLeavesToShow={10} height={'300px'} heading={'Pending Approvals'} />
              </div>
            </div>

            {/* Right Panel - Takes full width on smaller screens */}
            <div className="col-span-12 md:col-span-9 space-y-4">
              
              <div className='space-y-4'>
                {/* <div className="bg-grey p-3 rounded-xl border flex-grow" style={{ minHeight: "250px" }}>
                  <TeamPerformanceChart />
                </div> */}
                <div className="bg-white p-3 rounded-xl border flex-grow text-center" style={{ minHeight: "235px" }}>
                  <UpcomingLeavesTeamDashboard role={role} allMemberUpcomingLeaves={role === "manager" ? upcomingLeaves : upcomingLeaves} teamMembers={role === "manager" ? allUsers : teamMembers} />
                </div>
              </div>

              <div className="bg-grey p-3 rounded-xl border flex-grow" style={{ minHeight: "410px" }}>
                <TeamMembers teamMembers={role === "manager" ? allUsers : teamMembers} />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
