import { useState, useMemo } from "react";
import { FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaEye, FaUsers, FaUserCheck, FaUserClock, FaSearch, FaFilter, FaFileCsv } from 'react-icons/fa';
import DataLoader from '../../../ui/dataLoader'; // Adjust path if needed
import UserProgressModal from './UserProgressModal'; // Import the extracted modal
import { useGetHROnboardingUserList } from "../../../../hooks/query/onboarding/getHROnboardingUserList";
import { useGetHROnboardingUserDashbaordStats } from "../../../../hooks/query/onboarding/getHOnboardingUserDashbaordStats";
import Image from 'next/image';
// Stat Card Component (Similar to other dashboards)
const StatCard = ({ title, value, icon, colorClass = 'bg-blue-500', description = null }) => (
  <div className={`bg-white p-5 rounded-xl shadow-md flex items-center space-x-4 border-l-4 ${colorClass.replace('bg-', 'border-')}`}>
    <div className={`p-3 rounded-full ${colorClass} text-white`}>
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      {description && <p className="text-xs text-gray-400">{description}</p>}
    </div>
  </div>
);


// Get Overall Status (Completed/Pending - text and color)
const getUserOverallStatus = (user) => {
  const isComplete = user.passwordChanged && user.infoReviewed && user.docsReviewed && user.policiesAcknowledged;
  // Add Not Initiated Status if needed - assuming false means not initiated or pending
  const isInitiated = user.passwordChanged || user.infoReviewed || user.docsReviewed || user.policiesAcknowledged;

  if (isComplete) {
    return { text: 'Completed', color: 'text-green-600', icon: <FaUserCheck className="mr-1 inline" /> };
  }
  if (isInitiated) {
    return { text: 'Pending', color: 'text-yellow-600', icon: <FaHourglassHalf className="mr-1 inline" /> };
  }
  // Consider adding a 'Not Initiated' status if all are false
  return { text: 'Not Initiated', color: 'text-gray-500', icon: <FaUserClock className="mr-1 inline" /> };
};

// Get Current Step Name and Number
const getCurrentStepInfo = (user) => {
  if (
    user?.user_status?.status === 'Policies Acknowledged' &&
    user?.user_onboard === 1
  ) {
    return { number: 5, name: "Completed" };
  }
  if (user?.user_status?.status === 'Password Set') return { number: 1, name: "Password Set" };
  if (user?.user_status?.status === 'Personal Info Reviewed') return { number: 2, name: "Personal Info Reviewed" };
  if (user?.user_status?.status === 'Documents Reviewed') return { number: 3, name: "Documents Reviewed" };
  if (user?.user_status?.status === 'Policies Acknowledged') return { number: 4, name: "Policies Acknowledged" };
  return { number: 5, name: "Completed" };
};


