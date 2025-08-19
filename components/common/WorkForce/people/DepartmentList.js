import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import { utils, write } from 'xlsx';
import { BsSearch } from 'react-icons/bs';
import { MdFilterList } from 'react-icons/md';
import { PiExport } from 'react-icons/pi';
import { UseGetDepartments } from '../../../../hooks/query/admin/getDepartments';
import DepartmentEmployeesComponent from './DepartmentEmployeeList';
import DataLoader from '../../../ui/dataLoader';
import Image from 'next/image';

const PeopleDepartmentListComponent = ({ searchTerm, handleSearchChange }) => {
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const { data: departmentList, isLoading } = UseGetDepartments()


  const filteredDepartments = departmentList && departmentList.filter(
    (department) =>
      department?.department_name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleExportCSV = () => {
    const exportData = [];

    filteredDepartments.forEach((department) => {
      exportData.push({
        Department: department.department_name,
        Name: '',
        Attendance: '',
        Role: '',
        Position: '',
        Location: '',
        Status: ''
      });

      department.team_members.forEach((employee) => {
        exportData.push({
          Department: '',
          Name: employee.name,
          Attendance: `${employee.attendance_percentage}%`,
          Role: employee.role,
          Position: employee.position?.name,
          Location: employee.location?.name,
          Status: employee.todayAttendenceStatus
        });
      });
    });
    const worksheet = utils.json_to_sheet(exportData);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const buffer = write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    saveAs(blob, 'departmentList.csv');
  }
  const handleViewDepartment = (department) => {
    setSelectedDepartment(department);
  };

  return (
    <div className=" min-h-screen">
      {selectedDepartment ?
        <DepartmentEmployeesComponent department={selectedDepartment} setBack={setSelectedDepartment} />
        :
        isLoading ?
          <DataLoader />
          :
          departmentList &&
          <div className=''>
            <div className="flex flex-wrap justify-between  items-center gap-4 pb-3">
              <div className="flex-grow md:flex md:items-center md:w-auto">
                <div className="relative w-full">
                  <BsSearch className="absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search By Department Name"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="pl-10 pr-3 py-2 w-full focus:outline-none border rounded-lg"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2 items-center">

                {filteredDepartments?.length > 0 && (
                  <button onClick={handleExportCSV} className="py-2 px-4 border rounded-lg flex items-center gap-2 text-sm whitespace-nowrap">
                    <PiExport />
                    <span>Export CSV</span>
                  </button>
                )}
              </div>
            </div>
            <div className='grid grid-cols-3 gap-4 '>
              {filteredDepartments?.map((department) => (
                <div key={department.id} className="border p-4 rounded-xl shadow">
                  <div className="flex items-center space-x-2 mb-2">
                    <Image
                      src="/assets/icon.svg"
                      alt="Icon"
                      className="h-12 w-12"
                      height={200}
                      width={400}
                    />
                    <h3 className="font-bold text-xl">{department.department_name}</h3>
                  </div>
                  <div className='flex flex-col items-center'>
                    <span className='text-2xl font-semibold'>
                      {department.team_members.length}
                    </span>
                    <p>Total Employees</p>
                  </div>
                  <div className='flex justify-between items-center mt-2'>
                    <div className='relative flex -space-x-3 '>
                      {department?.team_members?.slice(0, 7).map((member, index) => (
                        <div key={member.id} className={`relative z-10 ${index !== 0 ? '-ml-3' : ''}`}>
                          <Image
                            src={member?.avatar}
                            alt={`${member?.name}'s avatar`}
                            className="h-9 w-9 rounded-full border-2 border-gray-100"
                            height={200}
                            width={400}
                          />
                        </div>
                      ))}
                    </div>


                    <button
                      onClick={() => handleViewDepartment(department)}
                      className="underline text-sm text-primary rounded-lg"
                    >
                      View Department
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
      }
    </div>
  );
};

export default PeopleDepartmentListComponent;
