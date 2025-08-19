import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { ArrowLeft, Edit2 } from 'lucide-react';
import { usePastAttendance } from '../../../hooks/query/getPastAttendance';
import { useAttendanceStats } from '../../../hooks/query/getAttendenceStats';
import DataLoader from '../../ui/dataLoader';
import { useRouter } from 'next/router';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import ViewLocationAttendanceModal from './ViewLocationSettingModal';
import * as XLSX from 'xlsx';
import { FaInfoCircle } from 'react-icons/fa';
import { LiaFileExcel, LiaFilePdf } from 'react-icons/lia';
import { FaRegCalendarAlt } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { formatDateToDdMmYy } from '../../../utils/functions';
import { useGetMemberDetail } from '../../../hooks/query/team_lead/team/getMemberDetail';
import { UseGetProfile } from '../../../hooks/query/getProfile';
import { UseGetUserShiftList } from '../../../hooks/query/getIndividualUserShifts';
import EditShiftModal from '../../admin/UserManagement/locations/updateShift';

const months = [
  { label: 'January', value: 1 },
  { label: 'February', value: 2 },
  { label: 'March', value: 3 },
  { label: 'April', value: 4 },
  { label: 'May', value: 5 },
  { label: 'June', value: 6 },
  { label: 'July', value: 7 },
  { label: 'August', value: 8 },
  { label: 'September', value: 9 },
  { label: 'October', value: 10 },
  { label: 'November', value: 11 },
  { label: 'December', value: 12 },
];

export const getStatusClasses = (status) => {
  // Normalize the status string: trim extra spaces and convert to lowercase
  const normalizedStatus = status?.trim().toLowerCase();

  const statuses = {
    absent: 'bg-red-100 text-darkred border-red-400 px-6 text-sm',
    present: 'bg-green-100 text-green-500 border-green-400 px-6 text-sm',
    late: 'bg-yellow-100 text-yellow-700 border-yellow-300 px-8 text-sm',
    leave: 'bg-orange-100 text-orange-400 border-orange-300 px-7 text-sm',
    'half leave': 'bg-orange-100 text-orange-400 border-orange-300 px-3 text-sm whitespace-nowrap',
    'day off': 'bg-blue-100 text-blue-400 border-blue-300 px-5  text-sm whitespace-nowrap',
    default: 'bg-gray-100 text-gray-500 border-gray-300 px-2 text-xs',
  };

  return statuses[normalizedStatus] || statuses.default;
};

