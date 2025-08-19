import React, { useEffect, useState } from 'react';
import { useClock } from './clockProvider';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { calculateWorkingHours, formatDateToAmPm, formatDateToDdMmYy } from '../../../utils/functions';
import UseClockedIn from '../../../hooks/mutations/clockedIn.js';
import UseClockedOut from '../../../hooks/mutations/clockedOut';
import ClockOutConfirmModal from './ClockOutConfirmModal';
import Link from 'next/link';
import LateClockInModal from './LateClockinModal';
import { UseGetProfile } from '../../../hooks/query/getProfile';
import { errorToaster } from '../../../utils/toaster';

const ClockInOutButton = () => {
  const { clockedIn, handleClick, startTime, endTime, elapsedTime } = useClock();
  const [lateModalVisible, setLateModalVisible] = useState(false);
  const [lateDuration, setLateDuration] = useState(null);
  const [reasonForLate, setReasonForLate] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [leave, setLeave] = useState(false);
  const { data: user, refetch } = UseGetProfile()
  const clockIn = UseClockedIn();
  const clockOut = UseClockedOut();
  const date = formatDateToDdMmYy(new Date());

  // Get current day in string format (e.g., "Monday")
  const currentDay = new Date().toLocaleDateString('en-US', { weekday: 'long' });

  useEffect(() => {
    if (user && user.todayAttendenceStatus === 'Leave') {
     
      setLeave(true);
    } else {
      setLeave(false);
    }
    refetch();
  }, [user, refetch]);



  // Check if the person is late based on location settings
  useEffect(() => {
    const todaySetting = user?.shift_settings?.find(setting => setting.day === currentDay);
    const latePolicy = user?.location?.late_policy;
  
    if (todaySetting && todaySetting.start_time && latePolicy && user.current_time) {
      // Convert today's scheduled start time (HH:mm:ss) and user.current_time (HH:mm:ss) to minutes since start of day
      const [startHour, startMinute] = todaySetting.start_time.split(':').map(Number);
      const scheduledStartMinutes = startHour * 60 + startMinute;
  
      const [currentHour, currentMinute] = user.current_time.split(':').map(Number);
      const currentTimeMinutes = currentHour * 60 + currentMinute;
  
      // Calculate the difference in minutes
      const differenceInMinutes = currentTimeMinutes - scheduledStartMinutes;
  
      // Determine the actual late time after subtracting the late policy
      const actualLateTime = Math.max(0, differenceInMinutes - latePolicy);
  
      // Store the actual late time (if any)
      setLateDuration(actualLateTime); 
    } else {
      setLateDuration(0); 
    }
  }, [currentDay, user]);
  


  
  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };
  
  const handleClockIn = () => {
    // Check if the person is late
    if (lateDuration && lateDuration > 0) {
      setLateModalVisible(true);
    } else {
      // If not late, clock in directly
      const currentTime = formatDateToAmPm(new Date());
      const clockInData = {
        date,
        start_time: currentTime
      };
      clockIn.mutate(clockInData, {
        onSuccess: () => {
          handleClick();
          localStorage.setItem('clockedIn', 'true');
          localStorage.setItem('startTime', new Date().toISOString());

        }
      });
    }
  };

  const handleLateModalSubmit = () => {
    const currentTime = formatDateToAmPm(new Date());

    const clockInData = {
      date,
      start_time: currentTime,
      late_reason: reasonForLate
    };
    if (reasonForLate) {
      clockIn.mutate(clockInData, {
        onSuccess: () => {
          handleClick();
          localStorage.setItem('clockedIn', 'true');
          localStorage.setItem('startTime', new Date().toISOString());

          setLateModalVisible(false);
        }
      });
    } else {
      errorToaster("Reason for Late is Missing")
    }
  };

  const handleClockOut = () => {
    const attendance_id = localStorage.getItem('clockId');
    
    const end_time = formatDateToAmPm(new Date());
    const current_time = new Date();
    const workingHours = calculateWorkingHours(startTime, current_time);
    const data = {
      attendence_id: attendance_id,
      end_time,
      date,
      working_hour: workingHours,
    };

    clockOut.mutate(data, {
      onSuccess: () => {
        handleClick();
        localStorage.setItem('clockedIn', 'false');
        localStorage.setItem('endTime', new Date().toISOString());

        setModalVisible(false);
      }
    });
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };
  

  return (
    <div className={`border-2 border-primary rounded-xl p-3 ${clockedIn ? 'bg-primary text-white' : 'bg-white text-default_text'}`}>
      <div className='flex justify-between'>
        <p className={`text-lg ${clockedIn ? 'text-white' : 'text-default_text'}`}>
          {clockedIn ? 'Clocked In' : leave ? 'On Leave' : 'Clocked Out'}</p>
        <Link href={'/attendance'} className={`flex underline cursor-pointer mt-2 sm:mt-0 ${clockedIn ? 'text-white' : 'text-primary'}`}>
          View All <BsThreeDotsVertical className='m-1 text-gray-500 p-[0.5px] w-4 bg-white rounded-full' />
        </Link>
      </div>
      {leave && !clockedIn && !endTime ?
        <div className='my-8'>
          <div className='flex justify-center'>
            <p className={'text-gray-400 text-3xl py-3'}>On Leave</p>
          </div>
        </div> :
        <div className=' my-4'>
          <div>
            Start Time
            <p className='text-sm'>{startTime ? startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '0:00'}</p>
          </div>
          <div className=' flex flex-col items-center text-xl'>
            {clockedIn ? 'Time Clocked:' : endTime ? 'Last Clock Out' : 'Time Clocked'}
            <div className='flex space-x-2 text-center'>
              <p className={`${clockedIn ? 'text-[#04FA00]' : 'text-gray-300'} text-3xl`}>
                {clockedIn ? formatTime(elapsedTime) : endTime ? endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '0:00'}
              </p>
              {clockedIn && (
                <span className='text-[#04FA00] text-base mt-2'>H:MM</span>
              )}
            </div>
          </div>
        </div>
      }
      <div className='flex items-end justify-between mt-auto'>
        <div>
          <p className='font-semibold'>{new Date().toLocaleDateString('en-US', { weekday: 'long' })}</p>
          <p>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <button
          onClick={clockedIn ? openModal : handleClockIn}
          className={` ${clockedIn ? 'bg-secondary' : 'bg-primary'} rounded-full my-2 px-3 py-1 disabled:bg-gray-400 text-white `}
          disabled={endTime}
        >
          {clockedIn ? 'Clock Out' : 'Clock In'}
        </button>
      </div>

      {/* Clock Out Confirmation Modal */}
      <ClockOutConfirmModal
        modalVisible={modalVisible}
        handleClockOut={handleClockOut}
        item="this shift" // Pass any relevant item detail if needed
        closeModal={closeModal}
      />

      {/* Late Clock-In Modal */}
      {lateModalVisible && (
        <LateClockInModal
          lateDuration={lateDuration}
          reasonForLate={reasonForLate}
          setReasonForLate={setReasonForLate}
          handleSubmit={handleLateModalSubmit}
          handleClose={() => setLateModalVisible(false)}
        />
      )}
    </div>
  );
};

export default ClockInOutButton;
