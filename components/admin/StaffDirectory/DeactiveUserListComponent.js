import React, { useState, useMemo, useEffect } from 'react';
import { BsSearch } from 'react-icons/bs';
import { TbEdit, TbTrash } from "react-icons/tb";
import { MdFilterList } from 'react-icons/md';
import { PiExport } from "react-icons/pi";
import { UseGetUsers } from '../../../hooks/query/admin/getUserList';
import DataLoader from '../../ui/dataLoader';
import { useRouter } from 'next/router';
import UseDeleteUser from '../../../hooks/mutations/admin/deleteUser';
import DeleteItemModal from '../../ui/deleteItemModal';
import { CiFloppyDisk } from "react-icons/ci";
import { MdDeleteOutline } from "react-icons/md";
import Image from 'next/image';
import { UseGetDeactivatedUsers } from '../../../hooks/query/admin/getDeactivatedUser';
import UseDeactivateUser from '../../../hooks/mutations/admin/deactivateUser';

export default function DeactivateUserlist({ isDashBoard }) {
  const { data: allStaffUsers, isLoading, isError, error } = UseGetDeactivatedUsers();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortCriteria, setSortCriteria] = useState('name');
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [activateModalVisible, setActivateModalVisible] = useState(false);
  const [userToActivate, setUserToActivate] = useState(null);
  const [filters, setFilters] = useState({
    role: '',
    department: '',
    location: ''
  });
  const [appliedFilters, setAppliedFilters] = useState(filters);
  const [roleOptions, setRoleOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [locationOptions, setLocationOptions] = useState([]);
  const router = useRouter();
  const activateUser = UseDeactivateUser()
  const deleteUser = UseDeleteUser();

  useEffect(() => {
    if (allStaffUsers) {
      // Extract distinct roles
      const roles = [...new Set(allStaffUsers.map(user => user.role).filter(Boolean))];
      setRoleOptions(roles);

      // Extract distinct departments
      const departments = [...new Set(allStaffUsers.map(user => user.department?.departments_name).filter(Boolean))];
      setDepartmentOptions(departments);

      // Extract distinct locations
      const locations = [...new Set(allStaffUsers.map(user => user.location?.name).filter(Boolean))];
      setLocationOptions(locations);
    }
  }, [allStaffUsers]);

  const filteredUsers = useMemo(() => {
    if (!allStaffUsers) return [];
    let filtered = allStaffUsers.filter(user =>
      Object.values(user).some(value =>
        value && typeof value === 'string' && value.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    // Apply additional filters
    if (appliedFilters.role) {
      filtered = filtered.filter(user => user.role.toLowerCase() === appliedFilters.role.toLowerCase());
    }
    if (appliedFilters.department) {
      filtered = filtered.filter(user => user.department?.departments_name.toLowerCase() === appliedFilters.department.toLowerCase());
    }
    if (appliedFilters.location) {
      filtered = filtered.filter(user => user.location?.name.toLowerCase() === appliedFilters.location.toLowerCase());
    }

    return filtered.sort((a, b) => {
      if (a[sortCriteria] < b[sortCriteria]) return -1;
      if (a[sortCriteria] > b[sortCriteria]) return 1;
      return 0;
    });
  }, [allStaffUsers, sortCriteria, searchTerm, appliedFilters]);

  const handleExportCSV = () => {
    const headers = "Name,Email,Phone,Role,Position,Department,Location\n";

    const rows = filteredUsers.map(member =>
      `${member.name},${member.email},${member.phone_number},${member?.role || ''},${member.position?.name || ''},${member.department?.departments_name || ''},${member.location?.name || ''}`
    ).join("\n");

    const csvContent = "data:text/csv;charset=utf-8," + headers + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");

    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "staff_directory.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const openDeleteModal = (user) => {
    setUserToDelete(user);
    setDeleteModalVisible(true);
  };


  const openActivateModal = (user) => {
    setUserToActivate(user);
    setActivateModalVisible(true);
  };
  const closeActivateModal = () => {
    setUserToActivate(null);
    setActivateModalVisible(false);
  };


  const openFilterModal = () => {
    setFilterModalVisible(true);
  };

  const closeDeleteModal = () => {
    setUserToDelete(null);
    setDeleteModalVisible(false);
  };

  const closeFilterModal = () => {
    setFilterModalVisible(false);
  };

  const handleDeleteUser = () => {
    if (userToDelete) {
      deleteUser.mutate(userToDelete.id);
      closeDeleteModal();
    }
  };
  const handleActivateUser = () => {
    if (userToActivate) {
      const data = {
        userId: userToActivate.id,
        status: 1
      }
      activateUser.mutate(data,
        {
          onSuccess: () => {
            closeActivateModal();
          }
        }
      );
    }
  }
  const handleFilterChange = (filterType, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterType]: value
    }));
  };

  const applyFilters = () => {
    setAppliedFilters(filters);
    closeFilterModal();
  };

  const clearFilters = () => {
    setFilters({
      role: '',
      department: '',
      location: ''
    });
    setAppliedFilters({
      role: '',
      department: '',
      location: ''
    });
    closeFilterModal();
  };

  return (
    <div>
      {isLoading ? (
        <DataLoader />
      ) : (
        <div>
          {!isDashBoard ?
            <>
              <div className="flex flex-wrap justify-between items-center gap-4 p-3">
                <div className="flex-grow md:flex md:items-center md:w-auto">
                  <div className="relative w-full">
                    <BsSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text_default_text" />
                    <input
                      type="text"
                      placeholder="Search By Name"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-3 py-2 w-full focus:outline-none border rounded-xl text-sm"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                  <button onClick={openFilterModal} className="py-2 px-4 border rounded-xl flex items-center gap-2 text-sm whitespace-nowrap">
                    <MdFilterList />
                    <span>Filter</span>
                  </button>
                  <button onClick={handleExportCSV} className="py-2 px-4 border rounded-xl flex items-center gap-2 text-sm whitespace-nowrap">
                    <PiExport />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              {filterModalVisible && (
                <div className="fixed inset-0 bg-gray-800 bg-opacity-50 z-50 flex justify-center items-center">
                  <div className="bg-white p-4 rounded-xl max-w-lg">
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-semibold">Filters</h2>
                      <button onClick={closeFilterModal} className="text_default_text">
                        Close
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Role Filter */}
                      <div className="flex flex-col">
                        <label htmlFor="roleFilter" className="mb-2 text-sm font-medium">Role</label>
                        <select
                          id="roleFilter"
                          value={filters.role}
                          onChange={(e) => handleFilterChange('role', e.target.value)}
                          className="py-2 px-3 pr-8 border rounded-xl text-sm focus:outline-none capitalize"
                        >
                          <option value="">Select Role</option>
                          {roleOptions.map((role, index) => (
                            <option key={index} value={role}>{role}</option>
                          ))}
                        </select>
                      </div>
                      {/* Department Filter */}
                      <div className="flex flex-col">
                        <label htmlFor="departmentFilter" className="mb-2 text-sm font-medium">Department</label>
                        <select
                          id="departmentFilter"
                          value={filters.department}
                          onChange={(e) => handleFilterChange('department', e.target.value)}
                          className="py-2 px-3 pr-8 border rounded-xl text-sm focus:outline-none capitalize"
                        >
                          <option value="">Select Department</option>
                          {departmentOptions.map((department, index) => (
                            <option key={index} value={department}>{department}</option>
                          ))}
                        </select>
                      </div>
                      {/* Location Filter */}
                      <div className="flex flex-col">
                        <label htmlFor="locationFilter" className="mb-2 text-sm font-medium">Location</label>
                        <select
                          id="locationFilter"
                          value={filters.location}
                          onChange={(e) => handleFilterChange('location', e.target.value)}
                          className="py-2 px-3 pr-8 border rounded-xl text-sm focus:outline-none capitalize"
                        >
                          <option value="">Select Location</option>
                          {locationOptions.map((location, index) => (
                            <option key={index} value={location}>{location}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="mt-6 flex justify-end gap-2">
                      <button
                        type='button'
                        className='flex items-center justify-center border border-secondary text_default_text rounded-xl py-2 px-6 text-xs'
                        onClick={clearFilters}
                      >
                        <MdDeleteOutline className='text-base mr-1' />
                        Clear
                      </button>
                      <button
                        onClick={applyFilters}
                        className="flex items-center justify-center rounded-xl text-center px-6 py-2 bg-primary text-white border text-xs"
                      >
                        <CiFloppyDisk className='text-base mr-1' />
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap justify-between items-start gap-4 px-3 py-2 text-sm">
                <div className="flex items-start">
                  <span>Showing {filteredUsers.length} results</span>
                </div>
                <div className="grid grid-cols-5 items-center p-2 border rounded-xl text-left relative">
                  <label htmlFor="sort" className="mr-4 col-span-1">Sort by</label>
                  <select
                    id="sort"
                    value={sortCriteria}
                    onChange={(e) => setSortCriteria(e.target.value)}
                    className="py-2 px-1 pr-24 border rounded-xl text-left col-span-4 bg-gray-100 text-sm"
                  >
                    <option value="name">Name</option>
                    <option value="email">Email</option>
                    <option value="phone_number">Phone</option>
                  </select>
                </div>
              </div>
            </>
            :
            null
          }

          {
            filteredUsers && filteredUsers.length > 0 ?
              <div className={`${!isDashBoard ? "p-3" : "mt-3"}`}>
                <div className="overflow-x-auto border rounded-xl min-h-screen overflow-y-auto">
                  <table className="min-w-full border-collapse bg-white">
                    <thead className="bg-gray-100 sticky top-0 z-20">
                      <tr className="">
                        <th className="px-4 py-2 text-left text_default_text text-sm">Name</th>
                        <th className="px-4 py-2 text-left text_default_text text-sm">Email</th>
                        <th className="px-4 py-2 text-left text_default_text text-sm">Phone</th>
                        <th className="px-4 py-2 text-left text_default_text text-sm">Role</th>
                        <th className="px-4 py-2 text-left text_default_text text-sm">Position</th>
                        <th className="px-4 py-2 text-left text_default_text text-sm">Department</th>
                        <th className="px-4 py-2 text-left text_default_text text-sm ">Team</th>
                        <th className="px-4 py-2 text-left text_default_text text-sm w-40">Location</th>
                        <th className="px-4 py-2 text-left text_default_text text-sm w-40">Status</th>
                        <th className="px-4 py-2 text-left text_default_text text-sm">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user, index) => (
                        <tr key={index} className={`${index === filteredUsers.length - 1 ? '' : 'border-b border-gray-100'}`}>
                          <td className="px-4 py-3 text-left text_default_text text-sm capitalize">
                            <div className="flex items-center">
                              <Image
                                src={user.avatar}
                                alt={user.name}
                                className="w-8 h-8 rounded-full mr-2"
                                height={200}
                                width={400}
                              />
                              <span>{user?.name || ''}</span>
                            </div>
                          </td>
                          <td className="px-2 py-3 text-left text_default_text text-sm break-all">{user?.email || ''}</td>
                          <td className="px-2 py-3 text-left text_default_text text-sm">{user?.phone_number || ''}</td>
                          <td className="px-2 py-3 text-left text_default_text text-sm capitalize">{user?.role.replace(/_/g, ' ') || ''}</td>
                          <td className="px-2 py-3 text-left text_default_text text-sm capitalize">{user.position?.name || ''}</td>
                          <td className="px-2 py-3 text-left text_default_text text-sm capitalize">{user.department?.departments_name || ''}</td>
                          <td className="px-2 py-3 text-left text_default_text text-sm capitalize">{user.team || ''}</td>
                          <td className="px-2 py-3 text-left text_default_text text-sm capitalize">{user.location?.name || ''}</td>
                          <td className="px-2 py-3 text-left text_default_text text-sm capitalize">{user?.activate_status || ''}</td>
                          <td className="px-2 py-2 text-left text_default_text text-sm flex justify-center space-x-2 items-center align-middle">
                            <button
                              onClick={() => { openActivateModal(user) }}
                              className="group relative rounded-md py-2 px-4 border border-primary text-primary text-sm"
                            >
                              Activate
                            </button>
                            <button
                              onClick={() => { openDeleteModal(user) }}
                              className="group relative rounded-md py-2 px-4 border border-secondary text_default_text text-sm"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              :
              <div className={`${!isDashBoard ? "p-3" : "mt-6"}`}>
                <div className={`${!isDashBoard ? "p-3" : "mt-6 border rounded-lg"} text-lg min-h-screen text_default_text text-center`}>
                  <p className={`${!isDashBoard ? null : "mt-6"}`}>
                    No Staff Directory Data!
                  </p>
                </div>
              </div>
          }
        </div>
      )
      }
      <DeleteItemModal modalVisible={activateModalVisible} item={'user'} handleDeleteItem={handleActivateUser} closeModal={closeActivateModal} action={'Activate'} />
      <DeleteItemModal modalVisible={deleteModalVisible} item={'user'} handleDeleteItem={handleDeleteUser} closeModal={closeDeleteModal} action={'delete'} />
    </div>
  );
}
