import React, { useState, useMemo, useEffect, useRef } from 'react';
import MemberCard from './MemberCard';
import { BsSearch } from 'react-icons/bs';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { MdFilterList } from 'react-icons/md';
import { PiExport } from "react-icons/pi";
import MemberCardSkeleton from './MemberCardSkeleton';
import { useAllTeamMembers } from '../../../hooks/query/team_lead/team/getTeamMembers';
import { useMemberLeaves } from '../../../hooks/query/team_lead/team/getMembersLeaves';

export default function MembersListComponent() {
  const { data: allTeamMembers = [], isLoading, isError, error } = useAllTeamMembers();
  const { data: allMemberLeaves = [], isLoadingMemberLeaves } = useMemberLeaves('pending');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedPositions, setSelectedPositions] = useState(["All"]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const filterModalRef = useRef(null);
  const yearFilterRef = useRef(null);
  const [isYearFilterOpen, setIsYearFilterOpen] = useState(false);
  const membersWithLeavesCount = useMemo(() => {
    return allTeamMembers.map(member => {
      const leavesCount = allMemberLeaves.filter(leave => leave.user_id === member.id).length;
      return { ...member, leavesCount };
    });
  }, [allTeamMembers, allMemberLeaves]);

  const filteredMembers = useMemo(() => {
    return membersWithLeavesCount.filter(member =>
      (member.name.toLowerCase().includes(searchTerm.toLowerCase()) 
      || member.employee_id.includes(searchTerm)) &&
      (selectedPositions.includes("All") || selectedPositions.length === 0 
      || selectedPositions.includes(member.position.name)) &&
      (new Date(member.joining_date).getFullYear() === currentYear)
    );
  }, [searchTerm, membersWithLeavesCount, currentYear, selectedPositions]);

  const handleExportCSV = () => {
    const headers = "Employee ID,Name,Gender,Email,Phone,Role,Position,Team,Department,Location,Joining Date,Work Hours\n";
  
    const rows = filteredMembers.map(member =>
      `${member?.employee_id},${member?.name},${member?.gender},${member?.email},${member?.phone_number},${member?.role},${member.position?.name},${member.team_obj?.team_name},${member.department?.departments_name},${member.location?.name},${member?.joining_date},${member?.working_hours}`
    ).join("\n");
  
    const csvContent = "data:text/csv;charset=utf-8," + headers + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
  
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "team_members.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };  

  const handlePositionFilter = (position) => {
    if (position === "All") {
      setSelectedPositions(["All"]);
    } else {
      setSelectedPositions(prevSelected => {
        if (prevSelected.includes(position)) {
          const updatedSelections = prevSelected.filter(p => p !== position);
          return updatedSelections.length === 0 ? ["All"] : updatedSelections;
        } else {
          return prevSelected.filter(p => p !== "All").concat(position);
        }
      });
    }
  };

  const distinctPositions = useMemo(() => {
    return ["All", ...new Set(allTeamMembers.map(member => member.position.name))];
  }, [allTeamMembers]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterModalRef.current && !filterModalRef.current.contains(event.target)) {
        setIsFilterModalOpen(false);
      }
      if (yearFilterRef.current && !yearFilterRef.current.contains(event.target)) {
        setIsYearFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [filterModalRef, yearFilterRef]);

  return (
    <>
      <div className="flex flex-wrap justify-between items-center gap-4 p-3">
        <div className="flex-grow md:flex md:items-center md:w-auto">
          <div className="relative w-full">
            <BsSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search by name or employee ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-3 py-2 w-full focus:outline-none border rounded-lg"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative">
            <button
              className="py-2 px-4 border rounded-lg flex items-center gap-2 text-sm whitespace-nowrap"
              onClick={() => setIsFilterModalOpen(true)}
            >
              <MdFilterList />
              <span>Filter</span>
            </button>
            {isFilterModalOpen && (
              <div
                className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg p-3 z-50"
                ref={filterModalRef}
              >
                {distinctPositions.map((position, index) => (
                  <label className="flex items-center gap-2 cursor-pointer capitalize whitespace-nowrap" key={index}>
                    <input
                      type="checkbox"
                      checked={selectedPositions.includes(position)}
                      onChange={() => handlePositionFilter(position)}
                    />
                    {position}
                  </label>
                ))}
              </div>
            )}
          </div>
          <div className="relative">
            <button
              className="py-2 px-4 border rounded-lg flex items-center gap-2 text-sm whitespace-nowrap"
              onClick={() => setIsYearFilterOpen(true)}
            >
              <FaRegCalendarAlt />
              <span>Joining Year</span>
            </button>
            {isYearFilterOpen && (
              <div
                className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg p-3 z-50"
                ref={yearFilterRef}
              >
                {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                  <label className="flex items-center gap-2 cursor-pointer capitalize whitespace-nowrap" key={year}>
                    <input
                      type="radio"
                      name="year"
                      value={year}
                      checked={currentYear === year}
                      onChange={() => setCurrentYear(year)}
                    />
                    {year}
                  </label>
                ))}
              </div>
            )}
          </div>
          <button onClick={handleExportCSV} className="py-2 px-4 border rounded-lg flex items-center gap-2 text-sm whitespace-nowrap">
            <PiExport />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      <div className="min-h-screen">
        {isLoading || isLoadingMemberLeaves ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 mx-1">
            {Array.from({ length: 8 }).map((_, index) => (
              <MemberCardSkeleton key={index} />
            ))}
          </div>
        ) : filteredMembers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-2 mx-1">
            {filteredMembers.map(member => (
              <MemberCard key={member.id} member={member} />
            ))}
          </div>
        ) : (
          <div className='text-gray-500 text-center mt-4 text-lg'>
            No Team Members!
          </div>
        )}
      </div>
    </>
  );
}
