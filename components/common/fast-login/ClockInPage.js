import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { CheckCircle, ClockIcon, Hourglass } from 'lucide-react';
import { useRouter } from 'next/router';
import { ArrowLeft } from 'lucide-react';
import { parseTime } from '../../../components/StaffDashboard/dashboard/clockProvider';
import { calculateWorkingHours, formatDateToAmPm, formatDateToDdMmYy } from '../../../utils/functions';
import { useGetFastLoginDetails } from '../../../hooks/query/getFastLoginDetail';
import DataLoader from '../../../components/ui/dataLoader';
import UseFastClockedIn from '../../../hooks/mutations/fast-clockin';
import UseFastClockedOut from '../../../hooks/mutations/fast-clockout';
import ClockInOutModal from './ClockInOutModal';

export default function ClockInPage({ id, setClockInPage, setId, handleBackFastLogin }) {
	const [currentTime, setCurrentTime] = useState(new Date());
	const router = useRouter();
	const { data, isLoading, refetch } = useGetFastLoginDetails(id);
	const [employeeData, setEmployeeData] = useState(null);
	const [isClockedIn, setIsClockedIn] = useState(false);
	const [timeElapsed, setTimeElapsed] = useState(0);
	const [startTime, setStartTime] = useState(null);
	const [showSuccessMessage, setShowSuccessMessage] = useState(false);
	const [redirectCountdown, setRedirectCountdown] = useState(3);
	const [showClockOutSuccess, setShowClockOutSuccess] = useState(false);
	const [isClockInDisabled, setIsClockInDisabled] = useState(false);
	const [showModal, setShowModal] = useState(false);

	const date = formatDateToDdMmYy(new Date());
	const clockIn = UseFastClockedIn();
	const clockOut = UseFastClockedOut();

	useEffect(() => {
		if (id) {
			// Reset state to handle new ID
			setEmployeeData(null);
			setIsClockedIn(false);
			setStartTime(null);
			refetch(); // Fetch new data
		}
	}, [id, refetch]);

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentTime(new Date());
		}, 1000);
		return () => clearInterval(timer);
	}, []);

	useEffect(() => {
		if (id) {
			setEmployeeData(null); // Clear the current employee data
			refetch(); // Fetch new data
		}
	}, [id, refetch]);

	useEffect(() => {
		if (data) {
			setEmployeeData(data);
		}
	}, [data]);

	useEffect(() => {
		if (employeeData && employeeData.attendance) {
			const { clockIn_id, start_time, status } = employeeData.attendance;

			if (status === 'check_in') {
				const start = parseTime(start_time);

				setStartTime(start);
				setIsClockedIn(true);

				localStorage.setItem('clockId', clockIn_id);
			} else {
				const start = parseTime(start_time);
				setStartTime(start);
				setIsClockedIn(false);
			}
		} else {
			setStartTime(null);
			setIsClockedIn(false);
		}
	}, [employeeData]);

	useEffect(() => {
		if (isClockedIn && startTime) {
			const intervalId = setInterval(() => {
				const now = new Date();
				setTimeElapsed(Math.floor((now - startTime) / 1000));
			}, 1000);

			return () => clearInterval(intervalId);
		}
	}, [isClockedIn, startTime]);

	const handleClockIn = () => {
		const start = new Date();
		clockIn.mutate({ date, start_time: formatDateToAmPm(start), employee_id: id }, {
			onSuccess: () => {
				setStartTime(start);
				setIsClockedIn(true);
				setShowSuccessMessage(true);
				setShowModal(true);

				let countdown = 3;
				const interval = setInterval(() => {
					setRedirectCountdown(countdown);
					if (countdown <= 0) {
						clearInterval(interval);
						setClockInPage(false);
					}
					countdown--;
				}, 1000);

				localStorage.setItem('startTime', start.toISOString());
			}
		});
	};

	const handleClockOut = () => {
		const end_time = new Date();
		const attendance_id = localStorage.getItem('clockId');
		const workingHours = calculateWorkingHours(startTime, end_time);

		const data = {
			attendence_id: attendance_id,
			employee_id: id,
			end_time: formatDateToAmPm(end_time),
			date,
			working_hour: workingHours,
		};

		clockOut.mutate(data, {
			onSuccess: () => {
				setShowClockOutSuccess(true);
				setShowModal(true);
				setIsClockedIn(false);
				setStartTime(null);
				setIsClockInDisabled(true);

				let countdown = 3;
				const interval = setInterval(() => {
					setRedirectCountdown(countdown);
					if (countdown <= 0) {
						clearInterval(interval);
						setClockInPage(false);
						setEmployeeData(null);
						setId(null);
					}
					countdown--;
				}, 1000);
			}
		});
	};

	const formatTime = (date) => {
		return date ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : '00:00';
	};

	const formatElapsedTime = (seconds) => {
		const hrs = Math.floor(seconds / 3600);
		const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
		return `${hrs}:${mins}`;
	};

	const handleBack = () => {
		setClockInPage(false);
		setEmployeeData(null); // Clear the state
		setId(null);
		handleBackFastLogin();
	};

	return (
		<>
			{!isLoading && employeeData ? (
				<div className="min-h-screen bg-[#F7F7F7] flex md:justify-center items-center text-default_text">
					<div className="bg-white w-full m-5 md:m-4 md:max-w-2xl lg:max-w-4xl rounded-3xl shadow-lg shadow-accent">
						<div className="md:my-10 text-default_text">
							<button onClick={handleBack} type='button' className='flex space-x-2 items-center px-2 py-1 text-default_text rounded-xl ml-3'>
								<ArrowLeft className='text-default_text h-5 w-5' />
								<span>Back</span>
							</button>
							<div>
								<div className="flex flex-shrink-0 justify-center px-4">
									<Image src="https://www.cordenconsulting.com/wp-content/uploads/2025/02/CC-logo.png" height={40000} width={40000} alt="logo" className="py-4 lg:p-0 w-48 lg:w-56" priority="" />
								</div>
								<p className='text-center text-base lg:text-lg my-4'>
									Welcome <span className='font-semibold'>{employeeData?.name}</span>
								</p>
							</div>
						</div>
						{employeeData && (
							<div className="grid grid-cols-4 gap-2 p-4">
								<div className="border rounded-lg p-4 capitalize hover:border-primary hover:shadow hover:shadow-primary">
									<p className="font-semibold">{employeeData?.name}</p>
									<p>{employeeData.designation}</p>
								</div>
								<div className="border rounded-lg p-4 capitalize hover:border-primary hover:shadow hover:shadow-primary">
									<p className="font-semibold">Employee ID</p>
									<p>{employeeData.employee_id}</p>
								</div>
								<div className="border rounded-lg p-4 capitalize hover:border-primary hover:shadow hover:shadow-primary">
									<p className="font-semibold">Joining Date</p>
									<p>{employeeData.joining_date}</p>
								</div>
								<div className="border rounded-lg p-4 capitalize hover:border-primary hover:shadow hover:shadow-primary">
									<p className="font-semibold">Department</p>
									<p>{employeeData.department?.departments_name}</p>
								</div>
							</div>
						)}

						<div className="grid grid-cols-5 p-4 gap-4">
							<div className="border rounded-lg p-6 font-semibold text-default_text text-base hover:border-primary hover:shadow col-span-2 hover:shadow-primary flex flex-col items-center">
								<div className='bg-accent p-6 rounded-full mb-4'>
									<ClockIcon className="text-5xl text-primary h-9 w-9" />
								</div>
								<p>{formatTime(currentTime)}</p>
								<p>{currentTime.toLocaleString('default', { weekday: 'long' })}</p>
								<p>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
								<p className='text-xs text-center mt-3 font-light'>Current Time</p>
							</div>
							<div className={`border rounded-lg p-6  hover:border-primary hover:shadow col-span-3 hover:shadow-primary flex flex-col items-center ${isClockedIn && !showClockOutSuccess && !showSuccessMessage ? 'bg-primary text-white' : 'bg-white text-default_text'}`}>
								{showClockOutSuccess ? (
									<>
										<div className='flex justify-center'>
											<div className='bg-green-100 p-6 rounded-full'>
												<CheckCircle className="text-5xl text-green-500 h-9 w-9" />
											</div>
										</div>
										<div className="text-center mt-6">
											<p className="font-medium text-xl">Clocked out!</p>
											{/* <p className="text-sm mt-2">This page will return to the login screen in {redirectCountdown} {redirectCountdown === 1 ? 'second' : 'seconds'}</p> */}
										</div>
									</>
								) : showSuccessMessage ? (
									<>
										<div className='flex justify-center'>
											<div className='bg-green-100 p-6 rounded-full'>
												<CheckCircle className="text-5xl text-green-500 h-9 w-9" />
											</div>
										</div>
										<div className="text-center mt-6">
											<p className="font-medium text-xl">Clocked in!</p>
											{/* <p className="text-sm mt-2">This page will return to the login screen in {redirectCountdown} {redirectCountdown === 1 ? 'second' : 'seconds'}</p> */}
										</div>
									</>
								) : (
									<>
										<div className={` p-6 rounded-full ${isClockedIn ? 'bg-[#AEACFF] ' : 'bg-orange-100 text-orange-500'} shadow-md`}>
											<Hourglass className="text-5xl  h-9 w-9" />
										</div>
										{isClockedIn ? (
											<div className='flex items-center mt-3'>
												<div className='text-sm mr-7 mt-3'>
													<p className='text-green-300 text-sm'>{formatTime(startTime)}</p>
													<p>Start Time</p>
												</div>
												<div className='flex flex-col items-center'>
													<p className={`font-medium text-green-400 text-3xl`}>{formatElapsedTime(timeElapsed)}<span className='text-sm ml-2'>H:MM</span></p>
													<p className='text-sm'>Time Clocked</p>
												</div>
											</div>
										) :
											employeeData?.attendance?.status == 'check_out' ? (
												<div className="flex space-x-4">
													<div className='flex flex-col items-center mt-3'>
														<p className={`font-medium text-gray-400 text-lg`}>{formatTime(startTime)}</p>
														<p className='text-sm'>Start Time</p>
													</div>
													<div className='flex flex-col items-center mt-3'>
														<p className={`font-medium text-gray-400 text-lg`}>{formatTime(parseTime(employeeData?.attendance?.end_time))}</p>
														<p className='text-sm'>End Time</p>
													</div>
												</div>
											)
												:
												<>
													<div className='flex flex-col items-center mt-3'>
														<p className={`font-medium text-gray-400 text-sm`}>00:00</p>
														<p className='text-sm'>Time Clocked</p>
													</div>
												</>
										}
									</>
								)}
								<div className='mt-4 w-full'>
									{isClockedIn ? (
										<div className="p-4">
											{!showModal && (
												<button
													onClick={handleClockOut}
													className="w-full bg-secondary text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-600"
												>
													Clock Out
												</button>
											)}
										</div>
									) : (
										<div className="p-4">
											{!showModal && (
												<button
													onClick={handleClockIn}
													className={`w-full bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600  ${isClockInDisabled || employeeData?.attendance?.status ? 'opacity-50 cursor-not-allowed' : ''}`}
													disabled={isClockInDisabled || employeeData?.attendance?.status}
												>
													Clock In
												</button>
											)}
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			)
				:
				!isLoading && employeeData == 'null' ?
					<div className="min-h-screen bg-[#F7F7F7] flex md:justify-center items-center text-default_text">
						No Employee Found
					</div>
					:
					(
						<div className="min-h-screen bg-[#F7F7F7] flex md:justify-center items-center text-default_text">
							<DataLoader />
						</div>
					)
			}
			{showModal && (
				<ClockInOutModal
					message={showClockOutSuccess ? 'You have successfully clocked out.' : 'You have successfully clocked in.'}
					redirectCountdown={redirectCountdown}
					setShowModal={setShowModal}
				/>
			)}
		</>
	);
}