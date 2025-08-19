import React, { useState, useMemo } from 'react';
import { BsSearch } from 'react-icons/bs';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { PiExport } from 'react-icons/pi';
import DatePicker from 'react-datepicker';
import { BsInfoCircle } from 'react-icons/bs';
import { MdFilterList } from 'react-icons/md';
import 'react-datepicker/dist/react-datepicker.css';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import DataLoader from '../../ui/dataLoader';
import { GetTeamAttendanceReport } from '../../../hooks/query/teamAttendanceReport';
import { formatDateToDdMmYy, getBase64ImageFromUrl } from '../../../utils/functions';
import { AgGridReact } from "ag-grid-react";
import { ClientSideRowModelModule, DateFilterModule, ModuleRegistry, NumberFilterModule, TextFilterModule, ValidationModule, } from "ag-grid-community";
ModuleRegistry.registerModules([ClientSideRowModelModule, TextFilterModule, NumberFilterModule, DateFilterModule, ValidationModule]);

export default function TeamAttendanceReport() {
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [fetchData, setFetchData] = useState(false);
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);

  const [displayedStartDate, setDisplayedStartDate] = useState(new Date());
  const [displayedEndDate, setDisplayedEndDate] = useState(new Date());
  const [filterDropdownVisible, setFilterDropdownVisible] = useState(false);
  const [filters, setFilters] = useState({
    all: true,
    byDepartment: false,
    byLocation: false,
    byTeam: false
  });

  const { data: AttendanceData, isLoading, refetch } = GetTeamAttendanceReport(
    displayedStartDate ? formatDateToDdMmYy(displayedStartDate) : fetchData ? formatDateToDdMmYy(startDate) : null,
    displayedEndDate ? formatDateToDdMmYy(displayedEndDate) : fetchData ? formatDateToDdMmYy(endDate) : null
  );


  const filteredData = AttendanceData?.filter(member => {
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
  const handleCustomDateRange = () => {
    setDisplayedStartDate(null);
    setDisplayedEndDate(null);
    setFetchData(true);
    refetch();
  };

  const handleQuickSelectDateRange = (rangeType) => {
    let newStartDate, newEndDate;
    const today = new Date();

    if (rangeType === 'day') {
      newStartDate = newEndDate = today;
    } else if (rangeType === 'month') {
      // From the 1st of the current month till today
      newStartDate = new Date(today.getFullYear(), today.getMonth(), 1); // First day of the current month
      newEndDate = today; // Current date
    } else if (rangeType === 'year') {
      newStartDate = new Date(today.getFullYear(), 0, 1); // January 1
      newEndDate = today;
    }

    setDisplayedStartDate(newStartDate);
    setDisplayedEndDate(newEndDate);
    setStartDate(null); // Clear custom start date
    setEndDate(null); // Clear custom end date
    setFetchData(true);
    refetch();
  };

  const handleViewClick = () => {
    handleCustomDateRange();
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

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
  };

  const getFilteredData = () => {
    if (!gridApi) return filteredData;
    
    let filteredRows = [];
    gridApi.forEachNodeAfterFilter((node) => {
      if (node.data) {
        filteredRows.push(node.data);
      }
    });
    return filteredRows;
  };

  const handleExportPDF = async () => {
    const doc = new jsPDF('l', 'mm', 'a4');
    const exportData = getFilteredData();

    try {
      // Get the Base64 string of the logo
      const logo = await getBase64ImageFromUrl('/assets/amanah.png');

      // Add the logo to the PDF
      doc.addImage(logo, 'PNG', 10, 10, 50, 20);

      // Title
      doc.setFontSize(16);
      doc.text('Attendance Report', 70, 30);
      // Add Date Range

      doc.setFontSize(12);
      doc.text(`Date Range:  ${formatDateToDdMmYy(displayedStartDate || startDate)} to ${formatDateToDdMmYy(displayedEndDate || endDate)}`, 120, 40, { align: 'center' });
      // Table Headers and Data

      const headers = [
        [
          
          'Employee Name',
          'Department',
          'Team',
          'Location',
          'Contracted Hours',
          'Total Working Hours',
          'Late Hours',
          'Late Days',
          'Early Out',
          'Authorize Absence',
          'UnAuthorize Absence',
          'Employee Id',
        ],
      ];
      const data = exportData.map((member) => [
        
        member.user_name,
        member.department_name,
        member.team_name,
        member.location_name,
        member.contracted_hours,
        member.total_working_hours,
        member.late_hours,
        member.late_days,
        member.early_clockout,
        member.authorize_absence,
        member.unauthorize_absence,
        member.employee_id,
      ]);

      // AutoTable for the Data
      autoTable(doc, {
        startY: 50,
        head: headers,
        body: data,
        theme: 'grid',
      });

      // Save the PDF
      doc.save('Attendance_Report.pdf');
    } catch (error) {
      console.error('Error loading image:', error);
    }
  };

  const handleExportCSV = () => {
    const exportData = getFilteredData();
    const headers = 'Employee Name,Department,Team,Location,Contracted Hours,Total Working Hours,Late Hours,Late Days,Early Out,Authorize Absence,UnAuthorize Absence , Employee Id,\n ';
    const rows = exportData
      .map(member =>
        `${member.employee_id},${member.user_name},${member.department_name},${member.team_name}${member.location_name},${member.contracted_hours},${member.total_working_hours},${member.late_hours},${member.late_days},${member.early_clockout},${member.authorize_absence},${member.unauthorize_absence}`
      )
      .join('\n');
    const csvContent = 'data:text/csv;charset=utf-8,' + headers + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'Attendance Report.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      minWidth: 150,
      filter: "agTextColumnFilter",
      suppressHeaderMenuButton: true,
      suppressHeaderContextMenu: true,
    };
  }, []);
  const [columnDefs, setColumnDefs] = useState([

    {
      field: "user_name",
      headerName: "Employee Name",
      filter: "agTextColumnFilter",
      filterParams: { buttons: ['reset', 'apply', 'clear'] },
      minWidth: 220,
      flex: 1,
    },
    {
      field: "department_name",
      headerName: "Department",
      filter: "agTextColumnFilter",
      filterParams: { buttons: ['reset', 'apply', 'clear'] },
      minWidth: 130,
      flex: 1,
    },
    {
      field: "team_name",
      headerName: "Team",
      filter: "agTextColumnFilter",
      filterParams: { buttons: ['reset', 'apply', 'clear'] },
      minWidth: 110,
      flex: 1,
    },
    {
      field: "location_name",
      headerName: "Location",
      filter: "agTextColumnFilter",
      filterParams: { buttons: ['reset', 'apply', 'clear'] },
      minWidth: 140,
      flex: 1,
    },
    {
      field: "contracted_hours",
      headerName: "Contracted Hours",
      filter: "agTextColumnFilter",
      filterParams: { buttons: ['reset', 'apply', 'clear'] },
      minWidth: 100,
      flex: 1,
      headerComponent: () => (
        <div className="text-sm text-gray-800 leading-tight text-left">
          Contracted <br /> Hours
        </div>
      ),
    },
    {
      field: "total_working_hours",
      headerName: "Working Hours",
      filter: false,
      minWidth: 90,
      flex: 1,
      headerComponent: () => (
        <div className="text-sm text-gray-800 leading-tight text-left">
          Working <br /> Hours
        </div>
      ),
    },
    {
      field: "late_hours",
      headerName: "Late Hours",
      filter: false,
      minWidth: 80,
      flex: 1,
      headerComponent: () => (
        <div className="text-sm text-gray-800 leading-tight text-left">
          Late <br /> Hours
        </div>
      ),
    },
    {
      field: "late_days",
      headerName: "Late Days",
      filter: false,
      minWidth: 70,
      flex: 1,
      headerComponent: () => (
        <div className="text-sm text-gray-800 leading-tight text-left">
          Late <br /> Days
        </div>
      ),
    },
    {
      field: "early_clockout",
      headerName: "Early Out",
      filter: false,
      minWidth: 70,
      flex: 1,
      headerComponent: () => (
        <div className="text-sm text-gray-800 leading-tight text-left">
          Early <br /> Out
        </div>
      ),
    },
    {
      field: "over_time",
      headerName: "Overtime",
      filter: false,
      minWidth: 70,
      flex: 1,
      headerComponent: () => (
        <div className="text-sm text-gray-800 leading-tight text-left">
          Over <br /> Time
        </div>
      ),
    },

    {
      field: "authorize_absence",
      headerName: "Authorize Absence (H:MM)",
      filter: false,
      minWidth: 130,
      flex: 1,
      headerComponent: () => (
        <div className="flex flex-col items-start text-gray-800 text-sm leading-tight">
          Authorize <span className="text-xs text-gray-600 flex "> Absence (H:MM) <BsInfoCircle className=" ml-2 text-gray-700" title="Sum of All approved Leaves" /></span>

        </div>
      ),
    },
    {
      field: "unauthorize_absence",
      headerName: "Unauthorized Absence (H:MM)",
      filter: false,
      minWidth: 130,
      flex: 1,
      headerComponent: () => (
        <div className="flex flex-col items-start text-gray-800 text-sm leading-tight">
          Unauthorized  <span className="text-xs flex  space-x-2 text-gray-600"> Absence(H:MM)
            <BsInfoCircle
              className="ml-2 text-gray-700"
              title="Contracted hours - working hours - Grace Period"
            />
          </span>

        </div>
      ),
    },
    {
      field: "employee_id",
      headerName: "Employee ID",
      filter: "agTextColumnFilter",
      filterParams: { buttons: ['reset', 'apply', 'clear'] },
      minWidth: 130,
      flex: 1,
    },


  ].filter(Boolean));



  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-4 p-3">
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
        <div className="flex flex-wrap gap-2 items-center">
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

          </div>
          <button onClick={handleExportCSV} className="py-2 px-4 border rounded-lg flex items-center gap-2 text-xs">
            <PiExport />
            <span>Export CSV</span>
          </button>
          <button onClick={handleExportPDF} className="py-2 px-4 border rounded-lg flex items-center gap-2 text-xs">
            <PiExport />
            <span>Export PDF</span>
          </button>
        </div>
      </div>
      <div className='flex justify-between items-center'>
        {(displayedStartDate && displayedEndDate) || (startDate && endDate) ? (
          <div className="text-center my-4 px-4">
            <p>
              Showing results from{' '}
              <strong>
                {formatDateToDdMmYy(displayedStartDate || startDate)}
              </strong>{' '}
              to{' '}
              <strong>
                {formatDateToDdMmYy(displayedEndDate || endDate)}
              </strong>
            </p>
          </div>
        ) : (
          <div className="text-center my-4 px-4">
            <p>Select a date range to view results</p>
          </div>
        )}


        <div className="flex justify-end space-x-3 my-4">
          <div className="pl-2 border rounded-lg flex items-center gap-2 z-30">
            <FaRegCalendarAlt />
            <DatePicker
              selected={startDate}
              onChange={date => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              dateFormat="dd-MM-yyyy"
              className="w-24"
              placeholderText="Start Date"
            />
            <FaRegCalendarAlt />
            <DatePicker
              selected={endDate}
              onChange={date => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              dateFormat="dd-MM-yyyy"
              className="w-24"
              placeholderText="End Date"
              minDate={startDate}
            />
            <button onClick={handleViewClick} className="py-2 px-4 bg-primary rounded-lg text-white">View</button>
          </div>
          <button
            onClick={() => handleQuickSelectDateRange('day')}
            className="py-2 px-4 bg-primary hover:bg-opacity-70 text-white rounded-lg"
          >
            Today
          </button>
          <button
            onClick={() => handleQuickSelectDateRange('month')}
            className="py-2 px-4 bg-primary hover:bg-opacity-70 text-white rounded-lg"
          >
            Month to date
          </button>
          <button
            onClick={() => handleQuickSelectDateRange('year')}
            className="py-2 px-4 bg-primary hover:bg-opacity-70 text-white rounded-lg"
          >
            Year to date
          </button>
        </div>
      </div>

      <div className="rounded-lg border overflow-hidden">
        {isLoading ? (
          <DataLoader />
        ) :
          AttendanceData?.length > 0 ? (
            <div style={containerStyle} className="min-h-screen bg-white">
              <div style={gridStyle}>
                <AgGridReact
                  rowData={filteredData}
                  domLayout="autoHeight"
                  columnDefs={columnDefs}
                  defaultColDef={defaultColDef}
                  onGridReady={onGridReady}
                />
              </div>
            </div>
          ) : (
            <div className="p-3 text-start min-h-screen">No Data</div>
          )
        }
      </div>
    </div>
  );
}

