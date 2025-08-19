import React, { useState, useEffect  , useMemo} from 'react';
import { MdFilterList } from 'react-icons/md';
import { BsSearch } from 'react-icons/bs';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { PiExport } from 'react-icons/pi';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { BsInfoCircle } from 'react-icons/bs';
import DataLoader from '../../ui/dataLoader';
import { formatDateToDdMmYy } from '../../../utils/functions';
import { useExportLeaveSummary } from '../../../hooks/query/getTeamLeaveReport';
import { AgGridReact } from "ag-grid-react";
import {ClientSideRowModelModule,DateFilterModule,ModuleRegistry,NumberFilterModule,TextFilterModule,ValidationModule,} from "ag-grid-community";
ModuleRegistry.registerModules([ClientSideRowModelModule,TextFilterModule,NumberFilterModule,DateFilterModule,ValidationModule /* Development Only */,
]);

export default function TeamLeaveReport({ role }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [disableFilter, setDisableFilter] = useState(true);
    const [filterDropdownVisible, setFilterDropdownVisible] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false); // Dropdown state for filters
    const [visibleColumns, setVisibleColumns] = useState({
        annualLeave: true,
        sickLeave: true,
        compassionateLeave: false,
        paternityLeave: false,
        maternityLeave: false,
    });
    const [filters, setFilters] = useState({
        all: true,
        byDepartment: false,
        byLocation: false,
        byTeam: false
    });
    const { data: LeaveData, isLoading, refetch } = useExportLeaveSummary(
        disableFilter ? null : formatDateToDdMmYy(startDate),
        disableFilter ? null : formatDateToDdMmYy(endDate)
    );
    useEffect(() => {
        refetch();
    }, [startDate, endDate, refetch]);

    const handleExportCSV = () => {
        const headers = 'Employee Id,Employee Name,Employee Role,Department , Team ,Location,' +
            `${visibleColumns.annualLeave ? 'Taken Annual Leave ,Remaining Annual Leave ,Total Annual Leave ,' : ''}` +
            `${visibleColumns.sickLeave ? 'Sick Leave Taken, Remaining Sick Leave ,Total Sick Leave ,' : ''}` +
            `${visibleColumns.compassionateLeave ? 'Taken Compassionate Leave Taken,Total Compassionate Leave ,' : ''}` +
            `${visibleColumns.paternityLeave ? ' Taken Paternity Leave ,Total Paternity Leave ,' : ''}` +
            `${visibleColumns.maternityLeave ? 'Taken Maternity Leave ,Total Maternity Leave ,' : ''}\n`;

        const rows = filteredData.map(member => (
            `${member.employee_id},${member.employee_name},${member.employee_role},${member.department_name},${member.team_name},${member.location_name},` +
            `${visibleColumns.annualLeave ? `${member.taken_annual_leaves},${member.remaining_annual_leaves},${member.total_annual_leaves},` : ''}` +
            `${visibleColumns.sickLeave ? `${member.taken_sick_leaves},${member.remining_sick_leaves},${member.total_sick_leaves},` : ''}` +
            `${visibleColumns.compassionateLeave ? `${member.taken_compassionate_leaves},${member.total_compassionate_leaves},` : ''}` +
            `${visibleColumns.paternityLeave ? `${member.taken_paternity_leaves} , ${member.total_paternity_leaves},` : ''}` +
            `${visibleColumns.maternityLeave ? `${member.taken_maternity_leaves},${member.total_maternity_leaves},` : ''}`
        )).join('\n');

        const csvContent = 'data:text/csv;charset=utf-8,' + headers + rows;
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'Attendance_Report.csv');
        document.body.appendChild(link);
        link.click();
        link.remove();
    };
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

    
    const filteredData = LeaveData?.filter(member => {
        const searchLower = searchTerm.toLowerCase();
        if (filters.all) {
            return Object.values(member).some(value =>
                value && value.toString().toLowerCase().includes(searchLower)
            );
        } else {
            const departmentMatch = filters.byDepartment && member?.department_name.toLowerCase().includes(searchLower);
            const locationMatch = filters.byLocation && member?.location_name?.toLowerCase().includes(searchLower);
            const teamMatch = filters.byTeam && member?.team_name.toLowerCase().includes(searchLower);

            return (departmentMatch || locationMatch || teamMatch);
        }
    });
    const handleColumnVisibility = (column) => {
        setVisibleColumns(prev => ({ ...prev, [column]: !prev[column] }));
    };
    const handleDisableFilterChange = () => {
        setDisableFilter(!disableFilter);
        if (!disableFilter) {
            setStartDate(null);
            setEndDate(null);
        }
    };

    const handleStartDateChange = (date) => {
        setStartDate(date);
    };

    const handleEndDateChange = (date) => {
        setEndDate(date);
    };

 const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
    const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  

    
    const [columnDefs, setColumnDefs] = useState([
        {
          field: "employee_id",
          headerName: "Employee ID",
          filter: "agTextColumnFilter",
          sortable: true,
          minWidth:110,
          filterParams: { buttons: ["reset", "apply", "clear"] },
        },
        {
          field: "employee_name",
          headerName: "Employee Name",
          filter: "agTextColumnFilter",
          sortable: true,
          filterParams: { buttons: ["reset", "apply", "clear"] },
        },
        {
          field: "employee_role",
          minWidth:100,
          headerName: "Role",
          filter: "agTextColumnFilter",
          sortable: true,
          filterParams: { buttons: ["reset", "apply", "clear"] },
        },
        {
          field: "department_name",
          headerName: "Department",
          filter: "agTextColumnFilter",
          sortable: true,
          minWidth:110,
          filterParams: { buttons: ["reset", "apply", "clear"] },
        },
        {
          field: "team_name",
          headerName: "Team",
          minWidth:110,
          filter: "agTextColumnFilter",
          sortable: true,
          filterParams: { buttons: ["reset", "apply", "clear"] },
        },
        {
          field: "location_name",
          headerName: "Location",
          filter: "agTextColumnFilter",
          sortable: true,
          filterParams: { buttons: ["reset", "apply", "clear"] },
        },
        visibleColumns.annualLeave && {
          field: "annualLeave",
          headerName: "Annual Leave",
          minWidth:120,
          filter: false,
          cellRenderer: (params) =>
            `${params.data.taken_annual_leaves}/${params.data.total_annual_leaves}`,
        },
        visibleColumns.annualLeave && {
          field: "remaining_annual_leaves",
          headerName: "Remaining Annual Leave",
          filter: false,
        },
        visibleColumns.sickLeave && {
          field: "sickLeave",
          headerName: "Sick Leave",
          minWidth:110,
          filter: false,
          cellRenderer: (params) =>
            `${params.data.taken_sick_leaves}/${params.data.total_sick_leaves}`,
        },
        visibleColumns.sickLeave && {
          field: "remaining_sick_leaves",
          headerName: "Remaining Sick Leave",
          filter: false,
        },
        visibleColumns.compassionateLeave && {
          field: "compassionateLeave",
          headerName: "Compassionate Leave",
          filter: false,
          cellRenderer: (params) =>
            `${params.data.taken_compassionate_leaves}/${params.data.total_compassionate_leaves}`,
        },
        visibleColumns.paternityLeave && {
          field: "paternityLeave",
          headerName: "Paternity Leave",
          filter: false,
          cellRenderer: (params) =>
            `${params.data.taken_paternity_leaves}/${params.data.total_paternity_leaves}`,
        },
        visibleColumns.maternityLeave && {
          field: "maternityLeave",
          headerName: "Maternity Leave",
          filter: false,
          cellRenderer: (params) =>
            `${params.data.taken_maternity_leaves}/${params.data.total_maternity_leaves}`,
        },
      ].filter(Boolean));
      
        const defaultColDef = useMemo(() => {
            return {
              flex: 1,
              minWidth: 150,
              filter: "agTextColumnFilter",
              suppressHeaderMenuButton: true,
              suppressHeaderContextMenu: true,
            };
          }, []);

    return (
        <div>
            <div className="flex flex-wrap justify-between items-center gap-4 p-3">
                {/* Search Bar */}
                <div className="flex-grow md:flex md:items-center md:w-auto">
                    <div className="relative w-full">
                        <BsSearch className="absolute left-3 top-1/2 transform -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-3 py-2 w-full focus:outline-none border rounded-lg"
                        />
                    </div>
                </div>
                <div className="flex  gap-2 items-center">
                    {/* Filter Dropdown */}
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

                    <div className="relative">
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            className="py-2 px-4 border rounded-lg"
                        >
                            Visible Columns
                        </button>

                        {showDropdown && (
                            <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-4 z-50">
                                {/* Column Filters */}
                                <div className="mb-4">
                                    <h4 className="font-semibold">Filter Columns</h4>
                                    {Object.keys(visibleColumns).map(column => (
                                        <label key={column} className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={visibleColumns[column]}
                                                onChange={() => handleColumnVisibility(column)}
                                            />
                                            <span className="ml-1">{column.replace(/([A-Z])/g, ' $1')}</span>
                                        </label>
                                    ))}
                                </div>


                            </div>
                        )}

                    </div>
                    <div className="py-2 px-4 border rounded-lg flex items-center gap-2 z-30">
                        <FaRegCalendarAlt />
                        <DatePicker
                            selected={startDate}
                            onChange={handleStartDateChange}
                            selectsStart
                            startDate={startDate}
                            endDate={endDate}
                            dateFormat="dd-MM-yyyy"
                            className="w-24 disabled:bg-gray-100"
                            placeholderText="Start Date"
                            disabled={disableFilter}
                        />
                        <DatePicker
                            selected={endDate}
                            onChange={handleEndDateChange}
                            selectsEnd
                            startDate={startDate}
                            endDate={endDate}
                            dateFormat="dd-MM-yyyy"
                            className="w-24 disabled:bg-gray-100"
                            minDate={startDate}
                            placeholderText="End Date"
                            disabled={disableFilter}
                        />
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="disableFilter"
                                checked={disableFilter}
                                onChange={handleDisableFilterChange}
                            />
                            <label htmlFor="disableFilter">List All</label>
                        </div>
                    </div>

                    {/* Export CSV Button */}
                    <button onClick={handleExportCSV} className="py-2 px-4 border rounded-lg flex items-center gap-2 text-sm">
                        <PiExport />
                        <span>Export CSV</span>
                    </button>
                </div>
            </div>
            <div className="rounded-lg border overflow-hidden">
                {isLoading ? (
                    <DataLoader />
                ) :
                    LeaveData?.length > 0 ? (

                      <div style={containerStyle} className="min-h-screen bg-white">
                                   <div style={gridStyle}>
                                     <AgGridReact
                                       rowData={filteredData}
                                         domLayout="autoHeight"
                                       columnDefs={columnDefs}
                                       defaultColDef={defaultColDef}
                                     />
                                   </div>
                                 </div>
                    )

                        : (
                            <div className="p-3 text-start min-h-screen">No Data</div>
                        )
                }
            </div >
          
        </div>
    );
}
