import React, { useState } from 'react';
import DataLoader from '../../../ui/dataLoader';
import { useRouter } from 'next/router';
import DeleteItemModal from '../../../ui/deleteItemModal';
import Image from 'next/image';
import EditBranchComponent from './EditBranch';
import UseDeleteBranch from '../../../../hooks/mutations/admin/deleteBranch';
import { UseGetBranchList } from '../../../../hooks/query/admin/getBranches';

export default function BranchListComponent() {
    const { data: branchsData, isLoading } = UseGetBranchList();
    const deletebranch = UseDeleteBranch();
    const [searchQuery, setSearchQuery] = useState('');
    const [editbranch, setEditbranch] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [branchId, setbranchId] = useState(null);

    const router = useRouter();

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredbranchs = branchsData?.filter((branch) =>
        branch.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDeletebranch = () => {
        if (branchId) {
            deletebranch.mutate(branchId);
            closeModal();
        }
    };
    const openModal = (branch) => {
        setbranchId(branch.id);
        setModalVisible(true);
    };

    const closeModal = () => {
        setbranchId(null);
        setModalVisible(false);
    };


    const handleEditbranch = (branch) => {
        setEditbranch(branch);
    };


    return (
        <div className="p-4">
            {editbranch ? (
                <EditBranchComponent branchData={editbranch} setEditbranch={setEditbranch} />
            ) : (
                <>
                    <div className="my-2">
                        <button onClick={() => { router.push("/user_management/branch/create") }} className="w-full p-2 text-white bg-primary hover:bg-lightblue cursor-pointer rounded-lg">
                            Create Branches
                        </button>
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search branch..."
                        className="block w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:border-primary"
                    />
                    {isLoading ? (
                        <DataLoader />
                    ) : branchsData ? (
                        <div className="overflow-x-auto border rounded-lg min-h-screen overflow-y-auto">
                            <table className="min-w-full border-collapse bg-white">
                                <thead className="bg-gray-100 sticky top-0 z-20">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-default_text text-sm">
                                            Branch
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
                                    {filteredbranchs.map((branch) => (
                                        <tr key={branch.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-default_text">{branch.name}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="relative flex -space-x-3">
                                                    {branch?.team_members?.map((member, index) => (
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
                                                <button onClick={() => handleEditbranch(branch)} className="text-primary hover:text-primary border border-primary p-2 rounded-lg">Edit</button>
                                                <button onClick={() => openModal(branch)} className="ml-2 text_default_text hover:text-opacity-80 border border-secondary p-2 rounded-lg">Delete</button>
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
            <DeleteItemModal closeModal={closeModal} item={'branch'} modalVisible={modalVisible} handleDeleteItem={handleDeletebranch} action={'delete'}/>
        </div>
    );
}
