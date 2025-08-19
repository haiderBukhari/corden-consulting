import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import UseCreateBranch from '../../../../hooks/mutations/admin/createBranch';
import { useRouter } from 'next/router';
import { successToaster } from '../../../../utils/toaster';
import { ArrowLeft } from 'lucide-react';
import { UseGetUsers } from '../../../../hooks/query/admin/getUserList';
import DataLoader from '../../../ui/dataLoader';
import Image from 'next/image';

const CreateBranchComponent = () => {
    const createbranch = UseCreateBranch();
    const { data: UserList, isLoading: isLoadingUsers } = UseGetUsers();
    const [memberSearchResults, setMemberSearchResults] = useState([]);
    const router = useRouter();

    useEffect(() => {
        if (UserList) {
            console.log("UserList Data:", UserList); // Debugging line
            const filteredMembers = UserList.filter(member => member.branch === null && member.is_worker === 0);
            console.log("Filtered Members:", filteredMembers); // Check who is included in the final result
            setMemberSearchResults(filteredMembers);
        }
    }, [UserList]);
    
    
    const validationSchema = Yup.object().shape({
        branchName: Yup.string().required('branch name is required'),
        selectedMembers: Yup.array(),
    });

    const formik = useFormik({
        initialValues: {
            branchName: '',
            selectedMembers: [],
        },
        validationSchema,
        onSubmit: (values) => {
            const formData = new FormData();
            formData.append("name", values.branchName);
            formData.append("members", JSON.stringify(values.selectedMembers)); // Stringify the array
            createbranch.mutate(formData, {
                onSuccess: () => {
                    successToaster("branch created Successfully!");
                    router.push(`/user_management/branch/list`);
                }
            });
        },
    });

    const handleSearchChange = (event) => {
        const searchQuery = event.target.value.toLowerCase();
        const filteredMembers = UserList.filter(
            (member) => member.branch == null && member.name.toLowerCase().includes(searchQuery)
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
        return <div><DataLoader /></div>;
    }

    return (
        <div className='p-4 min-h-screen'>
            <button onClick={() => { router.push(`/user_management/branch/list`) }} type='button' className='flex space-x-2 items-center px-2 py-1 text-white bg-primary rounded-xl  mb-3'>
                <ArrowLeft className='text-white h-5 w-5' />
                <span>Back</span>
            </button>
            <form onSubmit={formik.handleSubmit}>
                <div className="">
                    <div className="mb-4">
                        <label htmlFor="branchName" className="block mb-2">Enter branch Name</label>
                        <input
                            type="text"
                            id="branchName"
                            name="branchName"
                            value={formik.values.branchName}
                            onChange={formik.handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-primary"
                        />
                        {formik.errors.branchName && formik.touched.branchName && (
                            <div className="text-primary">{formik.errors.branchName}</div>
                        )}
                    </div>

                    <div className="mb-4">
                        <label className="block mb-2">Assign Member to branch</label>
                        <div className='p-4 border rounded-lg bg-gray-100'>
                            <input
                                type="text"
                                placeholder="Search members..."
                                onChange={handleSearchChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md mb-2 focus:outline-none focus:border-primary"
                            />
                            <table className="w-full">
                                {memberSearchResults.length > 0 ?
                                    <>
                                        <thead>
                                            <tr className='bg-white'>
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



                                            {memberSearchResults.map((member) => (
                                                <tr key={member.id} className={`  ${formik.values.selectedMembers.includes(member.id) ? 'bg-[#F1ECFF] border border-primary rounded-full my-2' : ''}`}>
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
                                                                alt={`${member.name}'s avatar`}
                                                                className='h-8 w-8 rounded-full mr-2'
                                                                height={200}
                                                                width={400}
                                                            />
                                                            {member.name}
                                                        </div></td>
                                                    <td className="px-6 py-4">{member.email}</td>
                                                    <td className="px-6 py-4">{member?.location?.name}</td>
                                                </tr>
                                            ))
                                            }


                                        </tbody>
                                    </>
                                    :
                                    <div className='flex justify-center my-12 w-full'>
                                        No Member Avaialable
                                    </div>
                                }
                            </table>
                        </div>
                    </div>
                </div>
                <div className='flex justify-end my-3 '>
                    <button onClick={() => { router.push('/user_management/branchs/list') }} className="px-4 py-2 bg-secondary text-white rounded-md mr-4">
                        Discard
                    </button>
                    <button type="submit" disabled={createbranch.isLoading} className="px-4 py-2 bg-primary text-white rounded-md">
                        {createbranch.isLoading ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateBranchComponent;
