import React from 'react'
import ClockInOutButton from './clockedInoutComponent'
import WaveGraph from './hoursWorkedChart';
import { BsCalendarEvent } from 'react-icons/bs';
import { jsPDF } from 'jspdf';
import Link from 'next/link';
import { UseGetWokingHours } from '../../../hooks/query/getWorkingHours';
import { UseCurrentUserUpcomingLeaves } from '../../../hooks/query/getCurrentUserUpcomingLeaves';
import { UseGetCompanyHandbooks } from '../../../hooks/query/admin/getCompanyHandbooks';
import TodoList from '../TodoList';

export default function StaffDashboard({ role, id, pendingLeaveApprovals, isLoading }) {
  const { data } = UseGetWokingHours();

  const { data: companyHandbooks, } = UseGetCompanyHandbooks();
  const { data: currentUserUpcomingLeaves = [] } = UseCurrentUserUpcomingLeaves();
  const date = new Date()

  const currentHandbook = companyHandbooks?.find(handbook => handbook.is_current === 1);

  const currentHandbookPath = currentHandbook?.file_path;
  const currentHandbookUpdatedAt = currentHandbook?.updated_at ? new Date(currentHandbook.updated_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }) : '';

  const formattedDate = date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });

  const upcomingEvents = [
    { title: "Meeting with Client", time: "4 AM", date: "5th May, 2024" },
    { title: "Project Deadline", time: "3 PM", date: "7th May, 2024" },
    // Add more upcoming events as needed
  ];

  // Dummy past events array
  const pastEvents = [
    { title: "Team Lunch", time: "4 PM", date: "30th April, 2024" },
    { title: "Pioneers of Productivity", time: "9 AM", date: "25th April, 2024" },
    { title: "Pioneers of Productivity", time: "9 AM", date: "25th April, 2024" },
    // Add more past events as needed
  ];

  function parseDateFromDdMmYy(dateString) {
    const [day, month, year] = dateString.split('-');
    return new Date(`${year}-${month}-${day}`);
  }

  function formatDateToDdMmYy(date) {
    const currDate = parseDateFromDdMmYy(date);

    // Extract day, month, and year components from the date object
    const day = String(currDate.getDate()).padStart(2, '0');
    const month = String(currDate.getMonth() + 1).padStart(2, '0'); // January is 0, so we add 1
    const year = String(currDate.getFullYear());

    // Concatenate components with hyphens to form the formatted date string
    return `${day}-${month}-${year}`;
  }
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFont('Arial', 'normal');
    doc.text('Company Policy', 20, 30);
    doc.text('Updated: ' + currentHandbookUpdatedAt, 20, 40);
    doc.text('You can view the full policy at:', 20, 50);
    doc.text(currentHandbookPath, 20, 60);
    doc.save('company-policy.pdf');
  };

  return (
    <div className='flex-1 min-h-screen px-2 sm:px-5 text-default_text'>
      <div className='grid gap-4 grid-cols-1 sm:grid-cols-2'>
        <ClockInOutButton />
        <WaveGraph data={data} />
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 my-3 gap-3'>
        <div className='p-3 bg-white rounded-lg border flex flex-col sm:flex-row justify-between text-primary'>
          <p className='font-semibold text-sm sm:text-base'>
            Upcoming Performance Review | March
          </p>
          <p className='text-sm sm:text-base mt-2 sm:mt-0'>
            Due Date:<span className='font-semibold'> {formattedDate}
            </span>
          </p>
        </div>
        <div>
          <div className='p-3 text-white rounded-lg border text-sm flex flex-col sm:flex-row justify-between bg-primary col-span-1'>
            {currentHandbook ? (
              <>
                <div className="text-white cursor-pointer">
                 Company Policy
                </div>
                <p className='mt-2 sm:mt-0'>{`Updated: ${currentHandbookUpdatedAt}`}</p>
              </>
            ) : (
              <p className="text-white">No company policy</p>
            )}
          </div>
        </div>
      </div>

      <div className={`mt-6 ${role !== 'staff' ? 'grid grid-cols-1 lg:grid-cols-6 gap-4' : ''}`}>
        {/* Training & Development */}
        {role !== 'staff' &&
          <div className='lg:col-span-3'>
            <div className="flex-grow">
              <TodoList pendingApprovals={pendingLeaveApprovals} maxLeavesToShow={7} height={'310px'} isLoading={isLoading} role={role} activeUserId={id}/>
            </div>
          </div>
        }

        <div className='lg:col-span-3'>
          {/* Leave management */}
          <div className="bg-white p-3 rounded-xl border px-3" style={{ height: 'auto', minHeight: '430px' }}>
            <div className='flex flex-col sm:flex-row justify-between'>
              <h3 className='text-default_text text-lg'>Leave Management</h3>
              <Link href={`/leave_management/overview`} className={`flex underline justify-start sm:justify-end cursor-pointer text-primary mt-2 sm:mt-0`}>
                View All
              </Link>
            </div>

            <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between mt-2'>
              {currentUserUpcomingLeaves?.length > 0 &&
                <div className='flex space-x-2'>
                  <h2 className='font-semibold text-default_text text-sm sm:text-base'>Upcoming Approved Leaves</h2>
                  <p className='text-white text-xs px-2 py-1 rounded-full bg-primary'>
                    {currentUserUpcomingLeaves?.length}
                  </p>
                </div>
              }
              <div className='mt-2 sm:mt-0'>
                <BsCalendarEvent className='h-8 w-8 sm:h-12 sm:w-12 text-primary' />
              </div>
            </div>

            <div className="my-7">
              {currentUserUpcomingLeaves && currentUserUpcomingLeaves.length > 0
                ? currentUserUpcomingLeaves.slice(0, 4)?.map((leave, index) => (
                  <div key={index} className='bg-gray-100 rounded-xl px-3 py-2 my-2'>
                    <h2 className='font-semibold text-text-default_text capitalize text-sm sm:text-base'> {leave.leave_type} Leave</h2>
                    <p className='text-sm sm:text-base'>
                      {formatDateToDdMmYy(leave.start_date)} to {formatDateToDdMmYy(leave.end_date)}
                    </p>
                  </div>
                ))
                :
                <div className='flex justify-center items-center h-40'>
                  No Upcoming leave!
                </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
