import React from 'react';
import { FaUserMinus, FaHourglassHalf, FaCheckCircle, FaSpinner, FaClipboardList } from 'react-icons/fa';

const StatCard = ({ title, value, icon, colorClass = 'bg-primary' }) => (
  <div className={`bg-white p-4 rounded-lg shadow-md flex items-center space-x-4 border-l-4 ${colorClass.replace('bg-', 'border-')}`}>
    <div className={`p-3 rounded-full ${colorClass} text-white`}>
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

const OffboardingStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 mb-6">
      <StatCard 
        title="Total Cases" 
        value={stats.total_cases || 0} 
        icon={<FaClipboardList className="w-5 h-5" />} 
        colorClass="bg-blue-500" 
      />
      {/* <StatCard 
        title="Not Started" 
        value={stats.not_started || 0} 
        icon={<FaHourglassHalf className="w-5 h-5" />} 
        colorClass="bg-yellow-500" 
      /> */}
      <StatCard 
        title="In Progress" 
        value={stats.in_progress || 0} 
        icon={<FaSpinner className="w-5 h-5" />} 
        colorClass="bg-orange-500" 
      />
      <StatCard 
        title="Completed" 
        value={stats.completed || 0} 
        icon={<FaCheckCircle className="w-5 h-5" />} 
        colorClass="bg-green-500" 
      />
    </div>
  );
};

export default OffboardingStats; 