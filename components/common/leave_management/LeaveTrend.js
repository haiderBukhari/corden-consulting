import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { useLeaveTrends } from '../../../hooks/query/getLeaveTrends';
import DataLoader from '../../ui/dataLoader';

Chart.register(...registerables);

const LeaveTrend = (id) => {
    const { data: leaveTrends = {}, isLoading,  } = useLeaveTrends(id);
    
    const chartData = {
        labels: leaveTrends.months,
        datasets: [
            {
                label: 'Annual',
                data: leaveTrends.annual_leaves,
                backgroundColor: '#5451D3',
            },
            {
                label: 'Sick',
                data: leaveTrends.sick_leaves,
                backgroundColor: '#3988FF',
            },
            {
                label: 'Maternity',
                data: leaveTrends.maternity_leaves,
                backgroundColor: '#069855',
            },
            {
                label: 'Paternity',
                data: leaveTrends.paternity_leaves,
                backgroundColor: '#1AC8B3',
            },
            {
                label: 'Compassionate',
                data: leaveTrends.compassionate_leaves,
                backgroundColor: '#FFA500',
            },
        ],
    };

    const options = {
        responsive: true,
        devicePixelRatio: 10,
            scales: {
            y: {
                beginAtZero: true,
            },
            x: {
                stacked: true, // Enable stacked bar
            },
            y: {
                stacked: true, // Enable stacked bar
            },
        },
        plugins: {
            legend: {
                display: true,
                align: 'end',
                labels: {
                  pointStyle: 'circle',
                  usePointStyle: true,
                },
              },
        },
    };

    return (
        <div>
            {leaveTrends && !isLoading ?
                <div className="justify-between items-center mb-4">
                    <span>
                        <span className="text-lg text-default_text">Leave Trend</span>
                    </span>
                    <Bar data={chartData} options={options} />
                </div>
                :
                <DataLoader />
            }
        </div>
    );
};

export default LeaveTrend;