import { createContext, useState, useContext, useEffect } from 'react';
import { UseGetProfile } from '../../../hooks/query/getProfile';

const ClockContext = createContext();

export const parseTime = (timeString) => {
  if (!timeString) return null; // Handle null or undefined values
  
  const [hours, minutes, seconds] = timeString.split(':').map(Number);
  const now = new Date();
  now.setHours(hours, minutes, seconds, 0);
  return now;
};


export const useClock = () => useContext(ClockContext);

export const ClockProvider = ({ children }) => {
  const [clockedIn, setClockedIn] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const { data: user, refetch } = UseGetProfile();
  const [TimeZone, setTimeZone] = useState(user?.time_zone);

  useEffect(() => {
      if (user?.time_zone) {
        setTimeZone(user.time_zone);
      }
  }, [user]);


  useEffect(() => {
    if (user && user?.attendance) {
      const { clockIn_id, start_time, status, end_time } = user.attendance;

      if (status === 'check_in') {
        const start = parseTime(start_time);
        setStartTime(start);
        setClockedIn(true);
        localStorage.setItem('clockedIn', true);
        localStorage.setItem('startTime', start.toString());
        localStorage.setItem('clockId', clockIn_id);
      }

      else {
        console.log("start",start_time)
        const start = parseTime(start_time)
        setStartTime(start);
        const end = parseTime(end_time)
        setEndTime(end)
        localStorage.setItem('endTime', end);
      }
    }

    else {
      localStorage.setItem('clockedIn', false);
      setStartTime(null)
      setEndTime(null)
    }
  }, [user]);

  useEffect(() => {
    if (clockedIn && startTime) {
      const intervalId = setInterval(() => {
        // Get the current time in the user's timezone
        const userTime = new Date(
          new Date().toLocaleString('en-US', {
            timeZone: TimeZone,
          })
        );
  
        // Calculate elapsed time in milliseconds
        const elapsed = userTime - startTime;
       
        setElapsedTime(elapsed);
      }, 1000);
  
      return () => clearInterval(intervalId);
    }
  }, [clockedIn, startTime, TimeZone]);
  

  const handleClick = () => {
    if (clockedIn) {
      const userTime = new Date(
        new Date().toLocaleString('en-US', {
          timeZone: TimeZone,
        })
      );
      setEndTime(userTime);
      setClockedIn(false);
      localStorage.removeItem('clockedIn');
      localStorage.removeItem('startTime');

    } else {
      const start = new Date(
        new Date().toLocaleString('en-US', {
          timeZone: TimeZone,
        })
      );
      setStartTime(start);
      setEndTime(null);
      setElapsedTime(0);
      setClockedIn(true);
      localStorage.setItem('clockedIn', true);
      localStorage.setItem('startTime', start.toString());
    }
  };
  
  const resetState = () => {
    setClockedIn(false);
    setStartTime(null);
    setEndTime(null);
    setElapsedTime(0);
  };

  return (
    <ClockContext.Provider value={{ clockedIn, handleClick, startTime, endTime, elapsedTime, resetState, setClockedIn, setEndTime, refetch, user }}>
      {children}
    </ClockContext.Provider>
  );
};
