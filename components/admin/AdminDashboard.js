import { useEffect, useState } from 'react';
import TotalTeamMembersCard from '../common/attendance/TotalTeamMembersCard';
import CurrentTeamLeaves from '../common/CurrentTeamLeaves';
import DataLoader from '../ui/dataLoader';
import { UsersIcon, UserGroupIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import { RiUser2Line } from "react-icons/ri";
import { useRouter } from 'next/router';
import StaffListComponent from './StaffDirectory/StaffListComponent';
import { UseGetDashboardStats } from '../../hooks/query/admin/getDashboardStats';

export default function AdminDashboardComponent({role}) {
  const [allMembersStats, setAllMembersStats] = useState(0);
  const [allStaffLeaves, setAllStaffLeaves] = useState(0);
  const router = useRouter();

  const { data: dashboardStats, isLoading } = UseGetDashboardStats();

  useEffect(() => {
    if (dashboardStats) {
      let membersStats = {
        "totalPresent": dashboardStats ? dashboardStats.totalPresent : 0,
        "totalOnLeave": dashboardStats ? dashboardStats.totalOnLeave : 0,
        "totalAbsent": dashboardStats ? dashboardStats.totalAbsent : 0,
      }

      let staffDetails = {
        totalMembers: dashboardStats ? dashboardStats.totalStaff : 0,
        uniqueRoles: 5
      };

      setAllMembersStats(membersStats);
      setAllStaffLeaves(staffDetails)
    }
  }, [dashboardStats]);

  const renderInfoCard = (title, Icon, viewAllLink, createLink, createText) => (
    <div className='flex-1 bg-white p-4 border rounded-lg'>
      <div className="flex justify-between mb-4">
        <h6 className="text-base font-medium text-default_text">{title}</h6>
        <div className="flex items-center">
          <p
            className="flex underline cursor-pointer text-primary text-xs"
            onClick={() => { router.push(viewAllLink) }}
          >
            View All
          </p>
        </div>
      </div>
      <div className="flex flex-col items-center space-y-2 border bg-gray-100 rounded-lg p-8">
        <Icon className="w-12 h-12 text-indigo-200 mb-2" />
        <button
          className="flex items-center space-x-2 text-primary py-2 px-4 rounded-lg border border-primary bg-white"
          onClick={() => { router.push(createLink) }}
        >
          <span className="text-base">{createText}</span>
          <PlusCircleIcon className="w-5 h-5 text-primary" />
        </button>
      </div>
    </div>
  );

  return (
    <>
      {isLoading ? (
        <DataLoader />
      ) : (
        <div className="bg-white mx-5">
          {/* Row 1 */}
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col h-full">
                  <TotalTeamMembersCard allMembersStats={allStaffLeaves} className="flex-1" />
                </div>
                <div className="flex flex-col h-full">
                  {/* Gender Ratio Card */}
                  <div className='flex-1 bg-white p-4 border rounded-lg'>
                    <div className="flex justify-between mb-8">
                      <h6 className="text-base font-medium text-default_text">
                        Gender Ratio
                      </h6>
                    </div>
                    <div className="flex items-center space-x-4">
                      <p className="text-2xl text-primary" style={{ lineHeight: "1.5rem" }}>
                        {dashboardStats?.maleStaffCount}
                        <span className="text-xs text_default_text">&nbsp;M</span>
                      </p>
                      <p className="text-2xl text-orange-500" style={{ lineHeight: "1.5rem" }}>
                      {dashboardStats?.femaleStaffCount}
                        <span className="text-xs text_default_text">&nbsp;F</span>
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col h-full">
                  <CurrentTeamLeaves allMembersStats={allMembersStats} className="flex-1" height="h-full" isBorder="border rounded-lg" role={role}/>
                </div>
              </div>
            </div>
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-12 gap-4 mt-3">
            <div className="col-span-12 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex flex-col h-full">
                  {renderInfoCard(
                    "Users",
                    UsersIcon,
                    "/admin/staff_directory",
                    "/user_management/create_user",
                    "Create"
                  )}
                </div>
                <div className="flex flex-col h-full">
                  {renderInfoCard(
                    "Teams",
                    UserGroupIcon,
                    "/user_management/teams/list",
                    "/user_management/teams/create",
                    "Create"
                  )}
                </div>
                <div className="flex flex-col h-full">
                  {renderInfoCard(
                    "Positions",
                    RiUser2Line,
                    "/user_management/positions/list",
                    "/user_management/positions/create",
                    "Create"
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Row 3 */}
          <div >
            <StaffListComponent isDashBoard={true} role={role}/>
          </div>
        </div>
      )}
    </>
  );
};
