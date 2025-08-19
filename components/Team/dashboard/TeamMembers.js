import React from 'react';
import { useRouter } from 'next/router';
import useGetActiveUser from '../../../hooks/query/getUserFromLocalStorage';
import Image from 'next/image';

export default function TeamMembers({ teamMembers }) {
  const router = useRouter();

  const { data: user } = useGetActiveUser()

  return (
    <div className='flex flex-col h-full'>
      {teamMembers && teamMembers.length > 0 ? (
        <div className='max-h-screen'>
          <div className="flex justify-between items-center mb-2">
            <span className="flex items-center justify-center">
              <span className="text-base text-gray-700 font-semibold">{user.role === "manager" ? "Employees" : "Team Members"}</span>
            </span>
            <span
              className="flex items-center justify-center underline text-sm text-primary cursor-pointer"
              onClick={() => { router.push(user.role === "manager" ? `/workforce/people/list` : `/${user.role}/team/members_list`) }}
            >
              View All
            </span>
          </div>

          <div className="overflow-x-auto">
            <div className="max-h-80 overflow-y-auto">
              <table className="min-w-full table-auto border-collapse ">
                <thead className='sticky top-0 bg-grey z-10'>
                  <tr className="border-b border-gray-100">
                    <th className="px-4 py-2 text-left text-gray-700 text-sm">Name</th>
                    <th className="px-4 py-2 text-center text-gray-700 text-sm">{user.role === "manager" ? "Department" : "Position"}</th>
                    {user.role === "manager" && <th className="px-4 py-2 text-center text-gray-700 text-sm w-12">Role</th>}
                    {user.role === "manager" && <th className="px-4 py-2 text-center text-gray-700 text-sm">Position</th>}
                    <th className="px-4 py-2 text-center text-gray-700 text-sm">Approval Request</th>
                    <th className="px-4 py-2 text-center text-gray-700 text-sm">Attendance</th>
                  </tr>
                </thead>
                
                <tbody>
                  {teamMembers.map((member, index) => (
                    <tr key={index} className={`${index === teamMembers.length - 1 ? '' : 'border-b border-gray-200'}`}>
                      <td className="px-4 py-2 ">
                        <div className="flex items-center space-x-2">
                          <div>
                            <Image src={member.avatar} className="w-8 h-8 rounded-full" height={200} width={400} alt={member.name} />
                          </div>
                          <div className="text-left text-sm text-gray-700 capitalize">
                            {member.name}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center text-gray-700 text-sm capitalize">{user.role === "manager" ? member?.department?.departments_name : member?.position?.name}</td>
                      {user.role === "manager" && <td className="px-4 py-3 text-center text-gray-700 text-sm capitalize">{member?.role.replace(/_/g, ' ')}</td>}
                      {user.role === "manager" && <td className="px-4 py-3 text-center text-gray-700 text-sm capitalize">{member.position?.name}</td>}
                      <td className="px-4 py-3 text-center text-sm">
                        {member.leave_counts.pending_items === 0 ?
                          "-" :
                          <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-primary text-white">
                            {member.leave_counts.pending_items}
                          </span>
                        }
                      </td>
                      <td className="px-4 py-3 text-center text-sm">
                        <span className={`px-4 py-2 text-sm rounded-md m-4 w-12 capitalize ${member.attendance_percentage < 75 ? 'bg-opacity-20 text_default_text border-secondary' :
                          member.attendance_percentage > 90 ?
                            'bg-green-100 text-green-500 border-green-400' :
                            'bg-orange-100 text-orange-400 border-orange-300'} `}
                        >
                          {member.attendance_percentage}%
                        </span>
                      </td>
                    </tr>
                  ))}

                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center text-gray-500 text-center" style={{ minHeight: "250px" }}>
          {user.role === "manager" ? "No Employees!" : "No Team Members!"}
        </div>
      )}
    </div>
  );
}