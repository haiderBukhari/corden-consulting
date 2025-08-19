import { FaCheckCircle, FaClock, FaHourglassHalf } from "react-icons/fa";

const OnboardingUserList = ({ users, onSelectUser, selectedUser }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <FaCheckCircle className="h-5 w-5 text-green-500" />;
      case "in_progress":
        return <FaHourglassHalf className="h-5 w-5 text-yellow-500" />;
      default:
        return <FaClock className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-red-100 text-red-800";
    }
  };

  const getCurrentStage = (user) => {
    if (user.status === "completed") return "Completed";
    if (user.documentsSubmitted) return "Stage 2 - Documents";
    if (user.profileCompleted) return "Stage 1 - Profile";
    return "Not Started";
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Employee
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Department
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Current Stage
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Start Date
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users?.map((user) => (
            <tr
              key={user.id}
              onClick={() => onSelectUser(user)}
              className={`hover:bg-gray-50 cursor-pointer ${
                selectedUser?.id === user.id ? "bg-gray-50" : ""
              }`}
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-10 w-10 flex-shrink-0">
                    <img
                      className="h-10 w-10 rounded-full"
                      src={user.photo || "/default-avatar.png"}
                      alt=""
                    />
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {user.fullName}
                    </div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{user.department}</div>
                <div className="text-sm text-gray-500">{user.jobTitle}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {getCurrentStage(user)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {getStatusIcon(user.status)}
                  <span
                    className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                      user.status
                    )}`}
                  >
                    {user.status.replace("_", " ")}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {new Date(user.startDate).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OnboardingUserList; 