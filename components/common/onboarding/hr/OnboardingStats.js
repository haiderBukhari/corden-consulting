import { FaUsers, FaCheckCircle, FaClock, FaHourglassHalf } from "react-icons/fa";

const OnboardingStats = ({ stats }) => {
  const statItems = [
    {
      label: "Total Users",
      value: stats.total,
      icon: FaUsers,
      color: "bg-blue-500",
    },
    {
      label: "Completed",
      value: stats.completed,
      icon: FaCheckCircle,
      color: "bg-green-500",
    },
    {
      label: "In Progress",
      value: stats.inProgress,
      icon: FaHourglassHalf,
      color: "bg-yellow-500",
    },
    {
      label: "Pending",
      value: stats.pending,
      icon: FaClock,
      color: "bg-red-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((item) => (
        <div
          key={item.label}
          className="bg-white rounded-lg shadow p-6 flex items-center space-x-4"
        >
          <div className={`${item.color} p-3 rounded-full`}>
            <item.icon className="h-6 w-6 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600">{item.label}</p>
            <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OnboardingStats; 