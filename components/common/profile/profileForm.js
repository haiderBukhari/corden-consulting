import React, { useState, useEffect } from 'react';
import ChangePassword from '../changePassword';
import { Upload } from 'lucide-react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { UseGetProfile } from '../../../hooks/query/getProfile';
import ButtonLoader from '../../ui/buttonLoader';
import DataLoader from '../../ui/dataLoader';

import { useFormik } from 'formik';
import Image from 'next/image';
import UseUpdateAvatar from '../../../hooks/mutations/updateAvatar';

function ProfileForm() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const { data: profileData, isLoading } = UseGetProfile();
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
      const data={
        avatar:formData,
      
        
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
    <div>
      {profileData && !isLoading ? (
        <div className='text-default_text min-h-screen'>
          <div className='rounded-lg mx-6'>
            <div className=''>
              {/* Profile Picture */}
              <form onSubmit={formik.handleSubmit} className='flex items-center space-x-12'>
                <div className='flex space-x-12 border rounded-xl p-3'>
                  <div>
                    <p className='font-semibold mb-2'>Profile Photo</p>
                    <div className='mb-4 flex items-center p-4  w-80'>
                      <div className='h-32 w-32 bg-slate-50 border-2 border-dashed rounded-full flex items-center justify-center relative'>
                        {uploadedImage ? (
                          <Image
                            src={uploadedImage}
                            alt='Profile'
                            className='h-32 w-32 object-contain rounded-full'
                            height={200}
                            width={400}
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
                </div>
                <div className='grid grid-cols-3 gap-4'>
                  {/* First Name */}
                  <div className='mb-4'>
                    <label htmlFor='firstName' className='block font-semibold'>
                      First Name
                    </label>
                    <input
                      type='text'
                      id='firstName'
                      name='firstName'
                      placeholder='First Name'
                      value={profileData.fname}
                      readOnly
                      className='text-gray-600'
                    />
                  </div>
                  {/* Middle Name */}
                  <div className='mb-4'>
                    <label htmlFor='middleName' className='block font-semibold'>
                      Middle Name
                    </label>
                    <input
                      type='text'
                      id='middleName'
                      name='middleName'
                      placeholder='Middle Name'
                      value={profileData?.middle_name}
                      readOnly
                      className='yyy'
                    />
                  </div>
                  {/* Last Name */}
                  <div className='mb-4'>
                    <label htmlFor='lastName' className='block font-semibold'>
                      Last Name
                    </label>
                    <input
                      type='text'
                      id='lastName'
                      name='lastName'
                      placeholder='Last Name'
                      value={profileData.lname}
                      readOnly
                      className='yyy'
                    />
                  </div>
                  {/* Phone Number */}
                  <div className='mb-4'>
                    <label htmlFor='phoneNumber' className='block font-semibold'>
                      Phone Number
                    </label>
                    <input
                      type='tel'
                      id='phoneNumber'
                      name='phoneNumber'
                      placeholder='Phone Number'
                      value={profileData ? profileData?.phone_number : ''}
                      readOnly
                      className='text-gray-600'
                    />
                  </div>

                  <div className='mb-4'>
                    <label htmlFor='email' className='block font-semibold'>
                      Email
                    </label>
                    <input
                      type='text'
                      id='email'
                      name='email'
                      placeholder='Email'
                      value={profileData ? profileData?.email : ''}
                      readOnly
                      className='text-gray-600 w-80 break-all'
                    />
                  </div>
                  <div className='mb-4'>
                    <label htmlFor='employee_id' className='block font-semibold'>
                      Employee Id
                    </label>
                    <input
                      type='string'
                      id='employee_id'
                      name='employee_id'
                      placeholder='Employee ID'
                      value={profileData ? profileData?.employee_id : ''}
                      readOnly
                      className='text-gray-600'
                    />
                  </div>
                </div>
              </form>
              <div>
                <div className='grid grid-cols-5 gap-4 mt-4'>
                  {/* Designation */}
                  <div className='mb-4'>
                    <label htmlFor='designation' className='block font-semibold'>
                      System User Role
                    </label>
                    <input
                      type='string'
                      id='designation'
                      name='designation'
                      placeholder='Designation'
                      value={profileData ? profileData?.role : ''}
                      readOnly
                      className='text-gray-600 capitalize'
                    />
                  </div>

                  <div className='mb-4'>
                    <label htmlFor='team' className='block font-semibold'>
                      Team Name
                    </label>
                    <input
                      type='string'
                      id='team'
                      name='team'
                      placeholder='team'
                      value={profileData ? profileData?.team : 'No Team'}
                      readOnly
                      className='text-gray-600 capitalize'
                    />
                  </div>


                  <div className='mb-4'>
                    <label htmlFor='team' className='block font-semibold'>
                      Department Name
                    </label>
                    <input
                      type='string'
                      id='departments_name'
                      name='departments_name'
                      placeholder='Department Name'
                      value={profileData ? profileData?.department?.departments_name : 'No Department'}
                      readOnly
                      className='text-gray-600 capitalize'
                    />
                  </div>


                  <div className='mb-4'>
                    <label htmlFor='position_name' className='block font-semibold'>
                      Position
                    </label>
                    <input
                      type='string'
                      id='position_name'
                      name='position_name'
                      placeholder='position Name'
                      value={profileData ? profileData?.position?.name : 'No Position'}
                      readOnly
                      className='text-gray-600 capitalize'
                    />
                  </div>

                  <div className='mb-4'>
                    <label htmlFor='joining_date' className='block font-semibold'>
                      Joining Date
                    </label>
                    <input
                      type='text'
                      id='joining_date'
                      name='joining_date'
                      placeholder='joining_date'
                      value={profileData ? profileData?.joining_date : ''}
                      readOnly
                      className='text-gray-600'
                    />
                  </div>


                </div>
              </div>
              <div className='grid grid-cols-5 gap-4'>
                <div className='mb-4'>
                  <label htmlFor='location' className='block font-semibold'>
                    Location
                  </label>
                  <div className='flex space-x-3'>
                    <input
                      type='string'
                      id='location'
                      name='location'
                      placeholder='location'
                      value={profileData ? profileData?.location?.name : 'No Location'}
                      readOnly
                      className='text-gray-600 capitalize'
                    />

                  </div>
                </div>
                <div className=' mb-4'>
                  <label htmlFor='nextOfKinName' className='block font-semibold'>
                    Shift Name
                  </label>
                  {profileData?.shift?.shift_name} Shift
                </div>

                {/* Next of Kin Name */}
                <div className='mb-4'>
                  <label htmlFor='nextOfKinName' className='block font-semibold'>
                    Next of Kin
                  </label>
                  <input
                    type='text'
                    id='nextOfKinName'
                    name='nextOfKinName'
                    placeholder='Next of Kin Name'
                    value={profileData ? profileData?.next_of_kin : ''}
                    readOnly
                    className='text-gray-600'
                  />
                </div>
                {/* Next of Kin Relation */}
                <div className='mb-4'>
                  <label htmlFor='nextOfKinRelation' className='block font-semibold'>
                    Next of Kin Relation
                  </label>
                  <input
                    type='text'
                    id='nextOfKinRelation'
                    name='nextOfKinRelation'
                    placeholder='Next of Kin Relation'
                    value={profileData ? profileData?.kin_relation : ''}
                    readOnly
                    className='text-gray-600 capitalize'
                  />
                </div>
                <div className='mb-4'>
                  <label htmlFor='kin_contact' className='block font-semibold'>
                    Next of Kin Contact
                  </label>
                  <input
                    type='text'
                    id='kin_contact'
                    name='kin_contact'
                    placeholder='Next of Kin Contact'
                    value={profileData ? profileData?.kin_contact : ''}
                    readOnly
                    className='text-gray-600'
                  />
                </div>


                {/* <div className='mb-4'>
                  <label htmlFor='salary' className='block font-semibold'>
                    Salary
                  </label>
                  £
                  <input
                    type='text'
                    id='salary'
                    name='salary'
                    placeholder='Salary'
                    value={profileData ? profileData?.current_salary : ''}
                    readOnly
                    className='text-gray-600'
                  />
                </div> */}
              </div>
            </div>
            <div className='border rounded-md p-2 mt-4 bg-slate-50'>
              <h2 className='font-semibold  mb-3'>Bank Details</h2>
              <div className='grid grid-cols-2 gap-3'>
                <div className='mb-4'>
                  <label htmlFor='accountNumber' className='block'>
                    Account Number/Phone Number
                  </label>

                  <input
                    type='text'
                    id='accountNumber'
                    name='accountNumber'

                    value={profileData ? profileData?.account_number : ''}
                    readOnly
                    className='rounded-lg text-sm w-full bg-white border text-default_text border-gray-300 p-2 mt-1'

                  />

                </div>
                <div className=' mb-4'>
                  <label htmlFor='bankName' className='block'>
                    Bank Name
                  </label>
                  <input
                    type='text'
                    id='accountNumber'
                    name='accountNumber'

                    value={profileData ? profileData?.bank_name : ''}
                    readOnly
                    className='rounded-lg text-sm w-full bg-white border text-default_text border-gray-300 p-2 mt-1'
                  />
                </div>
              </div>
            </div>
          </div>
          <ChangePassword />
        </div>
      ) : (
        <DataLoader />
      )}
    </div>
  );
}

export default ProfileForm;
