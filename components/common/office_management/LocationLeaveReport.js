import React, { useState, useEffect, useRef } from "react";
import { BsSearch } from "react-icons/bs";
import { MdFilterList } from "react-icons/md";
import { BsInfoCircle } from 'react-icons/bs';
import { PiExport } from "react-icons/pi";
import { useMemo } from "react";
import "react-datepicker/dist/react-datepicker.css";
import DataLoader from "../../ui/dataLoader";
import { UseExportLocationLeaves } from "../../../hooks/query/locations/getExportLocationLeaves";

import { AgGridReact } from "ag-grid-react";
import {ClientSideRowModelModule,DateFilterModule,ModuleRegistry,NumberFilterModule,TextFilterModule,ValidationModule,} from "ag-grid-community";
ModuleRegistry.registerModules([ClientSideRowModelModule,TextFilterModule,NumberFilterModule,DateFilterModule,ValidationModule /* Development Only */,
]);

export default function LocationLeaveRequestList({ role, managedLocations }) {
  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState({
    annualLeave: true,
    sickLeave: true,
    compassionateLeave: false,
    paternityLeave: false,
    maternityLeave: false,
  });

  const filterRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [filterRef]);

 

  const { data, isLoading } = UseExportLocationLeaves(selectedLocationId);

  const filteredData = data?.filter((item) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      (item?.employee_id &&
        item?.employee_id.toString().toLowerCase().includes(searchLower)) ||
      (item?.employee_name &&
        item?.employee_name.toLowerCase().includes(searchLower)) ||
      (item?.employee_role &&
        item?.employee_role.toLowerCase().includes(searchLower)) ||
      (item?.location_name &&
        item?.location_name.toLowerCase().includes(searchLower)) ||
        (item?.department_name &&
          item?.department_name.toLowerCase().includes(searchLower)) ||
          (item?.team_name &&
            item?.team_name.toLowerCase().includes(searchLower)) ||
            (item?.location_name &&
              item?.location_name.toLowerCase().includes(searchLower))
    );
  });

  const handleColumnVisibility = (column) => {
    setVisibleColumns((prev) => ({ ...prev, [column]: !prev[column] }));
  };

  const handleExportCSV = () => {
    const headers = [
      "Employee Id",
      "Employee Name",
      "Role",
      "Location",
    ];
    if (visibleColumns.annualLeave) {
      headers.push("Annual Leave"); // Taken / Total
      headers.push("Remaining Annual Leave");
    }
    if (visibleColumns.sickLeave) {
      headers.push("Sick Leave"); // Taken / Total
      headers.push("Remaining Sick Leave");
    }
    if (visibleColumns.compassionateLeave) {
      headers.push("Compassionate Leave"); // Taken / Total
    }
    if (visibleColumns.paternityLeave) {
      headers.push("Paternity Leave"); // Taken / Total
    }
    if (visibleColumns.maternityLeave) {
      headers.push("Maternity Leave"); // Taken / Total
    }
  
    const rows = filteredData?.map((item) => {
      const row = [
        item?.employee_id || "",
        item?.employee_name || "",
        item?.employee_role || "",
        item?.location_name || "",
      ];
  
      if (visibleColumns.annualLeave) {
        row.push(
          `${item?.taken_annual_leaves ?? ""}/${item?.total_annual_leaves ?? ""}`
        );
        row.push(item?.remaining_annual_leaves || "");
      }
  
      if (visibleColumns.sickLeave) {
        row.push(
          `${item?.taken_sick_leaves ?? ""}/${item?.total_sick_leaves ?? ""}`
        );
        row.push(item?.remining_sick_leaves || "");
      }
  
      if (visibleColumns.compassionateLeave) {
        row.push(
          `${item?.taken_compassionate_leaves ?? ""}/${item?.total_compassionate_leaves ?? ""}`
        );
      }
  
      if (visibleColumns.paternityLeave) {
        row.push(
          `${item?.taken_paternity_leaves ?? ""}/${item?.total_paternity_leaves ?? ""}`
        );
      }
  
      if (visibleColumns.maternityLeave) {
        row.push(
          `${item?.taken_maternity_leaves ?? ""}/${item?.total_maternity_leaves ?? ""}`
        );
      }
  
      return row.join(",");
    });
  
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
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
          field: "employee_name",
          headerName: "Employee Name",
          minWidth: 220,
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
        {
          field: "employee_id",
          headerName: "Employee ID",
          filter: "agTextColumnFilter",
          sortable: true,
          minWidth:110,
          filterParams: { buttons: ["reset", "apply", "clear"] },
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

  // Update columnDefs when visibleColumns changes
  useEffect(() => {
    const additionalColumns = [];

    if (visibleColumns.annualLeave) {
      additionalColumns.push(
        {
          field: "annualLeave",
          headerName: "Annual Leave",
          minWidth: 120,
          filter: false,
          cellRenderer: (params) =>
            `${params.data.taken_annual_leaves}/${params.data.total_annual_leaves}`,
        },
        {
          field: "remaining_annual_leaves",
          headerName: "Remaining Annual Leave",
          filter: false,
        }
      );
    }

    if (visibleColumns.sickLeave) {
      additionalColumns.push(
        {
          field: "sickLeave",
          headerName: "Sick Leave",
          minWidth: 110,
          filter: false,
          cellRenderer: (params) =>
            `${params.data.taken_sick_leaves}/${params.data.total_sick_leaves}`,
        },
        {
          field: "remining_sick_leaves",
          headerName: "Remaining Sick Leave",
          filter: false,
        }
      );
    }

    if (visibleColumns.compassionateLeave) {
      additionalColumns.push({
        field: "compassionateLeave",
        headerName: "Compassionate Leave",
        filter: false,
        cellRenderer: (params) =>
          `${params.data.taken_compassionate_leaves}/${params.data.total_compassionate_leaves}`,
      });
    }

    if (visibleColumns.paternityLeave) {
      additionalColumns.push({
        field: "paternityLeave",
        headerName: "Paternity Leave",
        filter: false,
        cellRenderer: (params) =>
          `${params.data.taken_paternity_leaves}/${params.data.total_paternity_leaves}`,
      });
    }

    if (visibleColumns.maternityLeave) {
      additionalColumns.push({
        field: "maternityLeave",
        headerName: "Maternity Leave",
        filter: false,
        cellRenderer: (params) =>
          `${params.data.taken_maternity_leaves}/${params.data.total_maternity_leaves}`,
      });
    }

    // Update columnDefs with base columns and additional columns
    setColumnDefs([
      {
        field: "employee_name",
        headerName: "Employee Name",
        minWidth: 220,
        filter: "agTextColumnFilter",
        sortable: true,
        filterParams: { buttons: ["reset", "apply", "clear"] },
      },
      {
        field: "employee_role",
        minWidth: 100,
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
        minWidth: 110,
        filterParams: { buttons: ["reset", "apply", "clear"] },
      },
      {
        field: "team_name",
        headerName: "Team",
        minWidth: 110,
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
      ...additionalColumns,
      {
        field: "employee_id",
        headerName: "Employee ID",
        filter: "agTextColumnFilter",
        sortable: true,
        minWidth: 110,
        filterParams: { buttons: ["reset", "apply", "clear"] },
      }
    ]);
  }, [visibleColumns]);

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

      <div className="flex flex-wrap justify-between items-center gap-4 p-3">
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
              onClick={() => setShowDropdown(!showDropdown)}
              className="px-4 py-2 border rounded-lg flex items-center gap-2 whitespace-nowrap"
            >
              <MdFilterList />
              <span>Filter</span>
            </button>
            {showDropdown && (
              <div
                ref={filterRef}
                className="absolute right-0 mt-2 w-48 bg-white border rounded-2xl p-3 z-50"
              >
                <div className="mb-4">
                  <h4 className="font-semibold">Filter Columns</h4>
                  {Object.keys(visibleColumns).map((column) => (
                    <label key={column} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={visibleColumns[column]}
                        onChange={() => handleColumnVisibility(column)}
                      />
                      <span className="ml-1 capitalize">
                        {column.replace(/([A-Z])/g, " $1")}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}
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

      <div className="rounded-lg border overflow-hidden">
                {isLoading ? (
                    <DataLoader />
                ) :
                    data?.length > 0 ? (

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
