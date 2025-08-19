import { useState, useMemo } from "react";
import { useRouter } from 'next/router';
import { FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaPlayCircle, FaUserClock, FaUserCheck, FaListAlt, FaPaperPlane, FaSearch, FaFilter, FaFileCsv } from 'react-icons/fa';
import DataLoader from '../../../ui/dataLoader';
import { useGetHROnboardingUserList } from "../../../../hooks/query/onboarding/getHROnboardingUserList";
import Image from "next/image";
import { useGetHROnboardingDashbaordStats } from "../../../../hooks/query/onboarding/getHRonboardingDashbaordStats";



// Status Renderer (using helper function)
const getHrStepStatusText = (step) => {
  switch (step) {
    case 'Pending Info': return { text: 'Step 1: Pending Info', color: 'text-yellow-600', icon: <FaHourglassHalf className="mr-1 inline" /> };
    case 'Pending Documents': return { text: 'Step 2: Pending Documents', color: 'text-yellow-600', icon: <FaHourglassHalf className="mr-1 inline" /> };
    case 'Pending Review & Email': return { text: 'Step 3: Pending Review & Email', color: 'text-orange-600', icon: <FaHourglassHalf className="mr-1 inline" /> };
    case 'Pending User Verification': return { text: 'Step 4: Pending User Verification', color: 'text-blue-600', icon: <FaHourglassHalf className="mr-1 inline" /> };
    case 'HR Steps Complete': return { text: 'Complete Onboarding ', color: 'text-green-600', icon: <FaCheckCircle className="mr-1 inline" /> };
    default: return { text: 'Unknown', color: 'text-gray-500', icon: <FaTimesCircle className="mr-1 inline" /> };
  }
};

// Action Button Renderer (Modified for simple table)
const ActionButton = ({ user, onResume }) => {
  const canResume = user.onboarding_status !== 'HR Steps Complete';
  return (
    <button
      onClick={() => onResume(user.id, user.current_step)}
      disabled={!canResume}
      className={`inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium shadow-sm transition-colors ${canResume
        ? 'text-primary bg-primary/10 hover:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary'
        : 'text-gray-400 bg-gray-100 cursor-not-allowed'
        }`}
      title={canResume ? "Resume Onboarding Process" : "HR Steps Completed"}
    >
      {canResume && <FaPlayCircle className="mr-1.5 h-3.5 w-3.5" />}
      {canResume ? 'Resume' : 'Completed'}
    </button>
  );
};

// Stat Card Component
const StatCard = ({ title, value, icon, colorClass = 'bg-primary' }) => (
  <div className={`bg-white p-4 rounded-lg shadow-md flex items-center space-x-4 border-l-4 ${colorClass.replace('bg-', 'border-')}`}>
    <div className={`p-2 rounded-full ${colorClass} text-white`}>
      {icon}
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500  capitalize tracking-wider">{title}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  </div>
);

