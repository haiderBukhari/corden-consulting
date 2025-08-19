import React, { useState } from 'react';
import DepartmentListComponent from './DepartmentList';
import PeopleTeamListComponent from './TeamList';
import PeopleDepartmentListComponent from './DepartmentList';
import { useGetPeopleCount } from '../../../../hooks/query/HR/getPeopleDetails';
import EmployeeListComponent from './EmployeeList';

const AllPeopleListComponent = () => {
  const [activeTab, setActiveTab] = useState('departments');
  const [searchTerm, setSearchTerm] = useState('');
  const {data:count,isLoading}=useGetPeopleCount()

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="p-3">
      {/* Tab navigation */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        <button
          className={`mr-4 border-2 rounded-lg py-2 ${activeTab === 'departments' ? 'bg-primary text-white' : 'border-primary'}`}
          onClick={() => handleTabChange('departments')}
        >
          All Departments
          {count && <span  className={` ${activeTab === 'departments' ? 'bg-white text-primary' : 'text-white bg-primary'} rounded-full px-1 text-sm ml-2`}>{count?.department}</span> }
        </button>
        <button
          className={`mr-4 border-2 rounded-lg py-2 ${activeTab === 'teams' ? 'bg-primary text-white' : 'border-primary text-primary' }`}
          onClick={() => handleTabChange('teams')}
        >
          All Teams 
          {count && <span  className={` ${activeTab === 'teams' ? 'bg-white text-primary' : 'text-white bg-primary'} rounded-full px-1 text-sm ml-2`}>{count?.team}</span> }
        </button>
        <button
          className={`border-2 rounded-lg py-2 ${activeTab === 'employees' ? 'bg-primary text-white' : 'border-primary text-primary'}`}
          onClick={() => handleTabChange('employees')}
        >
          All Employees
          {count && <span  className={` ${activeTab === 'employees' ? 'bg-white text-primary' : 'text-white bg-primary'} rounded-full px-1 text-sm ml-2`}>{count?.employee}</span> }
        </button>
      </div>

      
      {/* Content based on active tab */}
      {activeTab === 'departments' && <PeopleDepartmentListComponent searchTerm={searchTerm} handleSearchChange={handleSearchChange} />}
      {activeTab === 'teams' && <PeopleTeamListComponent searchTerm={searchTerm} handleSearchChange={handleSearchChange}  /> }
      {activeTab === 'employees' && <EmployeeListComponent searchTerm={searchTerm}  handleSearchChange={handleSearchChange} />}
    </div>
  );
};

export default AllPeopleListComponent;
