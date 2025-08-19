import { useState, useEffect } from 'react';
import { DateRangePicker } from 'react-date-range';
import { format, isSameDay, isWithinInterval } from 'date-fns';
import 'react-date-range/dist/styles.css'; // Main style file
import 'react-date-range/dist/theme/default.css'; // Theme CSS for the calendar
import { Tooltip } from 'react-tooltip';

function CreateRequestCalendar({ onDateChange, member, initialStartDate, initialEndDate }) {
  const [offDays, setOffDays] = useState([]);
  const [halfDays, setHalfDays] = useState([]);
  const [publicHolidays, setPublicHolidays] = useState([]);
  const [state, setState] = useState([
    {
      startDate: initialStartDate || new Date(),
      endDate: initialEndDate || new Date(),
      key: 'selection',
    },
  ]);

  useEffect(() => {
    const style = document.createElement('style');

    style.innerHTML = `
      .rdrDefinedRangesWrapper {
        display: none;
      }
    `;

    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    if (member && member.location) {
      if (member.shift_settings) {
        const offDays = [];
        const halfDays = [];

        member.shift_settings.forEach(setting => {
          if (setting.day_type === 'Off') {
            offDays.push(setting.day);
          } else if (setting.day_type === 'Half') {
            halfDays.push(setting.day);
          }
        });
        setOffDays(offDays);
        setHalfDays(halfDays);
      }

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

  function handleSelect(ranges) {
    const { selection } = ranges;
    setState([{ ...state[0], ...selection }]);
    onDateChange(selection);
  }

  function isDayOff(dayName) {
    return offDays.includes(dayName);
  }

  function isHalfDay(dayName) {
    return halfDays.includes(dayName);
  }

  function getPublicHolidaysForDate(date) {
    return publicHolidays
      .filter(holiday => isSameDay(holiday.date, date))
      .map(holiday => holiday.name);
  }


  function renderDayContent(date) {
    const dayName = format(date, 'EEEE');
    const isDisabled = isDayOff(dayName);
    const isHalf = isHalfDay(dayName);

    const holidaysForDate = getPublicHolidaysForDate(date);
    const isHoliday = holidaysForDate.length > 0;

    const { startDate, endDate } = state[0];
    const isSelected = isSameDay(startDate, date) || isSameDay(endDate, date);
    const isInRange = isWithinInterval(date, { start: startDate, end: endDate });

    return (
      <div
        className={`flex justify-center items-center w-full h-full 
          ${isDisabled ? 'pointer-events-none text-gray-300' : ''}
          ${isHoliday ? 'text-gray-300' : ''}
          ${isHalf ? 'bg-accent' : ''}
          ${(isSelected || isInRange) && !isDisabled ? 'rounded-full' : ''}
          ${(isSelected || isInRange) && !isHoliday ? 'rounded-full' : ''}
        `}
        style={{
          color: isDisabled ? '#ccc' : (isSelected || isInRange ? 'white' : 'black'),
          background: isDisabled
            ? '#f5f5f5'
            : isHoliday
              ? '#50C878' // Gold color for public holidays
              : isHalf
                ? '#8798ec'
                : 'inherit',
        }}
      >
        {format(date, 'd')}
      </div>
    );
  }

  const showPublicHolidayLegend = publicHolidays.length > 0;
  const showHalfDayLegend = halfDays.length > 0;
  const showOffDayLegend = offDays.length > 0;

  return (
    // <div className={"relative w-full rounded-3xl overflow-hidden"}>
    <div className="flex flex-col items-center justify-center w-full relative rounded-3xl overflow-hidden bg-white">
      {/* Legend Section */}
      <div className="flex justify-center space-x-4 pt-4 bg-white">
        {/* Public Holiday Legend */}
        {showPublicHolidayLegend && (
          <div className="flex items-center space-x-2">
            <span className={`w-3 h-3 bg-[#50C878] rounded-full`}></span>
            <span className="text-sm text-gray-700">Public Holiday</span>
          </div>
        )}

        {/* Half Day Legend */}
        {showHalfDayLegend && (
          <div className="flex items-center space-x-2">
            <span className={`w-3 h-3 bg-[#8798ec] rounded-full`}></span>
            <span className="text-sm text-gray-700">Half Day</span>
          </div>
        )}

        {/* Off Day Legend */}
        {showOffDayLegend && (
          <div className="flex items-center space-x-2">
            <span className={`w-3 h-3 bg-[#ccc] rounded-full`}></span>
            <span className="text-sm text-gray-700">Off Day</span>
          </div>
        )}
      </div>
      <DateRangePicker
        onChange={handleSelect}
        showSelectionPreview={false}
        moveRangeOnFirstSelection={false}
        months={1}
        ranges={state}
        direction="horizontal"
        showDateDisplay={false}
        rangeColors={['#546de5']}
        className="rdrCalendarWrapper max-w-none w-full"
        staticRanges={[]} // Disable predefined ranges when not interactive
        inputRanges={[]} // Disable input ranges when not interactive
        dayContentRenderer={renderDayContent}
        style={{ width: "100%" }}
      />
    </div>
  );
};

export default CreateRequestCalendar;
