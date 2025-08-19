import React, { useState, useEffect, useRef, useMemo } from 'react';
import { BsSearch } from 'react-icons/bs';
import { FaRegCalendarAlt } from 'react-icons/fa';
import { PiExport } from 'react-icons/pi';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import DataLoader from '../ui/dataLoader';
import DeleteItemModal from '../ui/deleteItemModal';
import { useRouter } from 'next/router';
import { TbEdit } from 'react-icons/tb';
import 'react-tooltip/dist/react-tooltip.css';
import useCancelLeave from '../../hooks/mutations/cancelLeave';
import useEditLeave from '../../hooks/mutations/editLeave';
import EditLeaveModal from '../ui/editLeaveModal';
import { EyeIcon } from 'lucide-react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { AgGridReact } from "ag-grid-react";
import { ClientSideRowModelModule, DateFilterModule, ModuleRegistry, NumberFilterModule, TextFilterModule, ValidationModule, } from "ag-grid-community";
ModuleRegistry.registerModules([ClientSideRowModelModule, TextFilterModule, NumberFilterModule, DateFilterModule, ValidationModule]);



const parseDate = (dateString) => {
  const [day, month, year] = dateString.split('-');
  return new Date(`${year}-${month}-${day}`);
};

export default function GeneralListComponent({ role, data }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [disableFilter, setDisableFilter] = useState(true);
  const [filterDropdownVisible, setFilterDropdownVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const router = useRouter();
  const [filters, setFilters] = useState("all");

  const filterRef = useRef(null);
  const cancelLeave = useCancelLeave();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);

  const editLeave = useEditLeave();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setFilterDropdownVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [filterRef]);

  const handleEdit = (leave) => {
    setSelectedLeave(leave);
    setIsModalOpen(true);
  };

  const handleExportCSV = () => {
    // Define the headers and rows based on listType
    let headers = '';
    let rows = '';


    headers = 'Start Date,End Date,Employee Name,Role,Leave Type,Day Type,Duration,Status,Reason\n';
    rows = filteredData.map(item =>
      `${item.start_date},${item.end_date},${item.user_name},${item.leave_user_role},${item.leave_type},${item.day_type},${item.no_of_days},${item.leave_status},${item.reason}`
    ).join('\n');


    // Create CSV content
    const csvContent = 'data:text/csv;charset=utf-8,' + headers + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);

    // Set the filename based on listType
    let filename = '';

    filename = 'leave_requests_list.csv';

    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const parseDate = (dateString) => {
    if (!dateString) return null;
    const [day, month, year] = dateString.split('-');
    return new Date(`${year}-${month}-${day}`);
  };

  const filteredData = useMemo(() => {
    if (!data) return [];

    return data
      .filter((item) => {
        const searchLower = searchTerm.toLowerCase();

        // Search Logic
        const matchesSearch = Object.values(item).some(
          (value) => value && value.toString().toLowerCase().includes(searchLower)
        );

        // Status Filter
        const passesStatus =
          filters === "all" || item.leave_status === filters;

        // Date Filter
        const itemStartDate = parseDate(item.start_date);
        const inDateRange =
          disableFilter ||
          (!startDate || (itemStartDate && itemStartDate >= startDate)) &&
          (!endDate || (itemStartDate && itemStartDate <= endDate));

        // Return true if it matches all filters
        return matchesSearch && passesStatus && inDateRange;
      })
      .sort((a, b) => {
        // If "all" is selected, sort by latest start date only
        if (filters === "all") {
          const dateA = parseDate(a.start_date);
          const dateB = parseDate(b.start_date);
          return dateB - dateA; // Latest dates on top
        }

        // Prioritize approved status first for other filters
        if (a.leave_status === "approved" && b.leave_status !== "approved") return -1;
        if (b.leave_status === "approved" && a.leave_status !== "approved") return 1;

        // If statuses are the same, sort by latest start date
        const dateA = parseDate(a.start_date);
        const dateB = parseDate(b.start_date);
        return dateB - dateA; // Latest dates on top
      });
  }, [data, searchTerm, filters, startDate, endDate, disableFilter]);

  const handleFilterChange = (filter) => {
    setFilters(filter);
  };


  const handleOpenCancelModal = (itemId) => {
    setSelectedItem(itemId);
    setIsModalVisible(true);
  };

  const handleCancelLeave = (reason) => {
    cancelLeave.mutate(
      { id: selectedItem, cancel_reason: reason },
      {
        onSuccess: () => {
          setIsModalVisible(false);
        }
      }
    )
  };

  const handleDisableFilterChange = () => {
    setDisableFilter((prev) => !prev);
    if (disableFilter) {
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


  let isLoading = false;

  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);
  

  const [columnDefs, setColumnDefs] = useState([
    {
      field: "start_date",
      headerName: "Start Date",
      filter: "agDateColumnFilter",
      sortable: true,
      minWidth:120,
      filterParams: {
        comparator: (filterLocalDateAtMidnight, cellValue) => {
          if (!cellValue) return -1;
    
          const [day, month, year] = cellValue.split("-"); // correct order
          const cellDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day)); // months are 0-based
          
          if (cellDate < filterLocalDateAtMidnight) return -1;
          if (cellDate > filterLocalDateAtMidnight) return 1;
          return 0;
        },
        buttons: ["reset", "apply", "clear"],
      },
    },    
    {
      field: "end_date",
      headerName: "End Date",
      minWidth:120,
      filter: "agDateColumnFilter",
      filterParams: {
        comparator: (filterLocalDateAtMidnight, cellValue) => {
          if (!cellValue) return -1;
    
          const [day, month, year] = cellValue.split("-"); // correct order
          const cellDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day)); // months are 0-based
          
          if (cellDate < filterLocalDateAtMidnight) return -1;
          if (cellDate > filterLocalDateAtMidnight) return 1;
          return 0;
        },
        buttons: ["reset", "apply", "clear"],
      },
      sortable: true,
    },
    {
      field: "user_name",
      headerName: "Employee Name",
      filter: "agTextColumnFilter",
      filterParams: { buttons: ['reset', 'apply', 'clear'] },
      sortable: true,
      cellClass: "capitalize",
    },
    {
      field: "leave_user_role",
      headerName: "Role",
      filter: "agTextColumnFilter",
      minWidth:110,
      filterParams: { buttons: ['reset', 'apply', 'clear'] },
      sortable: true,
      cellClass: "capitalize",
    },
    {
      field: "leave_type",
      headerName: "Leave Type",
      filter: "agTextColumnFilter",
      filterParams: { buttons: ['reset', 'apply', 'clear'] },
      sortable: true,
      minWidth:110,
      cellClass: "capitalize",
    },
    {
      field: "day_type",
      headerName: "Day Type",
      filter: "agTextColumnFilter",
      filterParams: { buttons: ['reset', 'apply', 'clear'] },
      sortable: true,
      minWidth:90,
      cellClass: "capitalize",
    },
    {
      field: "no_of_days",
      headerName: "Duration",
      filter: "agTextColumnFilter",
      minWidth:90,
      filterParams: { buttons: ['reset', 'apply', 'clear'] },
      sortable: true,
    },
    {
      field: "leave_status",
      headerName: "Status",
      filter: "agSetColumnFilter",
      filterParams: { buttons: ['reset', 'apply', 'clear'] },
      sortable: true,
      cellRenderer: (params) => (
        <button>
          <span class={`px-2 py-1 rounded-md capitalize ${getStatusClass(params.value)}`}>
            {params.value}
          </span>
        </button>
      ),
    },
    {
      field: "action",
      headerName: "Action",
      filter: false,
      sortable: false,
      cellRenderer: (params) => {
        return(
        <div className="flex space-x-2 mt-1 justify-start items-center">
          <button
            className="flex items-center justify-center rounded-md py-2 px-4 border border-primary text-primary"
            onClick={() => router.push(role === "team_lead"
              ? `/team_lead/leave / ${ params.data.leave_id }`
                : `/workforce/leave/${params.data.leave_id}`)}
            >
          <EyeIcon className="h-4 w-4" />
        </button>

        {
          role === "HR" && params.data.leave_status === "approved" && (
            <button
              onClick={() => handleEdit(params.data)}
              className="flex items-center justify-center rounded-md py-2 px-4 border border-primary text-primary"
            >
              <TbEdit className="h-4 w-4" />
            </button>
          )
        }

        {
          params.data.leave_status === "approved" && (
            <button
              className="text-orange-500 px-4 py-2 border border-orange-400 rounded-lg"
              onClick={() => handleOpenCancelModal(params.data.leave_id)}
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          )
        }
          </div >
        )
      }

          
        }
      ]);

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
    <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
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
        <div className=" relative">

          <select
            value={filters}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="py-2 px-4 border rounded-lg z-30"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="cancelled">Cancelled</option>
            <option value="rejected">Rejected</option>
          </select>


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
        <button onClick={handleExportCSV} className="py-2 px-4 border rounded-lg flex items-center gap-2 text-sm">
          <PiExport />
          <span>Export CSV</span>
        </button>
      </div>
    </div>

    <div className="rounded-lg bg-white min-h-screen border overflow-hidden">
      {isLoading ? (
        <DataLoader />
      ) : filteredData?.length > 0 ? (

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
      ) : (
        <p className="p-4 text-center text-gray-500">No records found</p>
      )}
    </div>

    {isModalVisible && (
      <DeleteItemModal
        modalVisible={isModalVisible}
        item={'Leave Request'}
        handleDeleteItem={handleCancelLeave}
        closeModal={() => setIsModalVisible(false)}
        isCancel={true}
        action={'cancel'}
      />
    )}
    {isModalOpen && (
      <EditLeaveModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        selectedLeave={selectedLeave}
        // leaveStatsData={leaveStatsData}
        editLeave={editLeave}
        userID={selectedLeave?.user_id}
      />
    )}
  </div>
);
}

export const getStatusClass = (status) => {
  switch (status) {
    case 'approved':
      return 'bg-green-100 text-green-500';
    case 'pending':
      return 'bg-orange-100 text-orange-500 px-3';
    case 'cancelled':
      return 'bg-gray-200 text-gray-500';
    case 'rejected':
      return 'bg-red-100 text-darkred';
    default:
      return '';
  }
};
