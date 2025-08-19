import React, { useState } from 'react';
import DataLoader from '../../ui/dataLoader';
import { useRouter } from 'next/router';
import EditTeamComponent from './EditTeam';
import { UseGetTeams } from '../../../hooks/query/admin/getTeamList';
import UseDeleteTeams from '../../../hooks/mutations/admin/deleteTeam';
import Image from 'next/image';
import DeleteItemModal from '../../ui/deleteItemModal';

export default function TeamListComponent() {
	const { data: teamList, isLoading } = UseGetTeams();
	const deleteTeam = UseDeleteTeams();
	const [searchQuery, setSearchQuery] = useState('');
	const [editTeam, setEditTeam] = useState(null);
	const [modalVisible, setModalVisible] = useState(false);
	const [teamIdToDelete, setTeamIdToDelete] = useState(null);

	const router = useRouter();

	const handleSearchChange = (event) => {
		setSearchQuery(event.target.value);
	};

	const filteredTeams = teamList?.filter((team) => {
		const query = searchQuery.toLowerCase();
		return (
			team.team_name.toLowerCase().includes(query) ||
			(team.department && team.department.toLowerCase().includes(query)) ||
			(team.team_lead && team.team_lead.toLowerCase().includes(query)) ||
			(team.team_members && team.team_members.some(member => member.name.toLowerCase().includes(query)))
		);
	});

	const handleDeleteItem = () => {
		if (teamIdToDelete) {
			deleteTeam.mutate(teamIdToDelete, {
				onSettled: () => {
					closeModal();
				},
			});
		}
	};

	const handleEditTeam = (team) => {
		setEditTeam(team);
	};

	const openModal = (id) => {
		setTeamIdToDelete(id);
		setModalVisible(true);
	};

	const closeModal = () => {
		setTeamIdToDelete(null);
		setModalVisible(false);
	};

	return (
		<div className="p-4 min-h-screen">
			{editTeam ? (
				<EditTeamComponent teamData={editTeam} setEditTeam={setEditTeam} />
			) : (
				<>
					<div className="my-2">
						<button onClick={() => { router.push("/user_management/teams/create") }} className="w-full p-2 text-white bg-primary hover:bg-primary hover:opacity-80 cursor-pointer rounded-lg">
							Create Teams
						</button>
					</div>
					<input
						type="text"
						value={searchQuery}
						onChange={handleSearchChange}
						placeholder="Search Team..."
						className="block w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:border-primary"
					/>
					{isLoading ? (
						<DataLoader />
					) : teamList ? (
						<div className="overflow-x-auto border rounded-lg min-h-screen overflow-y-auto">
							<table className="min-w-full border-collapse bg-white">
								<thead className="bg-gray-100 sticky top-0 z-20">
									<tr>
										<th className="px-4 py-2 text-left text-default_text text-sm">
											Team Name
										</th>

										<th className="px-4 py-2 text-left text-default_text text-sm">
											Team Leader
										</th>
										<th className="px-4 py-2 text-left text-default_text text-sm">
											Members
										</th>
										<th className="px-4 py-2 text-left text-default_text text-sm">
											Actions
										</th>
									</tr>
								</thead>
								<tbody className="bg-white divide-y divide-gray-200">
									{filteredTeams.map((team) => (
										<tr key={team.id} className="hover:bg-gray-50">
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="text-sm font-medium text-default_text">{team.team_name}</div>
											</td>

											<td className="px-6 py-4 whitespace-nowrap">
												<div className="text-sm font-medium text-default_text">{team.team_lead}</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="relative flex -space-x-3">
													{team?.team_members?.slice(0, 7).map((member, index) => (
														<div key={member.id} className={`relative z-10 ${index !== 0 ? '-ml-3' : ''}`}>
															<Image
																src={member?.avatar}
																alt={`${member.name}'s avatar`}
																className="h-9 w-9 rounded-full border-2 border-white"
																height={200}
																width={400}
															/>
														</div>
													))}
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
												<button onClick={() => handleEditTeam(team)} className="text-primary hover:text-primary border border-primary p-2 rounded-lg">Edit</button>
												<button onClick={() => openModal(team.id)} className="ml-2 text-default_text hover:text-default_text border border-secondary p-2 rounded-lg">Delete</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					) : (
						<div className='min-h-screen'>No Data</div>
					)}
				</>
			)}

			<DeleteItemModal
				modalVisible={modalVisible}
				closeModal={closeModal}
				handleDeleteItem={handleDeleteItem}
				item="team"
				action="delete"
			/>
		</div>
	);
}
