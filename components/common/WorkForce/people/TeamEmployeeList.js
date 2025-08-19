import React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, PencilIcon } from 'lucide-react';
import EditTeamComponent from '../../../admin/Teams/EditTeam';
import { getStatusClasses } from '../../attendance/AttendanceComponent';


const TeamEmployeesComponent = ({ team, setBack }) => {
  const [editTeam, setEditTeam] = useState(false)

  const handleEditEmployee = (employeeId) => {
    setEditTeam(true)
    // Implement edit functionality as needed
  };

  return (
    <div className="p-4">
      {editTeam ?
        <EditTeamComponent teamData={team} setEditTeam={setEditTeam} />
        :
        <div>
          <div className='flex  items-center'>
            <button onClick={() => setBack(null)} type='button' className='flex space-x-2 items-center px-2 py-1 text-white bg-primary rounded-xl'>
              <ArrowLeft className='text-white h-5 w-5' />
              <span>Back</span>
            </button>

            <h2 className="text-xl font-bold ml-3"> {team.team_name} Team</h2>

            <button onClick={() => handleEditEmployee(team.id)} className=" ml-9 py-1 flex items-center  px-2 border border-primary text-primary rounded-lg">
              <PencilIcon className='h-4 w-4 mr-2' />
              Edit
            </button>
          </div>
          <div className="overflow-x-auto border rounded-lg mt-7">
            <table className="min-w-full border rounded-sm  bg-white">
              <thead className="bg-gray-100 sticky top-0 z-20">
                <tr className='bg-gray-100 rounded-xl text-left'>
                  <th className="px-2 py-2 border-b text-left text-default_text text-sm">Name</th>
                  <th className="px-2 py-2 border-b text-left text-default_text text-sm">Email</th>
                  <th className="px-2 py-2 border-b text-left text-default_text text-sm">Attendance</th>
                  <th className="px-2 py-2 border-b text-left text-default_text text-sm">Department</th>
                  <th className="px-2 py-2 border-b text-left text-default_text text-sm">Role</th>
                  <th className="px-2 py-2 border-b text-left text-default_text text-sm">Position</th>
                  <th className="px-2 py-2 border-b text-left text-default_text text-sm">Location</th>
                  <th className="px-2 py-2 border-b text-left text-default_text text-sm">Status</th>
                </tr>
              </thead>
              <tbody>
                {team?.team_members.map((employee) => (
                  <tr key={employee.id}>
                    <td className="px-2 py-2 border-b text-left text-sm capitalize">{employee.name}</td>
                    <td className="px-2 py-2 border-b text-left text-sm">
                      {employee.email}
                      {/* <div className='bg-primary rounded-full px-2 flex justify-center text-center w-5 text-white'>
                                        {employee?.leave_counts.pending_items}
                                        </div> */}
                    </td>
                    <td className="px-2 py-2 border-b text-left text-sm">
                      <div className={`border rounded-lg p-2 w-14 capitalize ${employee?.attendance_percentage >= 90 ?
                        'border-green-300 text-green-400 bg-[#E6FAF0]' : employee?.attendance_percentage <= 75 ?
                          'border-red-300 text-red-400 bg-[#FDE8E8]' : 'border-yellow-400 text-yellow-500 bg-[#FBF5E8]'
                        }`}> {employee?.attendance_percentage}%</div>
                    </td>
                    <td className="px-2 py-2 border-b text-left text-sm capitalize">{employee?.department?.departments_name}</td>
                    <td className="px-2 py-2 border-b text-left text-sm capitalize">{employee?.role === "team_lead" ? employee?.role.replace('_', " ") : employee?.role}</td>
                    <td className="px-2 py-2 border-b text-left text-sm capitalize">{employee?.position?.name}</td>
                    <td className="px-2 py-2 border-b text-left text-sm capitalize">{employee?.location?.name}</td>
                    <td className="px-2 py-2 border-b text-left text-sm">
                       <span
                        className={`py-2 rounded-md capitalize ${getStatusClasses(employee.todayAttendenceStatus)
                          }`}
                      >
                        {employee.todayAttendenceStatus}
                      </span>
                     
                    
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      }

    </div>
  );
};

export default TeamEmployeesComponent;
