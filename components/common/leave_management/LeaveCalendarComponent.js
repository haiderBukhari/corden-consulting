import LeaveCalendar from './LeaveCalendar';

function LeaveCalendarComponent({member}) {
  return (
    <div className="flex min-h-screen">
      <div className="flex-1 overflow-y-auto">
        <div className="w-full mx-auto px-3">
          <LeaveCalendar member={member}/>
        </div>
      </div>
    </div>
  );
}

export default LeaveCalendarComponent;