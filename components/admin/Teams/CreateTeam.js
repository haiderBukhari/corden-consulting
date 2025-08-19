import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import { ArrowLeft } from 'lucide-react';
import { successToaster } from '../../../utils/toaster';
import { UseGetUsers } from '../../../hooks/query/admin/getUserList';
import DataLoader from '../../ui/dataLoader';
import UseCreateTeam from '../../../hooks/mutations/admin/createTeam';
import Image from 'next/image';

const CreateTeamComponent = () => {
    const createTeam = UseCreateTeam();
    const { data: UserList, isLoading: isLoadingUsers } = UseGetUsers();
    const [memberSearchResults, setMemberSearchResults] = useState([]);
    const router = useRouter();

    useEffect(() => {
        if (UserList) {
            const filteredMembers = UserList?.filter(member => member.team == 'No Team' && member.role === 'staff');

            setMemberSearchResults(filteredMembers);
        }
    }, [UserList]);

    const validationSchema = Yup.object().shape({
        TeamName: Yup.string().required('Team name is required'),
        TeamLeader: Yup.string().required('Team Leader is required'),
        selectedMembers: Yup.array(),
    });

    const formik = useFormik({
        initialValues: {
            TeamName: '',
            TeamLeader: '',
            selectedMembers: [],
        },
        validationSchema,
        onSubmit: (values) => {
            const formData = new FormData();
            formData.append("team_name", values.TeamName);
            formData.append("team_lead_id", values.TeamLeader);
            formData.append("members", JSON.stringify(values.selectedMembers));
            createTeam.mutate(formData, {
                onSuccess: () => {
                    successToaster("Team created Successfully!");
                    router.push("/user_management/teams/list");
                }
            });
        },
    });

    const handleSearchChange = (event) => {
        const searchQuery = event.target.value.toLowerCase();
        const filteredMembers = UserList.filter(
            (member) => member.Team == 'No Team' && member.role === 'staff' && member.name.toLowerCase().includes(searchQuery)
        );
        setMemberSearchResults(filteredMembers);
    };

    const handleCheckboxChange = (memberId) => {
        const { selectedMembers } = formik.values;
        if (selectedMembers.includes(memberId)) {
            formik.setFieldValue('selectedMembers', selectedMembers.filter(id => id !== memberId));
        } else {
            formik.setFieldValue('selectedMembers', [...selectedMembers, memberId]);
        }
    };

    if (isLoadingUsers) {
        return <DataLoader />;
    }

    return (
        <div className='p-4 min-h-screen'>
            <button onClick={() => router.push('/user_management/teams/list')} type='button' className='flex space-x-2 items-center px-2 py-1 text-white bg-primary rounded-xl mb-3'>
                <ArrowLeft className='text-white h-5 w-5' />
                <span>Back</span>
            </button>
            <form onSubmit={formik.handleSubmit}>
                <div className="">
                    <div className=' grid grid-cols-5 gap-3'>
                        <div className="mb-4 col-span-2">
                            <label htmlFor="TeamName" className="block mb-2">Team Name</label>
                            <input
                                type="text"
                                id="TeamName"
                                name="TeamName"
                                value={formik.values.TeamName}
                                onChange={formik.handleChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-primary"
                            />
                            {formik.errors.TeamName && formik.touched.TeamName && (
                                <div className="text-primary">{formik.errors.TeamName}</div>
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
                                {UserList?.filter(user => user.role === 'team_lead' && user.team == "No Team").map(user => (
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
                        <label className="block mb-2">Assign Team Members</label>
                        <div className='p-4 border rounded-lg bg-gray-100'>
                            <input
                                type="text"
                                placeholder="Search members..."
                                onChange={handleSearchChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md mb-2 focus:outline-none focus:border-primary"
                            />
                            <table className="w-full">
                                <thead>
                                    <tr className='bg-white rounded-xl'>
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
                                <tbody>
                                    {memberSearchResults?.map((member) => (
                                        <tr key={member.id} className={`${formik.values.selectedMembers.includes(member.id) ? 'bg-[#F1ECFF] border border-primary rounded-full my-2' : ''}`}>
                                            <td className="px-6 py-4">
                                                <input
                                                    type="checkbox"
                                                    id={`member-${member.id}`}
                                                    name="selectedMembers"
                                                    value={member.id}
                                                    checked={formik.values.selectedMembers.includes(member.id)}
                                                    onChange={() => handleCheckboxChange(member.id)}
                                                    className="rounded-full focus:ring-2 focus:ring-primary"
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className='flex space-x-3'>
                                                    <Image
                                                        src={member?.avatar}
                                                        alt={`${member?.name}'s avatar`}
                                                        className='h-8 w-8 rounded-full mr-2'
                                                        height={200}
                                                        width={400}
                                                    />
                                                    <span>{member.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">{member.email}</td>
                                            <td className="px-6 py-4 capitalize">{member?.location?.name}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className='flex justify-end my-3'>
                    <button onClick={() => router.push('/user_management/teams/list')} className="px-4 py-2 bg-secondary text-white rounded-md mr-4">
                        Discard
                    </button>
                    <button type="submit" disabled={createTeam.isLoading} className="px-4 py-2 bg-primary text-white rounded-md">
                        {createTeam.isLoading ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateTeamComponent;
