import React from 'react';
import DataLoader from '../../ui/dataLoader';

const ViewLocationAttendanceModal = ({ user, isOpen, onClose, isLoading }) => {
    if (!isOpen) return null;


    const getYearlyCalendar = (startMonth) => {
        const months = {
            January: 'January to December',
            February: 'February to January',
            March: 'March to February',
            April: 'April to March',
            May: 'May to April',
            June: 'June to May',
            July: 'July to June',
            August: 'August to July',
            September: 'September to August',
            October: 'October to September',
            November: 'November to October',
            December: 'December to November',
        };
        return months[startMonth] || 'Unknown calendar range';
    };
    // Calculate contract hours per month
    const getMonthlyContractHours = (weeklyHours) => {
        return (parseFloat(weeklyHours) * 4.33).toFixed(2); // 4.33 is the average number of weeks per month
    };
    // Function to format time to AM/PM
    const formatTime = (time) => {
        if (!time) return 'Off';
        const [hours, minutes, seconds] = time.split(':');
        const date = new Date();
        date.setHours(hours, minutes, seconds);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };
    console.log("Shift",user)

    return (

        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white rounded-lg p-6 w-3/4 max-w-2xl relative">
                {/* Close Icon */}
                <button
                    className="absolute top-3 right-3 text-gray-500 hover:text-default_text"
                    onClick={onClose}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
                {isLoading ?
                    <DataLoader />
                    :
                    user?.location_settings && user?.shift_settings &&
                    <>
                        <h2 className="text-xl font-semibold mb-4">Location Settings</h2>
                        <div className="grid grid-cols-4 gap-2 mb-4">
                            {/* Location Name */}
                            <div>
                                <p className="font-semibold">Location Name:</p>
                                <p>{user?.location?.name}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Shift Name:</p>
                                <p>{user?.shift?.shift_name}</p>
                            </div>

                            {/* Probation Period */}
                            <div>
                                <p className="font-semibold">Probation Period:</p>
                                <p>{user?.location?.probation_period} months</p>
                            </div>

                            {/* Late Policy */}
                            <div>
                                <p className="font-semibold">Late Policy:</p>
                                <p>{user?.location?.late_policy} minutes allowed</p>
                            </div>
                            <div>
                                <p className="font-semibold">Yearly Calendar:</p>
                                <p>{getYearlyCalendar(user?.location?.yearly_calendar_start)}</p>
                            </div>
                            <div>
                                <p className="font-semibold">Contracted Hours (Monthly):</p>
                                <p>{user.location?.contract_hours} hours</p>
                            </div>
                            <div>
                                <p className="font-semibold">Contracted Hours (Weekly):</p>
                                <p>{(user.location?.contract_hours) / 4} hours</p>
                            </div>
                            <div>
                                <p className="font-semibold">Time Zone</p>
                                <p>{user.location?.time_zone} </p>
                            </div>
                        </div>
<h2 className='font-semibold mb-3'>
    Shift Timmings
</h2>
                        {user?.shift_settings?.length > 0 ?
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr>
                                        <th className="border px-4 py-2">Day</th>
                                        <th className="border px-4 py-2">Start Time</th>
                                        <th className="border px-4 py-2">End Time</th>
                                        <th className="border px-4 py-2">Day Type</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {user?.shift_settings?.map((setting) => (
                                        <tr key={setting.id}>
                                            <td className="border px-4 py-2">{setting.day}</td>
                                            <td className="border px-4 py-2">{formatTime(setting.start_time)}</td>
                                            <td className="border px-4 py-2">{formatTime(setting.end_time)}</td>
                                            <td className="border px-4 py-2">{setting.day_type}</td>
                                        </tr>
                                    ))
                                    }

                                </tbody>
                            </table>
                            :
                            <div>
                                No Office Timimg is Set</div>}
                        <button
                            className="mt-4 bg-primary text-white px-4 py-2 rounded"
                            onClick={onClose}
                        >
                            Close
                        </button>
                    </>
                }
            </div>
        </div>
    );
};

export default ViewLocationAttendanceModal;
