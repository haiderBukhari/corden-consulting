import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/router';
import { MdDeleteOutline } from "react-icons/md";
import { CiFloppyDisk } from "react-icons/ci";
import DataLoader from '../../../ui/dataLoader';
import ButtonLoader from '../../../ui/buttonLoader';
import { successToaster } from '../../../../utils/toaster';
import { UseGetDepartments } from '../../../../hooks/query/admin/getDepartments';
import { UseGetPositions } from '../../../../hooks/query/admin/getPositions';
import { UseGetTeams } from '../../../../hooks/query/admin/getTeamList';
import { UseGetRoles } from '../../../../hooks/query/admin/getRoles';
import UseCreateUser from '../../../../hooks/mutations/admin/createUser';
import { UseGetLocations } from '../../../../hooks/query/admin/getLocations';
import { UseGetUsers } from '../../../../hooks/query/admin/getUserList';
import { useGetShiftList } from '../../../../hooks/query/getShiftList';
import { UseGetBranchList } from '../../../../hooks/query/admin/getBranches';
import { FaEye, FaEyeSlash } from "react-icons/fa";

import useEditUser from '../../../../hooks/mutations/admin/editUser';
import { UseGetStaffUserById } from '../../../../hooks/query/admin/getStaffUserById';
const EmployeeOnboardingCreateUser = ({ onSubmit, user_id }) => {
  const router = useRouter();
  const userId = router.query.userId || user_id;
  const { data: userData } = UseGetStaffUserById(userId);
  const [isEditUser, setIsEditUser] = useState(false);
  const editUser = useEditUser();
  useEffect(() => {
    if (userData) {
      setIsEditUser(true);
    } else {
      setIsEditUser(false);
    }
  }, [userData]);

  const createUser = UseCreateUser();
  const Banks = [
    { id: 1, bank_name: 'Dahabshill Bank' },
    { id: 2, bank_name: 'Edahab' },
    { id: 3, bank_name: 'Dara-Salaam Bank' },
    { id: 4, bank_name: 'Zaad' },
    { id: 5, bank_name: 'Amal Bank' },
    { id: 6, bank_name: 'Premier Bank' },
    { id: 7, bank_name: 'IBS Bank' }
  ];

  const [initialValues, setInitialValues] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    gender: '',
    phoneNumber: '',
    nextOfKinName: '',
    contact: '',
    nextOfKinRelation: '',
    position: '',
    location: '',
    salary: '',
    role: '',
    department: '',
    team: '',
    joiningDate: '',
    password: '',
    confirmPassword: '',
    workers: '',
    financeAccessManager: '',
    bankName: '',
    shiftId: '',
    accountNumber: '',
    branch: '',
    restrictedApi: false
  });


  const { data: departmentData, isLoadingDepartments } = UseGetDepartments();
  const { data: positionsData, isLoadingPositions } = UseGetPositions();
  const { data: branchData, isLoadingBranches } = UseGetBranchList();
  const { data: rolesList, isLoadingRoles } = UseGetRoles();
  const { data: UserList } = UseGetUsers();
  const { data: locationsData, isLoadingLocations } = UseGetLocations();
  const { data: teamsData, isLoadingTeams } = UseGetTeams();

   useEffect(() => {
    if (userData && rolesList && isEditUser) {

      const userRole = rolesList.find(
        (r) => r.name.toLowerCase() === userData.role.toLowerCase()
      );

      // Convert "14 Oct 2024" to "2024-10-14"

      const newInitialValues = {
        firstName: userData.fname || '',
        middleName: userData.middle_name || '',  // Middle name
        lastName: userData.lname || '',
        email: userData.email || '',
        gender: userData.gender || '',
        phoneNumber: userData.phone_number || '',
        nextOfKinName: userData.next_of_kin || '',
        contact: userData.kin_contact || '',
        nextOfKinRelation: userData.kin_relation || '',
        position: userData.position?.id || '',
        branch: userData.branch?.id || '',
        location: userData.location?.id || '',
        salary: userData.current_salary || '',
        role: userRole ? userRole.role_id : '',
        department: userData.department?.id || '',
        team: userData.team_obj?.id || '',
        reportsTo: userData?.reports_to || '',
        joiningDate: userData?.date_of_joining,
        restrictedApi: userData?.is_restricted_IP === 1,
        workers: userData?.is_worker === 1,
        financeAccessManager: userData?.access_finance_section === 1,
        bankName: userData?.bank_name || '',
        accountNumber: userData?.account_number || '',
        shiftId: String(userData?.shift_id),
        password: userData?.temp_password || '',
        confirmPassword: userData?.temp_password || ''
      };
      setInitialValues(newInitialValues);

    }
  }, [userData, rolesList, isEditUser]);

  let genders = [
    { id: 1, type: "male" },
    { id: 2, type: "female" },
    { id: 3, type: "other" }
  ];

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('First name is required'),
    middleName: Yup.string(),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    gender: Yup.string().required('Gender is required'),
    phoneNumber: Yup.string().required('Phone number is required'),
    nextOfKinName: Yup.string().required('Next of kin name is required'),
    contact: Yup.string().required('Kin contact is required'),
    nextOfKinRelation: Yup.string().required('Relation to next of kin is required'),
    position: Yup.string().required('Position is required'),
    branch: Yup.string(),
    location: Yup.string().required('Location is required'),
    salary: Yup.number(),
    role: Yup.string().required('Role is required'),
    department: Yup.string().required('Department is required'),
    team: Yup.string(),
    reportsTo: Yup.string().required('ReportsTo Manager is required'),
    joiningDate: Yup.date().required("Date of joining is required"),
    restrictedApi: Yup.boolean(),
    bankName: Yup.string().required("Bank Name is required"),
    accountNumber: Yup.string().required("Account Number is required"),
    workers: Yup.boolean(),
    shiftId: Yup.string().required("Shift is required"),
    financeAccessManager: Yup.boolean(),
    password: Yup.string().min(8, 'Password must be at least 8 characters').required('Password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required'),
  });

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const payload = {
        fname: values.firstName,
        middle_name: values.middleName,
        lname: values.lastName,
        email: values.email,
        gender: values.gender,
        phone_number: values.phoneNumber,
        next_of_kin: values.nextOfKinName,
        kin_contact: values.contact,
        kin_relation: values.nextOfKinRelation,
        position_id: values.position,
        branch_id: values.branch,
        location_id: values.location,
        current_salary: values.salary,
        role_id: values.role,
        department_id: values.department,
        team_id: values.team,
        reports_to: values.reportsTo,
        date_of_joining: values.joiningDate,
        bank_name: values.bankName,
        account_number: values.accountNumber,
        is_restricted_IP: values.restrictedApi ? 1 : 0,
        is_worker: values.workers ? 1 : 0,
        access_finance_section: values.financeAccessManager ? 1 : 0,
        shift_id: values.shiftId,
        password: values.password,
        password_confirmation: values.confirmPassword
      };
    

      if (isEditUser) {
        payload.id = user_id;

        editUser.mutate(payload, {
          onSuccess: () => {
            successToaster('User updated successfully!');
            onSubmit({
              ...payload,
              
              userId: userId
            });
            resetForm();

          }
        });
      } else {
        createUser.mutate(payload, {
          onSuccess: (response) => {
            successToaster('User created successfully');
            onSubmit({
              ...payload,
              
              userId: response.data.response.id
            });
            resetForm();
          }
        });
      }
    }
  });
    

  

  const { data: shiftList, refetch, isLoading: ShiftLoading } = useGetShiftList(formik.values.location);

  const generateRandomPassword = () => {
    const randomPassword = Math.random().toString(36).substr(2, 8);
    formik.setFieldValue('password', randomPassword);
  };

  useEffect(() => {
    if (formik.values.location) {
      refetch();
    }
  }, [formik.values.location]);

  return (
    <div>
      {positionsData && branchData && departmentData && rolesList && locationsData && !isLoadingDepartments && !isLoadingPositions && !isLoadingRoles && !isLoadingBranches && !isLoadingLocations && !isLoadingTeams ? (
        <div className='text-default_text min-h-screen'>
          <div className='rounded-lg mx-5 max-w-6xl'>
            <form onSubmit={formik.handleSubmit}>
              <div className='grid grid-cols-5 gap-4'>
                {/* First Name */}
                <div className='mb-4'>
                  <label htmlFor='firstName' className='block'>
                    First Name
                  </label>
                  <input
                    type='text'
                    id='firstName'
                    name='firstName'
                    placeholder='First Name Here'
                    value={formik.values.firstName}
                    onChange={formik.handleChange}
                    className='w-full text-sm rounded-lg bg-white text-default_text border border-gray-300 p-2 mt-1'
                  />
                  {formik.touched.firstName && formik.errors.firstName && (
                    <p className="text-red-500">{formik.errors.firstName}</p>
                  )}
                </div>

                {/* Middle Name */}
                <div className='mb-4'>
                  <label htmlFor='middleName' className='block'>
                    Middle Name
                  </label>
                  <input
                    type='text'
                    id='middleName'
                    name='middleName'
                    placeholder='Middle Name Here'
                    value={formik.values.middleName}
                    onChange={formik.handleChange}
                    className='w-full text-sm rounded-lg bg-white text-default_text border border-gray-300 p-2 mt-1'
                  />
                  {formik.touched.middleName && formik.errors.middleName && (
                    <p className="text-red-500">{formik.errors.middleName}</p>
                  )}
                </div>

                {/* Last Name */}
                <div className='mb-4'>
                  <label htmlFor='lastName' className='block'>
                    Last Name
                  </label>
                  <input
                    type='text'
                    id='lastName'
                    name='lastName'
                    placeholder='Last Name Here'
                    value={formik.values.lastName}
                    onChange={formik.handleChange}
                    className='w-full text-sm rounded-lg bg-white text-default_text border border-gray-300 p-2 mt-1'
                  />
                  {formik.touched.lastName && formik.errors.lastName && (
                    <p className="text-red-500">{formik.errors.lastName}</p>
                  )}
                </div>

                {/* Email */}
                <div className='mb-4'>
                  <label htmlFor='email' className='block'>
                    Email
                  </label>
                  <input
                    type='text'
                    id='email'
                    name='email'
                    placeholder='Email Here'
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    className='w-full text-sm rounded-lg bg-white text-default_text border border-gray-300 p-2 mt-1'
                  />
                  {formik.touched.email && formik.errors.email && (
                    <p className="text-red-500">{formik.errors.email}</p>
                  )}
                </div>

                {/* Phone Number */}
                <div className='mb-4'>
                  <label htmlFor='phoneNumber' className='block'>
                    Phone Number
                  </label>
                  <input
                    type='tel'
                    id='phoneNumber'
                    name='phoneNumber'
                    placeholder='Phone Number Here'
                    value={formik.values.phoneNumber}
                    onChange={formik.handleChange}
                    className='w-full text-sm rounded-lg bg-white text-default_text border border-gray-300 p-2 mt-1'
                  />
                  {formik.touched.phoneNumber && formik.errors.phoneNumber && (
                    <p className="text-red-500">{formik.errors.phoneNumber}</p>
                  )}
                </div>
              </div>

              <div className='grid grid-cols-3 gap-4 mt-4'>
                {/* Next of Kin Name */}
                <div className='mb-4'>
                  <label htmlFor='nextOfKinName' className='block'>
                    Next of kin
                  </label>
                  <input
                    type='text'
                    id='nextOfKinName'
                    name='nextOfKinName'
                    placeholder='Name Here'
                    value={formik.values.nextOfKinName}
                    onChange={formik.handleChange}
                    className='rounded-lg text-sm w-full bg-white border text-default_text border-gray-300 p-2 mt-1'
                  />
                  {formik.touched.nextOfKinName && formik.errors.nextOfKinName && (
                    <p className="text-red-500">{formik.errors.nextOfKinName}</p>
                  )}
                </div>

                {/* Contact */}
                <div className='mb-4'>
                  <label htmlFor='contact' className='block'>
                    Next of kin contact
                  </label>
                  <input
                    type='tel'
                    id='contact'
                    name='contact'
                    placeholder='Contact Here'
                    value={formik.values.contact}
                    onChange={formik.handleChange}
                    className='rounded-lg text-sm w-full bg-white border text-default_text border-gray-300 p-2 mt-1'
                  />
                  {formik.touched.contact && formik.errors.contact && (
                    <p className="text-red-500">{formik.errors.contact}</p>
                  )}
                </div>

                {/* Relation to next of kin */}
                <div className='mb-4'>
                  <label htmlFor='nextOfKinRelation' className='block'>
                    Relation to next of kin
                  </label>
                  <input
                    type='text'
                    id='nextOfKinRelation'
                    name='nextOfKinRelation'
                    placeholder='Relation Here'
                    value={formik.values.nextOfKinRelation}
                    onChange={formik.handleChange}
                    className='rounded-lg text-sm w-full bg-white border text-default_text border-gray-300 p-2 mt-1'
                  />
                  {formik.touched.nextOfKinRelation && formik.errors.nextOfKinRelation && (
                    <p className="text-red-500">{formik.errors.nextOfKinRelation}</p>
                  )}
                </div>
              </div>

              <div className='grid grid-cols-3 gap-4 mt-4'>
                {/* Password */}
                <div className="mb-4 relative">
                  <label htmlFor='password' className='block'>
                    Password
                  </label>
                  <input
                    type="text"
                    id="password"
                    name="password"
                    placeholder={"Password"}
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    className={`w-full text-sm rounded-lg bg-white border text-default_text border-gray-300 p-2 mt-1`}
                  />
                  {formik.touched.password && formik.errors.password && (
                    <p className="text-red-500">{formik.errors.password}</p>
                  )}
                  <span
                    className='absolute -top-3 right-0 text-primary border border-primary rounded-2xl cursor-pointer px-2 py-1 text-sm'
                    onClick={generateRandomPassword}
                  >
                    Generate
                  </span>
                </div>

                {/* Confirm Password */}
                <div className="mb-4">
                  <label htmlFor='confirmPassword' className='block'>
                    Confirm Password
                  </label>
                  <input
                    type="text"
                    id='confirmPassword'
                    name='confirmPassword'
                    placeholder={"Confirm Password"}
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    className='w-full text-sm rounded-lg bg-white border text-default_text border-gray-300 p-2 mt-1'
                  />
                  {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                    <p className="text-red-500">{formik.errors.confirmPassword}</p>
                  )}
                </div>

                {/* Gender */}
                <div className='mb-4'>
                  <label htmlFor='gender' className='block'>
                    Gender
                  </label>
                  <select
                    id='gender'
                    name='gender'
                    value={formik.values.gender}
                    onChange={formik.handleChange}
                    className='rounded-lg text-sm w-full bg-white border text-default_text border-gray-300 p-2 mt-1 capitalize'
                  >
                    <option value=''>Select Gender</option>
                    {genders.map((gen) => (
                      <option key={gen.id} value={gen.type}>
                        {gen.type}
                      </option>
                    ))}
                  </select>
                  {formik.touched.gender && formik.errors.gender && (
                    <p className="text-red-500">{formik.errors.gender}</p>
                  )}
                </div>
              </div>

              <div className='grid grid-cols-3 gap-4 mt-4'>
                {/* Assign Position */}
                <div className='mb-4'>
                  <label htmlFor='position' className='block'>
                    Assign Position
                  </label>
                  <select
                    id='position'
                    name='position'
                    value={formik.values.position}
                    onChange={formik.handleChange}
                    className='rounded-lg text-sm w-full bg-white border text-default_text border-gray-300 p-2 mt-1 capitalize'
                  >
                    <option value=''>Select Position</option>
                    {positionsData.map((position) => (
                      <option key={position.id} value={position.id}>
                        {position.name}
                      </option>
                    ))}
                  </select>
                  {formik.touched.position && formik.errors.position && (
                    <p className="text-red-500">{formik.errors.position}</p>
                  )}
                </div>

                {/* Restricted API Checkbox */}
                <div className='mb-4'>
                  <label htmlFor='restrictedApi' className='block'>
                    Restricted API
                  </label>
                  <div className="flex items-center mt-1">
                    <input
                      type="checkbox"
                      id="restrictedApi"
                      name="restrictedApi"
                      checked={formik.values.restrictedApi}
                      onChange={(e) =>
                        formik.setFieldValue("restrictedApi", e.target.checked)
                      }
                      className="h-4 w-4 text-red-500 border-gray-300 rounded focus:ring-primary"
                    />
                    <span className="ml-2 text-sm text-default_text">Enable Restricted API</span>
                  </div>
                  {formik.touched.restrictedApi && formik.errors.restrictedApi && (
                    <p className="text-red-500">{formik.errors.restrictedApi}</p>
                  )}
                </div>

                <div>
                  <div className='mb-4'>
                    <label htmlFor='branch' className='block'>
                      Assign Branch
                    </label>
                    <select
                      id='branch'
                      name='branch'
                      value={formik.values.branch}
                      onChange={formik.handleChange}
                      className='rounded-lg text-sm w-full bg-white border text-default_text border-gray-300 p-2 mt-1 capitalize'
                    >
                      <option value=''>Select Branch</option>
                      {branchData.map((branch) => (
                        <option key={branch.id} value={branch.id}>
                          {branch.name}
                        </option>
                      ))}
                    </select>
                    {formik.touched.branch && formik.errors.branch && (
                      <p className="text-red-500">{formik.errors.branch}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className='grid grid-cols-3 gap-4 mt-4'>
                {/* Location Dropdown */}
                <div className="mb-4">
                  <label htmlFor="location" className="block">
                    Assign Location <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="location"
                    name="location"
                    value={formik.values.location}
                    onChange={(e) => {
                      formik.handleChange(e);
                      formik.setFieldValue("shiftId", ""); // Reset shift selection when location changes
                    }}
                    className="rounded-lg text-sm w-full bg-white border text-default_text border-gray-300 p-2 mt-1 capitalize"
                  >
                    <option value="">Select Location</option>
                    {locationsData.map((location) => (
                      <option key={location.id} value={location.id}>
                        {location.name}
                      </option>
                    ))}
                  </select>
                  {formik.touched.location && formik.errors.location && (
                    <p className="text-red-500 text-sm">{formik.errors.location}</p>
                  )}
                </div>

                {/* Shift Selection */}
                <div className="mb-4">
                  <label className="block">
                    Select Shift <span className="text-red-500">*</span>
                  </label>

                  {/* Loader when shifts are loading */}
                  {ShiftLoading ? (
                    <div className="flex justify-center items-center mt-3">
                      <div className="w-6 h-6 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                    </div>
                  ) : shiftList?.length > 0 ? (
                    <div className="mt-3 space-y-3">
                      {shiftList.map((shift) => (
                        <div key={shift.id} className="flex items-center bg-gray-50 space-x-3 border p-3 rounded-lg hover:bg-gray-50">
                          <input
                            type="radio"
                            id={`shift-${shift.id}`}
                            name="shiftId"
                            value={String(shift.id)}
                            checked={formik.values.shiftId === String(shift.id)}
                            onChange={(e) => formik.setFieldValue("shiftId", e.target.value)}
                            className="cursor-pointer w-5 h-5 accent-blue-500"
                          />
                          <label htmlFor={`shift-${shift.id}`} className="cursor-pointer">
                            {shift.shift_name} ( {shift.start_time} - {shift.end_time} )
                          </label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-3 text-red-500 bg-red-100 p-3 rounded-lg text-center">
                      <p>No shifts found for this location. Please add a shift to proceed.</p>
                    </div>
                  )}

                  {formik.touched.shiftId && formik.errors.shiftId && (
                    <p className="text-red-500 text-sm mt-1">{formik.errors.shiftId}</p>
                  )}
                </div>

                <div className='mb-4'>
                  <label htmlFor='workers' className='block'>
                    Payroll Employee
                  </label>
                  <div className="flex items-center mt-1">
                    <input
                      type="checkbox"
                      id="workers"
                      name="workers"
                      checked={formik.values.workers}
                      onChange={(e) =>
                        formik.setFieldValue("workers", e.target.checked)
                      }
                      className="h-4 w-4 text-red-500 border-gray-300 rounded focus:ring-primary"
                    />
                    <span className="ml-2 text-sm text-default_text">Payroll Employee Only</span>
                  </div>
                  {formik.touched.workers && formik.errors.workers && (
                    <p className="text-red-500">{formik.errors.workers}</p>
                  )}
                </div>
              </div>

              <div className='grid grid-cols-3 gap-4 mt-4'>
                {/* Assign Department */}
                <div className='mb-4'>
                  <label htmlFor='department' className='block'>Assign Department</label>
                  <select
                    id='department'
                    name='department'
                    value={formik.values.department}
                    onChange={formik.handleChange}
                    className='rounded-lg text-sm w-full bg-white border text-default_text border-gray-300 p-2 mt-1 capitalize'
                  >
                    <option value=''>Select Department</option>
                    {departmentData.map((department) => (
                      <option key={department.id} value={department.id}>
                        {department.department_name}
                      </option>
                    ))}
                  </select>
                  {formik.touched.department && formik.errors.department && (
                    <p className="text-red-500">{formik.errors.department}</p>
                  )}
                </div>

                {/* Assign Role */}
                <div className='mb-4'>
                  <label htmlFor='role' className='block'>Assign Role</label>
                  <select
                    id='role'
                    name='role'
                    value={formik.values.role}
                    onChange={formik.handleChange}
                    className='rounded-lg text-sm w-full bg-white border text-default_text border-gray-300 p-2 mt-1 capitalize'
                  >
                    <option value=''>Select Role</option>
                    {rolesList
                      .filter(role => role.description.toLowerCase() !== 'admin')
                      .map((role) => (
                        <option key={role.role_id} value={role.role_id}>
                          {role.description}
                        </option>
                      ))}
                  </select>
                  {formik.touched.role && formik.errors.role && (
                    <p className="text-red-500">{formik.errors.role}</p>
                  )}
                </div>

                {/* Access to Finance Manager Checkbox (only for Manager role) */}
                {formik.values.role == '4' && (
                  <div className='mb-4 mt-2'>
                    <label htmlFor='financeAccessManager' className='block'>
                      Finance Access
                    </label>
                    <div className="flex items-center mt-1">
                      <input
                        type='checkbox'
                        name='financeAccessManager'
                        checked={formik.values.financeAccessManager}
                        onChange={() =>
                          formik.setFieldValue('financeAccessManager', formik.values.financeAccessManager ? 0 : 1)
                        }
                        className="h-4 w-4 text-red-500 border-gray-300 rounded focus:ring-primary"
                      />
                      <span className="ml-2 text-sm text-default_text">Access to Finance Section</span>
                    </div>
                  </div>
                )}
              </div>

              <div className='grid grid-cols-3 gap-4 mt-4'>
                {/* Assign Team */}
                {formik.values.role == '2' &&
                  <div className=''>
                    <label htmlFor='team' className='block'>
                      Assign Team
                    </label>
                    <select
                      id='team'
                      name='team'
                      value={formik.values.team}
                      onChange={formik.handleChange}
                      className='rounded-lg text-sm w-full bg-white border text-default_text border-gray-300 p-2 mt-1 capitalize'
                    >
                      <option value=''>Select Team</option>
                      {teamsData.map((team) => (
                        <option key={team.id} value={team.id}>
                          {team.team_name}
                        </option>
                      ))}
                    </select>
                    {formik.touched.team && formik.errors.team && (
                      <p className="text-red-500">{formik.errors.team}</p>
                    )}
                  </div>
                }

                <div className=' mb-4 '>
                  <label htmlFor='joiningDate' className='block'>
                    Date of Joining
                  </label>
                  <input
                    type='date'
                    id='joiningDate'
                    name='joiningDate'
                    value={formik.values.joiningDate}
                    onChange={formik.handleChange}
                    className='rounded-lg text-sm w-full bg-white border text-default_text border-gray-300 p-2 mt-1'
                  />
                  {formik.touched.joiningDate && formik.errors.joiningDate && (
                    <p className="text-red-500">{formik.errors.joiningDate}</p>
                  )}
                </div>

                <div className=' mb-4 '>
                  <label htmlFor='reportsTo' className='block'>
                    Reports To Manager
                  </label>
                  <select
                    id='reportsTo'
                    name='reportsTo'
                    value={formik.values.reportsTo}
                    onChange={formik.handleChange}
                    className='rounded-lg text-sm w-full bg-white border text-default_text border-gray-300 p-2 mt-1 capitalize'
                  >
                    <option value=''>Select Manager</option>
                    {UserList
                      ?.filter((user) => user.role === "manager")
                      .map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name}
                        </option>
                      ))}
                  </select>
                  {formik.touched.reportsTo && formik.errors.reportsTo && (
                    <p className="text-red-500">{formik.errors.reportsTo}</p>
                  )}
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
                      type='string'
                      id='accountNumber'
                      name='accountNumber'
                      value={formik.values.accountNumber}
                      onChange={formik.handleChange}
                      className='rounded-lg text-sm w-full bg-white border text-default_text border-gray-300 p-2 mt-1'
                    />
                    {formik.touched.accountNumber && formik.errors.accountNumber && (
                      <p className="text-red-500">{formik.errors.accountNumber}</p>
                    )}
                  </div>

                  <div className=' mb-4'>
                    <label htmlFor='bankName' className='block'>
                      Assign Bank
                    </label>
                    <select
                      id="bankName"
                      name="bankName"
                      value={formik.values.bankName}
                      onChange={formik.handleChange}
                      className="rounded-lg text-sm w-full bg-white border text-default_text border-gray-300 p-2 mt-1 capitalize"
                    >
                      <option value="">Select Bank</option>
                      {Banks.map((bank) => (
                        <option key={bank.id} value={bank.bank_name}>
                          {bank.bank_name}
                        </option>
                      ))}
                    </select>
                    {formik.touched.bankName && formik.errors.bankName && (
                      <p className="text-red-500">{formik.errors.bankName}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-12 pb-4">
                <button
                  type='button'
                  className='flex items-center justify-center border border-secondary text_default_text rounded-xl py-2 px-9 text-sm'
                  onClick={() => router.push('/hr/onboarding')}
                >
                  <MdDeleteOutline className='text-base mr-1' />
                  Discard
                </button>
                <button
                  type="submit"
                  className="flex items-center justify-center rounded-xl text-center px-9 py-2 bg-primary text-white border text-sm"
                >
                  <CiFloppyDisk className='text-base mr-1' />
                  {createUser.isLoading ? <ButtonLoader text={'Creating...'} /> : "Next Step"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <DataLoader />
      )}
    </div>
  );
};

export default EmployeeOnboardingCreateUser;
