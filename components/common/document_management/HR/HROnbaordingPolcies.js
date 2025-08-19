import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from 'react-query';
import { BsSearch } from 'react-icons/bs';
import { FaEye, FaDownload } from 'react-icons/fa';

import { PiExport } from "react-icons/pi";
import { AgGridReact } from "ag-grid-react";
import { ClientSideRowModelModule, ModuleRegistry, TextFilterModule } from "ag-grid-community";
import OnboardingPolicyDocumentManagmentUser from '../user/components/UserOnboardingPolicies';
import { useGetHROnboardingUserList } from '../../../../hooks/query/onboarding/getHROnboardingUserList';
import { getAcknlowedgePolicy } from '../../../../hooks/query/documentManagment/getAcknlowedgePolicy';
import DataLoader from '../../../ui/dataLoader';
ModuleRegistry.registerModules([
    ClientSideRowModelModule,
    TextFilterModule
]);

const OnboardingPolicyDocumentManagmentHR = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const { data: UsersList, isLoading: isLoadingUsers } = useGetHROnboardingUserList('user')
   

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
    const handleExportCSV = () => {
        const data = selectedEmployee ? documents : employees;
        const headers = selectedEmployee
            ? "Policy Name,Description,Acknowledge Date,Acknowledge Time,Policy Type,Uploaded By\n"
            : "Name,Position,Department,Onboarding Date,Documents,Last Updated\n";

        const rows = data.map(item => {
            if (selectedEmployee) {
                return `${item.policy_name},${item.policy_description},${item.acknowledged_at},${item.acknowledgeTime},${item.policy_type},${item.uploaded_by}`;
            } else {
                return `${item.name},${item.position},${item.department},${item.onboardingDate},${item.documentCount},${item.lastUpdated}`;
            }
        }).join("\n");

        const csvContent = "data:text/csv;charset=utf-8," + headers + rows;
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${selectedEmployee ? 'employee_documents' : 'employees'}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    const handleViewDetails = (employee) => {
        setSelectedEmployee(employee);
    };

    const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
    const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);


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
        return (
            <DataLoader/>
        );
    }

    if (selectedEmployee) {
        return (
            <OnboardingPolicyDocumentManagmentUser
                user={selectedEmployee}
                setSelectedEmployee={setSelectedEmployee}
                detail={true}
            />
        )
    }


    return (
        <div className="space-y-6 min-h-screen bg-white">
            <div className="p-4">
                <div className="">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-semibold">Onboarding Policies</h2>
                            <p className="mt-2 text-sm text-gray-700">
                                View and manage employee onboarding policies
                            </p>
                        </div>
                    </div>
                </div>
                <div className="">
                    <div className="flex flex-wrap justify-between items-center gap-4 py-4">
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

export default OnboardingPolicyDocumentManagmentHR; 