// Function to generate CSV content and trigger download
const downloadCSV = (data, headers, filename = 'user_onboarding_progress.csv') => {
  const csvRows = [];
  // Add header row
  csvRows.push(headers.join(','));

  // Add data rows
  for (const row of data) {
    const stepInfo = getCurrentStepInfo(row);
    const overallStatus = getUserOverallStatus(row);
    const values = [
      `"${row.name}"`, // Enclose in quotes in case of commas in name
      row.email,
      row.role,
      stepInfo.number <= 4 ? `"Step ${stepInfo.number}: ${stepInfo.name}"` : `"${stepInfo.name}"`,
      `"${overallStatus.text}"`
    ];
    csvRows.push(values.join(','));
  }

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const UserOnboardingDashboard = () => {
  const { data: userOnboardingUsers, isLoading: isLoadingUserSelf , refetch } = useGetHROnboardingUserList('user');
  const { data: userOnboardingStats, isLoading: isLoadingUserOnboardingStats } = useGetHROnboardingUserDashbaordStats();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserForModal, setSelectedUserForModal] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Always call hooks, even if data is not ready
  const filteredUsers = useMemo(() => {
    if (!userOnboardingUsers) return [];
    return userOnboardingUsers.filter(user => {
      const searchLower = searchTerm.toLowerCase();
      const nameMatch = user.name?.toLowerCase().includes(searchLower);
      const emailMatch = user.email?.toLowerCase().includes(searchLower);

      // Get user's current step name
      const stepInfo = getCurrentStepInfo(user);
      let stepMatch = true;
      if (statusFilter !== 'all') {
        if (statusFilter === 'Completed') {
          stepMatch = stepInfo.name === 'Completed';
        } else {
          stepMatch = stepInfo.name === statusFilter;
        }
      }

      return (nameMatch || emailMatch) && stepMatch;
    });
  }, [userOnboardingUsers, searchTerm, statusFilter]);

  if (isLoadingUserSelf || isLoadingUserOnboardingStats) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <DataLoader />
      </div>
    );
  }

  if (!userOnboardingUsers || !userOnboardingStats) return null;

  // ... (handleViewProgress and closeModal remain the same) ...
  const handleViewProgress = (user) => {
    setSelectedUserForModal(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUserForModal(null);
  };

  // CSV Export Handler
  const handleExportCSV = () => {
    const headers = ["Name", "Email", "Role", "Current Step"];
    downloadCSV(filteredUsers, headers, 'user_self_onboarding_progress.csv'); // Specify filename
  };

  // Define table headers
  const tableHeaders = [
    "User", "Email", "Role", "Current Step", "Action"
  ];

  return (
    <div className="space-y-6 p-4 md:p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold text-gray-900">User Onboarding</h1>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <StatCard title="Total Users" value={userOnboardingStats?.total_users} icon={<FaUsers className="w-6 h-6"/>} colorClass="bg-blue-500" />
        <StatCard title="Completed Onboarding" value={userOnboardingStats?.complete_onboard_user} icon={<FaUserCheck className="w-6 h-6"/>} colorClass="bg-green-500" />
        <StatCard title="Pending User Action" value={userOnboardingStats?.pending_user_action} icon={<FaUserClock className="w-6 h-6"/>} colorClass="bg-yellow-500" />
      </div>

      {/* User Progress Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 p-5 border-b border-gray-200">User Progress Overview</h2>
        <div className="overflow-x-auto">
          {/* Controls: Search, Filter, Export */}
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-white ">
            {/* Search Input */}
            <div className="relative flex-grow sm:flex-grow-0 sm:w-1/3">
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Status Filter Dropdown */}
              <div className="flex items-center">
                <FaFilter className="text-gray-500 mr-2 h-4 w-4" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-md py-2 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="all">All Steps</option>
                  <option value="Password Set">Password Set</option>
                  <option value="Personal Info Reviewed">Personal Info Reviewed</option>
                  <option value="Documents Reviewed">Documents Reviewed</option>
                  <option value="Policies Acknowledged">Policies Acknowledged</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              {/* Export CSV Button */}
              <button
                onClick={handleExportCSV}
                className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary text-sm font-medium transition-colors"
                title="Export filtered data as CSV"
              >
                <FaFileCsv className="mr-2 h-4 w-4" />
                Export CSV
              </button>
            </div>
          </div>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {tableHeaders.map(header => (
                  <th key={header} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => {
                  const stepInfo = getCurrentStepInfo(user);
                  const overallStatus = getUserOverallStatus(user);
                  return (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-150 ease-in-out">
                      <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Image
                              src={user.avatar}
                              alt={user.name}
                              className="w-8 h-8 rounded-full mr-2"
                              height={200}
                              width={400}
                            />
                            <span>{user?.name || ''}</span>
                          </div>
                        </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{user.role}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {stepInfo.name === "Completed" ? (
                          <span className="font-medium text-green-600">{stepInfo.name}</span>
                        ) : (
                          <span>
                            Step {stepInfo.number}: <span className="font-medium">{stepInfo.name}</span>
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <button
                          onClick={() => handleViewProgress(user)}
                          className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 transition-colors shadow-sm"
                          title="View Progress Details"
                        >
                          <FaEye className="mr-1.5 h-3.5 w-3.5" />
                          View Progress
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={tableHeaders.length} className="text-center py-12 px-6 text-gray-500">
                    {searchTerm || statusFilter !== 'all' ? 'No users match your filters.' : 'No users found for self-onboarding.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Progress Modal */}
      <UserProgressModal
        isOpen={isModalOpen}
        onClose={closeModal}
        user={selectedUserForModal}
        refetch={refetch}
      />
    </div>
  );
};

export default UserOnboardingDashboard; 