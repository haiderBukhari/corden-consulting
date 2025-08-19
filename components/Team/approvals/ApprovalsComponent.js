import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { Check, ArrowLeft } from "lucide-react";
import { IoCalendarOutline, IoInformationCircleOutline } from "react-icons/io5";
import { MdFilterList } from 'react-icons/md';
import { BsSearch } from "react-icons/bs";
import { FaQuestion } from "react-icons/fa6";
import DataLoader from "../../ui/dataLoader";
import { useGetIndividualMemberLeave } from "../../../hooks/query/team_lead/team/getIndividualMemberLeave";
import { useMemberLeaves } from "../../../hooks/query/team_lead/team/getMembersLeaves";
import { UseHRandManagerLeaveApprovalRequests } from "../../../hooks/query/getHRandManagerLeaveApprovalRequests";
import UseManageLeaveApproval from "../../../hooks/mutations/manageLeaveApproval";
import { UseGetConfigurations } from "../../../hooks/query/admin/getConfigurations";
import { Tooltip } from 'react-tooltip'
import { formatDateToDay } from "../../../utils/functions";

const ApprovalsComponent = ({ role, id }) => {
  const router = useRouter();
  const { id: routeId } = router.query;
  const memberId = id || routeId;

  const { data: memberLeave, isLoading: isLoadingMemberLeaves } = useMemberLeaves("all");
  const { data: HRandManagerLeaves, isLoading: isLoadingHRandManagerLeaves } = UseHRandManagerLeaveApprovalRequests("all");
  const { data: individualMemberLeave } = useGetIndividualMemberLeave(memberId);

  const { data: configurations, isLoading: isLoadingConfigurations } = UseGetConfigurations();

  const manageLeaveApproval = UseManageLeaveApproval();

  const [activeTab, setActiveTab] = useState("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [leaveReasons, setLeaveReasons] = useState({});
  const [errors, setErrors] = useState({});
  const [filterDropdownVisible, setFilterDropdownVisible] = useState(false);
  const [filters, setFilters] = useState({
    pending: true,
    approved: false,
    rejected: false,
  });

  const filterRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setFilterDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [filterRef]);

  const handleFilterChange = (filterName) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterName]: !prevFilters[filterName],
    }));
  };

  const approveLeave = (leaveId) => {
    const formData = new FormData();
    formData.append("action", "approved");
    formData.append("reason", leaveReasons[leaveId] || "");

    manageLeaveApproval.mutate(
      { formData, role, leaveId },
      {
        onSuccess: () => {
          setErrors((prevErrors) => ({ ...prevErrors, [leaveId]: "" }));
        },
      }
    );
  };

  const rejectLeave = (leaveId) => {
    if (!leaveReasons[leaveId]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [leaveId]: "Reason is required",
      }));
      return;
    }

    const formData = new FormData();
    formData.append("action", "rejected");
    formData.append("reason", leaveReasons[leaveId] || "");

    manageLeaveApproval.mutate(
      { formData, role, leaveId },
      {
        onSuccess: () => {
          setErrors((prevErrors) => ({ ...prevErrors, [leaveId]: "" }));
        },
      }
    );
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const handleYearChange = (event) => {
    setSelectedYear(event.target.value);
  };

  const handleReasonChange = (event, leaveId) => {
    setLeaveReasons({ ...leaveReasons, [leaveId]: event.target.value });
    setErrors((prevErrors) => ({ ...prevErrors, [leaveId]: "" }));
  };

  const getMonthFromDateString = (dateString) => {
    const date = new Date(dateString.split("-").reverse().join("-"));
    return date.getMonth();
  };

  const getYearFromDateString = (dateString) => {
    const date = new Date(dateString.split("-").reverse().join("-"));
    return date.getFullYear();
  };

  const calculateLeaveDuration = (startDate, endDate) => {
    const start = new Date(startDate.split("-").reverse().join("-"));
    const end = new Date(endDate.split("-").reverse().join("-"));
    return (end - start) / (1000 * 60 * 60 * 24) + 1;
  };

  const mergeLeaveDetails = (individualLeaves, allLeaves) => {
    if (!individualLeaves || !allLeaves) return [];
    const mergedLeaves = individualLeaves.map((individualLeave) => {
      const fullDetails = allLeaves?.find((leave) => leave.leave_id === individualLeave.leave_id);
      return { ...fullDetails, ...individualLeave };
    });

    return mergedLeaves.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  };

  const leaves = memberId ? mergeLeaveDetails(individualMemberLeave, role === "team_lead" ? memberLeave : HRandManagerLeaves) : role === "team_lead" ? memberLeave : HRandManagerLeaves;

  const isPendingAtCurrentRole = (leave) => {
    if (role === "team_lead") {
      return leave.team_lead_status === "pending";
    } else if (role === "HR") {
      if (leave.hr_status === "pending") {
        // For staff in a team, ensure Team Lead has approved
        if (leave.leave_user_role === "staff" && leave.user_team === "Yes") {
          return leave.team_lead_status === "approved";
        }
        // For others, HR is the first approver
        return true;
      }
      return false;
    } else if (role === "manager") {
      if (leave.leave_status === "pending" && leave.manager_status === "pending") {
        if (leave.leave_user_role === "staff") {
          // Manager approval required based on configurations
          const leaveDuration = parseFloat(leave.no_of_days);
          const noOfDaysConfig = configurations?.[0]?.no_of_days || 0;
          if (leaveDuration >= noOfDaysConfig) {
            if (leave.user_team === "Yes") {
              return leave.team_lead_status === "approved" && leave.hr_status === "approved";
            } else {
              return leave.hr_status === "approved";
            }
          } else {
            // Manager approval not required
            return false;
          }
        } else if (leave.leave_user_role === "team_lead") {
          return leave.hr_status === "approved"; // Manager approves after HR
        } else if (leave.leave_user_role === "HR") {
          // Manager approves HR's leaves directly
          return leave.hr_status === "pending" && leave.manager_status === "pending" && leave.leave_status === "pending";
        } else if (leave.leave_user_role === "manager") {
          // Managers can approve other managers' leaves after HR approval
          return leave.hr_status === "approved";
        }
        return false;
      }
      return false;
    }
    return false;
  };

  const isApprovedOrRejectedByCurrentRole = (leave) => {
    if (role === "team_lead") {
      return ["approved", "rejected"].includes(leave.team_lead_status);
    } else if (role === "HR") {
      return ["approved", "rejected"].includes(leave.hr_status);
    } else if (role === "manager") {
      return ["approved", "rejected"].includes(leave.manager_status);
    }
    return false;
  };

  const filteredLeaves = leaves?.filter((leave) => {
    const matchesSearchQuery =
      leave.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      leave.leave_description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesMonth =
      selectedMonth === "" ||
      getMonthFromDateString(leave.start_date) === parseInt(selectedMonth);
    const matchesYear =
      selectedYear === "" ||
      getYearFromDateString(leave.start_date) === parseInt(selectedYear);

    if (role === "manager") {
      const pending =
        filters.pending &&
        isPendingAtCurrentRole(leave) &&
        matchesSearchQuery &&
        matchesMonth &&
        matchesYear;
      const approved =
        filters.approved &&
        leave.manager_status === "approved" &&
        matchesSearchQuery &&
        matchesMonth &&
        matchesYear;
      const rejected =
        filters.rejected &&
        leave.manager_status === "rejected" &&
        matchesSearchQuery &&
        matchesMonth &&
        matchesYear;
      return pending || approved || rejected;
    } else {
      if (activeTab === "pending") {
        return (
          isPendingAtCurrentRole(leave) &&
          matchesSearchQuery &&
          matchesMonth &&
          matchesYear
        );
      } else {
        return (
          isApprovedOrRejectedByCurrentRole(leave) &&
          matchesSearchQuery &&
          matchesMonth &&
          matchesYear
        );
      }
    }
  });

  const ApprovalStatusIcon = ({ icon: Icon, name, roleUser, status }) => {
    let iconColorClass = "";
    let bgColor = "";
    let roleName = "";

    switch (status) {
      case "approved":
        iconColorClass = "text-white";
        bgColor = "bg-green-400";
        break;
      case "rejected":
        iconColorClass = "text-white";
        bgColor = "bg-primary";
        break;
      case "pending":
        iconColorClass = "text-yellow-600";
        bgColor = "bg-orange-100";
        break;
      default:
        iconColorClass = "text-gray-500";
        break;
    }

    if (role.toLowerCase() === roleUser.toLowerCase()) {
      roleName = `${roleUser === "team_lead" ? "Team Lead" : roleUser} (You)`;
    } else {
      roleName = roleUser === "team_lead" ? "Team Lead" : roleUser;
    }

    return (
      <div className="flex items-center">
        <div className="flex items-center flex-col">
          <div className={`p-1 rounded-full ${iconColorClass} ${bgColor} mb-1`}>
            <Icon className="h-5 w-5" />
          </div>
          <span className="text-sm capitalize">{name}</span>
          <span className="text-xs text-primary text-center">{roleName}</span>
        </div>
      </div>
    );
  };

  const renderApprovalTimeline = (approval) => {
    const userRole = approval.leave_user_role;
    const leaveDuration = calculateLeaveDuration(approval.start_date, approval.end_date);

    // Check if the user belongs to a team
    const isTeamMember = approval?.user_team === "Yes";

    const shouldHideManagerFlow = userRole === "staff" && leaveDuration < configurations?.[0]?.no_of_days && approval.leave_status === "approved";

    if (userRole === "staff") {
      if (isTeamMember) {
        // Team member: Team Lead -> HR -> Manager
        return (
          <>
            <div className="flex-1 flex flex-col items-center justify-center">
              <ApprovalStatusIcon
                icon={approval.team_lead_status === "approved" ? Check : approval.team_lead_status === "rejected" ? XMarkIcon : FaQuestion}
                name={approval?.team_lead !== "No" ? approval?.team_lead : null}
                roleUser="team_lead"
                status={approval.team_lead_status}
              />
            </div>
            {approval.team_lead_status === "approved" && (
              <>
                <div
                  className={`${approval.hr_status === "pending" ? "bg-yellow-600" : approval.hr_status === "approved" ? "bg-green-400" : "bg-secondary"} h-1 rounded-full w-32 border-dotted`}
                  style={{ marginTop: "-35px" }}
                />
                <div className="flex-1 flex flex-col items-center justify-center">
                  <ApprovalStatusIcon
                    icon={approval.hr_status === "approved" ? Check : approval.hr_status === "pending" ? FaQuestion : XMarkIcon}
                    name={approval?.hr !== "No" ? approval?.hr : null}
                    roleUser="HR"
                    status={approval.hr_status}
                  />
                </div>
              </>
            )}
            {approval.hr_status === "approved" && !shouldHideManagerFlow && (
              <>
                <div
                  className={`${approval.manager_status === "pending" ? "bg-yellow-600" : approval.manager_status === "approved" ? "bg-green-400" : "bg-secondary"} h-1 rounded-full w-32 border-dotted`}
                  style={{ marginTop: "-35px" }}
                />
                <div className="flex-1 flex flex-col items-center justify-center">
                  <ApprovalStatusIcon
                    icon={approval.manager_status === "approved" ? Check : approval.manager_status === "pending" ? FaQuestion : XMarkIcon}
                    name={approval?.manager !== "No" ? approval?.manager : null}
                    roleUser="Manager"
                    status={approval.manager_status}
                  />
                </div>
              </>
            )}
          </>
        );
      } else {
        // Not a team member: HR -> Manager
        return (
          <>
            <div className="flex-1 flex flex-col items-center justify-center">
              <ApprovalStatusIcon
                icon={approval.hr_status === "approved" ? Check : approval.hr_status === "rejected" ? XMarkIcon : FaQuestion}
                name={approval?.hr !== "No" ? approval?.hr : null}
                roleUser="HR"
                status={approval.hr_status}
              />
            </div>
            {approval.hr_status === "approved" && !shouldHideManagerFlow && (
              <>
                <div
                  className={`${approval.manager_status === "pending" ? "bg-yellow-600" : approval.manager_status === "approved" ? "bg-green-400" : "bg-secondary"} h-1 rounded-full w-32 border-dotted`}
                  style={{ marginTop: "-35px" }}
                />
                <div className="flex-1 flex flex-col items-center justify-center">
                  <ApprovalStatusIcon
                    icon={approval.manager_status === "approved" ? Check : approval.manager_status === "pending" ? FaQuestion : XMarkIcon}
                    name={approval?.manager !== "No" ? approval?.manager : null}
                    roleUser="Manager"
                    status={approval.manager_status}
                  />
                </div>
              </>
            )}
          </>
        );
      }
    }

    if (userRole === "team_lead") {
      return (
        <>
          <div className="flex-1 flex flex-col items-center justify-center">
            <ApprovalStatusIcon
              icon={approval.hr_status === "approved" ? Check : approval.hr_status === "rejected" ? XMarkIcon : FaQuestion}
              name={approval?.hr !== "No" ? approval?.hr : null}
              roleUser="HR"
              status={approval.hr_status}
            />
          </div>
          {approval.hr_status === "approved" && (
            <>
              <div
                className={`${approval.manager_status === "pending" ? "bg-yellow-600" : approval.manager_status === "approved" ? "bg-green-400" : "bg-secondary"} h-1 rounded-full w-32 border-dotted`}
                style={{ marginTop: "-35px" }}
              />
              <div className="flex-1 flex flex-col items-center justify-center">
                <ApprovalStatusIcon
                  icon={approval.manager_status === "approved" ? Check : approval.manager_status === "pending" ? FaQuestion : XMarkIcon}
                  name={approval?.manager !== "No" ? approval?.manager : null}
                  roleUser="Manager"
                  status={approval.manager_status}
                />
              </div>
            </>
          )}
        </>
      );
    }

    if (userRole === "HR") {
      return (
        <>
          <div className="flex-1 flex flex-col items-center justify-center">
            <ApprovalStatusIcon
              icon={approval.manager_status === "approved" ? Check : approval.manager_status === "rejected" ? XMarkIcon : FaQuestion}
              name={approval?.manager !== "No" ? approval?.manager : null}
              roleUser="Manager"
              status={approval.manager_status}
            />
          </div>
        </>
      );
    }

    if (userRole === "manager") {
      // Handle leaves applied by managers
      return (
        <>
          <div className="flex-1 flex flex-col items-center justify-center">
            <ApprovalStatusIcon
              icon={approval.hr_status === "approved" ? Check : approval.hr_status === "rejected" ? XMarkIcon : FaQuestion}
              name={approval?.hr !== "No" ? approval?.hr : null}
              roleUser="HR"
              status={approval.hr_status}
            />
          </div>
          {approval.hr_status === "approved" && (
            <>
              <div
                className={`${approval.manager_status === "pending" ? "bg-yellow-600" : approval.manager_status === "approved" ? "bg-green-400" : "bg-secondary"} h-1 rounded-full w-32 border-dotted`}
                style={{ marginTop: "-35px" }}
              />
              <div className="flex-1 flex flex-col items-center justify-center">
                <ApprovalStatusIcon
                  icon={approval.manager_status === "approved" ? Check : approval.manager_status === "pending" ? FaQuestion : XMarkIcon}
                  name={approval?.manager !== "No" ? approval?.manager : null}
                  roleUser="Manager"
                  status={approval.manager_status}
                />
              </div>
            </>
          )}
        </>
      );
    }

    return null;
  };

  const isTextareaEnabled = (approval) => {
    const userRole = approval.leave_user_role;

    if (userRole === "staff") {
      if (approval.user_team === "Yes") {
        return (
          (role === "team_lead" && approval.team_lead_status === "pending") ||
          (role === "HR" && approval.hr_status === "pending" && approval.team_lead_status === "approved") ||
          (role === "manager" && approval.manager_status === "pending" && approval.team_lead_status === "approved" && approval.hr_status === "approved")
        );
      } else {
        // user_team === "No"
        return (
          (role === "HR" && approval.hr_status === "pending") ||
          (role === "manager" && approval.manager_status === "pending" && approval.hr_status === "approved")
        );
      }
    }
    if (userRole === "team_lead") {
      return (role === "HR" && approval.hr_status === "pending") || (role === "manager" && approval.manager_status === "pending" && approval.hr_status === "approved");
    }
    if (userRole === "HR") {
      return role === "manager" && approval.manager_status === "pending";
    }
    if (userRole === "manager") {
      return (role === "HR" && approval.hr_status === "pending") || (role === "manager" && approval.manager_status === "pending" && approval.hr_status === "approved");
    }
    return false;
  };

  const isButtonEnabled = (approval) => {
    return isTextareaEnabled(approval);
  };

  const getPendingRole = (approval) => {
    if (approval.leave_user_role === "staff") {
      if (approval.user_team === "Yes") {
        if (approval.team_lead_status === "pending") {
          return "Team Lead";
        }
        if (approval.hr_status === "pending" && approval.team_lead_status === "approved") {
          return "HR";
        }
        if (approval.manager_status === "pending" && approval.hr_status === "approved") {
          return "Manager";
        }
      } else {
        // user_team === "No"
        if (approval.hr_status === "pending") {
          return "HR";
        }
        if (approval.manager_status === "pending" && approval.hr_status === "approved") {
          return "Manager";
        }
      }
    } else if (approval.leave_user_role === "team_lead") {
      if (approval.hr_status === "pending") {
        return "HR";
      }
      if (approval.manager_status === "pending" && approval.hr_status === "approved") {
        return "Manager";
      }
    } else if (approval.leave_user_role === "HR") {
      if (approval.manager_status === "pending") {
        return "Manager";
      }
    } else if (approval.leave_user_role === "manager") {
      // For leaves applied by managers: HR -> Manager
      if (approval.hr_status === "pending") {
        return "HR";
      }
      if (approval.manager_status === "pending" && approval.hr_status === "approved") {
        return "Manager";
      }
    }
    return "unknown role";
  };

  if (isLoadingMemberLeaves || isLoadingHRandManagerLeaves || isLoadingConfigurations) {
    return <DataLoader />;
  }

  return (
    <div className="text-default_text">
      {id && (
        <div className="px-4">
          <button
            onClick={() => {
              router.push(role == "team_lead" ? `/team_lead/team/${id}/detail-page` : `/workforce/people/${id}/detail-page`);
            }}
            type="button"
            className="flex space-x-2 items-center px-2 py-1 text-white bg-primary rounded-xl mb-2"
          >
            <ArrowLeft className="text-white h-5 w-5" />
            <span>Back</span>
          </button>
        </div>
      )}
      <div className="rounded-lg shadow-sm min-h-screen p-4">
        {role !== "manager" && (
          <div className="mb-5">
            <div className={`grid grid-cols-2 gap-4 ${role === "manager" && "pt-2 pb-2"}`}>
              <button
                className={`px-4 py-2 rounded-full ${activeTab === "pending" ? "bg-primary text-white" : "bg-gray-200"}`}
                onClick={() => handleTabChange("pending")}
              >
                Pending
              </button>
              <button
                className={`px-4 py-2 rounded-full ${activeTab === "approved/rejected" ? "bg-primary text-white" : "bg-gray-200"}`}
                onClick={() => handleTabChange("approved/rejected")}
              >
                Approved/Rejected
              </button>
            </div>
          </div>
        )}
        <div className="relative w-full mb-3 flex items-center">
          <BsSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="border rounded-2xl w-full pl-12 px-4 py-2"
          />
          {role === "manager" && (
            <div className="ml-4 relative">
              <button onClick={() => setFilterDropdownVisible(!filterDropdownVisible)} className="px-4 py-2 border rounded-2xl flex items-center gap-2 whitespace-nowrap">
                <MdFilterList />
                <span>Filter</span>
              </button>
              {filterDropdownVisible && (
                <div ref={filterRef} className="absolute right-0 mt-2 w-48 bg-white border rounded-2xl p-3 z-50">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={filters.pending} onChange={() => handleFilterChange("pending")} />
                    Pending
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={filters.approved} onChange={() => handleFilterChange("approved")} />
                    Approved
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={filters.rejected} onChange={() => handleFilterChange("rejected")} />
                    Rejected
                  </label>
                </div>
              )}
            </div>
          )}
          <div className="flex items-center ml-4 border rounded-2xl bg-white px-4 py-2">
            <IoCalendarOutline className="text-gray-500 mr-2" />
            <select value={selectedMonth} onChange={handleMonthChange} className="">
              <option value="">All Months</option>
              <option value="0">January</option>
              <option value="1">February</option>
              <option value="2">March</option>
              <option value="3">April</option>
              <option value="4">May</option>
              <option value="5">June</option>
              <option value="6">July</option>
              <option value="7">August</option>
              <option value="8">September</option>
              <option value="9">October</option>
              <option value="10">November</option>
              <option value="11">December</option>
            </select>
          </div>
          <div className="flex items-center ml-4 border rounded-2xl bg-white px-4 py-2">
            <IoCalendarOutline className="text-gray-500 mr-2" />
            <select value={selectedYear} onChange={handleYearChange} className="">
              <option value="">All Years</option>
              {[2022, 2023, 2024, 2025].map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>

        {filteredLeaves && filteredLeaves.length > 0 ? (
          <div className="max-h-screen overflow-y-auto border rounded-2xl p-3">
            {filteredLeaves.map((approval) => (
              <div key={approval.leave_id}>
                <h2 className="p-2 text-lg">
                  {formatDateToDay(approval.created_at)}
                </h2>

                <div className="grid grid-cols-12 gap-3 mb-4">
                  <div className={`border rounded-2xl col-span-5 p-4 relative ${approval.is_new === "NEW" ? "border-primary" : ""}`}>
                    <div className="flex justify-between items-center">
                      <h2 className="text-base text-default_text font-semibold mr-2">
                        <span className="capitalize text-primary">{approval.user_name + " "}</span>
                        {approval.leave_description}
                      </h2>
                      {approval.is_new === "NEW" && <span className="bg-primary text-white text-xs rounded-full px-3 py-2 self-start">New</span>}
                    </div>
                    <div className="flex justify-between items-center mt-2 mb-4">
                      <span className="text-xs text-default_text">{approval.time_ago}</span>
                      {approval.attachment && (
                        <a href={approval.attachment} download className="text-sm break-all text-primary underline" target="_blank">
                          Download Attachment
                        </a>
                      )}
                    </div>

                    <hr />

                    <div className="mt-2">
                      <div className="flex justify-between items-center mt-2 mb-4">
                        <span className="text-sm font-semibold">Approval Timeline</span>
                        {approval.reason && (
                          <>
                            <IoInformationCircleOutline
                              data-tooltip-id="my-tooltip"
                              data-tooltip-content={"Reason: " + approval.reason}
                              className="cursor-pointer h-5 w-5 bg-primary text-white rounded-full"
                            />
                            <Tooltip
                              id="my-tooltip"
                              place="right"
                              type="light"
                              effect="float"
                              style={{ maxWidth: "300px", whiteSpace: "normal", wordWrap: "break-word" }}
                            />
                          </>
                        )}
                      </div>
                      <div className="flex items-center justify-between mt-2">{renderApprovalTimeline(approval)}</div>
                    </div>
                  </div>

                  <div className="flex col-span-7 bg-[#F6F6F6] rounded-2xl">
                    {!approval.approved && !approval.rejected && approval.leave_status === "pending" && (
                      <div className="flex flex-col w-full p-4">
                        <div className="flex-grow">
                          <textarea
                            name="reason"
                            className={`p-4 text-base text-default_text w-full rounded-2xl border focus:outline-none focus:border-primary ${isTextareaEnabled(approval) ? "cursor-text bg-white" : "cursor-not-allowed bg-[#E4E4E4]"}`}
                            placeholder="Write note here"
                            style={{ height: "6em", resize: "none" }}
                            value={
                              role === "team_lead"
                                ? approval.reason_by_team_lead
                                : role === "HR"
                                  ? approval.reason_by_hr
                                  : role === "manager"
                                    ? approval.reason_by_manager
                                    : leaveReasons[approval.leave_id] ? leaveReasons[approval.leave_id] : ""
                            }
                            onChange={(e) => handleReasonChange(e, approval.leave_id)}
                            disabled={!isTextareaEnabled(approval)}
                          />
                          {errors[approval.leave_id] && <div className="text-darkred">{errors[approval.leave_id]}</div>}
                        </div>
                        <div className="flex space-x-4 justify-end">
                          {
                            approval.leave_status === "approved" ? (<>
                              <button className="cursor-default bg-white flex items-center text-green-500 py-6 px-14 justify-center border rounded-2xl">
                                <p>Approved</p>
                                <Check className="h-5 w-5 ml-2 bg-green-400 text-white rounded-full p-1" />
                              </button>
                            </>)
                              : (

                                <div className="flex justify-between items-center w-full">
                                  <div className="text-left text-italic text-sm">
                                    Leave request pending at
                                    <span className="mx-1 text_default_text text-base">{getPendingRole(approval) + "'s"}</span>
                                    end.
                                  </div>
                                  <div className="flex space-x-4">
                                    <button className={`${isButtonEnabled(approval) ? "cursor-pointer" : "cursor-not-allowed text-gray-400"}`} onClick={() => rejectLeave(approval.leave_id)} disabled={!isButtonEnabled(approval)}>
                                      <div className={`${isButtonEnabled(approval) ? "bg-white" : "bg-[#E4E4E4]"} shadow-sm px-10 py-3 text-xs my-2 rounded-full`}>
                                        <XMarkIcon className="h-5 w-5 bg-primary text-white rounded-full p-1" />
                                      </div>
                                      <p>Reject</p>
                                    </button>
                                    <button className={`${isButtonEnabled(approval) ? "cursor-pointer" : "cursor-not-allowed text-gray-400"}`} onClick={() => approveLeave(approval.leave_id)} disabled={!isButtonEnabled(approval)}>
                                      <div className={`${isButtonEnabled(approval) ? "bg-white" : "bg-[#E4E4E4]"} shadow-sm px-10 py-3 text-xs my-2 rounded-full`}>
                                        <Check className="h-5 w-5 bg-green-400 text-white rounded-full p-1" />
                                      </div>
                                      <p>Approve</p>
                                    </button>
                                  </div>
                                </div>
                              )}
                        </div>
                      </div>
                    )}
                    {(approval.leave_status === "approved" || approval.leave_status === "rejected") && (
                      <div className="flex flex-col w-full p-4">
                        <div className="flex-grow">
                          <textarea
                            name="reason"
                            className="p-4 text-base text-default_text w-full bg-[#E4E4E4] rounded-2xl border focus:outline-none focus:border-primary"
                            placeholder={
                              role === "team_lead"
                                ? approval.reason_by_team_lead
                                : role === "HR"
                                  ? approval.reason_by_hr
                                  : role === "manager"
                                    ? approval.reason_by_manager
                                    : "No reason added!"
                            }
                            style={{ height: "6em", resize: "none" }}
                            value={
                              role === "team_lead"
                                ? approval.reason_by_team_lead
                                : role === "HR"
                                  ? approval.reason_by_hr
                                  : role === "manager"
                                    ? approval.reason_by_manager
                                    : ""
                            }
                            disabled
                          />
                        </div>
                        <div className="flex space-x-4 justify-end">
                          <button className={`cursor-default bg-white flex items-center ${approval.leave_status === "approved" ? "text-green-500" : "text-darkred"} py-6 px-14 justify-center border rounded-2xl`}>
                            <p>{approval.leave_status === "approved" ? "Approved" : "Rejected"}</p>
                            {approval.leave_status === "approved" ? (
                              <Check className="h-5 w-5 ml-2 bg-green-400 text-white rounded-full p-1" />
                            ) : (
                              <XMarkIcon className="h-5 w-5 ml-2 bg-primary text-white rounded-full p-1" />
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              </div>

            ))}
          </div>
        ) : (
          <div className="text-gray-500 text-center flex my-48 justify-center text-xl">No Approvals!</div>
        )}
      </div>
    </div>
  );
};

export default ApprovalsComponent;
