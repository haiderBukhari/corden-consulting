import React, { useState } from 'react';
import DataLoader from '../../../ui/dataLoader';
import DeleteItemModal from '../../../ui/deleteItemModal';
import EditRegion from './EditRegion';
import UseDeleteLocations from '../../../../hooks/mutations/admin/deleteLocation';
import CreateRegion from './CreateRegion';
import { UseGetRegions } from '../../../../hooks/query/admin/getRegions';
import UseDeleteRegion from '../../../../hooks/mutations/admin/regions/deleteRegion';

export default function RegionListComponent({ role }) {

	const { data: regionList, isLoading } = UseGetRegions()
	const deleteRegions = UseDeleteRegion();
	const [searchQuery, setSearchQuery] = useState('');
	const [editRegion, setEditRegion] = useState(null);
	const [createRegion, setCreateRegion] = useState(false)
	const [modalVisible, setModalVisible] = useState(false);
	const [locationId, setLocationId] = useState(null);

	
	const handleSearchChange = (event) => {
		setSearchQuery(event.target.value);
	};

	const filteredRegions = regionList?.filter((region) =>
		region.name.toLowerCase().includes(searchQuery.toLowerCase())
	);
	
	const handleDeleteRegion = () => {
		if (locationId) {
			deleteRegions.mutate(locationId);
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


	const handleEditLocation = (region) => {
		setEditRegion(region);
	};

	return (
		<div className="p-4">

			<div>
				<div className="my-2">
					<button onClick={() => { setCreateRegion(true) }} className="w-full p-2 text-white bg-primary hover:bg-lightblue cursor-pointer rounded-lg">
						Create Regions
					</button>
				</div>
				<input
					type="text"
					value={searchQuery}
					onChange={handleSearchChange}
					placeholder="Search Region..."
					className="block w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:border-primary"
				/>
				{isLoading ? (
					<DataLoader />
				) : regionList ? (
					<div className="overflow-x-auto border rounded-lg min-h-screen overflow-y-auto">
						<table className="min-w-full border-collapse bg-white">
							<thead className="bg-grey sticky top-0 z-20">
								<tr>
									<th className="px-4 py-2 text-left text-default_text text-sm">
										Regions
									</th>
									<th className="px-4 py-2 text-left text-default_text text-sm">
										Location
									</th>

									<th className="px-4 py-2 text-left text-default_text text-sm">
										Actions
									</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{filteredRegions.map((region) => (
									<tr key={region.id} className="hover:bg-gray-50">
										<td className="px-6 py-4 whitespace-nowrap">
											<div className="text-sm font-medium text-default_text">{region.name}</div>
										</td>
										<td className="p-2  ">
											<div className=" grid grid-cols-4 gap-x-5 gap-y-3">
												{region?.locations

												?.map((loc, index) => (
														<div key={loc.id} className={`p-2 text-sm border bg-slate-100 rounded-md  `}>
															{loc.name}
														</div>
													))}
											</div>
										</td>


										<td className="px-6 py-4 whitespace-nowrap text-sm font-medium">

											<button onClick={() => handleEditLocation(region)} className="text-primary hover:text-primary border border-primary p-2 rounded-lg">Edit</button>

											<button onClick={() => openModal(region)} className="ml-2 text-default_text hover:text-opacity-80 border border-secondary p-2 rounded-lg">Delete</button>

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

			{createRegion &&
				<CreateRegion setCreateRegion={setCreateRegion} />
			}
			{editRegion &&
				<EditRegion regionData={editRegion} setEditRegion={setEditRegion} />
			}

			<DeleteItemModal closeModal={closeModal} item={'Region'} modalVisible={modalVisible} handleDeleteItem={handleDeleteRegion} action={'delete'} />
		</div>
	);
}