// Function to generate CSV content and trigger download (Adapted for HR Onboarding)
const downloadCSV = (data, headers, filename = 'hr_onboarding_pipeline.csv') => {
  const csvRows = [];
  // Add header row
  csvRows.push(headers.join(','));

  // Add data rows
  for (const row of data) {
    const statusInfo = getHrStepStatusText(row.onboarding_status);
    const values = [
      `"${row.name}"`, // Enclose in quotes
      row.email,
      row.role,
      `"${statusInfo.text}"`
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

const OnboardingDashboard = () => {
  const router = useRouter();
  const { data: hrOnboardingUsers, isLoading: isLoadingHr } = useGetHROnboardingUserList('hr');
  const { data: hrStats, isLoading: isLoadingHrStats } = useGetHROnboardingDashbaordStats();
  const [searchTerm, setSearchTerm] = useState(''); // State for search
  const [statusFilter, setStatusFilter] = useState('all'); // State for status filter ('all', '1', '2', '3', '4', '5')
  // TODO: Replace with actual data fetching logic

  const handleResumeHrOnboarding = (userId, resumeStep) => {
    if (resumeStep < 5) {
      router.push(`/HR/onboarding/process?userId=${userId}&resumeStep=${resumeStep}`);
    }
  };

  
  // Filtered and Searched Data
  const filteredUsers = useMemo(() => {
    return hrOnboardingUsers && hrOnboardingUsers?.filter(user => {
      const searchLower = searchTerm.toLowerCase();
      const nameMatch = user.name.toLowerCase().includes(searchLower);
      const emailMatch = user.email.toLowerCase().includes(searchLower);
      // Status filter checks the step number (as string because select value is string)
      const statusMatch = statusFilter === 'all' || String(user.onboarding_status) === statusFilter;

      return (nameMatch || emailMatch) && statusMatch;
    });
  }, [hrOnboardingUsers, searchTerm, statusFilter]);

  // Define table headers for simple table
  const tableHeaders = [
    "User", "Email", "Role", "Current Status", "Action"
  ];

  // CSV Export Handler
  const handleExportCSV = () => {
    // Define headers for CSV export (excluding Action)
    const headers = ["Name", "Email", "Role", "Current Status"];
    downloadCSV(filteredUsers, headers); // Use filtered data for export
  };

  return (
    <div className="space-y-6 p-4 md:p-6 bg-white min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">HR Onboarding Dashboard</h1>
        <button
          onClick={() => router.push("/HR/onboarding/process")}
          className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary text-sm font-medium transition-colors"
        >
          Onboard New User
        </button>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
        <StatCard
          title=" Pending User Info"
          value={hrStats?.in_progress || 0}
          icon={<FaUserClock className="w-5 h-5" />}
          colorClass="bg-blue-500"
        />
        <StatCard
          title=" Pending Documents"
          value={hrStats?.pending_docs || 0}
          icon={<FaListAlt className="w-5 h-5" />}
          colorClass="bg-yellow-500"
        />
        <StatCard
          title="Pending Email"
          value={hrStats?.pending_email_review || 0}
          icon={<FaPaperPlane className="w-5 h-5" />}
          colorClass="bg-orange-500"
        />
        <StatCard
          title="Pending User Verification"
          value={hrStats?.pending_verify || 0}
          icon={<FaUserCheck className="w-5 h-5" />}
          colorClass="bg-indigo-500"
        />
        <StatCard
          title="Complete Onboarding"
          value={hrStats?.hr_completed || 0}
          icon={<FaCheckCircle className="w-5 h-5" />}
          colorClass="bg-green-500"
        />
      </div>

      {/* HR Onboarding Pipeline Table Section */}
      <div className="bg-white rounded-lg shadow overflow-hidden border border-gray-200 ">
        <h2 className="text-xl font-semibold text-gray-800 p-4 border-b border-gray-200">HR Onboarding Pipeline</h2>
        {isLoadingHr ? (
          <div className="p-6 text-center"><DataLoader /></div>
        ) : (
          <div className="overflow-x-auto">
            <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 bg-white">
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
                    <option value="all">All Statuses</option>
                    <option value='Pending Info'>Pending Info</option>
                    <option value='Pending Documents'>Pending Documents</option>
                    <option value='Pending Review & Email'>Pending Review & Email</option>
                    <option value='Pending User Verification'>Pending User Verification</option>
                    <option value='HR Steps Complete'>Complete Onboarding</option>
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
                {filteredUsers?.length > 0 ? (
                  filteredUsers?.map((user) => {
                    const statusInfo = getHrStepStatusText(user.onboarding_status);
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
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center p-2 rounded-md text-xs font-medium ${statusInfo.color.replace('text-', 'bg-').replace(/-(600|500)/, '-100')} ${statusInfo.color}`}>
                            {statusInfo.icon}
                            {statusInfo.text}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <ActionButton user={user} onResume={handleResumeHrOnboarding} />
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={tableHeaders.length} className="text-center py-12 px-6 text-gray-500">
                      {searchTerm || statusFilter !== 'all' ? 'No users match your filters.' : 'No users found in the HR onboarding pipeline.'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingDashboard; 