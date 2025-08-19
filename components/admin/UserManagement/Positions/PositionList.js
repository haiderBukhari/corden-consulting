import React, { useState } from 'react';
import { UseGetPositions } from '../../../../hooks/query/admin/getPositions';
import DataLoader from '../../../ui/dataLoader';
import { useRouter } from 'next/router';
import EditPositionComponent from './EditPosition';
import UseDeletePosition from '../../../../hooks/mutations/admin/deletePosition';
import DeleteItemModal from '../../../ui/deleteItemModal';
import Image from 'next/image';

export default function PositionListComponent() {
    const { data: positionsData, isLoading } = UseGetPositions();
    const deletePosition = UseDeletePosition();
    const [searchQuery, setSearchQuery] = useState('');
    const [editPosition, setEditPosition] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [positionId, setPositionId] = useState(null);

    const router = useRouter();

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredPositions = positionsData?.filter((position) =>
        position.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDeletePosition = () => {
        if (positionId) {
            deletePosition.mutate(positionId);
            closeModal();
        }
    };
    const openModal = (position) => {
        setPositionId(position.id);
        setModalVisible(true);
    };

    const closeModal = () => {
        setPositionId(null);
        setModalVisible(false);
    };


    const handleEditPosition = (position) => {
        setEditPosition(position);
    };


    return (
        <div className="p-4">
            {editPosition ? (
                <EditPositionComponent positionData={editPosition} setEditPosition={setEditPosition} />
            ) : (
                <>
                    <div className="my-2">
                        <button onClick={() => { router.push("/user_management/positions/create") }} className="w-full p-2 text-white bg-primary hover:bg-lightblue cursor-pointer rounded-lg">
                            Create Positions
                        </button>
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search position..."
                        className="block w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:border-primary"
                    />
                    {isLoading ? (
                        <DataLoader />
                    ) : positionsData ? (
                        <div className="overflow-x-auto border rounded-lg min-h-screen overflow-y-auto">
                            <table className="min-w-full border-collapse bg-white">
                                <thead className="bg-gray-100 sticky top-0 z-20">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-default_text text-sm">
                                            Position
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
                                    {filteredPositions.map((position) => (
                                        <tr key={position.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-default_text">{position.name}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="relative flex -space-x-3">
                                                    {position?.team_members?.slice(0, 7).map((member, index) => (
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
                                                <button onClick={() => handleEditPosition(position)} className="text-primary hover:text-primary border border-primary p-2 rounded-lg">Edit</button>
                                                <button onClick={() => openModal(position)} className="ml-2 text_default_text hover:text-opacity-80 border border-secondary p-2 rounded-lg">Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div>No Data</div>
                    )}
                </>
            )}
            <DeleteItemModal closeModal={closeModal} item={'position'} modalVisible={modalVisible} handleDeleteItem={handleDeletePosition} action={'delete'}/>
        </div>
    );
}
