import React, {useState} from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { BsThreeDotsVertical } from "react-icons/bs";
import DataLoader from '../../ui/dataLoader';

Chart.register(...registerables);

function TeamPerformanceChart() {
  const [isLoading, setIsloading] = useState(false);

  const chartData = {
    labels: ['John', 'Jane', 'Alice', 'Mark', 'John', 'Jane', 'Alice', 'Mark', 'Jane', 'Alice', 'Mark'],
    datasets: [
      {
        label: 'Hours Worked',
        data: [40, 35, 50, 45, 95, 65, 70, 30, 58, 99, 105],
        backgroundColor: ['#92D6FE', '#88FFB8', '#FFCE56', '#FE7F7F'],
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          borderDash: [8, 4]
        }
      }
    },
  };

  return (
    <>
      {chartData && !isLoading ?
        <div className="flex flex-col h-full">
          <div className="mb-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className='text-base text-gray-700'>Team Performance</h4>
                <p className='text-xs text-gray-400'>
                  Lorem ipsum dolor sit amet, consectetur adip
                </p>
              </div>
              <div className="p-2 bg-white rounded-full">
                <BsThreeDotsVertical className="text-gray-500 cursor-pointer" />
              </div>
            </div>
          </div>
          <div className='flex justify-center items-center my-12'>
          <div className='text-center font-semibold '>
            Comming Soon....
          </div>
          </div>
          {/* <div className="flex-grow">
            <Bar data={chartData} options={options} />
          </div> */}
        </div>
        :
        <DataLoader />
      }
    </>
  );
};

export default TeamPerformanceChart;