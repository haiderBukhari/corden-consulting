import Link from 'next/link';

function CurrentTeamLeaves({ allMembersStats, height, isBorder, role }) {

  return (
    <div className={`w-full bg-white p-4 items-center ${isBorder ? isBorder : null} ${height ? height : null}`}>
      {
        role !== "HR" &&
        <div className="flex justify-between items-center mb-4">
          <span className="flex items-center">
            <span className="text-base font-semibold text-gray-700 mr-2">Attendance</span>
          </span>
          <div className="p-1 text-primary underline text-sm">
            <Link href={role === 'team_lead' ? `/${role}/team/attendance` : (role === 'admin' ? `/${role}/attendance` : `/workforce/attendance`)}>
              View All
            </Link>
          </div>
        </div>
      }
      <div className="flex justify-between items-center text-center w-full">
        <div className="flex-1 flex flex-col justify-center">
          <p className="text-base text-gray-700 mb-2">Present</p>
          <p className="text-2xl font-semibold text-green-500">{allMembersStats.totalPresent || 0}</p>
        </div>
        <div className="flex-1 flex flex-col justify-center border-l border-r border-gray-200">
          <p className="text-base text-gray-700 mb-2">Leave</p>
          <p className="text-2xl font-semibold text-orange-500">{allMembersStats.totalOnLeave || 0}</p>
        </div>
        <div className="flex-1 flex flex-col justify-center">
          <p className="text-base text-gray-700 mb-2">Absent</p>
          <p className="text-2xl font-semibold text-darkred">{allMembersStats.totalAbsent || 0}</p>
        </div>
      </div>
    </div>
  );
};

export default CurrentTeamLeaves;
