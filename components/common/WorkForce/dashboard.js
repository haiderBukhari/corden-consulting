import React, { useState, useEffect } from 'react';
import CurrentTeamLeaves from '../CurrentTeamLeaves';
import { UseGetDashboardStats } from '../../../hooks/query/admin/getDashboardStats';
import { RiTeamLine } from "react-icons/ri";
import Image from 'next/image'
import CompanyHandbookComponent from '../CompanyHandbookComponent';
import { BsThreeDotsVertical } from "react-icons/bs";
import { UseGetUsers } from '../../../hooks/query/admin/getUserList';
import DataLoader from '../../ui/dataLoader';
import { useRouter } from 'next/router';
import { UseHRandManagerLeaveApprovalRequests } from '../../../hooks/query/getHRandManagerLeaveApprovalRequests';
import TeamDashboard from '../../Team/dashboard';

const WorkforceDashboardComponent = ({ role }) => {
  const [allMembersStats, setAllMembersStats] = useState(0);
  const [totalStaffCount, setTotalStaffCount] = useState(0);
  const [viewDropdown, setViewDropdown] = useState(false);
  const router = useRouter();

  const { data: allUsers, isLoadingAllUsers, } = UseGetUsers();

  const { data: dashboardStats, isLoading, } = UseGetDashboardStats();

  const { data: HRandManagerLeaves, isLoading: isLoadingHRandManagerLeaves } = UseHRandManagerLeaveApprovalRequests("all");

  useEffect(() => {
    if (dashboardStats) {
      let membersStats = {
        "totalPresent": dashboardStats ? dashboardStats.totalPresent : 0,
        "totalOnLeave": dashboardStats ? dashboardStats.totalOnLeave : 0,
        "totalAbsent": dashboardStats ? dashboardStats.totalAbsent : 0,
      }

      setAllMembersStats(membersStats);
      setTotalStaffCount(dashboardStats ? dashboardStats.totalStaff : 0)
    }
  }, [dashboardStats]);

  const pendingManagerLeaves = HRandManagerLeaves?.filter(leave => {
    if (leave.leave_user_role === 'staff' && leave.leave_status === "pending") {
      return leave.team_lead_status === 'approved' && leave.hr_status === 'approved' && leave.manager_status === 'pending';
    } else if (leave.leave_user_role === 'team_lead' && leave.leave_status === "pending") {
      return leave.hr_status === 'approved' && leave.manager_status === 'pending';
    } else if (leave.leave_user_role === 'HR' && leave.leave_status === "pending") {
      return leave.manager_status === 'pending';
    }
    return false;
  });

  const approvedLeaves = HRandManagerLeaves?.filter(leave => leave.leave_status === 'approved');

  return (
    <>
      {isLoading || isLoadingAllUsers || isLoadingHRandManagerLeaves ? (
        <DataLoader />
      ) : (
        <div className='flex-1 min-h-screen px-5 text-default_text'>
          {
            role !== "manager" ?
              <div>
                <div className='grid gap-4 lg:grid-cols-6 md:grid-cols-6'>
                  <div className='p-3 bg-white rounded-lg border justify-between text-default_text col-span-3 space-y-4 shadow-sm shadow-primary'>
                    <div className='flex justify-between items-center'>
                      <span className='text-default_text text-lg'>Total Employees</span>
                      <span
                        className={`flex underline cursor-pointer text-primary text-sm`}
                        onClick={() => { router.push("/workforce/people/list") }}
                      >
                        View All
                      </span>
                    </div>
                    <div className="relative flex -space-x-3 pr-4">
                      {allUsers?.slice(0, 10).map((employee, index) => (
                        <div key={employee.id} className={`relative z-10 ${index !== 0 ? '-ml-3' : ''}`}>
                          <Image
                            src={employee.avatar}
                            alt="Player Avatar"
                            className="h-12 w-12 rounded-full border-2 border-white"
                            width={500}
                            height={500}
                          />
                        </div>
                      ))}
                    </div>
                    <div className='flex justify-between items-center'>
                      <span className='text-default_text text-2xl'>{totalStaffCount}</span>
                      <RiTeamLine className="text-violet-500 cursor-pointer text-2xl" />
                    </div>
                  </div>
                  <div className='p-3 bg-white rounded-lg border justify-between text-default_text col-span-3'>
                    <div className='flex flex-col justify-end'>
                      <div className='flex justify-between items-center'>
                        <span className='text-default_text text-lg'>Employee Attendance</span>
                        <span
                          className={`flex underline cursor-pointer text-primary text-sm`}
                          onClick={() => { router.push("/workforce/attendance") }}
                        >
                          View All
                        </span>
                      </div>
                      <div className='pt-3 pb-3'>
                        <CurrentTeamLeaves allMembersStats={allMembersStats} className="flex-1" height="h-full" role={role} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className='grid grid-cols-7 my-3 gap-3'>
                  <div className='p-3 bg-white rounded-lg border justify-between col-span-5'>
                    {
                      allUsers && allUsers.length > 0 ?
                        <>
                          <div className='flex justify-between items-center'>
                            <span className='text-default_text text-lg'>Overview</span>
                            <div className='relative'>
                              <div className='bg-primary rounded-full p-1 cursor-pointer text-white'
                                onClick={() => setViewDropdown(!viewDropdown)}
                              >
                                <BsThreeDotsVertical />
                              </div>
                              {viewDropdown && (
                                <div className="flex flex-col absolute w-56 right-0 mt-2 bg-white border rounded-lg shadow-lg p-3 z-50">
                                  <span
                                    className='text-default_text p-2 cursor-pointer'
                                    onClick={() => { router.push("/workforce/leave/leave_calender") }}
                                  >
                                    View Leave Calendar
                                  </span>
                                  <span
                                    className='text-default_text p-2 cursor-pointer'
                                    onClick={() => { router.push("/workforce/attendance") }}
                                  >
                                    View Attendance
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="overflow-x-auto mt-4">
                            <div className="overflow-y-auto" style={{ maxHeight: "700px" }}>
                              <table className="min-w-full table-auto border-collapse">
                                <thead className='bg-gray-100 sticky top-0'>
                                  <tr className="border-b border-gray-200">
                                    <th className="px-4 py-2 text-left text-gray-700 text-sm">Name</th>
                                    <th className="px-4 py-2 text-center text-gray-700 text-sm">Department</th>
                                    <th className="px-4 py-2 text-center text-gray-700 text-sm">Role</th>
                                    <th className="px-4 py-2 text-center text-gray-700 text-sm">Position</th>
                                    {/* <th className="px-4 py-2 text-center text-gray-700 text-sm">Pending Items</th> */}
                                    <th className="px-4 py-2 text-center text-gray-700 text-sm">Attendance</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {allUsers?.map((user, index) => (
                                    <tr key={index} className={`${index === user.length - 1 ? '' : 'border-b border-gray-200'}`}>
                                      <td className="px-4 py-2">
                                        <div className="flex items-center space-x-2">
                                          <div>
                                            <Image
                                              src={user?.avatar}
                                              alt={user?.name}
                                              className="w-8 h-8 rounded-full"
                                              width={500}
                                              height={500}
                                            />
                                          </div>
                                          <div className="text-left text-sm text-gray-700 capitalize">
                                            {user?.name}
                                          </div>
                                        </div>
                                      </td>
                                      <td className="px-4 py-3 text-center text-gray-700 text-sm capitalize">{user.department?.departments_name}</td>
                                      <td className="px-4 py-3 text-center text-gray-700 text-sm capitalize">{(user?.role).replace("_", " ")}</td>
                                      <td className="px-4 py-3 text-center text-gray-700 text-sm capitalize">{user.position?.name}</td>
                                      {/* <td className="px-4 py-3 text-center text-sm">
                                        {user.leave_counts.pending_items === 0 ?
                                          "-" :
                                          <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-primary text-white">
                                            {user.leave_counts.pending_items}

                                          </span>
                                        }
                                      </td> */}
                                      <td className="px-4 py-3 text-center text-sm">
                                        <span className={`px-4 py-2 text-sm rounded-md m-4 w-12 capitalize ${user?.attendance_percentage < 75 ? 'bg-red-100 text-darkred border-red-400' :
                                          user?.attendance_percentage > 90 ?
                                            'bg-green-100 text-green-500 border-green-400' :
                                            'bg-orange-100 text-orange-400 border-orange-300'} `}
                                        >
                                          {user?.attendance_percentage || 50}%
                                        </span>
                                      </td>
                                    </tr>
                                  ))}

                                </tbody>
                              </table>
                            </div>
                          </div>
                        </>
                        :
                        <div className='flex justify-center items-center text-default_text text-lg'>
                          No users data!
                        </div>
                    }
                  </div>
                  <div className='p-3 text-white rounded-lg border text-sm flex justify-between col-span-2'>
                    <div>
                      <div className='flex flex-col justify-end'>
                        <div className='flex justify-between'>
                          <span className='text-default_text text-lg'>Company Handbook</span>
                        </div>
                        <div className='mt-4'>
                          <CompanyHandbookComponent isHRDashboard={true} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              :
              <div>
                <TeamDashboard role={role} totalStaffCount={totalStaffCount} allMembersStatsManager={allMembersStats} managerPendingApprovals={pendingManagerLeaves} allUsers={allUsers} approvedLeaves={approvedLeaves} />
              </div>
          }
        </div>
      )}
    </>
  )
}

export default WorkforceDashboardComponent;