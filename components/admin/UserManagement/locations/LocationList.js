import React, { useState } from 'react';
import DataLoader from '../../../ui/dataLoader';
import DeleteItemModal from '../../../ui/deleteItemModal';
import EditLocationModal from './EditLocation';
import CreateLocationModal from './createLocation';
import { UseGetLocations } from '../../../../hooks/query/admin/getLocations';
import UseDeleteLocations from '../../../../hooks/mutations/admin/deleteLocation';
import Image from 'next/image';
import SettingForm from './SettingForm';
import { useRouter } from 'next/router';

export default function LocationListComponent({ role }) {
	const { data: locationsList, isLoading } = UseGetLocations();
	const deleteLocation = UseDeleteLocations();
	const [searchQuery, setSearchQuery] = useState('');
	const [editLocation, setEditLocation] = useState(null);
	const [createLocation, setCreateLocation] = useState(false)
	const [modalVisible, setModalVisible] = useState(false);
	const [locationId, setLocationId] = useState(null);
	const [showSettingPage, setShowSettingPage] = useState(false);
	const router=useRouter()

	const handleSearchChange = (event) => {
		setSearchQuery(event.target.value);
	};

	const filteredLocations = locationsList?.filter((location) =>
		location.name.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const handleDeleteLocation = () => {
		if (locationId) {
			deleteLocation.mutate(locationId);
			closeModal();
		}
	};

	const openModal = (location) => {
		setLocationId(location.id);
		setModalVisible(true);
	};
	

	const closeModal = () => {
		setLocationId(null);
		setModalVisible(false);
	};
	const showSetting = (location) => {
		setShowSettingPage(true)
		setLocationId(location)
	}
	const showShiftSetting = (location) => {
		router.push(`/user_management/locations/${location.id}`)
		
	}

	const handleEditLocation = (location) => {
		setEditLocation(location);
	};

	return (
		<div className="p-4">
			{showSettingPage ?
				<SettingForm location={locationId} setShowSettingPage={setShowSettingPage} />
				:
				<div>
					<div className="my-2">
						<button onClick={() => { setCreateLocation(true) }} className="w-full p-2 text-white bg-primary hover:bg-lightblue cursor-pointer rounded-lg">
							Create Locations
						</button>
					</div>
					<input
						type="text"
						value={searchQuery}
						onChange={handleSearchChange}
						placeholder="Search location..."
						className="block w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:border-primary"
					/>
					{isLoading ? (
						<DataLoader />
					) : locationsList ? (
						<div className="overflow-x-auto border rounded-lg min-h-screen overflow-y-auto">
							<table className="min-w-full border-collapse bg-white">
								<thead className="bg-gray-100 sticky top-0 z-20">
									<tr>
										<th className="px-4 py-2 text-left text-default_text text-sm">
											Office
										</th>
										<th className="px-4 py-2 text-left text-default_text text-sm">
											Office Manager
										</th>
										<th className="px-4 py-2 text-left text-default_text text-sm">
											Managers
										</th>
										<th className="px-4 py-2 text-left text-default_text text-sm">
											Team Leaders
										</th>
										<th className="px-4 py-2 text-left text-default_text text-sm">
											Team Members
										</th>
										<th className="px-4 py-2 text-left text-default_text text-sm">
											Actions
										</th>
									</tr>
								</thead>
								<tbody className="bg-white divide-y divide-gray-200">
									{filteredLocations.map((location) => (
										<tr key={location.id} className="hover:bg-gray-50">
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="text-sm font-medium text-default_text">{location.name}</div>
											</td>
											<td className="px-3 py-4 whitespace-nowrap">
												<div className="text-sm font-medium text-default_text capitalize">{location?.manager ? location?.manager?.fname + " "+location?.manager?.middle_name+" "+ location?.manager?.lname: "No Office Manager"}</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="relative flex -space-x-3">
													{location?.team_members
														?.filter(member => member.role === 'manager')
														?.map((member, index) => (
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
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="relative flex -space-x-3">
													{location?.team_members
														?.filter(member => member.role === 'team_lead')
														.splice(0, 4)
														?.map((member, index) => (
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
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="relative flex -space-x-3">
													{location?.team_members
														?.filter(member => member.role !== 'manager' && member.role !== 'team_lead')
														.slice(0, 4)
														?.map((member, index) => (
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

												<button onClick={() => handleEditLocation(location)} className="text-primary hover:text-primary border border-primary p-2 rounded-lg">Edit</button>

												<button onClick={() => openModal(location)} className="ml-2 text-default_text hover:text-opacity-80 border border-secondary p-2 rounded-lg">Delete</button>
												{/* {role !== 'HR' && */}
												<button onClick={() => showSetting(location)} className="ml-2 text-yellow-500 hover:text-yellow-700 border border-yellow-700 p-2 rounded-lg">Setting</button>
												<button onClick={() => showShiftSetting(location)} className="ml-2 text-green-500 hover:text-green-700 border border-green-700 p-2 rounded-lg">Shift Timing</button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					) : (
						<div className='min-h-screen overflow-y-auto bg-white'>No Data</div>
					)}
				</div>
			}
			{createLocation &&
				<CreateLocationModal setCreateLocation={setCreateLocation} />
			}
			{editLocation &&
				<EditLocationModal locationData={editLocation} setEditLocation={setEditLocation} />
			}

			
            <DeleteItemModal closeModal={closeModal} item={'location'} modalVisible={modalVisible} handleDeleteItem={handleDeleteLocation} action={'delete'}/>

        </div>
    );
}
