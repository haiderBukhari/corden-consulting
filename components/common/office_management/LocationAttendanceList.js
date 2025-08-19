
import React, { useState, useEffect } from 'react';
import { BsSearch } from 'react-icons/bs';
import { FaRegCalendarAlt, FaInfoCircle } from 'react-icons/fa';
import { PiExport } from "react-icons/pi";
import { useMemo } from 'react';
import DatePicker from 'react-datepicker';
import { PencilIcon } from '@heroicons/react/24/outline';
import 'react-datepicker/dist/react-datepicker.css';
import DataLoader from '../../ui/dataLoader';

import { getStatusClasses } from '../attendance/AttendanceComponent';
import { formatDateToDdMmYy } from '../../../utils/functions';
import { UseGetLocationAttendanceList } from '../../../hooks/query/locations/getLocationAttendanceList';
import { MdFilterList } from 'react-icons/md';  
import EditAttendanceModal from '../WorkForce/attendance/editAttendanceModal';
import { AgGridReact } from "ag-grid-react";
import { ClientSideRowModelModule, DateFilterModule, ModuleRegistry, NumberFilterModule, TextFilterModule, ValidationModule, } from "ag-grid-community";
ModuleRegistry.registerModules([ClientSideRowModelModule, TextFilterModule, NumberFilterModule, DateFilterModule, ValidationModule /* Development Only */,
]);

