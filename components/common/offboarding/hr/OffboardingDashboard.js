import React, { useState } from 'react';
import OffboardingStats from './OffboardingStats';
import OffboardingUserList from './OffboardingUserList';
import OffboardingUserDetail from './OffboardingUserDetail';
import DataLoader from '../../../ui/dataLoader';
import { useRouter } from 'next/router';
import { useOffBoardingUsersList } from '../../../../hooks/query/offboarding/getOffBoardingUsersList';
import { useOffBoardingDashboardStats } from '../../../../hooks/query/offboarding/getOffBoardingDashboardStats';
import { useOffboardingReviewDetails } from '../../../../hooks/query/offboarding/getOffboardingProcessThreeDetails';
import useCancelOffBoarding from '../../../../hooks/mutations/offboarding/cancelOffBoarding';

const OffboardingDashboard = () => {
  const router = useRouter();
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [userToCancel, setUserToCancel] = useState(null);
  const [filters, setFilters] = useState({
    exitType: 'all',
    department: 'all',
    checklistStatus: 'all',
    offboardingStatus: 'all',
    dateRange: 'all'
  });

  const { data: stats, isLoading: isLoadingStats } = useOffBoardingDashboardStats();
  const { data: cases, isLoading: isLoadingCases } = useOffBoardingUsersList();
  const { data: selectedUserDetails } = useOffboardingReviewDetails(selectedUser?.id);
  const { mutate: cancelOffboarding, isLoading: isCancelling } = useCancelOffBoarding();

  // Sort cases by created_at date (newest first)
  const sortedCases = cases ? [...cases].sort((a, b) => {
    return new Date(b.created_at) - new Date(a.created_at);
  }) : [];

  const filteredCases = sortedCases?.filter((case_) => {
    const matchesSearch =
      case_.user.fname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      case_.user.lname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      case_.user.employee_id?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilters =
      (filters.exitType === 'all' || case_.exit_type === filters.exitType) &&
      (filters.department === 'all' || case_.department === filters.department) &&
      (filters.checklistStatus === 'all' || case_.status === filters.checklistStatus) &&
      (filters.offboardingStatus === 'all' || case_.offboarding_status.toString() === filters.offboardingStatus) &&
      (filters.dateRange === 'all' || {
        'today': new Date(case_.last_working_day).toDateString() === new Date().toDateString(),
        'this_week': {
          start: new Date(new Date().setDate(new Date().getDate() - 7)),
          end: new Date()
        },
        'this_month': {
          start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          end: new Date()
        }
      }[filters.dateRange] || true);

    return matchesSearch && matchesFilters;
  });

  const handleCancelOffboarding = (user) => {
    setUserToCancel(user);
    setShowCancelModal(true);
  };

  const confirmCancelOffboarding = () => {
    if (!userToCancel || !userToCancel.id) return;
    
    cancelOffboarding(userToCancel.id, {
      onSuccess: () => {
        setShowCancelModal(false);
        setUserToCancel(null);
      }
    });
  };

  const handleInitiateNewOffboarding = () => {
    router.push("/HR/offboarding/new_offboarding");
  };

  const handleSelectUser = (user) => {
    router.push({
      pathname: "/HR/offboarding/process",
      query: { 
        offboardingId: user.id,
        resumeStep: user.current_step
      }
    });
  };

  const handleResumeOffboarding = (user) => {
    router.push({
      pathname: "/HR/offboarding/process",
      query: { 
        offboardingId: user.id,
        resumeStep: user.current_step + 1
      }
    });
  };

  if (isLoadingStats || isLoadingCases) {
    return <DataLoader />;
  }

  if (!stats || !cases) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Error loading offboarding data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6 bg-white min-h-screen">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Offboarding Dashboard</h1>
        <button
          onClick={handleInitiateNewOffboarding}
          className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-md shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary text-sm font-medium transition-colors"
        >
          Initiate New Offboarding
        </button>
      </div>

      <OffboardingStats stats={stats} />

      <div className="bg-white rounded-lg shadow">
        <div className="p-2 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by name or ID..."
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary p-2"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex space-x-4">
              <select
                className="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                value={filters.exitType}
                onChange={(e) => setFilters({ ...filters, exitType: e.target.value })}
              >
                <option value="all">All Exit Types</option>
                <option value="resignation">Resignation</option>
                <option value="Termination">Termination</option>
                <option value="retirement">Retirement</option>
                <option value="end_of_contract">End of contract</option>
              </select>
              <select
                className="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                value={filters.checklistStatus}
                onChange={(e) => setFilters({ ...filters, checklistStatus: e.target.value })}
              >
                <option value="all">All Checklist Status</option>
                <option value="not_started">Not Started</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              <select
                className="rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                value={filters.offboardingStatus}
                onChange={(e) => setFilters({ ...filters, offboardingStatus: e.target.value })}
              >
                <option value="all">All Offboarding Status</option>
                <option value="0">In Progress</option>
                <option value="1">Completed</option>
              </select>
            </div>
          </div>
        </div>

        <OffboardingUserList
          cases={filteredCases}
          onSelectUser={handleSelectUser}
          onCancelOffboarding={handleCancelOffboarding}
          onResumeOffboarding={handleResumeOffboarding}
        />
      </div>

      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Cancel Offboarding</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to cancel the offboarding process for {userToCancel?.user?.fname} {userToCancel?.user?.lname}?
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                No
              </button>
              <button
                onClick={confirmCancelOffboarding}
                disabled={isCancelling}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {isCancelling ? 'Cancelling...' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OffboardingDashboard; 