const AttendanceComponent = ({ role, id, isShowBackButton }) => {

  const [leaveStatMonth, setLeaveStathMonth] = useState(new Date().getMonth() + 1); // Default to January


  const router = useRouter();
  const { data: user, isLoadingUser } = UseGetProfile(id)
  const { data: userData, isLoadingUserData } = useGetMemberDetail(id);
  const { data: userShiftList, isLoading: isShiftLoading } = UseGetUserShiftList(id);
  const [userShiftModalOpen, setUserShiftModalOpen] = useState(false);

  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [disableFilter, setDisableFilter] = useState(false);
  const [dateError, setDateError] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: pastAttendanceData, isLoading, refetch } = usePastAttendance(
    id,
    startDate ? formatDateToDdMmYy(startDate) : null,
    endDate ? formatDateToDdMmYy(endDate) : null
  );
  const { data: attendanceStats, isLoadingAttendace, refetch: AttendanceStat } = useAttendanceStats(id, leaveStatMonth);



  useEffect(() => {
    AttendanceStat()
  }, [leaveStatMonth])

  const handleStartDateChange = (date) => {
    if (endDate && date > endDate) {
      setDateError('Start date cannot be after end date.');
    } else {
      setStartDate(date);
      setDateError('');
      
    }
  };

  const handleEndDateChange = (date) => {
    if (startDate && date < startDate) {
      setDateError('End date cannot be before start date.');
    } else {
      setEndDate(date);
      setDateError('');
      
    }
  };

  const handleDisableFilterChange = () => {
    setDisableFilter(!disableFilter);
    setStartDate(null);
    setEndDate(null);
    refetch(id)
  };


  const downloadPdf = () => {
    const doc = new jsPDF();
    autoTable(doc, {
      head: [['Date', 'Time In', 'Time Out', 'Status', 'Late Time', 'Late Reason', 'Entered By']],
      body: filteredAttendanceData.map(item => [item.date, item.time_in, item.time_out, item.status, item.late_mins, item.late_reason, item.user_name]),
    });
    doc.save('attendance.pdf');
  };

  const downloadExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredAttendanceData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance');
    XLSX.writeFile(workbook, 'attendance.xlsx');
  };

  const parseDate = (dateString) => {
    const [day, month, year] = dateString.split('-');
    return new Date(year, month - 1, day); // month is 0-indexed
  };

  const sortedAttendanceData = pastAttendanceData?.slice().sort((a, b) => {
    const dateA = parseDate(a.date);
    const dateB = parseDate(b.date);
    return dateB - dateA;
  });

  const filteredAttendanceData = disableFilter
    ? sortedAttendanceData
    : sortedAttendanceData?.filter(item => {
      const itemDate = parseDate(item.date);
      return (
        (!startDate || itemDate >= startDate) &&
        (!endDate || itemDate <= endDate) &&
        (selectedStatus === 'all' || item.status === selectedStatus)
      );
    });

  const handleSubmit = () => {
    // Call the API with the selected dates or current date if not selected
    const currentStartDate = startDate || new Date();
    const currentEndDate = endDate || new Date();
    refetch(formatDateToDdMmYy(currentStartDate), formatDateToDdMmYy(currentEndDate));
  };

  const pickTimings = (arr = []) =>
    arr.map(({ day, start_time, end_time, day_type }) => ({
      day,
      start_time: start_time?.slice(0, 5),
      end_time: end_time?.slice(0, 5),
      day_type,
    }));

  const defaultLocationShift = userData
    ? {
      id: userData.shift_id || 0,
      shift_name: userData.shift?.shift_name || "Default Location Shift",
      first_day_of_week: userData.location?.first_day_of_week || "Monday",
      contract_hours: userData.location?.contract_hours || 0,
      is_default: 1,
      timings: pickTimings(userData.location_settings || userData.shift_settings),
      location: { contract_hours: userData.location?.contract_hours || 0 },
    }
    : null;

  const shiftForModal =
    userShiftList && userShiftList?.timings?.length > 0
      ? userShiftList
      : defaultLocationShift;

  return (
    <div className='text-default_text min-h-screen'>
      <ViewLocationAttendanceModal
        user={user}
        isOpen={isModalOpen}
        isLoading={isLoadingUser}
        onClose={() => setIsModalOpen(false)}
      />

      {isShowBackButton && id && (
        <button
          onClick={() => {
            router.push(role === 'team_lead' ? `/${role}/team/${id}/detail-page` : `/workforce/people/${id}/detail-page`);
          }}
          type='button'
          className='flex space-x-2 items-center px-2 py-1 text-white bg-primary rounded-xl mx-5 mb-3'
        >
          <ArrowLeft className='text-white h-5 w-5' />
          <span>Back</span>
        </button>
      )}
      <div className="flex justify-end mb-5">
        {
          role === 'HR' && (
            <button
              onClick={() => setUserShiftModalOpen(true)}
              className="bg-primary text-white px-4 py-2 mr-2 rounded flex items-center justify-center"
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Shift
            </button>
          )
        }
        <button
          className="bg-primary text-white px-4 py-2 rounded"
          onClick={() => setIsModalOpen(true)}
        >
          View Location Settings
        </button>
      </div>

     
      {isLoading || isLoadingAttendace || isLoadingUserData ? (
        <DataLoader />
      ) : (
        filteredAttendanceData && attendanceStats && userData && (
          <div className='px-5'>
            <div className="grid grid-cols-4 gap-4">
              <div className="border rounded-lg p-4 capitalize hover:border-primary hover:shadow hover:shadow-primary">
                <p className="font-semibold">Full Name</p>
                <p>{userData.name}</p>
              </div>

              <div className="border rounded-lg p-4 capitalize hover:border-primary hover:shadow hover:shadow-primary">
                <p className="font-semibold">Employee ID</p>
                <p>{userData?.employee_id}</p>
              </div>

              <div className="border rounded-lg p-4 capitalize hover:border-primary hover:shadow hover:shadow-primary">
                <p className="font-semibold">Joining Date</p>
                <p>{userData?.joining_date}</p>
              </div>

              <div className="border rounded-lg p-4  capitalize hover:border-primary hover:shadow hover:shadow-primary">
                <p className="font-semibold">Department</p>
                <p>{userData.department?.departments_name}</p>
              </div>
            </div>
            <div className='rounded-lg shadow-sm border-primary my-3 shadow-primary border p-4'>
              <div className='flex justify-end '>
                <div className='px-3'>
                  <div className='text-right flex items-center space-x-3'>
                    <select
                      id="month"
                      value={leaveStatMonth}
                      onChange={(e) => setLeaveStathMonth(Number(e.target.value))}
                      className="border py-2 rounded-lg p-1"
                    >
                      <option value="" disabled>
                        Select Month
                      </option>
                      {months.map((month) => (
                        <option key={month.value} value={month.value}>
                          {month.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-4 gap-4 my-4 ">

                <div className="border-r-2">
                  <div className="flex flex-col items-center">
                    <Image src='/assets/working_hour.svg' className="h-12 w-12" height={200} width={400} alt="Working Hour Icon" />
                    <p className="font-semibold mt-2 text-lg">{attendanceStats.average_working_hours}</p>
                    <p className='text-sm'>Average Working Hours <span className='text-xs'> (monthly)</span> </p>
                  </div>
                </div>

                <div className="border-r-2">
                  <div className="flex flex-col items-center">
                    <Image src='/assets/clock.svg' className="h-12 w-12" height={200} width={400} alt="Clock Icon" />
                    <p className="font-semibold mt-2 text-lg">{attendanceStats.average_clock_in}</p>
                    <p className='text-sm'>Average Time In <span className='text-xs'> (monthly)</span></p>
                  </div>
                </div>

                <div className="border-r-2">
                  <div className="flex flex-col items-center">
                    <Image src='/assets/pause.svg' className="h-12 w-12" height={200} width={400} alt="Pause Icon" />
                    <p className="font-semibold mt-2 text-lg">{attendanceStats.average_clock_out}</p>
                    <p className='text-sm'>Average Time Out <span className='text-xs'> (monthly)</span></p>
                  </div>
                </div>
                <div className="border-r-2">
                  <div className="flex flex-col items-center">
                    <Image src='/assets/pause.svg' className="h-12 w-12" height={200} width={400} alt="Pause Icon" />
                    <p className="font-semibold mt-2 text-lg">{attendanceStats?.average_late_time}</p>
                    <p className='text-sm'>Average Late  <span className='text-xs'> (monthly)</span></p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center my-5">
              <h2 className='text-lg'>Attendances Record</h2>
              <div>
                <div className="space-x-2 flex items-center">


                  <div className="py-1 px-4 border rounded-lg flex items-center gap-2 z-30">
                    <FaRegCalendarAlt />
                    <DatePicker
                      selected={startDate}
                      onChange={handleStartDateChange}
                      selectsStart
                      startDate={startDate}
                      endDate={endDate}
                      dateFormat="dd-MM-yyyy"
                      className="w-24 disabled:bg-gray-100"
                      maxDate={new Date()}
                      placeholderText="Start Date"
                      disabled={disableFilter}
                    />
                    <DatePicker
                      selected={endDate}
                      onChange={handleEndDateChange}
                      selectsEnd
                      startDate={startDate}
                      endDate={endDate}
                      dateFormat="dd-MM-yyyy"
                      className="w-24 disabled:bg-gray-100"
                      minDate={startDate}
                      maxDate={new Date()}
                      placeholderText="End Date"
                      disabled={disableFilter}
                    />
                    <button
                      onClick={handleSubmit}
                      className='px-4 py-1 bg-primary text-white rounded-lg'
                    >
                      Submit
                    </button>
                    <div className="flex items-center gap-2">
                    <input
                    type="checkbox"
                    id="disableFilter"
                    checked={disableFilter}
                    onChange={handleDisableFilterChange}
                  />
                      <label htmlFor="disableFilter">List All</label>
                    </div>
                  </div>

                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="py-2 px-4 border rounded-lg z-30"
                  >
                    <option value="all">All Status</option>
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                    <option value="Leave">Leave</option>
                    <option value="Late">Late</option>
                    <option value="Day Off">Day Off</option>
                  </select>

                  <button
                    onClick={downloadPdf}
                    className='px-4 py-2 flex items-center text-default_text border bg-white rounded-lg'
                  >
                    Export PDF <LiaFilePdf className='h-5 w-5' />
                  </button>
                  <button
                    onClick={downloadExcel}
                    className='px-4 py-2 bg-white border text-default_text flex items-center rounded-lg'
                  >
                    Export Excel <LiaFileExcel className='h-5 w-5' />
                  </button>
                </div>
                {dateError && <p className="text-darkred text-xs mt-2">{dateError}</p>}
              </div>
            </div>

            <div className="mb-3 text-sm text-gray-600 font-medium">
               Displaying: {filteredAttendanceData ? filteredAttendanceData.length : 0} record(s)
            </div>

            <div className='border rounded-lg p-3 overflow-y-auto' style={{ height: "550px" }}>
              <table className="w-full table-auto border-collapse">
                <thead className="border-b">
                  <tr className=" border-gray-200 border-b">
                    <th className="text-center px-4 py-3">Date</th>
                    <th className="text-center px-4 py-3">Time In</th>
                    <th className="text-center px-4 py-3">Time Out</th>
                    <th className="text-center px-4 py-3">Status </th>

                    <th className="text-center px-4 py-3">Late Info</th>


                    <th className="text-center px-4 py-3">Entered By</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAttendanceData.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                      <td className="text-center px-4 py-3">{item.date}</td>
                      <td className="text-center px-4 py-3">{item.time_in}</td>
                      <td className="text-center px-4 py-3">{item.time_out}</td>
                      <td className="text-center  py-3">

                        <span
                          className={`py-2 rounded-md capitalize ${getStatusClasses(item.status)
                            }`}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td>

                        <div className=" text-sm text-center text-yellow-700 flex items-center justify-center space-x-2">

                          <span>{item.late_mins}</span>
                          {item.late_reason && (
                            <div className="relative group">
                              <FaInfoCircle className="h-4 w-4 cursor-pointer text-yellow-700" />
                              <div
                                className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover:block bg-yellow-100 text-default_text text-xs p-2 rounded shadow-lg"
                                style={{ whiteSpace: 'nowrap' }}
                              >
                                reason: {item.late_reason}
                              </div>
                            </div>
                          )}
                        </div>

                      </td>


                      <td className="text-center px-4 py-3">{item.user_name}</td>
                    </tr>
                  ))}
                </tbody>

              </table>
              {filteredAttendanceData.length === 0 && (
                <p className="text-center text-gray-500 py-4">No records found</p>
              )}
            </div>
          </div>
        )
      )}

      {userShiftModalOpen && (
        <EditShiftModal
          id={id}
          shiftData={shiftForModal}
          isIndividual={true}
          onClose={() => setUserShiftModalOpen(false)}
        />
      )}
    </div>
  );
};

export default AttendanceComponent;

