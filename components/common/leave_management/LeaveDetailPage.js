import React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft } from 'lucide-react';
import { getStatusClass } from '../GeneralListComponent';
import DataLoader from '../../ui/dataLoader';
import { UseGetLeaveDetail } from '../../../hooks/query/getLeaveDetail';
import { UseGetConfigurations } from '../../../hooks/query/admin/getConfigurations';
import ApproveLeaveModal from '../../ui/hrApproveLeaveModal';

export default function LeaveDetailPage({ isIndividualUser = false, isTeam, role }) {
	const formatActionTimestamp = (timestamp) => {
		if (!timestamp) return { date: null, time: null };
		const [date, time, meridian] = timestamp.split(' ');
		return { date, time: `${time} ${meridian}` };
	};
	const router = useRouter();
	const { id } = router.query;

	const { data: leaveDetail, isLoading: isLoadingLeaveDetail } = UseGetLeaveDetail(id);
	const { data: configurations, isLoading: isLoadingConfigurations } = UseGetConfigurations();
	const [isModalOpen, setModalOpen] = useState(false);
	const [selectedRole, setSelectedRole] = useState(null);

	// Determine the approval steps based on leave_user_role
	const getApprovalSteps = () => {
		if (!leaveDetail) return [];

		const { leave_user_role, no_of_days, user_team, team_lead_action_at, hr_action_at, manager_action_at } = leaveDetail;
		const config_no_of_days = configurations ? parseInt(configurations[0]?.no_of_days, 10) : 0;
		const leaveDuration = parseFloat(no_of_days);

		

		const actionTimestamps = {
			team_lead_action_at: formatActionTimestamp(team_lead_action_at),
			hr_action_at: formatActionTimestamp(hr_action_at),
			manager_action_at: formatActionTimestamp(manager_action_at),
		};

		if (leave_user_role === 'staff') {
			if (user_team === 'Yes') {
				if (leaveDuration < config_no_of_days) {
					// Do not include Manager step
					return [
						{
							role: 'Team Lead',
							name: 'team_lead',
							statusKey: 'team_lead_status',
							reasonKey: 'reason_by_team_lead',
							actionAt: actionTimestamps.team_lead_action_at,
						},
						{
							role: 'HR',
							name: 'hr',
							statusKey: 'hr_status',
							reasonKey: 'reason_by_hr',
							actionAt: actionTimestamps.hr_action_at,
						},
					];
				} else {
					// Include Manager step
					return [
						{
							role: 'Team Lead',
							name: 'team_lead',
							statusKey: 'team_lead_status',
							reasonKey: 'reason_by_team_lead',
							actionAt: actionTimestamps.team_lead_action_at,
						},
						{
							role: 'HR',
							name: 'hr',
							statusKey: 'hr_status',
							reasonKey: 'reason_by_hr',
							actionAt: actionTimestamps.hr_action_at,
						},
						{
							role: 'Manager',
							name: 'manager',
							statusKey: 'manager_status',
							reasonKey: 'reason_by_manager',
							actionAt: actionTimestamps.manager_action_at,
						},
					];
				}
			} else {
				// user_team === 'No'
				if (leaveDuration < config_no_of_days) {
					// Only HR is involved
					return [
						{
							role: 'HR',
							name: 'hr',
							statusKey: 'hr_status',
							reasonKey: 'reason_by_hr',
							actionAt: actionTimestamps.hr_action_at,
						},
					];
				} else {
					// HR and Manager are involved
					return [
						{
							role: 'HR',
							name: 'hr',
							statusKey: 'hr_status',
							reasonKey: 'reason_by_hr',
							actionAt: actionTimestamps.hr_action_at,
						},
						{
							role: 'Manager',
							name: 'manager',
							statusKey: 'manager_status',
							reasonKey: 'reason_by_manager',
							actionAt: actionTimestamps.manager_action_at,
						},
					];
				}
			}
		} else if (leave_user_role === 'team_lead') {
			return [
				{
					role: 'HR',
					name: 'hr',
					statusKey: 'hr_status',
					reasonKey: 'reason_by_hr',
					actionAt: actionTimestamps.hr_action_at,
				},
				{
					role: 'Manager',
					name: 'manager',
					statusKey: 'manager_status',
					reasonKey: 'reason_by_manager',
					actionAt: actionTimestamps.manager_action_at,
				},
			];
		} else if (leave_user_role.toLowerCase() === 'hr') {
			return [
				{
					role: 'Manager',
					name: 'manager',
					statusKey: 'manager_status',
					reasonKey: 'reason_by_manager',
					actionAt: actionTimestamps.manager_action_at,
				},
			];
		} else if (leave_user_role === 'manager') {
			// For leaves applied by managers: HR -> Manager
			return [
				{
					role: 'HR',
					name: 'hr',
					statusKey: 'hr_status',
					reasonKey: 'reason_by_hr',
					actionAt: actionTimestamps.hr_action_at,
				},
				{
					role: 'Manager',
					name: 'manager',
					statusKey: 'manager_status',
					reasonKey: 'reason_by_manager',
					actionAt: actionTimestamps.manager_action_at,
				},
			];
		} else {
			return [];
		}
	};


	const openApproveModal = (role) => {
		setSelectedRole(role);
		setModalOpen(true);
	};

	// Build the approvals array dynamically
	// Build the approvals array dynamically
	const approvalSteps = getApprovalSteps();
	let approvals = [];

	for (let step of approvalSteps) {
		const status = leaveDetail[step.statusKey];

		// Access the actionAt object directly from the step
		const actionAt = step.actionAt.date ? `${step.actionAt.date} ${step.actionAt.time}` : 'Not Found';

		const approval = {
			role: step.role,
			status: status,
			name: leaveDetail[step.name],
			reason: leaveDetail[step.reasonKey],
			actionAt: actionAt // Use the formatted actionAt
		};
		approvals.push(approval);
	}
	// If the leave is cancelled, add cancellation details to the approvals array
	if (leaveDetail?.leave_status === 'cancelled') {
		const cancel_at = formatActionTimestamp(leaveDetail?.cancel_action_at)
		const actionAt = cancel_at.date ? `${cancel_at.date} ${cancel_at.time}` : 'Not Found';
		approvals.push({
			role: `${leaveDetail?.cancel_by_role}`,
			status: 'cancelled',
			reason: leaveDetail?.cancel_reason,
			name: leaveDetail?.cancel_by,
			actionAt: actionAt
		});
	}
	const shouldShowActionHeader = role === 'HR' && leaveDetail?.leave_status === "pending" &&
		approvals.some(approval => approval.status === 'pending' && approval.role !== 'HR');

	return (

		<div className="p-3 min-h-screen">
			{
				isLoadingLeaveDetail || isLoadingConfigurations ? (
					<DataLoader />
				) : (
					leaveDetail &&
					<>
						<button
							onClick={() =>
								router.push(isIndividualUser ? '/leave_management/overview' : isTeam ? "/team_lead/team/leave_list" : '/workforce/leave/list')
							}
							type="button"
							className="flex space-x-2 items-center px-2 py-1 text-white bg-primary rounded-xl mb-3"
						>
							<ArrowLeft className="text-white h-5 w-5" />
							<span>Back</span>
						</button>

						{/* Leave Information Section */}
						<div className="bg-white p-6 rounded-lg shadow-md">
							{/* Leave Information Section */}
							<div className="mb-6">
								<h2 className="text-xl font-semibold text-primary mb-4">
									<span className="capitalize">{leaveDetail?.user_name}&nbsp;</span>
									<span>{leaveDetail?.leave_description}</span>
								</h2>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
									<div>
										<span className="font-semibold">Leave Duration:</span>{' '}
										<span className="">
											{leaveDetail?.start_date} to {leaveDetail?.end_date}
										</span>
									</div>
									<div>
										<span className="font-semibold">Number of Days:</span>{' '}
										<span className="capitalize">{leaveDetail?.no_of_days}</span>
									</div>
									<div>
										<span className="font-semibold">Day Type:</span>{' '}
										<span className="capitalize">
											{leaveDetail?.day_type}{' '}
											{leaveDetail?.half_type === 'first_half'
												? '(First Half)'
												: leaveDetail?.half_type === 'second_half'
													? '(Second Half)'
													: ''}
										</span>
									</div>
									<div>
										<span className="font-semibold">Submitted:</span>{' '}
										<span className="">{leaveDetail?.time_ago}</span>
									</div>
									<div>
										<span className="font-semibold">Leave Type:</span>{' '}
										<span className="capitalize">{leaveDetail?.leave_type} Leave</span>
									</div>
									<div>
										<span className="font-semibold">Requested by:</span>{' '}
										<span className="capitalize">
											{leaveDetail?.user_name} ({leaveDetail?.leave_user_role?.replace(/_/g, ' ')})
										</span>
									</div>
									<div className="md:col-span-2">
										<span className="font-semibold">Reason for Leave:</span>{' '}
										<span className="">{leaveDetail?.reason}</span>
									</div>
								</div>

								{leaveDetail?.attachment && (
									<div className="mt-6">
										<a
											href={leaveDetail?.attachment}
											download
											className="text-primary underline hover:text-primary"
											target="_blank"
											rel="noopener noreferrer"
										>
											View Attachment
										</a>
									</div>
								)}
							</div>
						</div>

						{/* Approval Status Section */}
						<div className="mt-8 bg-white p-6 rounded-lg shadow-md">
							<h2 className="text-xl font-bold text-default_text mb-6">Approval Status</h2>

							{/* Approval Table */}
							<div className="overflow-x-auto">
								<table className="min-w-full border-collapse bg-white">
									<thead>
										<tr className="bg-gray-100 text-gray-700">
											<th className="border p-4 font-semibold text-left">Role</th>
											<th className="border p-4 font-semibold text-left">Name</th>
											<th className="border p-4 font-semibold text-left">Status</th>
											<th className="border p-4 font-semibold text-left">Reason</th>
											<th className="border p-4 font-semibold text-left">Date Time</th>
											{shouldShowActionHeader &&
												<th className="border p-4 font-semibold text-left">Action</th>
											}
										</tr>
									</thead>
									<tbody>
										{approvals.length > 0 ? (
											approvals.map((approval, index) => (
												<tr key={index} className="hover:bg-gray-50">
													<td className="border p-4 font-semibold capitalize">{approval.role}</td>
													<td className="border p-4 font-semibold capitalize">{approval.name}</td>
													<td className={`border p-4 capitalize ${getStatusClass(approval.status)}`}>
														{approval.status}
														{approval.role === "Manager" && leaveDetail?.update_behalf_of_manager === 1 && (
															<span className="text-sm text-primary font-semibold ml-2">
																(HR {leaveDetail?.leave_status} leave on behalf of Manager)
															</span>
														)}
														{approval.role === "Team Lead" && leaveDetail?.update_behalf_of_team_lead === 1 && (
															<span className="text-sm text-primary font-semibold ml-2">
																(HR approved leave on behalf of Team Lead)
															</span>
														)}
													</td>
													<td className="border p-4">{approval.reason || 'Not Added'}</td>

													<td className="border p-4">{approval.actionAt || 'Not Added'}</td>
													{role === 'HR' && leaveDetail?.leave_status === "pending" && (
														<td className="border p-4">
															{approval.status === 'pending' && (
																(approval.role === 'Team Lead' ||
																	(approval.role === 'Manager' && leaveDetail?.hr_status == 'approved')
																) && (
																	<button
																		onClick={() => openApproveModal(approval.role)}
																		className="text-white bg-primary px-4 py-2 rounded-xl"
																	>
																		Approve Leave on behalf of {approval.role}
																	</button>
																)
															)}
														</td>
													)}
												</tr>
											))
										) : (
											<tr>
												<td colSpan="3" className="border p-4 text-center text-gray-500">
													No approval steps required.
												</td>
											</tr>
										)}
									</tbody>
								</table>
							</div>


						</div>

						{/* Approve Leave Modal */}
						{isModalOpen && (
							<ApproveLeaveModal
								isOpen={isModalOpen}
								onClose={() => setModalOpen(false)}
								role={selectedRole}
								leaveId={id}
							/>
						)}
					</>
				)
			}
		</div >
	);
}



