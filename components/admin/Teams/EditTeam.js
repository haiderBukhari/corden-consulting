import React, { useEffect, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { UseGetUsers } from '../../../hooks/query/admin/getUserList';
import { successToaster } from '../../../utils/toaster';
import DataLoader from '../../ui/dataLoader';
import { ArrowLeft } from 'lucide-react';
import UseEditTeam from '../../../hooks/mutations/admin/editTeam';
import Image from 'next/image';

const EditTeamComponent = ({ teamData, setEditTeam }) => {
    const { mutate, isLoading } = UseEditTeam();
    const { data: UserList, isLoading: isLoadingUsers } = UseGetUsers();
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredMembers, setFilteredMembers] = useState([]);

    useEffect(() => {
        if (UserList && teamData.team_members) {
            const preSelectedIds = new Set(teamData.team_members.map(member => member.id));
            const preSelectedMembers = UserList.filter(user => preSelectedIds.has(user.id) && user.role === 'staff');
            const remainingMembers = UserList.filter(user => user.role === 'staff' && user.team === "No Team" && !preSelectedIds.has(user.id));
            setFilteredMembers([...preSelectedMembers, ...remainingMembers]);
        }
    }, [UserList, teamData]);

    const validationSchema = Yup.object().shape({
        departmentName: Yup.string().required('Team name is required'),
        TeamLeader: Yup.string().required('Team Leader is required'),
        selectedMembers: Yup.array(),
    });

    const formik = useFormik({
        initialValues: {
            departmentName: teamData.team_name,
            TeamLeader: teamData.team_lead_id,
            selectedMembers: teamData.team_members ? teamData.team_members.map(member => member.id) : [],
        },
        validationSchema,
        onSubmit: (values) => {
            const formData = new FormData();
            formData.append("team_id", teamData.id);
            formData.append("team_name", values.departmentName);
            formData.append("team_lead_id", values.TeamLeader);
            formData.append("members", JSON.stringify(values.selectedMembers));
            mutate(formData, {
                onSuccess: () => {
                    successToaster("Team edited successfully!");
                    setEditTeam(null);
                }
            });
        },
    });

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
        const searchQuery = event.target.value.toLowerCase();
        const preSelectedIds = new Set(teamData.team_members.map(member => member.id));
        const filtered = UserList.filter(user =>
            user.role === 'staff' &&
            user.team === "No Team" &&
            (preSelectedIds.has(user.id) ||
                (user.name.toLowerCase().includes(searchQuery) ||
                    user.email.toLowerCase().includes(searchQuery) ||
                    user.location?.name.toLowerCase().includes(searchQuery))
            )
        );
        setFilteredMembers(filtered);
    };

    const handleMemberChange = (memberId) => {
        const isSelected = formik.values.selectedMembers.includes(memberId);
        const newSelectedMembers = isSelected
            ? formik.values.selectedMembers.filter(id => id !== memberId)
            : [...formik.values.selectedMembers, memberId];
        formik.setFieldValue('selectedMembers', newSelectedMembers);
    };

    if (isLoadingUsers) {
        return <div><DataLoader /></div>;
    }

    return (
        <div>
            <button onClick={() => { setEditTeam(false) }} type='button' className='flex space-x-2 items-center px-2 py-1 text-white bg-primary rounded-xl mb-3 ml-3'>
                <ArrowLeft className='text-white h-5 w-5' />
                <span>Back</span>
            </button>
            <form onSubmit={formik.handleSubmit} className='p-4'>
                <div className='grid grid-cols-5 gap-3'>
                    <div className="mb-4 col-span-2">
                        <label htmlFor="departmentName" className="block mb-2">Team Name</label>
                        <input
                            type="text"
                            id="departmentName"
                            name="departmentName"
                            value={formik.values.departmentName}
                            onChange={formik.handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-primary"
                        />
                        {formik.errors.departmentName && formik.touched.departmentName && (
                            <div className="text-primary">{formik.errors.departmentName}</div>
                        )}
                    </div>

                    <div className="mb-4 col-span-2">
                        <label htmlFor="TeamLeader" className="block mb-2">Select Team Leader</label>
                        <select
                            id="TeamLeader"
                            name="TeamLeader"
                            value={formik.values.TeamLeader}
                            onChange={formik.handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-primary"
                        >
                            <option value="" label="Select a team leader" />
                            {UserList?.filter(user => (user.role === 'team_lead' && user.team === 'No Team') || user.id === teamData.team_lead_id).map(user => (
                                <option key={user.id} value={user.id}>
                                    {user.name}
                                </option>
                            ))}
                        </select>
                        {formik.errors.TeamLeader && formik.touched.TeamLeader && (
                            <div className="text-primary">{formik.errors.TeamLeader}</div>
                        )}
                    </div>
                </div>
                <div className="mb-4">
                    <label className="block mb-2">Assign Member to Team</label>
                    <div className="p-4 border rounded-lg bg-gray-100">
                        <input
                            type="text"
                            placeholder="Search members..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md mb-2 focus:outline-none focus:border-primary"
                        />
                        <table className="w-full">
                            <thead>
                                <tr className="bg-white">
                                    <th></th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-default_text uppercase tracking-wider">
                                        Name
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-default_text uppercase tracking-wider">
                                        Email
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-default_text uppercase tracking-wider">
                                        Location
                                    </th>
                                </tr>
                            </thead>
                            <tbody className=''>
                                {filteredMembers.map((member) => (
                                    <tr
                                        key={member.id}
                                        className={` ${formik.values.selectedMembers.includes(member.id) ? 'bg-[#F1ECFF] border border-primary rounded-full my-2' : ''}`}
                                    >
                                        <td className="px-6 py-4">
                                            <input
                                                type="checkbox"
                                                checked={formik.values.selectedMembers.includes(member.id)}
                                                onChange={() => handleMemberChange(member.id)}
                                                className="rounded-full focus:ring-2 focus:ring-primary"
                                            />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className='flex space-x-3'>
                                                <Image
                                                    src={member?.avatar}
                                                    alt={`${member.name}'s avatar`}
                                                    className='h-8 w-8 rounded-full mr-2'
                                                    height={200}
                                                    width={400}
                                                />
                                                {member.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">{member.email}</td>
                                        <td className="px-6 py-4 capitalize">{member?.location?.name}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {formik.errors.selectedMembers && formik.touched.selectedMembers && (
                            <div className="text-primary">{formik.errors.selectedMembers}</div>
                        )}
                    </div>
                </div>

                <div className="flex justify-end my-3">
                    <button type="button" onClick={() => { setEditTeam(null) }} className="px-4 py-2 bg-secondary text-white rounded-md mr-4">
                        Cancel
                    </button>
                    <button type="submit" className="px-4 py-2 bg-primary text-white rounded-md">
                        {isLoading ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditTeamComponent;
