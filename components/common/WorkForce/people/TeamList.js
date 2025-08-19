import TeamEmployeesComponent from './TeamEmployeeList';
import { UseGetTeams } from '../../../../hooks/query/admin/getTeamList';
import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import { utils, write } from 'xlsx';
import { BsSearch } from 'react-icons/bs';
import { MdFilterList } from 'react-icons/md';
import { PiExport } from 'react-icons/pi';
import DataLoader from '../../../ui/dataLoader';
import Image from 'next/image';

const PeopleTeamListComponent = ({ searchTerm, handleSearchChange }) => {
  const { data: TeamList, isLoading } = UseGetTeams()
  const [selectedTeam, setSelectedTeam] = useState(null);

  const filteredTeams = TeamList && TeamList?.filter(
    (team) =>
      team.team_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      team.team_lead.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportCSV = () => {
    const exportData = [];

    filteredTeams.forEach((team) => {
      exportData.push({
        team: team.team_name,
        Name: '',
        Attendance: '',
        Role: '',
        Position: '',
        Location: '',
        Status: ''
      });

      team.team_members.forEach((employee) => {
        exportData.push({
          team: '',
          Name: employee.name,
          Attendance: `${employee.attendance_percentage}%`,
          Role: employee.role,
          Position: employee.position?.name,
          Location: employee.location?.name,
          Status: employee.todayAttendenceStatus
        });
      });
    });
    const worksheet = utils.json_to_sheet(exportData);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const buffer = write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    saveAs(blob, 'team.csv');
  }
  const handleViewTeam = (team) => {
    setSelectedTeam(team);
  };

  return (
    <div className=" min-h-screen">
      {selectedTeam ?
        <TeamEmployeesComponent team={selectedTeam} setBack={setSelectedTeam} />
        :
        isLoading ?
          <DataLoader />
          :
          TeamList &&
          <div className=''>
            <div className="flex flex-wrap justify-between  items-center gap-4 pb-3">
              <div className="flex-grow md:flex md:items-center md:w-auto">
                <div className="relative w-full">
                  <BsSearch className="absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search By Team Name"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="pl-10 pr-3 py-2 w-full focus:outline-none border rounded-lg"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2 items-center">

                {filteredTeams?.length > 0 && (
                  <button onClick={handleExportCSV} className="py-2 px-4 border rounded-lg flex items-center gap-2 text-sm whitespace-nowrap">
                    <PiExport />
                    <span>Export CSV</span>
                  </button>
                )}
              </div>
            </div>
            <div className='grid grid-cols-3 gap-4 '>
              {filteredTeams?.map((team) => (
                <div key={team.id} className="border p-4 rounded-xl shadow">
                  <div className="flex items-center space-x-5 mb-2">
                    <Image
                      src="/assets/icon.svg"
                      alt="Icon"
                      className="h-12 w-12"
                      height={200}
                      width={400}
                    />
                    <div>
                      <h3 className="font-bold text-xl capitalize">{team.team_name}</h3>
                      <span className='text-sm '>
                        Team Lead: <span className='font-semibold'> {team.team_lead}</span>

                      </span>
                    </div>
                  </div>

                  <div className='flex flex-col items-center'>
                    <span className='text-2xl font-semibold'>
                      {team.team_members.length}
                    </span>
                    <p>Total Employees</p>
                  </div>
                  <div className='flex justify-between items-center mt-2'>
                    <div className='relative flex -space-x-3 '>
                      {team?.team_members?.slice(0, 7).map((member, index) => (
                        <div key={member.id} className={`relative z-10 ${index !== 0 ? '-ml-3' : ''}`}>
                          <Image
                            src={member?.avatar}
                            alt={`${member?.name}'s avatar`}
                            className="h-9 w-9 rounded-full border-2 border-gray-100"
                            height={200}
                            width={400}
                          />
                        </div>
                      ))}
                    </div>


                    <button
                      onClick={() => handleViewTeam(team)}
                      className="underline text-sm text-primary rounded-lg"
                    >
                      View team
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
      }
    </div>
  );
};

export default PeopleTeamListComponent;
