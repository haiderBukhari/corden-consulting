import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from 'react-query';
import { BsSearch } from 'react-icons/bs';
import { FaEye, FaDownload } from 'react-icons/fa';

import { PiExport } from "react-icons/pi";
import { AgGridReact } from "ag-grid-react";
import { ClientSideRowModelModule, ModuleRegistry, TextFilterModule } from "ag-grid-community";
import OnboardingDocumentManagmentUser from '../user/components/UserOnboardingDocuments';
import { useGetHROnboardingUserList } from '../../../../hooks/query/onboarding/getHROnboardingUserList';
import DataLoader from '../../../ui/dataLoader';
ModuleRegistry.registerModules([
    ClientSideRowModelModule,
    TextFilterModule
]);

const OnboardingDocumentManagmentHRComponent = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const { data: UsersList, isLoading: isLoadingUsers } = useGetHROnboardingUserList('user')


    const handleExportCSV = () => {
        const data = selectedEmployee ? UsersList : UsersList;
        const headers = selectedEmployee
            ? "Document Name,Upload Date,Uploaded By\n"
            : "Name,Position,Department,Onboarding Date,Documents,Last Updated\n";

        const rows = data.map(item => {
            if (selectedEmployee) {
                return `${item.document_name},${item.date},${item.uploaded_by}`;
            } else {
                return `${item.name},${item.position.name},${item.department.departments_name},${item.onboard_date},${item.doc_count},${item.created_at}`;
            }
        }).join("\n");

        const csvContent = "data:text/csv;charset=utf-8," + headers + rows;
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${selectedEmployee ? 'employee_documents' : 'User Onboarding Documents'}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    const handleViewDetails = (employee) => {
        setSelectedEmployee(employee);
    };

    const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
    const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

    const employeeColumnDefs = useMemo(() => [
        {
            field: "name",
            headerName: "Employee Name",
            minWidth: 200,
            filter: "agTextColumnFilter",
            filterParams: { buttons: ['reset', 'apply', 'clear'] },
        },
        {
            field: "position",
            headerName: "Position",
            minWidth: 180,
            filter: "agTextColumnFilter",
            filterParams: { buttons: ['reset', 'apply', 'clear'] },
            cellRenderer: (params) => (
                <span>
                    {params.data.position.name}
                </span>
            ),
        },
        {
            field: "department",
            headerName: "Department",
            minWidth: 150,
            filter: "agTextColumnFilter",
            filterParams: { buttons: ['reset', 'apply', 'clear'] },
            cellRenderer: (params) => (
                <span>
                    {params.data.department.departments_name}
                </span>
            ),
        },
        {
            field: "onboard_date",
            headerName: "Onboarding Date",
            minWidth: 150,
            cellRenderer: (params) => (
                <span>
                    {params.data?.onboard_date?.split("T")[0]}
                </span>
            ),
        },
        {
            field: "documentCount",
            headerName: "Documents",
            minWidth: 120,
            valueGetter: (params) => `${params.data.doc_count} documents`,
        },
        // {
        //     field: "lastUpdated",
        //     headerName: "Last Updated",
        //     minWidth: 150,
        // },
        {
            headerName: "Actions",
            minWidth: 120,
            cellRenderer: (params) => (
                <button
                    onClick={() => handleViewDetails(params.data)}
                    className="flex items-center text-primary  text-xs mt-2 bg-white border border-primary rounded-lg px-2 py-1"
                >
                    <FaEye className="h-4 w-4 mr-1" />
                    <span>View Details</span>
                </button>
            ),
        }
    ], []);


    const defaultColDef = useMemo(() => ({
        flex: 1,
        minWidth: 150,
        filter: true,
        enablePivot: true,
        suppressHeaderMenuButton: true,
        suppressHeaderContextMenu: true,
    }), []);

    // Filter data based on search term
    const filteredEmployees = useMemo(() => {
        if (!UsersList) return [];
        if (!searchTerm) return UsersList;

        const searchLower = searchTerm.toLowerCase();
        return UsersList.filter(employee =>
            employee.name.toLowerCase().includes(searchLower) ||
            employee.position.name.toLowerCase().includes(searchLower) ||
            employee.department.departments_name.toLowerCase().includes(searchLower)
        );
    }, [UsersList, searchTerm]);

   

    if (isLoadingUsers) {
       return <DataLoader/>
    }

    if (selectedEmployee) {
        return (
            <OnboardingDocumentManagmentUser
                user={selectedEmployee}
                setSelectedEmployee={setSelectedEmployee}
                detail={true}
            />
        )
    }


    return (
        <div className="space-y-6 min-h-screen bg-white">
            <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-semibold">Onboarding Documents</h2>
                            <p className="mt-2 text-sm text-gray-700">
                                View and manage employee onboarding documents
                            </p>
                        </div>
                    </div>
                </div>
                <div className="px-4 py-5 sm:p-6">
                    <div className="flex flex-wrap justify-between items-center gap-4 p-3">
                        <div className="flex-grow md:flex md:items-center md:w-auto">
                            <div className="relative w-full">
                                <BsSearch className="absolute left-3 top-1/2 transform -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Search employees..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-3 py-2 w-full focus:outline-none border rounded-lg"
                                />
                            </div>
                        </div>
                        <button onClick={handleExportCSV} className="py-2 px-4 border rounded-lg flex items-center gap-2 text-sm whitespace-nowrap">
                            <PiExport />
                            <span>Export CSV</span>
                        </button>
                    </div>

                    <div style={containerStyle} className="min-h-screen bg-white">
                        <div style={gridStyle}>
                            <AgGridReact
                                rowData={filteredEmployees}
                                columnDefs={employeeColumnDefs}
                                defaultColDef={defaultColDef}
                                domLayout="autoHeight"
                                sideBar={{
                                    toolPanels: ['columns', 'filters'],
                                    defaultToolPanel: 'columns',
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OnboardingDocumentManagmentHRComponent; 