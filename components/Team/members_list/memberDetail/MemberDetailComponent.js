import React from 'react';
import { useState } from 'react';
import { ArrowLeft, Edit2, PowerOff } from 'lucide-react';
import Image from 'next/image';
import ButtonLoader from '../../../ui/buttonLoader';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { useFormik } from 'formik';
import { Upload } from 'lucide-react';
import { useEffect } from 'react';
import { useGetMemberDetail } from '../../../../hooks/query/team_lead/team/getMemberDetail';
import { useRouter } from 'next/router';
import { BsFillTelephoneFill, } from 'react-icons/bs';
import { MdAlternateEmail } from "react-icons/md";
import { LiaUserLockSolid } from "react-icons/lia";
import { CiClock2 } from "react-icons/ci";
import { PiPauseCircleThin } from "react-icons/pi";
import TrainingAndDevelopmentComponent from '../../../StaffDashboard/dashboard/trainingAndDevelopmentComponent';
import Approvals from '../../dashboard/Approvals';
import MemberAttendenceGraph from './MemberAttendenceGraph';
import GoalsObjectivesPerformanceChart from './GoalsObjectivePerformanceChart';
import DataLoader from '../../../ui/dataLoader';
import Link from 'next/link';
import { useGetIndividualMemberLeave } from '../../../../hooks/query/team_lead/team/getIndividualMemberLeave';
import useGetActiveUser from '../../../../hooks/query/getUserFromLocalStorage';
import DeleteItemModal from '../../../ui/deleteItemModal';
import PayrollGraph from './PayrollGraph';
import UseDeactivateUser from '../../../../hooks/mutations/admin/deactivateUser';
import { getStatusClasses } from '../../../common/attendance/AttendanceComponent';
import { UseGetProfile } from '../../../../hooks/query/getProfile';
import UseUpdateProfile from '../../../../hooks/mutations/updateProfilePhoto';
import UseUpdateAvatar from '../../../../hooks/mutations/updateAvatar';

const LegendItem = ({ color, label }) => (
  <div className="flex items-center mr-4">
    <span className={`h-2 w-2 rounded-full mr-2`} style={{ backgroundColor: `${color}` }}></span>
    <span className="text-sm text-gray-600">{label}</span>
  </div>
);

