import React, { useState, useEffect, useRef } from "react";
import { BsSearch } from "react-icons/bs";
import { useMemo } from "react";
import { MdFilterList } from 'react-icons/md';
import { FaRegCalendarAlt } from "react-icons/fa";
import { PiExport } from "react-icons/pi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { EyeIcon } from "@heroicons/react/24/outline";
import { TbEdit } from "react-icons/tb";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/router";
import DataLoader from "../../ui/dataLoader";
import { UseGetLocationLeaveRequestList } from "../../../hooks/query/locations/getLocationLeaveRequestList";
import { getStatusClass } from "../GeneralListComponent";
import { AgGridReact } from "ag-grid-react";
import { ClientSideRowModelModule, DateFilterModule, ModuleRegistry, NumberFilterModule, TextFilterModule, ValidationModule, } from "ag-grid-community";
ModuleRegistry.registerModules([ClientSideRowModelModule, TextFilterModule, NumberFilterModule, DateFilterModule, ValidationModule]);


export default function LocationLeaveRequestList({ role, managedLocations }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [disableFilter, setDisableFilter] = useState(true);
  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const [filterDropdownVisible, setFilterDropdownVisible] = useState(false);

  const router = useRouter();
  const filterRef = useRef(null);
  const [filters, setFilters] = useState({
      all: true,
      pending: false,
      approved: false,
      cancelled: false,
      rejected: false,
    });

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

  

  const { data, isLoading } = UseGetLocationLeaveRequestList(selectedLocationId, "all");

  const filteredData = data?.filter((item) => {
    const lowerSearch = searchTerm.toLowerCase();
    const matchesSearch =
      (item?.user_name && item.user_name.toLowerCase().includes(lowerSearch)) ||
      (item?.leave_type && item.leave_type.toLowerCase().includes(lowerSearch));
  
    let matchesDate = true;
    if (!disableFilter && startDate && endDate) {
      const itemDate = new Date(item?.start_date);
      matchesDate = itemDate >= startDate && itemDate <= endDate;
    }
  
    const status = item?.leave_status?.toLowerCase();
    let matchesStatus = false;
    if (filters.all) {
      matchesStatus = true;
    } else {
      matchesStatus = filters[status];
    }
  
    return matchesSearch && matchesDate && matchesStatus;
  });  

  const handleDisableFilterChange = () => {
    setDisableFilter(!disableFilter);
    if (!disableFilter) {
      setStartDate(null);
      setEndDate(null);
    }
  };

  const handleFilterChange = (filter) => {
    setFilters((prevFilters) => {
      if (filter === "all") {
        const newState = !prevFilters.all;
        return {
          all: newState,
          approved: newState,
          pending: newState,
          cancelled: newState,
          rejected: newState
        };
      } else {
        const updatedFilters = {
          ...prevFilters,
          [filter]: !prevFilters[filter]
        };
        updatedFilters.all = updatedFilters.approved && updatedFilters.pending && updatedFilters.cancelled && updatedFilters.rejected;
        return updatedFilters;
      }
    });
  };

  const handleExportCSV = () => {
    const headers =
      "Start Date,End Date,Employee Name,Leave Type,Day Type,Duration,Status,Reason\n";
    const rows = filteredData
      ?.map(
        (item) =>
          `${item?.start_date || ""},${item?.end_date || ""},${
            item?.user_name || ""
          },${item?.leave_type || ""},${item?.day_type || ""},${
            item?.no_of_days || ""
          },${item?.leave_status || ""},${item?.reason || ""}`
      )
      .join("\n");
    const csvContent = "data:text/csv;charset=utf-8," + headers + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Location_Leave_Request_Report.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };
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
      minWidth: 220,
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

      <div className="flex flex-wrap justify-between items-center gap-4 mb-4 p-3">
        <div className="flex-grow md:flex md:items-center md:w-auto">
          <div className="relative w-full">
            <BsSearch className="absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by Employee or Leave Type"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-3 py-2 w-full focus:outline-none border rounded-lg"
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <div className=" relative">
            <button
              onClick={() => setFilterDropdownVisible(!filterDropdownVisible)}
              className="px-4 py-2 border rounded-lg flex items-center gap-2 whitespace-nowrap"
            >
              <MdFilterList />
              <span>Filter</span>
            </button>
            {filterDropdownVisible && (
              <div
                ref={filterRef}
                className="absolute right-0 mt-2 w-48 bg-white border rounded-2xl p-3 z-50"
              >
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={
                      filters.all ||
                      (filters.approved &&
                        filters.pending &&
                        filters.cancelled &&
                        filters.rejected)
                    }
                    onChange={() => handleFilterChange("all")}
                  />
                  All
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.approved}
                    onChange={() => handleFilterChange("approved")}
                  />
                  Approved
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.pending}
                    onChange={() => handleFilterChange("pending")}
                  />
                  Pending
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.cancelled}
                    onChange={() => handleFilterChange("cancelled")}
                  />
                  Cancelled
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.rejected}
                    onChange={() => handleFilterChange("rejected")}
                  />
                  Rejected
                </label>
              </div>
            )}
          </div>
          <div className="py-2 px-4 border rounded-lg flex items-center gap-2 z-30">
            <FaRegCalendarAlt />
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="dd-MM-yyyy"
              className="w-24 disabled:bg-gray-100"
              placeholderText="Start Date"
              disabled={disableFilter}
            />
            <FaRegCalendarAlt />
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              dateFormat="dd-MM-yyyy"
              className="w-24 disabled:bg-gray-100"
              placeholderText="End Date"
              disabled={disableFilter}
              minDate={startDate}
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
          <button
            onClick={handleExportCSV}
            className="py-2 px-4 border rounded-lg flex items-center gap-2 text-sm"
          >
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
      
    </div>
  );
}
