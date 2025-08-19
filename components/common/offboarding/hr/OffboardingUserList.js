import { FaEdit, FaTimes, FaPlayCircle } from 'react-icons/fa';
import { format, startOfDay, isAfter } from 'date-fns';
import DataLoader from '../../../ui/dataLoader';

const OffboardingUserList = ({ cases, onSelectUser, onCancelOffboarding, onResumeOffboarding, isLoading }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'in_progress':
      case 0:
        return 'bg-yellow-100 text-yellow-800';
  
      case 'completed':
      case 1:
        return 'bg-green-100 text-green-800';
  
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isActionDisabled = (lastWorkingDay) =>
    isAfter(startOfDay(new Date()), startOfDay(new Date(lastWorkingDay)));

  if (isLoading) {
    return <DataLoader />;
  }

  if (!cases || cases.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No offboarding cases found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto max-h-[450px] overflow-y-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50 sticky top-0 z-10">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Employee
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Department
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Exit Type
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Last Working Day
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Checklist Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Offboarding Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {cases.map((offBoardingItem) => {
            const isDisabled = isActionDisabled(offBoardingItem.last_working_day);
            return (
              <tr key={offBoardingItem.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img
                        className="h-10 w-10 rounded-full"
                        src={offBoardingItem.user.avatar || "/default-avatar.png"}
                        alt=""
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 capitalize">
                        {offBoardingItem.user.fname} {offBoardingItem.user.lname}
                      </div>
                      <div className="text-sm text-gray-500">
                        {offBoardingItem.user.employee_id || 'N/A'}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap capitalize">
                  <div className="text-sm text-gray-900">{offBoardingItem.department || 'N/A'}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {offBoardingItem.exit_type.replace(/_/g, ' ').replace(/^./, c => c.toUpperCase())}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {format(new Date(offBoardingItem.last_working_day), 'MMM d, yyyy')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-4 inline-flex text-xs py-2 font-semibold rounded-full capitalize ${getStatusColor(offBoardingItem.status)}`}>
                    {offBoardingItem.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-4 inline-flex text-xs py-2 font-semibold rounded-full capitalize ${getStatusColor(offBoardingItem.offboarding_status)}`}>
                    {offBoardingItem.offboarding_status === 0 ? 'In Progress' : 'Completed'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {!isDisabled && (
                    <div className="flex space-x-3">
                      {offBoardingItem?.offboarding_status === 0 ? (
                        <button
                          onClick={() => onResumeOffboarding(offBoardingItem)}
                          title="Resume offboarding"
                          className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium shadow-sm transition-colors text-primary bg-primary/10 hover:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary"
                        >
                          <FaPlayCircle className="mr-1.5 h-3.5 w-3.5" />
                          Resume
                        </button>
                      ) : offBoardingItem.offboarding_status === 1 ? (
                        <>
                          <button
                            onClick={() => onSelectUser(offBoardingItem)}
                            className="text-primary hover:text-primary-dark"
                            title="Edit offboarding"
                          >
                            <FaEdit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => onCancelOffboarding(offBoardingItem)}
                            className="text-red-600 hover:text-red-800"
                            title="Cancel offboarding"
                          >
                            <FaTimes className="h-5 w-5" />
                          </button>
                        </>
                      ) : null}
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default OffboardingUserList; 