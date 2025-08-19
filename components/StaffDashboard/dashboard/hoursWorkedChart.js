import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

Chart.register(...registerables);

const WaveGraph = ({ data, isLoading }) => {
  const chartData = {
    labels: data?.days,
    datasets: [
      {
        label: 'Hours Worked',
        data: data?.working_hours,
        fill: true,
        backgroundColor: 'rgba(96, 4, 51, 0.2)',
        borderColor: '#600433',
        tension: 0.4,
      },
    ],
  };

  const handleSaveReport = () => {
    const workbook = XLSX.utils.book_new();
    const worksheetData = [
      ['Day', 'Hours Worked'],
      ...data.days.map((day, index) => [day, data.working_hours[index]]),
    ];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance Report');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'attendance_report.xlsx');
  };

  const chartOptions = {
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: {
        suggestedMin: 0,
        suggestedMax: 9,
        display: false,
      },
      x: {
        type: 'category',
        grid: { display: false },
        labels: data?.days,
      },
    },
  };

  return (
    <div className="bg-grey w-full rounded-lg py-2 px-1 border shadow-lg">
      {isLoading ? (
        <div className="flex justify-center items-center mt-12">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : data ? (
        <>
          <div className="flex flex-col sm:flex-row justify-between px-2">
            <h2 className="text-base sm:text-lg text-default_text">Hours Worked</h2>
            <button
              onClick={handleSaveReport}
              className="border border-primary flex space-x-2 text-primary text-xs sm:text-sm rounded-full py-1 px-3 sm:px-4 mt-2 sm:mt-0 w-full sm:w-auto justify-center"
            >
              <Download className="h-3 w-4 sm:h-4 sm:w-5" />
              Save Report
            </button>
          </div>
          <div className="w-full h-[150px] sm:h-[170px] mt-2">
            <Line data={chartData} options={chartOptions} />
          </div>
        </>
      ) : (
        <div className="flex justify-center items-center pt-10 sm:pt-14">
          <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-t-2 border-b-2 border-primary"></div>
        </div>
      )}
    </div>
  );
};

export default WaveGraph;