export default function MemberDetailComponent() {
  const router = useRouter();
  const { data: user } = useGetActiveUser();
  const { id } = router.query;
  const { data: member, isLoading } = useGetMemberDetail(id);
  const { data: memberLeave } = useGetIndividualMemberLeave(id);
  const pendingLeaves = memberLeave?.filter(leave => leave.leave_status === 'pending') || [];
  const [modalVisible, setDeleteModalVisible] = useState(false);
  const [memberId, setMemberId] = useState(null);
  const deactivateUser = UseDeactivateUser();
  const [uploadedImage, setUploadedImage] = useState(null);
  const { data: profileData } = UseGetProfile(id);
  const updateProfile = UseUpdateAvatar();

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const upcomingEvents = [
    { title: "Meeting with Client", time: "4 AM", date: "5th May, 2024" },

    // Add more upcoming events as needed
  ];

  const calculatePercentage = (leave, total) => {
    return (leave / total) * 100
  }

  // Dummy past events array
  const pastEvents = [
    { title: "Team Lunch", time: "4 PM", date: "30th April, 2024" },
    { title: "Team Lunch", time: "9 AM", date: "25th April, 2024" },


    // Add more past events as needed
  ];

  const openModal = (user) => {
    setMemberId(user.id);
    setDeleteModalVisible(true);
  };

  const closeModal = () => {
    setMemberId(null);
    setDeleteModalVisible(false);
  };

  const handleDeleteMember = () => {
    if (memberId) {
      const data = {
        userId: memberId,
        status: 0
      }
      deactivateUser.mutate(data,
        {
          onSuccess: () => {
            closeModal();

            router.push(user.role == 'team_lead' ? `/${user.role}/team/members_list` : `/workforce/people/list`)
          }
        }
      );

    }
  };

  useEffect(() => {
    if (profileData) {
      setUploadedImage(profileData?.avatar);
    }
  }, [profileData]);

  const removeImage = () => {
    formik.setFieldValue('avatar', null);
    setUploadedImage(null);
  };

  const formik = useFormik({
    initialValues: {
      avatar: null,
    },
    onSubmit: async (values, { resetForm }) => {
      const formData = new FormData();
      formData.append('avatar', values.avatar);
      const data = {
        avatar: formData,
        id: id
      }
      updateProfile.mutate(data,
        {
          onSuccess: () => {
            const data = {
              id: profileData.id,
              name: profileData.name,
              email: profileData.email,
              role: profileData.role,
              avatar: profileData.avatar
            }

            localStorage.setItem('user', JSON.stringify(data));
          }
        }
      );
    },
  });

  return (
    <div className=' px-4 '>
      <button onClick={() => { router.push(user.role == 'team_lead' ? `/${user.role}/team/members_list` : `/workforce/people/list`) }} type='button' className='flex space-x-2 items-center px-2 py-1 text-white bg-primary rounded-xl'>
        <ArrowLeft className='text-white h-5 w-5' />
        <span>Back</span>
      </button>
      {(isLoading) ?
        <DataLoader />
        :
        member && member.avatar ?
          <div className='grid grid-cols-10 space-x-3 my-3'>
            {/* left */}
            <div className="col-span-3 space-y-3">
              {/* Image */}
              {user.role == 'HR' ?

                <form onSubmit={formik.handleSubmit} className='flex space-x-4 border rounded-xl p-3'>
                  <div>

                    <div className='mb-4 flex items-center p-4 h-56 '>
                      <div className={` bg-slate-50 border-2 border-dashed rounded-full flex items-center justify-center relative`}>
                        {uploadedImage ? (

                          <Image
                            src={uploadedImage}
                            className={`   h-32 w-32 rounded-full object-fit`}
                            height={200}
                            width={400}
                            alt="Working Hour Icon"
                          />
                        ) : (
                          <span>No Image</span>
                        )}
                      </div>
                      <div className='text-xs space-y-2 ml-5'>
                        <label
                          htmlFor='avatar'
                          className='cursor-pointer rounded-3xl border-2 bg-primary text-white items-center flex justify-center p-2 '
                        >
                          <input
                            type='file'
                            id='avatar'
                            name='avatar'
                            accept='image/*'
                            className='hidden'
                            onChange={(event) => {
                              formik.setFieldValue('avatar', event.currentTarget.files[0]);
                              handleImageUpload(event);
                            }}
                          />

                          <span className='text-white'>Upload</span>
                          <Upload className='h-4 w-4 ml-2' />
                        </label>
                        <button
                          type='button'
                          onClick={removeImage}
                          className='cursor-pointer rounded-3xl border border-primary text-primary items-center flex justify-center p-2'
                        >
                          Remove
                          <XMarkIcon className='h-4 w-4 ml-2' />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className='flex items-end'>
                    <button
                      type='submit'
                      disabled={!formik.values.avatar}
                      className={`w-full my-4 flex justify-center rounded-full py-2 px-4 border border-transparent text-base font-medium text-white ${formik.values.avatar ? 'bg-primary hover:bg-opacity-45' : 'bg-primary bg-opacity-45'
                        }`}
                    >
                      {updateProfile.isLoading ? <ButtonLoader text={'Saving...'} /> : 'Save'}
                    </button>
                  </div>
                </form>
                :
                <div className='rounded-full relative'>
                  <Image
                    src={member?.avatar}
                    className={`${user.role !== 'team_lead' ? 'h-72' : 'h-80'}  w-full rounded-xl border object-contain`}
                    height={200}
                    width={400}
                    alt="Working Hour Icon"
                  />
                </div>
              }

              {/* Edit & Deactivate Buttons (if not team lead) */}
              <div className="grid grid-cols-2 gap-2">
                {user.role !== "team_lead" && (
                  <>
                    <button
                      onClick={() => { router.push(`/workforce/people/${id}/editUser?user_id=${id}`); }}
                      className="text-sm bg-primary justify-center px-3 py-2 rounded-md text-white flex items-center"
                    >
                      <Edit2 className="mr-2 h-5 w-5" />
                      Edit User
                    </button>
                    <button
                      onClick={() => openModal(member)}
                      className="text-sm border border-secondary text-red-600 justify-center px-3 py-2 rounded-md flex items-center"
                    >
                      <PowerOff className="mr-1 h-4 w-4" />
                      Deactivate User
                    </button>
                  </>
                )}
              </div>

              <div className="flex justify-around text-center" >
                <div className="flex flex-col items-center relative group">
                  <div className="rounded-full p-3 bg-purple-100 mb-1 flex justify-center items-center">
                    <LiaUserLockSolid className="text-purple-500 h-6 w-6" />
                  </div>
                  <div className="absolute bottom-full mb-2 hidden group-hover:block w-max bg-gray-800 text-white text-xs rounded py-1 px-2">
                    Working Hours
                  </div>
                  <p className="text-sm">{member.working_hours}</p>
                </div>
                <div className="flex flex-col items-center relative group">
                  <div className="rounded-full p-3 bg-blue-100 mb-1 flex justify-center items-center">
                    <CiClock2 className="text-primary h-6 w-6" />
                  </div>
                  <div className="absolute bottom-full mb-2 hidden group-hover:block w-max bg-gray-800 text-white text-xs rounded py-1 px-2">
                    Clock In Time
                  </div>
                  <p className="text-sm">
                    {
                      member.todayAttendenceStatus === 'Absent'
                        ? 'Absent'
                        : member.clock_in_time || 0}
                  </p>
                </div>
                <div className="flex flex-col items-center relative group">
                  <div className="rounded-full p-3 bg-green-100 mb-1 flex justify-center items-center">
                    <PiPauseCircleThin className="text-green-500 h-6 w-6" />
                  </div>
                  <div className="absolute bottom-full mb-2 hidden group-hover:block w-max bg-gray-800 text-white text-xs rounded py-1 px-2">
                    Clock Out Time
                  </div>
                  <p className="text-sm">
                    {member.todayAttendenceStatus === 'Absent'
                      ? 'Absent'
                      : member.clock_out_time || 0}
                  </p>
                </div>
              </div>
              <div className=''>
                <TrainingAndDevelopmentComponent height={user.role == 'manager' ? '600px' : '370px'} pastEvents={pastEvents} upcomingEvents={upcomingEvents} role={user.role} id={id} />
              </div>
            </div>
            {/* right side  */}
            <div className='col-span-7 px-2 space-y-3'>
              {/* name and leave bar */}
              <div className='grid grid-cols-6'>
                <div className='col-span-2 mt-4 pr-3'>
                  <h2 className='font-semibold capitalize'>
                    {member?.name}
                  </h2>
                  <p className='text-sm capitalize'>{member?.role === "team_lead" ? member?.role.replace(/_/g, ' ') : member?.role}</p>
                </div>
                {/* Leave Balance Bar */}
                <div onClick={() => user.role == 'team_lead' ? router.push(`/${user.role}/team/${id}/leaves`) : router.push(`/workforce/people/${id}/leaves`)} className='col-span-4 shadow-md cursor-pointer rounded-md p-2  px-3 border border-primary opacity-70 '>
                  <div className="flex justify-center space-x-4 pb-2">
                    <LegendItem color="#5451D3" label="Annual" />
                    <LegendItem color="#3988FF" label="Sick" />
                    <LegendItem color="#069855" label="Maternity" />
                    <LegendItem color="#1AC8B3" label="Paternity" />
                    <LegendItem color="#FFA500" label="Compassionate" />
                  </div>
                  <div className='flex space-x-3 items-center'>
                    <h3 className='font-semibold '>Leaves</h3>
                    <div className='flex justify-between '>
                      {/* <span className='text-sm text-gray-700'>{member.leave_counts.remaining}/{member.leave_counts.total}</span> */}
                    </div>
                    <div className='relative w-full h-6 bg-gray-200 rounded-full overflow-hidden'>
                      <div
                        style={{ width: `${calculatePercentage(member.leave_counts.annual, member.leave_counts.total)}%`, backgroundColor: '#5451D3' }}
                        className='h-full inline-block'
                      />

                      <div
                        style={{ width: `${calculatePercentage(member.leave_counts.sick, member.leave_counts.total)}%`, backgroundColor: '#3988FF' }}
                        className='h-full inline-block'
                      />
                      <div
                        style={{ width: `${calculatePercentage(member.leave_counts.paternity, member.leave_counts.total)}%`, backgroundColor: '#1AC8B3' }}
                        className='h-full inline-block'
                      />
                      <div
                        style={{ width: `${calculatePercentage(member.leave_counts.maternity, member.leave_counts.total)}%`, backgroundColor: '#069855' }}
                        className='h-full inline-block'
                      />
                      <div
                        style={{ width: `${calculatePercentage(member.leave_counts.compassionate, member.leave_counts.total)}%`, backgroundColor: '#FFA500' }}
                        className='h-full inline-block'
                      />
                    </div>
                  </div>

                </div>
              </div>

              {/* employee id , date */}
              <div className='grid grid-cols-6 gap-3'>
                <div className="border col-span-2 rounded-lg p-4 capitalize hover:border-primary hover:shadow hover:shadow-primary">
                  <p className="font-semibold">Employee ID</p>
                  <p>{member.employee_id}</p>
                </div>

                <div className="border col-span-2 rounded-lg p-4 capitalize hover:border-primary hover:shadow hover:shadow-primary">
                  <p className="font-semibold">Joining Date</p>
                  <p>{member.joining_date}</p>
                </div>

                <div className="border col-span-2 rounded-lg p-4 capitalize hover:border-primary hover:shadow hover:shadow-primary">
                  <p className="font-semibold">Department</p>
                  <p>{member?.department?.departments_name}</p>
                </div>
              </div>

              {/* employee stats  */}
              <div className="grid grid-cols-6  gap-5 text-center mb-4">
                <div className="flex flex-col items-center">
                  <div className="bg-gray-100 py-2 rounded-full flex justify-center items-center w-full  mb-2">
                    <BsFillTelephoneFill className="text-primary text-sm" />
                  </div>
                  <p className='text-xs'>
                    {member.phone_number}
                  </p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="bg-gray-100 py-2 rounded-full flex justify-center items-center w-full  mb-2">
                    <MdAlternateEmail className="text-primary text-lg" />
                  </div>
                  <span className='text-xs break-all'>
                    {member.email}
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <Link href={(user.role == 'team_lead' ? `/${user.role}/team/${id}/attendance` : `/workforce/people/${id}/attendance`)} className="bg-green-200 py-2 rounded-full shadow-md cursor-pointer flex justify-center items-center w-full  mb-2  border border-green-500">
                    {member.attendance_percentage}%
                  </Link>
                  <span className='text-xs'>
                    Attendance
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <div className='  flex  justify-center items-center w-full  mb-2' >
                    <span
                      className={`py-2 rounded-md capitalize ${getStatusClasses(member.todayAttendenceStatus)
                        }`}
                    >
                      {member.todayAttendenceStatus}
                    </span>


                  </div>
                  <span className='text-xs'>
                    Today
                  </span>
                </div>
                <div className="flex flex-col items-center ">
                  <Link className="bg-opacity-50 bg-primary px-2 py-2 rounded-full flex justify-start items-center w-full mb-2 cursor-pointer  "
                    href={(user.role == 'team_lead' ? `/${user.role}/team/${id}/onboarding` : `/workforce/people/${id}/onboarding`)}>

                    <p className='rounded-full px-2 text-white bg-primary'>
                      35%
                    </p>
                  </Link>
                  <span className='text-xs'>
                    Onboarding
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="bg-white text-primary border py-2 rounded-full flex justify-center items-center w-full  mb-2">
                    {member?.upcoming_leave}
                  </div>
                  <span className='text-xs'>
                    Upcoming Leave
                  </span>
                </div>
              </div>
              <div className='grid grid-cols-9 gap-5 text-center'>
                <div className='col-span-5 space-y-4'>
                  {user.role == 'manager' &&
                    <PayrollGraph id={id} />
                  }
                  <MemberAttendenceGraph role={user.role} id={id} />

                  <GoalsObjectivesPerformanceChart role={user.role} id={id} />
                </div>
                <div className='col-span-4 text-left'>
                  <Approvals allMemberPendingLeaves={pendingLeaves} maxLeavesToShow={user.role == 'manager' ? 6 : 4} height={user.role == 'manager' ? '700px' : '450px'} />
                </div>
              </div>
            </div>
          </div>
          :
          <div className='min-h-screen text-lg flex justify-center items-center'>
            Member Not Found
          </div>
      }
      <DeleteItemModal closeModal={closeModal} item={'user'} modalVisible={modalVisible} handleDeleteItem={handleDeleteMember} action={'deactivate'} />
    </div>
  );
}
