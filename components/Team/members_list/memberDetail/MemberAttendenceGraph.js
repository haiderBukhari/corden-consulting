import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { useRouter } from 'next/router';
import { useTeamMemberAttendanceTrends } from '../../../../hooks/query/team_lead/team/getTeamMemberAttendanceTrends';
import DataLoader from '../../../ui/dataLoader';

Chart.register(...registerables);

const MemberAttendanceGraph = ({ role, id }) => {
    const { data: attendanceTrend = {}, isLoading } = useTeamMemberAttendanceTrends(id);
    const router = useRouter();

    // Extract weekdays, dates, present, absent, and leave from the API response
    const { weekdays = [], dates = [], present = [], absent = [], leave = [] } = attendanceTrend;

    if (!weekdays.length || !present.length || !absent.length) {
        return <div>No data available</div>;
    }

    // Create labels combining weekday and date (in DD/MM format)
    const labels = weekdays.map((day, index) => {
        const dateParts = dates[index] ? dates[index].split('-') : []; // Split date into parts (YYYY-MM-DD)
        const formattedDate = dateParts.length === 3 ? `${dateParts[2]}/${dateParts[1]}` : ''; // Format as DD/MM
        return `${day}\n${formattedDate}`; // Combine day with formatted date
    });

    const chartData = {
        labels: labels, // Display day and formatted date (DD/MM)
        datasets: [
            {
                label: 'Absent',
                data: absent,
                backgroundColor: '#FE7F7F',
                barThickness: 10,
            },
            {
                label: 'Present',
                data: present,
                backgroundColor: '#52CB50',
                barThickness: 10,
            },
            {
                label: 'Leave',
                data: leave,
                backgroundColor: '#FFD36F',
                barThickness: 10,
            },
        ],
    };

    const options = {
        responsive: true,
        devicePixelRatio: 10,
        scales: {
            y: {
                beginAtZero: true,
                stacked: true,
                grid: {
                    display: false,
                },
            },
            x: {
                stacked: true,
                grid: {
                    display: false,
                },
                ticks: {
                    callback: function (val, index) {
                        // Show day and date under each other (day first)
                        return labels[index]; // Use the formatted label (day and DD/MM)
                    },
                },
            },
        },
        plugins: {
            legend: {
                display: true,
                align: 'end',
                paddingBottom: '5px',
                labels: {
                    pointStyle: 'circle',
                    usePointStyle: true,
                },
            },
            tooltip: {
                callbacks: {
                    title: function (tooltipItems) {
                        // Show day and date in the tooltip (day first)
                        return labels[tooltipItems[0].dataIndex];
                    },
                },
            },
        },
    };

    return (
        <div>
            <div className="bg-grey rounded-lg py-2 px-2 border shadow-md">
                <div className='flex justify-between'>
                    <span className="text-lg text-default_text">Attendance</span>
                    <p
                        className="flex underline text-primary cursor-pointer"
                        onClick={() => router.push(
                            role === 'team_lead' ? `/${role}/team/${id}/attendance` : `/workforce/people/${id}/attendance`
                        )}
                    >
                        View All
                    </p>
                </div>
                {isLoading ? (
                    <div className='h-40 flex justify-center items-center'>
                        <DataLoader />
                    </div>
                ) : (
                    <div>
                        <Bar data={chartData} options={options} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default MemberAttendanceGraph;