export default function LocationAttendanceList({ role, managedLocations }) {

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [date, setDate] = useState(formatDateToDdMmYy(new Date()));

  const [filterDropdownVisible, setFilterDropdownVisible] = useState(false);
  const [filters, setFilters] = useState({
    all: true,
    byDepartment: false,
    byLocation: false,
    byTeam: false
  });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedAttendance, setSelectedAttendance] = useState(null);

  const [selectedLocationId, setSelectedLocationId] = useState(null);


  const { data: AttendanceList, isLoading, refetch, error } = UseGetLocationAttendanceList(selectedLocationId, date);

  useEffect(() => {
    refetch();
  }, [date, refetch]);

  const handleFilterChange = (filterName) => {
    setFilters(prevFilters => {
      const newFilters = { ...prevFilters, [filterName]: !prevFilters[filterName] };
      if (filterName === 'all') {
        return { all: true, byDepartment: false, byLocation: false, byTeam: false };
      } else {
        return { ...newFilters, all: false };
      }
    });
  };


  const handleDateChange = (date) => {
    const newFormattedDate = formatDateToDdMmYy(date);
    setSelectedDate(date);
    setDate(newFormattedDate);
  };

  const handleExportCSV = () => {
    const headers = "Name,Role,Team,Department,Location,Status,Late Time,Late Reason,Clock In,Clock Out , date\n";

    const rows = filteredData.map(member =>
      `${member.user_name},${member.role.name},${member.team},${member.department ? member.department.departments_name : 'N/A'},${member.location || 'N/A'},${member.status},${member.late_mins},${member.late_reason},${member.time_in},${member.time_out},${member.date}`
    ).join("\n");

    const csvContent = "data:text/csv;charset=utf-8," + headers + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");

    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "attendance_list.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };


  const handleEditClick = (attendance) => {
    setSelectedAttendance(attendance);
    setEditModalOpen(true);
  };


  const filteredData = AttendanceList?.filter(member => {
    const searchLower = searchTerm.toLowerCase();
    if (filters.all) {
      return Object.values(member).some(value =>
        value && value.toString().toLowerCase().includes(searchLower)
      );
    } else {
      const departmentMatch = filters.byDepartment && member?.department?.departments_name.toLowerCase().includes(searchLower);
      const locationMatch = filters.byLocation && member?.location?.toLowerCase().includes(searchLower);
      const teamMatch = filters.byTeam && member?.team.toLowerCase().includes(searchLower);

      return (departmentMatch || locationMatch || teamMatch);
    }
  });

  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);


  const [columnDefs, setColumnDefs] = useState([

    {
      field: "user_name",
      headerName: "Name",
      minWidth: 220,
      filter: "agTextColumnFilter",
      filterParams: { buttons: ['reset', 'apply', 'clear'] },
    },
    {
      headerName: "Role",
      field: "role.name",
      valueGetter: (params) => params.data.role?.name?.replace('_', ' ') || 'N/A',
      sortable: true,
      minWidth: 95,
      filter: "agTextColumnFilter",
      filterParams: { buttons: ['reset', 'apply', 'clear'] },
    },
    {
      headerName: "Department",
      field: "department.departments_name",
      valueGetter: (params) => params.data.department?.departments_name || 'N/A',
      minWidth: 130,
      filter: "agTextColumnFilter",
      filterParams: { buttons: ['reset', 'apply', 'clear'] },
    },
    {
      field: "location",
      headerName: "Location",
      minWidth: 140,
      filter: "agTextColumnFilter",
      filterParams: { buttons: ['reset', 'apply', 'clear'] },
    },
    {
      field: "status",
      headerName: "Status",
      sortable: true,
      minWidth: 130,
      filter: "agSetColumnFilter",
      filterParams: { buttons: ['reset', 'apply', 'clear'] },
      cellRenderer: (params) => (
        <span className={`py-1 px-2 rounded-md capitalize ${getStatusClasses(params.value)}`}>
          {params.value}
        </span>
      ),
    },
    {
      field: "late_info",
      headerName: "Late Info",
      filter: false,
      minWidth: 120,
      cellRenderer: (params) => {
        const { late_mins, late_reason } = params.data;
        return (
          <div className="flex items-center space-x-2 tooltip-cell">
            <span>{late_mins || 0}</span>
            {late_reason && (
              <div className="relative group">
                <FaInfoCircle className="h-4 w-4 text-yellow-600 cursor-pointer" />
                <div className="absolute -left-16 -bottom-2 mb-2 hidden group-hover:block bg-yellow-100 text-default_text text-xs p-2 rounded shadow-lg z-50">
                  Reason: {late_reason}
                </div>
              </div>
            )}
          </div>
        );
      },
      cellClassName: (params) => params.data.late_reason ? 'tooltip-cell' : '',
    },
    {
      field: "time_in",
      headerName: "Clock In",
      filter: false,
      minWidth: 95,
    },
    {
      field: "time_out",
      headerName: "Clock Out",
      filter: false,
      minWidth: 95,
    },
    {
      field: "ip",
      headerName: "IP Address",
      filter: false,
      minWidth: 160,
      cellRenderer: (params) => {
        const { ip, valid_ip } = params.data;
        const className = valid_ip === 1
          ? "bg-green-100 text-green-500"
          : "bg-red-100 text-darkred";
        return (
          <span className={`py-1 px-2 rounded-md capitalize ${className}`}>
            {ip === '-' ? 'N/A' : ip}
          </span>
        );
      },
    },
    {
      field: "date",
      headerName: "Date",
      minWidth: 110,
      filter: "agDateColumnFilter",
      filterParams: { buttons: ['reset', 'apply', 'clear'] },
    },

    {
      field: "employee_id",
      headerName: "Employee ID",
      minWidth: 110,
      filter: "agTextColumnFilter",
      filterParams: { buttons: ['reset', 'apply', 'clear'] },
    },
    {
      headerName: "Shift",
      field: "shift.shift_name",
      valueGetter: (params) => params.data.shift?.shift_name || 'N/A',
      minWidth: 130,
      filter: "agTextColumnFilter",
      filterParams: { buttons: ['reset', 'apply', 'clear'] },
    },
    // Move timezone herep
    {
      field: "timezone",
      headerName: "Timezone",
      minWidth: 130,
      filter: "agTextColumnFilter",
      filterParams: { buttons: ['reset', 'apply', 'clear'] },
    },
    role === "HR" && {
      field: "actions",
      headerName: "Actions",
      minWidth: 120,
      cellRenderer: (params) => (
        <button
          disabled={params.data.status === 'on leave'}
          onClick={() => handleEditClick(params.data)}
          className="flex items-center text-primary rounded-lg border border-primary p-2 disabled:bg-secondary disabled:border-gray-700"
        >
          <PencilIcon className="h-4 w-4 mr-1" />
        </button>
      ),
    },
  ].filter(Boolean));


  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 150,
      filter: "agTextColumnFilter",
      enablePivot: true,
      suppressHeaderMenuButton: true,
      suppressHeaderContextMenu: true,
    };
  }, []);
  return (
    <div>
      <EditAttendanceModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        attendance={selectedAttendance}
        refetch={refetch}
      />
      <div className="flex items-center gap-4 p-3">
        <label htmlFor="locationSelect" className="font-bold">
          Select Location:
        </label>
        <select
          id="locationSelect"
          value={selectedLocationId || "all"}
          onChange={(e) => {
            if (e.target.value === "all") {

              setSelectedLocationId(null);
            } else {

              setSelectedLocationId(Number(e.target.value));
            }
          }}
          className="px-3 py-2 border rounded"
        >
          <option value="all">All</option>
          {managedLocations && managedLocations.map((loc) => (
            <option key={loc.id} value={loc.id}>
              {loc.name}
            </option>
          ))}
        </select>

      </div>
      <div className="flex flex-wrap justify-between items-center gap-4 p-3">
        <div className="flex-grow md:flex md:items-center md:w-auto">
          <div className="relative w-full">
            <BsSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 " />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-3 py-2 w-full focus:outline-none border rounded-lg"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative">
            <button
              onClick={() => setFilterDropdownVisible(!filterDropdownVisible)}
              className="py-2 px-4 border rounded-lg flex items-center gap-2 text-sm whitespace-nowrap"
            >
              <MdFilterList />
              <span>Filter</span>
            </button>
            {filterDropdownVisible && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg p-3 z-50">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.all}
                    className='focus:ring-primary'
                    onChange={() => handleFilterChange('all')}
                  />
                  All
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className='focus:ring-primary'
                    checked={filters.byDepartment}
                    onChange={() => handleFilterChange('byDepartment')}
                  />
                  By Department
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className='focus:ring-primary'
                    checked={filters.byLocation}
                    onChange={() => handleFilterChange('byLocation')}
                  />
                  By Location
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    className='focus:ring-primary'
                    checked={filters.byTeam}
                    onChange={() => handleFilterChange('byTeam')}
                  />
                  By Team
                </label>
              </div>
            )}
          </div>
          <div className="py-2 px-4 border rounded-lg flex items-center gap-2 z-30">
            <FaRegCalendarAlt />
            <DatePicker
              selected={selectedDate}
              onChange={handleDateChange}
              dateFormat="dd-MM-yyyy"
              className="w-24"
              maxDate={new Date()}

            />
          </div>
          <button onClick={handleExportCSV} className="py-2 px-4 border rounded-lg flex items-center gap-2 text-sm whitespace-nowrap">
            <PiExport />
            <span>Export CSV</span>
          </button>
        </div>
      </div>
      <div className="rounded-lg border overflow-hidden bg-white min-h-screen">
        {isLoading ? (
          <DataLoader />
        ) : filteredData?.length > 0 ? (

          <div style={containerStyle} className="min-h-screen bg-white">
            <div style={gridStyle} > {/* Make sure theme is applied */}
              <AgGridReact
                rowData={filteredData}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                domLayout="autoHeight"
                sideBar={{
                  toolPanels: ['columns', 'filters'],
                  defaultToolPanel: 'columns',
                }}

              />
            </div>
          </div>

        )
          :
          <div className='flex justify-center my-24 min-h-screen'>
            No Data
          </div>
        }

      </div>
    </div>
  );
}
