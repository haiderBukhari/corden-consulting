import React, { useState, useEffect } from 'react';
import ChangePassword from '../changePassword';
import { Upload } from 'lucide-react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { UseGetProfile } from '../../../hooks/query/getProfile';
import ButtonLoader from '../../ui/buttonLoader';
import DataLoader from '../../ui/dataLoader';
import UseUpdateProfile from '../../../hooks/mutations/updateProfilePhoto';
import { useFormik } from 'formik';
import Image from 'next/image';

function AdminProfileForm() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const { data: profileData, isLoading } = UseGetProfile();
  const updateProfile = UseUpdateProfile();

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
      updateProfile.mutate(formData,
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
                      className={`w-full my-4 flex justify-center rounded-full py-2 px-4 border border-transparent text-base font-medium text-white ${formik.values.avatar ? 'bg-primary hover:bg-lightblue' : 'bg-blue-300'
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

export default AdminProfileForm;
