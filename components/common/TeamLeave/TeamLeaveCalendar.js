import React, { useState, useRef, useEffect, useCallback } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import 'tailwindcss/tailwind.css';
import DataLoader from '../../ui/dataLoader';
import styled from "@emotion/styled";
import { MdNavigateBefore, MdNavigateNext, MdFilterList } from "react-icons/md";
import { useTeamLeaveCalendar } from '../../../hooks/query/team_lead/team/getTeamLeaveCalendar';
import { UseHRandManagerLeaveApprovalRequests } from '../../../hooks/query/getHRandManagerLeaveApprovalRequests';
import { UseGetLocationsHolidays } from '../../../hooks/query/getLocationsHolidays';
import { Tooltip } from 'react-tooltip';
import { getAllLeaveList } from '../../../hooks/query/getALLLeaveList';

export const StyleWrapper = styled.div`
  .fc-daygrid-day-top {
    flex-direction: initial;
    padding-left: 5px;
  }
`;

const leaveColors = {
  'sick': '#3988FF',
  'annual': '#5451D3',
  'maternity': '#069855',
  'paternity': '#1AC8B3',
  'compassionate': '#FFA500'
};

const TeamLeaveCalendar = ({ role }) => {
  const calendarRef = useRef(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedLeaveTypes, setSelectedLeaveTypes] = useState(['all']);
  const [selectedDurationTypes, setSelectedDurationTypes] = useState(['all']);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isPublicHolidaysModalOpen, setIsPublicHolidaysModalOpen] = useState(false);
  const filterModalRef = useRef(null);
  const publicHolidaysModalRef = useRef(null);
  const { data: locationsHolidayList, isLoading: isLoadingLocationsHolidayList } = UseGetLocationsHolidays();

  // const { data: teamLeaves, isLoading, refetch } = useTeamLeaveCalendar(
  //   currentDate.toLocaleString('default', { month: 'long' }).toLowerCase(),
  //   currentDate.getFullYear()
  // );
  
  const { data: HRandManagerLeaves, isLoading: isLoadingHRandManagerLeaves } = getAllLeaveList();

  // const approvedLeaves = role === "manager"
  //   ? HRandManagerLeaves?.filter(leave => leave.leave_status === 'approved')
  //   : teamLeaves;

  const approvedLeaves = HRandManagerLeaves?.filter(leave => leave.leave_status === 'approved');

  let publicHolidays = [];

  locationsHolidayList?.forEach(location => {
    if (location?.public_holidays && location?.public_holidays.length > 0) {
      location.public_holidays.forEach(holiday => {
        publicHolidays.push({
          ...holiday,
          locationName: location.location_name
        });
      });
    }
  });

  // Refetch data when currentDate changes
  // useEffect(() => {
  //   refetch();
  // }, [currentDate, refetch]);

  // Update calendar view when currentDate changes
  useEffect(() => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.gotoDate(currentDate);
    }
  }, [currentDate]);

  // Handle clicks outside the filter modal
  useEffect(() => {
    const handleClickOutsideFilter = (event) => {
      if (filterModalRef.current && !filterModalRef.current.contains(event.target)) {
        setIsFilterModalOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutsideFilter);
    return () => {
      document.removeEventListener('mousedown', handleClickOutsideFilter);
    };
  }, []);

  // Handle clicks outside the public holidays modal
  useEffect(() => {
    const handleClickOutsidePublicHolidays = (event) => {
      if (publicHolidaysModalRef.current && !publicHolidaysModalRef.current.contains(event.target)) {
        setIsPublicHolidaysModalOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutsidePublicHolidays);
    return () => {
      document.removeEventListener('mousedown', handleClickOutsidePublicHolidays);
    };
  }, []);

  // Prevent background scrolling when public holidays modal is open
  useEffect(() => {
    if (isPublicHolidaysModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isPublicHolidaysModalOpen]);

  const handlePrevMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    setCurrentDate(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    setCurrentDate(newDate);
  };

  const handleMonthChange = useCallback((event) => {
    const newMonthName = event.target.value; // e.g., 'january'
    const monthIndex = new Date(`${newMonthName} 1, 2020`).getMonth(); // 0-based index
    const newDate = new Date(currentDate.getFullYear(), monthIndex, 1);
    setCurrentDate(newDate);
  }, [currentDate]);

  const handleYearChange = useCallback((event) => {
    const newYear = parseInt(event.target.value, 10);
    const newDate = new Date(newYear, currentDate.getMonth(), 1);
    setCurrentDate(newDate);
  }, [currentDate]);

  const formatDate = (dateStr) => {
    const [day, month, year] = dateStr.split('-');
    return `${year}-${month}-${day}`;
  };

  const getLeaveTypeColor = (leaveType) => {
    const colorMap = {
      'sick': { background: 'rgba(57, 136, 255, 0.2)', textColor: '#3988FF' },
      'annual': { background: 'rgba(84, 81, 211, 0.2)', textColor: '#5451D3' },
      'maternity': { background: 'rgba(6, 152, 85, 0.2)', textColor: '#069855' },
      'paternity': { background: 'rgba(26, 200, 179, 0.2)', textColor: '#1AC8B3' },
      'compassionate': { background: 'rgba(255, 165, 0, 0.2)', textColor: '#FFA500' }
    };
    return colorMap[leaveType] || { background: 'bg-gray-100', border: 'border-l-4 border-gray-500', textColor: 'text-gray-500' };
  };

  const handleLeaveTypeChange = (type) => {
    if (type === 'all') {
      setSelectedLeaveTypes(['all']);
    } else {
      setSelectedLeaveTypes(prevTypes => {
        const newTypes = prevTypes.includes(type)
          ? prevTypes.filter(t => t !== type)
          : [...prevTypes.filter(t => t !== 'all'), type];

        return newTypes.length === 0 ? ['all'] : newTypes;
      });
    }
  };

  const handleDurationTypeChange = (type) => {
    if (type === 'all') {
      setSelectedDurationTypes(['all']);
    } else {
      setSelectedDurationTypes(prevTypes => {
        const newTypes = prevTypes.includes(type)
          ? prevTypes.filter(t => t !== type)
          : [...prevTypes.filter(t => t !== 'all'), type];

        return newTypes.length === 0 ? ['all'] : newTypes;
      });
    }
  };

  const renderFilterOptions = () => (
    <div>
      <div className="mb-2">
        <span className="font-semibold">Leave Types</span>
        <div className="mt-1">
          <label className="flex items-center cursor-pointer capitalize">
            <input
              type="checkbox"
              value="all"
              checked={selectedLeaveTypes.includes('all')}
              onChange={() => handleLeaveTypeChange('all')}
            />
            <span className="ml-2 text-sm text-gray-600 capitalize">All</span>
          </label>
          {Object.keys(leaveColors).map((type) => (
            <label key={type} className="mr-4 flex cursor-pointer items-center">
              <input
                type="checkbox"
                value={type}
                checked={selectedLeaveTypes.includes(type)}
                onChange={() => handleLeaveTypeChange(type)}
              />
              <span className="ml-2 text-sm text-gray-600 capitalize">{type}</span>
            </label>
          ))}
        </div>
      </div>
      <div>
        <span className="font-semibold">Leave Duration</span>
        <div className="mt-1">
          <label className="flex items-center cursor-pointer capitalize">
            <input
              type="checkbox"
              value="all"
              checked={selectedDurationTypes.includes('all')}
              onChange={() => handleDurationTypeChange('all')}
            />
            <span className="ml-2 text-sm text-gray-600 capitalize">All</span>
          </label>
          {['full', 'half'].map((dayType) => (
            <label key={dayType} className="mr-4 flex cursor-pointer items-center">
              <input
                type="checkbox"
                value={dayType}
                checked={selectedDurationTypes.includes(dayType)}
                onChange={() => handleDurationTypeChange(dayType)}
              />
              <span className="ml-2 text-sm text-gray-600 capitalize">
                {dayType === 'full' ? 'Full Day' : 'Half Day'}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );

  const LegendItem = ({ color, label }) => (
    <div className="flex items-center mr-4">
      <span className="h-2 w-2 rounded-full mr-2" style={{ backgroundColor: color }}></span>
      <span className="text-sm text-gray-600">{label}</span>
    </div>
  );

  const parseDate = (dateStr) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(Date.UTC(year, month - 1, day));
  };

  // Create events for public holidays
  const holidayEvents = publicHolidays.map(holiday => {
    const startDate = parseDate(holiday.start_date);
    const endDate = parseDate(holiday.end_date);

    // Adjust end date to be exclusive for FullCalendar
    endDate.setDate(endDate.getDate() + 1);

    return {
      title: `${holiday.name} (${holiday.locationName})`,
      start: startDate.toISOString().split('T')[0],
      end: endDate.toISOString().split('T')[0],
      allDay: true,
      extendedProps: {
        locationName: holiday.locationName,
        holidayName: holiday.name,
      }
    };
  });

  const events = approvedLeaves?.filter(leave =>
    (selectedLeaveTypes.includes('all') || selectedLeaveTypes.includes(leave.leave_type)) &&
    (selectedDurationTypes.includes('all') || selectedDurationTypes.includes(leave.day_type))
  ).map(leave => {
    const startDate = new Date(formatDate(leave.start_date));
    const endDate = new Date(formatDate(leave.end_date));
    const adjustedEndDate = new Date(endDate.setDate(endDate.getDate() + 1)).toISOString().split('T')[0]; // Adjust end date for FullCalendar

    return {
      title: `${leave.user_name}`,
      start: formatDate(leave.start_date),
      end: adjustedEndDate, // Correctly adjust end date
      extendedProps: {
        leaveType: leave.leave_type,
        dayType: leave.day_type,
        halfType: leave.half_type,
      }
    };
  }) || [];

  const combinedEvents = [...events, ...holidayEvents];

  return (
    <div>
      {isLoadingHRandManagerLeaves || isLoadingLocationsHolidayList ? (
        <DataLoader />
      ) : (
        <div className='px-3'>
          <div className="flex justify-between items-center mb-4">
            <div className='font-semibold text-left'></div>
            <div className="flex space-x-2">
              <div className="relative">
                <button
                  className="py-2 px-4 border rounded-lg flex items-center gap-2 text-sm whitespace-nowrap"
                  onClick={() => setIsFilterModalOpen(true)}
                >
                  <MdFilterList />
                  <span>Filter Leave Type</span>
                </button>
                {isFilterModalOpen && (
                  <div
                    className="absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-lg p-3 z-50"
                    ref={filterModalRef}
                  >
                    {renderFilterOptions()}
                  </div>
                )}
              </div>
              <button
                className="py-2 px-4 border rounded-lg flex items-center gap-2 text-sm whitespace-nowrap"
                onClick={() => setIsPublicHolidaysModalOpen(true)}
              >
                <span>Public Holidays</span>
              </button>
            </div>
          </div>
          {/* Public Holidays Modal */}
          {isPublicHolidaysModalOpen && (
            <div className="fixed inset-0 flex items-center justify-center z-50">
              <div className="fixed inset-0 bg-black opacity-50"></div>
              <div className="bg-white rounded-lg shadow-lg w-3/4 max-w-3xl relative max-h-screen overflow-y-auto" ref={publicHolidaysModalRef}>
                <button
                  className="absolute top-2 right-2 text-gray-600 hover:text-default_text text-2xl"
                  onClick={() => setIsPublicHolidaysModalOpen(false)}
                >
                  &times;
                </button>
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-4">Public Holidays</h2>
                  <div className="overflow-auto max-h-96">
                    <table className="w-full">
                      <thead className="sticky top-0 bg-white">
                        <tr>
                          <th className="px-4 py-2 border text-left">Name</th>
                          <th className="px-4 py-2 border">Location</th>
                          <th className="px-4 py-2 border">Start Date</th>
                          <th className="px-4 py-2 border">End Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {publicHolidays.map((holiday, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2 border capitalize">{holiday.name}</td>
                            <td className="px-4 py-2 border text-center capitalize">{holiday.locationName}</td>
                            <td className="px-4 py-2 border text-center">{formatDate(holiday.start_date)}</td>
                            <td className="px-4 py-2 border text-center">{formatDate(holiday.end_date)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="flex flex-col items-center justify-center w-full mx-auto">
            <div className="relative w-full rounded-2xl overflow-hidden border">
              <div className="flex justify-center space-x-4 pt-4 bg-white mb-5">
                <LegendItem color="#5451D3" label="Annual" />
                <LegendItem color="#3988FF" label="Sick" />
                <LegendItem color="#069855" label="Maternity" />
                <LegendItem color="#1AC8B3" label="Paternity" />
                <LegendItem color="#FFA500" label="Compassionate" />
                <LegendItem color="#006400" label="Public Holiday" />
              </div>
              <div className="flex items-center justify-between w-full px-4 py-2">
                <button
                  onClick={handlePrevMonth}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-500 py-1 px-2 rounded-lg border flex items-center justify-center"
                >
                  <MdNavigateBefore className='h-5 w-5' />
                </button>
                <div>
                  <select
                    onChange={handleMonthChange}
                    value={currentDate.toLocaleString('default', { month: 'long' }).toLowerCase()}
                    className="mx-2 text-sm">
                    {Array.from({ length: 12 }, (_, i) => (
                      <option
                        value={new Date(0, i).toLocaleString('default', { month: 'long' }).toLowerCase()}
                        key={i}
                      >
                        {new Date(0, i).toLocaleString('default', { month: 'long' })}
                      </option>
                    ))}
                  </select>
                  <select
                    onChange={handleYearChange}
                    value={currentDate.getFullYear()}
                    className="mx-2 text-sm">
                    {Array.from({ length: 5 }, (_, i) => (
                      <option value={currentDate.getFullYear() - 2 + i} key={i}>
                        {currentDate.getFullYear() - 2 + i}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={handleNextMonth}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-500 py-1 px-2 rounded-lg border flex items-center justify-center"
                >
                  <MdNavigateNext className='h-5 w-5' />
                </button>
              </div>
              <StyleWrapper>
                <FullCalendar
                  ref={calendarRef}
                  plugins={[dayGridPlugin, interactionPlugin]}
                  initialView="dayGridMonth"
                  initialDate={currentDate} // Set initial date based on state
                  headerToolbar={{
                    left: '',
                    center: '',
                    right: ''
                  }}
                  events={combinedEvents}
                  eventColor='transparent'
                  eventContent={({ event }) => {
                    if (event.extendedProps.holidayName) {
                      // This is a public holiday event with tooltip
                      const fullName = `${event.extendedProps.holidayName} (${event.extendedProps.locationName})`;
                      const truncatedName = fullName.length > 20 ? `${fullName.substring(0, 17)}...` : fullName;

                      return (
                        <div style={{ paddingLeft: "2px", paddingBottom: "4px" }}>
                          <div
                            style={{
                              backgroundColor: '#006400', // Dark green background
                              color: '#FFFFFF',           // White text for contrast
                              paddingLeft: "5px",
                              borderLeft: '4px solid #006400', // Dark green border
                              fontWeight: "bold"
                            }}
                          >
                            <span
                              className="block cursor-pointer truncate"
                              data-tooltip-id={`tooltip-${event.id}`}
                              data-tooltip-content={fullName}
                            >
                              {truncatedName}
                            </span>
                            <Tooltip
                              id={`tooltip-${event.id}`}
                              place="top"
                              effect="solid"
                              className="max-w-xs whitespace-pre-wrap z-50"
                            />
                          </div>
                        </div>
                      );
                    } else {
                      const styles = getLeaveTypeColor(event.extendedProps.leaveType);
                      const durationLabel = event.extendedProps.dayType === 'full' ? 'Full Day' : 'Half Day';
                      return (
                        <div style={{ paddingLeft: "2px", paddingBottom: "4px" }}>
                          <div
                            style={{
                              backgroundColor: styles.background,
                              color: styles.textColor,
                              paddingLeft: "5px",
                              borderLeft: "4px solid",
                              borderColor: styles.textColor, // Ensure border color matches leave type
                              fontWeight: "bold"
                            }}
                          >
                            <span className='capitalize'>
                              {event.title}
                            </span>
                          </div>
                        </div>
                      );
                    }
                  }}
                />
              </StyleWrapper>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamLeaveCalendar;