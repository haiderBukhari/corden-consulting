import React, { useState } from 'react';
import { BsThreeDotsVertical } from "react-icons/bs";
import { format, differenceInDays, parse ,startOfDay } from 'date-fns';
import { useRouter } from 'next/router';
import Image from 'next/image';

function UpcomingLeavesTeamDashboard({ role, allMemberUpcomingLeaves, teamMembers }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  function parseDate(dateStr) {
    return parse(dateStr, "dd-MM-yyyy", new Date());
  }

  function formatDate(dateStr) {
    const date = parseDate(dateStr);
    return format(date, 'd MMM');
  }

  function daysUntil(dateStr) {
    const date = parseDate(dateStr);
    const fromNow = differenceInDays(date, startOfDay(new Date()));
    return `In ${fromNow} days`;
  }

  function findTeamMember(userId) {
    const member = teamMembers?.find(member => member.id === userId);
    return member ? { avatar: member.avatar, designation: member.designation } : { avatar: '', designation: '' };
  }

  function toggleDropdown() {
    setDropdownOpen(!dropdownOpen);
  }

  function handleOptionClick(path) {
    router.push(path);
    setDropdownOpen(false);
  }

  return (
    <div className='flex flex-col h-full'>
      {allMemberUpcomingLeaves && allMemberUpcomingLeaves.length > 0 ? (
        <div>
          <div className="flex justify-between items-center mb-1 relative">
            <h2 className="text-base text-gray-700 font-semibold">{role === "manager" ? "Upcoming Approved Leave" : "Upcoming Leave"}</h2>
            <div className="p-2 bg-white rounded-full relative">
              <BsThreeDotsVertical
                className="text-gray-500 cursor-pointer"
                onClick={toggleDropdown}
              />
              {dropdownOpen && (
                <div className="absolute text-sm right-0 mt-2 w-48 bg-white border border-gray-200 rounded shadow-lg z-50">
                  <div
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleOptionClick(role === "manager" ? `/workforce/approvals` : `/${role}/team/approval`)}
                  >
                    View All Leaves
                  </div>
                  <div
                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                    onClick={() => handleOptionClick(role === "manager" ? `/workforce/leave_calender` : `/${role}/team/team_leave_calendar`)}
                  >
                    Leave Calendar
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="h-auto overflow-y-auto" style={{ height: "32vh" }}>
            <table className="min-w-full table-auto border-collapse">
              <thead className='sticky top-0 bg-white z-10'>
                <tr className="border-b border-gray-200">
                  <th className="px-2 py-2 text-default_text text-sm text-left">Employee</th>
                  <th className="px-2 py-2 text-default_text text-sm text-left">Begins</th>
                  <th className="px-2 py-2 text-default_text text-sm text-left">From</th>
                  <th className="px-2 py-2 text-default_text text-sm text-left">To</th>
                </tr>
              </thead>
              <tbody>
                {allMemberUpcomingLeaves.slice(0, 10).map((leave, index) => {
                  const { avatar, designation } = findTeamMember(leave.user_id);
                  return (
                    <tr key={index} className={`${index === allMemberUpcomingLeaves.length - 1 ? '' : 'border-b border-gray-200'}`}>
                      <td className="px-2 py-2 flex items-center">
                        <Image
                          src={avatar}
                          className="w-10 h-10 rounded-full mr-2"
                          height={200}
                          width={400}
                          alt="profile"
                        />
                        <div className='text-left'>
                          <div className='capitalize text-base'>{leave.name}</div>
                          <div className="text-sm text-gray-400 capitalize">{designation}</div>
                        </div>
                      </td>
                      <td className="px-2 py-2 text-primary text-left text-sm">{daysUntil(leave.start_date)}</td>
                      <td className="px-2 py-2 text-primary text-left text-sm">{formatDate(leave.start_date)}</td>
                      <td className="px-2 py-2 text-primary text-left text-sm">{formatDate(leave.end_date)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500 text-center" style={{ height: "42vh" }}>
          No Upcoming Leave for Team Members!
        </div>
      )}
    </div>
  );
}

export default UpcomingLeavesTeamDashboard;
