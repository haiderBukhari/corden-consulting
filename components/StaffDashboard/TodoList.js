import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import useGetActiveUser from '../../hooks/query/getUserFromLocalStorage';
import { UseGetConfigurations } from '../../hooks/query/admin/getConfigurations';
import { UseGetProfile } from '../../hooks/query/getProfile';

function TodoList({ pendingApprovals, maxLeavesToShow = 10, height, isLoading, role, activeUserId }) {
	const { data: userProfile, isLoading: isLoadingUserprofile } = UseGetProfile(activeUserId);
	const [approvals, setApprovals] = useState([]);
	const router = useRouter();
	const { id } = router.query;
	const { data: user } = useGetActiveUser();
	const { data: configurations, isLoading: isLoadingConfigurations } = UseGetConfigurations();

	useEffect(() => {
		if (pendingApprovals && !isLoadingConfigurations) {
			const { leaves, salaries, loans } = pendingApprovals;
			let approvals = [];

			const isPendingAtCurrentRole = (leave) => {
				if (role === "team_lead") {
					return (
						leave.leave_status === "pending" &&
						leave.team_lead_status === "pending"
					);
				} else if (role === "HR") {
					if (leave.leave_user_role === "HR") {
						return false; // HR cannot approve their own leaves
					}
					if (leave.leave_status === "pending" && leave.hr_status === "pending") {
						if (leave.leave_user_role === "staff") {
							if (leave.user_team === "Yes") {
								return leave.team_lead_status === "approved";
							} else {
								return true; // HR is the first approver if no team
							}
						} else if (leave.leave_user_role === "team_lead" || leave.leave_user_role === "manager") {
							return true; // HR approves leaves from TL and Manager
						}
					}
					return false;
				} else if (role === "manager") {
					if (leave.leave_status === "pending" && leave.manager_status === "pending") {
						if (leave.leave_user_role === "staff") {
							const leaveDuration = parseFloat(leave.no_of_days);
							const noOfDaysConfig = configurations?.[0]?.no_of_days || 0;
							if (leaveDuration >= noOfDaysConfig) {
								if (leave.user_team === "Yes") {
									return (
										leave.team_lead_status === "approved" &&
										leave.hr_status === "approved"
									);
								} else {
									return leave.hr_status === "approved";
								}
							} else {
								return false; // Manager approval not required based on configurations
							}
						} else if (leave.leave_user_role === "team_lead") {
							return leave.hr_status === "approved"; // Manager approves after HR
						} else if (leave.leave_user_role === "HR") {
							// Manager approves HR's leaves directly
							return leave.hr_status === "pending" && leave.manager_status === "pending" && leave.leave_status === "pending";
						} else if (leave.leave_user_role === "manager") {
							// Manager approves other managers' leaves after HR
							return leave.hr_status === "approved";
						}
					}
					return false;
				}
				return false;
			};

			if (leaves && leaves.length > 0) {
				const filteredLeaves = leaves.filter(isPendingAtCurrentRole);
				approvals = approvals.concat(filteredLeaves.map(item => ({ ...item, type: 'leave' })));
			}

			const sortedApprovals = approvals
				.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
				.slice(0, maxLeavesToShow)
				.map(approval => ({
					...approval,
					isNew: (new Date() - new Date(convertDateFormat(approval.created_at))) / 60000 <= 5,
				}));

			let allApprovals = [...sortedApprovals];

			// Only if the user has access to the finance section, add salaries and loans
			if (userProfile?.access_finance_section === 1) {
				allApprovals = [
					...allApprovals,
					...(salaries?.map(item => ({ ...item, type: 'salary' })) || []),
					...(loans?.map(item => ({ ...item, type: 'loan' })) || []),
				];
			}

			setApprovals(allApprovals);
		} else {
			setApprovals([]);
		}
	}, [pendingApprovals, maxLeavesToShow, role, configurations, isLoadingConfigurations]);

	const convertDateFormat = (dateStr) => {
		if (!dateStr) return '';
		const parts = dateStr.split('-');
		if (parts.length === 3) {
			const [day, month, year] = parts;
			return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
		}
		return dateStr;
	};

	const generateRequestSummary = (item, listType) => {
		if (listType === 'leave') {
			return `${item.user_name} pending ${item.leave_type} leave for (${item.no_of_days} ${item.no_of_days == 1 ? ' day' : 'days'}) from ${item.start_date} to ${item.end_date}`;
		} else if (listType === 'salary') {
			return `${item.early_salary_details.requested_by}  has requested an advance salary of $${item.early_salary_details.es_amount} for ${item.early_salary_details.month}`;
		} else if (listType === 'loan') {
			return `${item.loan_details.requested_by} has request a loan of $${item.loan_details.loan_amount}  starting from ${item.loan_details?.first_payment_date}.`;
		}
		return '';
	};

	const handleApprovalClick = (approval) => {
    if (user.role === 'manager') {
      if (approval.type === 'leave') {
        router.push('/workforce/approvals');
      } else if (approval.type === 'loan') {
        router.push('/finances/workforce/loan/new_requests');
      } else if (approval.type === 'salary') { // advance salary
        router.push('/finances/workforce/advance-salary/new_requests');
      }
    } else {
      // Existing routing logic for other roles
      if (id) {
        router.push(
          user.role === 'team_lead'
            ? `/${user.role}/team/${id}/approvals`
            : `/workforce/people/${id}/approvals`
        );
      } else {
        router.push(user.role !== "team_lead" ? `/workforce/approvals` : `/${user.role}/team/approval`);
      }
    }
  };

	return (
		<div className="w-full border-2 border-primary shadow-lg rounded-lg p-4">
			<div className="flex justify-between items-center mb-4">
				<div className="flex items-center">
					<h2 className="text-default_text text-lg mr-3">
						Todo list
					</h2>
				</div>
				<Link href={id ? (user.role === 'team_lead' ? `/${user.role}/team/${id}/approvals` : `/workforce/people/${id}/approvals`) : (user.role !== "team_lead" ? `/workforce/approvals` : `/${user.role}/team/approval`)}>
					{/* <span className="text-primary font-semibold underline hover:text-blue-900 transition-colors duration-300 text-sm">View All</span> */}
				</Link>
			</div>
			{isLoading || isLoadingUserprofile ? (
				<div style={{ height: height }} className="">
					<div className="flex justify-center pt-24 items-center">
						<div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
					</div>
				</div>
			) : approvals && approvals?.length > 0 ? (
				<div>
					<div className="flex items-center pb-3">
						<p className="text-lg font-semibold text-primary mr-2">
							Pending {user?.role === 'manager' ? 'Approvals' : 'Leave Approvals'}
						</p>
						<span className="inline-flex items-center justify-center h-5 p-2 w-5 rounded-full bg-primary text-white text-sm font-semibold">
							{approvals.length}
						</span>
					</div>
					<div className="overflow-y-auto pr-2" style={{ height: height }}>
						{approvals.map(approval => (
							<div
								key={approval.id || approval.leave_id || approval.loan_id || approval.salary_id}
								onClick={() => handleApprovalClick(approval)}
								className={`bg-grey border rounded-lg p-2 mb-4 shadow-md cursor-pointer transform transition duration-300 hover:shadow-lg hover:scale-90 hover:bg-primary hover:bg-opacity-45 ${approval.isNew ? 'border-primary' : 'hover:border-primary'}`}
							>
								<div className="flex justify-between items-start text-sm">
									<div>
										<p className="text-default_text font-semibold mb-2 capitalize">
											{generateRequestSummary(approval, `${approval.type}`)}
										</p>
										<div className="flex items-center space-x-2">
											{approval.type == 'loan' &&
												<span className="text-xs text_default_text">{approval.time_ago}</span>
											}
											{approval?.isNew && (
												<span className="text-xs bg-red-600 text-white rounded-full px-2 py-1">New</span>
											)}

											<span className="text-xs bg-primary bg-opacity-45 text-white rounded-full px-4 py-1 capitalize">{approval.type}</span>

										</div>
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			) : (
				<div className="flex items-center justify-center mb-12 text_default_text text-center " style={{ height: height }}>
					No Pending Todo!
				</div>
			)}
		</div>
	);
}

export default TodoList;
