import { useState, useEffect, useRef } from 'react';
import { Calendar } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { useAllApprovedLeaves } from '../../../hooks/query/getAllApprovedLeaves';
import DataLoader from '../../ui/dataLoader';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import useGetActiveUser from '../../../hooks/query/getUserFromLocalStorage';
import Image from 'next/image';
import { MdFilterList } from 'react-icons/md';
import { formatDateToDdMmYy } from '../../../utils/functions';
import { UseGetConfigurations } from '../../../hooks/query/admin/getConfigurations';
import { format, isWithinInterval, startOfDay } from 'date-fns';

const leaveColors = {
  'sick': '#3988FF',
  'annual': '#5451D3',
  'maternity': '#069855',
  'paternity': '#1AC8B3',
  'compassionate': '#FFA500'
};

const dayTypeColors = {
  'publicHoliday': '#50C878',
  'halfDay': '#8798ec',
  'offDay': '#ccc'
};

function LeaveCalendar({ member }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedLeaveTypes, setSelectedLeaveTypes] = useState(['all']);
  const [selectedDurationTypes, setSelectedDurationTypes] = useState(['all']);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const { data: allApprovedLeaves = [], isLoading, isError, error } = useAllApprovedLeaves();
  const { data: user, userIsLoading } = useGetActiveUser();
  const { data: configurations, isLoading: isLoadingConfigurations } = UseGetConfigurations();
  const filterModalRef = useRef(null);
  const [offDays, setOffDays] = useState([]);
  const [halfDays, setHalfDays] = useState([]);
  const [publicHolidays, setPublicHolidays] = useState([]);

  // Extract off days from the member's location settings
  useEffect(() => {
    if (member && member.location) {
      // Extract off days
      if (member?.shift_settings) {
        const daysOff = member?.shift_settings
          .filter(setting => setting.day_type === 'Off')
          .map(setting => setting.day);
        setOffDays(daysOff);

        // Extract half days
        const halfDaySettings = member?.shift_settings
          .filter(setting => setting.day_type === 'Half')
          .map(setting => setting.day);
        setHalfDays(halfDaySettings);
      }

      // Extract public holidays
      if (member.location.public_holidays) {
        const holidays = [];

        member.location.public_holidays.forEach(holiday => {
          const start = new Date(holiday.start_date);
          const end = new Date(holiday.end_date);

          let currentDate = new Date(start);
          while (currentDate <= end) {
            holidays.push({
              date: new Date(currentDate),
              name: holiday.name,
            });
            currentDate.setDate(currentDate.getDate() + 1);
          }
        });

        setPublicHolidays(holidays);
      }
    }
  }, [member]);

  function handleSelect(date) {
    if (isDayOff(date)) {
      return;
    }
    setSelectedDate(startOfDay(date));
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterModalRef.current && !filterModalRef.current.contains(event.target)) {
        setIsFilterModalOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [filterModalRef]);

  useEffect(() => {
    const style = document.createElement('style');

    style.innerHTML = `
      .rdrDayToday .rdrDayNumber span:after {
        display: none;
      }
    `;

    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  function isDayOff(date) {
    const dayName = format(date, 'EEEE');
    return offDays.includes(dayName);
  }

  function isHalfDay(date) {
    const dayName = format(date, 'EEEE');
    return halfDays.includes(dayName);
  }

  function getPublicHolidayForDate(date) {
    const holiday = publicHolidays?.find(holiday => holiday.date.toDateString() === date.toDateString());
    return holiday ? holiday.name : null;
  }

  function getHolidayPeriod(date) {
    const normalizedDate = startOfDay(date);

    const holiday = member?.location.public_holidays.find(holiday =>
      isWithinInterval(normalizedDate, {
        start: startOfDay(new Date(holiday?.start_date)),
        end: startOfDay(new Date(holiday?.end_date)),
      })
    );

    if (holiday) {
      const startDate = new Date(holiday.start_date);
      const endDate = new Date(holiday.end_date);
      const numberOfDays = holiday.no_of_days; // Use the provided no_of_days

      return {
        name: holiday.name,
        start_date: format(startDate, 'dd MMM yyyy'),
        end_date: format(endDate, 'dd MMM yyyy'),
        number_of_days: numberOfDays,
      };
    }

    return null;
  }

  function customDayContent(day) {
    const formattedDate = format(day, 'yyyy-MM-dd');
    const leavesForDay = allApprovedLeaves.filter(leave =>
      formattedDate >= leave.start_date &&
      formattedDate <= leave.end_date &&
      (selectedLeaveTypes.includes('all') || selectedLeaveTypes.includes(leave.type)) &&
      (selectedDurationTypes.includes('all') || selectedDurationTypes.includes(leave.day_type))
    );

    const isDisabled = isDayOff(day);
    const isHalf = isHalfDay(day);
    const publicHolidayName = getPublicHolidayForDate(day);

    const dotStyle = isDisabled ? { display: 'none' } : {};

    const backgroundColor = isDisabled
      ? dayTypeColors['offDay']
      : publicHolidayName
        ? dayTypeColors['publicHoliday']
        : isHalf
          ? dayTypeColors['halfDay']
          : 'inherit';

    return (
      <div
        className={`
        ${publicHolidayName ? 'rounded-full text-gray-300' : ''}
        ${isHalf ? 'rounded-full text-primary' : ''}
        ${isDisabled ? 'rounded-full cursor-not-allowed' : 'cursor-pointer'}
        flex flex-col items-center justify-center w-14 h-14
      `}
        style={{
          background: backgroundColor,
          width: (isDisabled || publicHolidayName || isHalf) ? '400px' : 'inherit',
          height: (isDisabled || publicHolidayName || isHalf) ? '30px' : 'inherit',
          pointerEvents: (isDisabled || publicHolidayName || isHalf) ? 'none' : 'auto' // Disable click events on off-days
        }}
      >
        <span className="text-sm leading-none">{format(day, 'd')}</span>
        <div className="flex justify-center mt-1">
          {leavesForDay.map((leave, index) => (
            <span
              key={index}
              className="h-2 w-2 rounded-full mx-0.5"
              style={{ backgroundColor: leaveColors[leave.type], ...dotStyle }}
            ></span>
          ))}
        </div>
      </div>
    );
  }

  const LegendItem = ({ color, label, type }) => {
    if (type === 'circle') {
      return (
        <div className="flex items-center mr-4">
          <span
            className="h-3 w-3 rounded-full mr-2"
            style={{ backgroundColor: color }}
          ></span>
          <span className="text-sm text-gray-600">{label}</span>
        </div>
      );
    } else if (type === 'dash') {
      return (
        <div className="flex items-center mr-4">
          <span
            className="h-1 w-6 rounded-full mr-2"
            style={{ backgroundColor: color }}
          ></span>
          <span className="text-sm text-gray-600">{label}</span>
        </div>
      );
    }
    return null;
  };

  function handleLeaveTypeChange(type) {
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
  }

  function handleDurationTypeChange(type) {
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
  }

  function renderFilterOptions() {
    return (
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
  }

  function renderLeaveDetails() {
    if (!selectedDate) {
      return (
        <div className='w-full border rounded-2xl p-8 mt-5'>
          <div className="flex justify-center items-center h-full text-center">
            No date selected.
          </div>
        </div>
      )
    }

    const selectedLeaveDetails = allApprovedLeaves.filter(leave =>
      format(selectedDate, 'yyyy-MM-dd') >= leave.start_date &&
      format(selectedDate, 'yyyy-MM-dd') <= leave.end_date &&
      (selectedLeaveTypes.includes('all') || selectedLeaveTypes.includes(leave.type)) &&
      (selectedDurationTypes.includes('all') || selectedDurationTypes.includes(leave.day_type))
    );

    const holidayPeriod = getHolidayPeriod(selectedDate);
    const isHalf = isHalfDay(selectedDate);

    return (
      <div className='w-full border rounded-2xl p-4 mt-5'>
        <div className="flex justify-between items-center">
          <span className="flex items-center justify-center mb-4">
            <span className="text-lg text-default_text mr-2">Calendar Status</span>
          </span>
          <div className="flex items-center justify-center mb-4">
            {formatDateToDdMmYy(selectedDate)}
          </div>
        </div>

        {holidayPeriod && (
          <div className="mb-4">
            <div className="bg-white rounded-xl shadow overflow-hidden">
              <table className="min-w-full table-auto">
                <tbody>
                  <tr className="bg-gray-100">
                    <td className="px-4 py-4 text-gray-500 text-sm">
                      <div className="mt-2">
                        <div className="text-sm text-gray-600">Selected Holiday</div>
                        <div className="font-semibold text-primary capitalize text-base">
                          {holidayPeriod.name}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-gray-500 text-sm">
                      <div className="mt-2">
                        <div className="text-sm text-gray-600">Start Date</div>
                        <div className="font-semibold text-primary capitalize  text-base">
                          {holidayPeriod.start_date}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-gray-500 text-sm">
                      <div className="mt-2">
                        <div className="text-sm text-gray-600">End Date</div>
                        <div className="font-semibold text-primary capitalize  text-base">
                          {holidayPeriod.end_date}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-gray-500 text-sm">
                      <div className="mt-2">
                        <div className="text-sm text-gray-600">Number of Days</div>
                        <div className="font-semibold text-primary capitalize  text-base">
                          {holidayPeriod.number_of_days}
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedLeaveDetails.length > 0 ? (
          <div className="overflow-x-auto">
            <div className="space-y-2">
              {selectedLeaveDetails.map((leave, index) => (
                <div key={index} className="bg-white rounded-xl shadow overflow-hidden">
                  <table className="min-w-full table-auto">
                    <tbody>
                      <tr className="bg-gray-100">
                        <td className="px-4 py-4 text-gray-500 text-sm">
                          <div className="flex items-center">
                            <Image src={user?.avatar} className="h-12 w-12 rounded-lg mr-4" height={200} width={400} alt={`${user.name}'s profile`} />
                            <div>
                              <div className="text-sm font-semibold text-gray-700 capitalize">{user.name}</div>
                              <div className="text-sm text-gray-600 capitalize">Employee</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-2 text-gray-500 text-sm">
                          <div className="mt-2">
                            <div className="text-sm text-gray-600">Leave Type</div>
                            <div className="font-semibold text-primary capitalize">
                              {leave.type}{' '}
                              ({leave.day_type === 'full'
                                ? 'Full Day'
                                : `Half Day - ${leave.half_type.replace('_', ' ')}`})
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-2 text-gray-500 text-sm">
                          <div className="mt-2">
                            <div className="text-sm text-gray-600">Leave Dates</div>
                            <div className="font-semibold text-primary">
                              {formatDateToDdMmYy(new Date(leave.start_date))} to {formatDateToDdMmYy(new Date(leave.end_date))}
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-2 text-gray-500 text-sm">
                          <div className="flex items-center">
                            <CheckCircleIcon className="h-12 w-12 mr-4 fill-green-500" />
                            <div>
                              <div className="text-sm text-gray-600">Approved By</div>
                              <div className="font-semibold text-primary">{getApprovers(leave)}</div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* Display Half Day Note only if there are no leave details and it's a half day */}
        {!selectedLeaveDetails.length && isHalf && !holidayPeriod && (
          <div className="text-center text-gray-500 mb-4">
            This day is a half day.
          </div>
        )}

        {/* If no public holiday, no leave, and no half day */}
        {!holidayPeriod && !isHalf && !selectedLeaveDetails.length && (
          <div className="text-center text-gray-500">No leave details for selected date.</div>
        )}
      </div>
    );
  }

  const getApprovers = (leave) => {
    // if (leave?.leave_status !== 'approved') {
    //   return '';
    // }

    const userRole = user.role;
    const leaveDuration = parseFloat(leave.no_of_days);
    const config_no_of_days = configurations ? parseInt(configurations[0]?.no_of_days, 10) : 0;

    if (userRole === 'staff') {
      if (leave?.team_lead_id) {
        if (leaveDuration >= config_no_of_days) {
          return "Team Lead, HR, Manager";
        } else {
          return "Team Lead, HR";
        }
      } else {
        if (leaveDuration >= config_no_of_days) {
          return "HR, Manager";
        } else {
          return "HR";
        }
      }
    }

    if (userRole === 'team_lead') {
      return "HR and Manager";
    }

    if (userRole === 'HR') {
      return "Manager";
    }

    if (userRole === 'manager') {
      return "HR and Manager";
    }

    return '';
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className='font-semibold text-left'>
          Personal Leave Calendar
        </h2>

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
      </div>

      <div className="flex flex-col items-center justify-center w-full">
        <div className="relative w-full rounded-2xl overflow-hidden border hover:border-primary hover:shadow-sm hover:shadow-primary">
          <div className="flex flex-wrap justify-center space-x-4 pt-4 bg-white">
            {/* Conditionally Render Day Type Legends */}
            {publicHolidays.length > 0 && (
              <LegendItem
                type="dash"
                color={dayTypeColors['publicHoliday']}
                label="Public Holiday"
              />
            )}
            {halfDays.length > 0 && (
              <LegendItem
                type="dash"
                color={dayTypeColors['halfDay']}
                label="Half Day"
              />
            )}
            {offDays.length > 0 && (
              <LegendItem
                type="dash"
                color={dayTypeColors['offDay']}
                label="Off Day"
              />
            )}

            {/* Leave Type Legends */}
            {Object.keys(leaveColors).map((type) => (
              <LegendItem
                key={type}
                type="circle"
                color={leaveColors[type]}
                label={type.charAt(0).toUpperCase() + type.slice(1)}
              />
            ))}
          </div>
          <Calendar
            date={selectedDate}
            onChange={handleSelect}
            color={'#999999'}
            className="w-full"
            style={{ width: "100%" }}
            dayContentRenderer={customDayContent}
          />
        </div>
        {isLoading ? <DataLoader /> : renderLeaveDetails()}

        <div className="w-full border rounded-2xl p-4 mt-5">
          <div className="flex justify-between items-center mb-4">
            <span className="text-lg text-default_text">All Public Holidays</span>
          </div>

          <div className="bg-white rounded-xl shadow overflow-y-auto max-h-60">
            <table className="min-w-full table-auto">
              {/* Table Header */}
              <thead>
                <tr className="bg-gray-200">
                  <th
                    scope="col"
                    className="px-4 py-2 text-left text-gray-600 text-sm sticky top-0 bg-gray-200 z-10"
                  >
                    Holiday Name
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-2 text-left text-gray-600 text-sm sticky top-0 bg-gray-200 z-10"
                  >
                    Start Date
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-2 text-left text-gray-600 text-sm sticky top-0 bg-gray-200 z-10"
                  >
                    End Date
                  </th>
                  <th
                    scope="col"
                    className="px-4 py-2 text-left text-gray-600 text-sm sticky top-0 bg-gray-200 z-10"
                  >
                    Number of Days
                  </th>
                </tr>
              </thead>
              {/* Table Body */}
              <tbody>
                {member?.location.public_holidays &&
                  member?.location.public_holidays.length > 0 ? (
                  member?.location.public_holidays.map((holiday, index) => (
                    <tr
                      key={index}
                      className="border-t hover:bg-gray-50"
                    >
                      <td className="px-4 py-4 text-gray-700 text-sm">
                        {holiday.name}
                      </td>
                      <td className="px-4 py-4 text-gray-700 text-sm">
                        {format(
                          new Date(holiday.start_date),
                          'dd MMM yyyy'
                        )}
                      </td>
                      <td className="px-4 py-4 text-gray-700 text-sm">
                        {format(new Date(holiday.end_date), 'dd MMM yyyy')}
                      </td>
                      <td className="px-4 py-4 text-gray-700 text-sm">
                        {holiday.no_of_days}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-4 py-2 text-center text-gray-500"
                    >
                      No public holidays available.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LeaveCalendar;
