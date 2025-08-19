import React, { useEffect, useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { DownloadIcon } from 'lucide-react';
import EditGratuitylModal from './UpdateGratuity';
import DataLoader from '../../../ui/dataLoader';
import { ArrowLeft } from 'lucide-react';
import { getGratuityDetails } from '../../../../hooks/query/finances/gratuity/getGratuityDetail';
import { useRouter } from 'next/router';
import { UseGetProfile } from '../../../../hooks/query/getProfile';
export default function GratuityDetail({ isUser }) {
    const router = useRouter()
    const { id } = router.query
    const [showGratuity, setShowGratuity] = useState(false);
    const { data: gratuityDetail, isLoading } = getGratuityDetails(id);
    const {data :ProfileData}=UseGetProfile(id)

    const [isOpenEditGratuity, setIsOpenEditGratuity] = useState(false);
    const user = gratuityDetail?.gratuity_records[0]?.user

    const fun = () => {
        if (isUser == 'false') {
            router.push('/finances/workforce/gratuity/list');

        } else {
            router.push('/finances/payroll/overview');

        }
    }
    return (
        <div>
            {
                isOpenEditGratuity &&
                <EditGratuitylModal
                    id={id}
                    data={user}
                    onClose={() => setIsOpenEditGratuity(false)}
                />}
            <div>


                {isLoading ? (
                    <DataLoader />
                ) : (
                    <div className='px-4 min-h-screen'>
                        <button onClick={() => fun()} type='button' className='flex space-x-2 items-center px-2 py-1 text-white bg-primary rounded-xl mb-3 ml-3'>
                            <ArrowLeft className='text-white h-5 w-5' />
                            <span>Back</span>
                        </button>
                        {isUser === 'false' && ProfileData?.starting_balance <= 0 && (
                            <div className='flex justify-end'>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsOpenEditGratuity(true);
                                    }}
                                    className="group relative rounded-md py-2 px-4 mr-2 border border-primary text-primary text-base"
                                >
                                    Add Starting Balance
                                </button>
                            </div>
                        )}


                        <div className='gap-4 mb-4 flex flex-col'>
                            {/* Gratuity Balance Section */}
                            <div className='border rounded-xl px-8 py-5 w-96 my-4 shadow-sm border-primary  '>
                                <div className='flex items-center justify-between'>
                                    <h3 className='text-xl font-semibold text-gray-800 mr-4'>Gratuity Balance</h3>
                                    <button onClick={() => setShowGratuity(!showGratuity)}>
                                        {showGratuity ? (
                                            <FaEye className='text-primary h-5 w-5 mt-1 transition-all' />
                                        ) : (
                                            <FaEyeSlash className='text-primary h-5 w-5 mt-1 transition-all' />
                                        )}
                                    </button>
                                </div>

                                <div className='flex items-center gap-2 mt-5'>
                                    {showGratuity ? (
                                        <span className='text-2xl text-primary font-semibold'>
                                            ${ProfileData?.gratuity_fund || 'N/A'}
                                        </span>
                                    ) : (
                                        <span className='text-4xl text-gray-500 font-semibold'>****</span>
                                    )}
                                </div>
                            </div>

                            {/* User Information Section */}
                            <div className='border rounded-xl px-8 py-5 shadow-sm  '>
                                <h3 className='text-xl font-semibold text-gray-800 mb-4'>User Information</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <span className="text-lg font-medium text-gray-700">User Name:</span>{' '}
                                        <span className="text-gray-800">{ProfileData?.name}</span>
                                    </div>
                                    <div>
                                        <span className="text-lg font-medium text-gray-700">Starting Balance:</span>{' '}
                                        <span className="capitalize text-gray-800">{ProfileData?.starting_balance}</span>
                                    </div>
                                    <div>
                                        <span className="text-lg font-medium text-gray-700">Salary:</span>{' '}
                                        <span className="capitalize text-gray-800">{ProfileData?.current_salary}</span>
                                    </div>
                                </div>
                            </div>
                        </div>




                        <div className='border rounded-lg shadow-md p-4 bg-white'>

                            <table className='w-full border-collapse border border-gray-300'>
                                <thead>
                                    <tr className='bg-gray-100'>
                                        {/* <th className='border px-4 py-2 text-left'>User Name</th>
                                        <th className='border px-4 py-2 text-left'>Employee Id</th> */}
                                        <th className='border px-4 py-2 text-left'>Sr No</th>
                                        <th className='border px-4 py-2 text-left'>Month</th>
                                        <th className='border px-4 py-2 text-left'>Gratuity Value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {gratuityDetail?.gratuity_records.length > 0 ? (
                                        gratuityDetail?.gratuity_records?.map((row, index) => (
                                            <tr key={index} className='border hover:bg-gray-50'>
                                                {/* <td className='border px-4 py-2'>{row?.user?.fname + " " + row?.user?.middle_name + " " + row?.user?.lname}</td>
                                                <td className='border px-4 py-2'>{row.name}</td> */}
                                                <td className='border px-4 py-2'>{index + 1}</td>
                                                <td className='border px-4 py-2'>{row.month}</td>
                                                <td className='border px-4 py-2'>${row.monthly_gratuity}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan='4' className='text-center py-4 text-gray-500'>No Data Available</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        <div className="p-4 bg-white shadow-md my-5 rounded-lg">
                            <h2 className="text-lg font-semibold mb-4">Activity Log</h2>
                            <div className="overflow-x-auto border rounded-lg ">
                                <table className="min-w-full border-collapse bg-white">
                                    <thead className="bg-grey sticky top-0 z-20">
                                        <tr>
                                            <th className="px-2 py-2 border-b text-left text-default_text text-sm">User Name</th>

                                            <th className="px-2 py-2 border-b text-left text-default_text text-sm">Reason</th>
                                            <th className="px-2 py-2 border-b text-left text-default_text text-sm">Date</th>
                                            <th className="px-2 py-2 border-b text-left text-default_text text-sm">Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {gratuityDetail?.gratuity_logs && gratuityDetail?.gratuity_logs?.length > 0 ? (
                                            gratuityDetail?.gratuity_logs?.map((log, index) => {
                                                // Split the created_at field into date and time
                                                const [date, time] = log?.updated_at.split(" ");
                                                return (
                                                    <tr
                                                        key={log.id}
                                                    >
                                                        <td className="px-2 py-3 border-b text-default_text">{log?.updated_by}</td>

                                                        <td className="px-2 py-3 border-b text-default_text">{log?.reason}</td>
                                                        <td className="px-2 py-3 border-b text-default_text">{date}</td>
                                                        <td className="px-2 py-3 border-b text-default_text">{time}</td>
                                                    </tr>
                                                );
                                            })
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan="5"
                                                    className="px-6 py-3 text-center text-gray-500"
                                                >
                                                    No activity logs available.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

            </div>

        </div>
    );
}
