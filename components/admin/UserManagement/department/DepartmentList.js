import React, { useState } from 'react';
import DataLoader from '../../../ui/dataLoader';
import { useRouter } from 'next/router';
import EditDepartmentComponent from './EditDepartment';
import { UseGetDepartments } from '../../../../hooks/query/admin/getDepartments';
import UseDeleteDepartment from '../../../../hooks/mutations/admin/deleteDepartment';
import DeleteItemModal from '../../../ui/deleteItemModal';
import Image from 'next/image';

export default function DepartmentListComponent({role}) {
    const { data: departmentList, isLoading } = UseGetDepartments();
    const deleteDepartment = UseDeleteDepartment();
    const [searchQuery, setSearchQuery] = useState('');
    const [editDepartment, setEditDepartment] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [departmentId, setDepartmentId] = useState(null);

    const router = useRouter();

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredDepartments = departmentList?.filter((Department) =>
        Department.department_name.toLowerCase().includes(searchQuery.toLowerCase())
    );


    const handleDeleteDepartment = () => {
        if (departmentId) {
            deleteDepartment.mutate(departmentId);
            closeModal();
        }
    };
    const openModal = (department) => {
        setDepartmentId(department.id);
        setModalVisible(true);
    };

    const closeModal = () => {
        setDepartmentId(null);
        setModalVisible(false);
    };
    const handleEditDepartment = (Department) => {
        setEditDepartment(Department);
    };


    return (
        <div className="p-4">
            {editDepartment ? (
                <EditDepartmentComponent DepartmentData={editDepartment} setEditDepartment={setEditDepartment} />
            ) : (
                <>
                    <div className="my-2">
                        <button onClick={() => { router.push(`/user_management/departments/create`) }} className="w-full p-2 text-white bg-primary hover:bg-lightblue cursor-pointer rounded-lg">
                            Create Departments
                        </button>
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        placeholder="Search Department..."
                        className="block w-full px-4 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:border-primary"
                    />
                    {isLoading ? (
                        <DataLoader />
                    ) : departmentList ? (
                        <div className="overflow-x-auto border rounded-lg min-h-screen overflow-y-auto">
                            <table className="min-w-full border-collapse bg-white">
                                <thead className="bg-gray-100 sticky top-0 z-20">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-default_text text-sm">
                                            Department
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
                                    {filteredDepartments.map((Department) => (
                                        <tr key={Department.id} className="hover:bg-grey">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-default_text">{Department.department_name}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="relative flex -space-x-3">
                                                    {Department?.team_members?.slice(0, 7).map((member, index) => (
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
                                                <button onClick={() => handleEditDepartment(Department)} className="text-primary hover:text-primary border border-primary p-2 rounded-lg">Edit</button>
                                                <button onClick={() => openModal(Department)} className="ml-2 text_default_text hover:text-opacity-80 border border-secondary p-2 rounded-lg">Delete</button>
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
            <DeleteItemModal  closeModal={closeModal} item={'department'} modalVisible={modalVisible} handleDeleteItem={handleDeleteDepartment} action={'delete'}/>
        </div>
    );
}
