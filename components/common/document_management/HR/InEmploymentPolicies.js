
import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from 'react-query';
import { FaEye, FaDownload } from 'react-icons/fa';
import { BsSearch } from 'react-icons/bs';
import { PiExport } from "react-icons/pi";
import { ArrowLeft } from 'lucide-react';
import AddPolicyForm from './components/AddPolicyForm';
import HRPolicyDetail from './components/HRPolicyDetail';
import { AgGridReact } from "ag-grid-react";
import { PlusIcon } from '@heroicons/react/24/outline';
import { ClientSideRowModelModule, ModuleRegistry, TextFilterModule } from "ag-grid-community";
import { useRouter } from 'next/router';
import { getPolicyList } from '../../../../hooks/query/documentManagment/getPolicyList';
ModuleRegistry.registerModules([
    ClientSideRowModelModule,
    TextFilterModule
]);

const InEmploymentPolicyDocumentManagement = ({ user, detail }) => {
    const [searchTerm, setSearchTerm] = useState('');
    
    const [selectedPolicy, setSelectedPolicy] = useState(null);
    const [showAddPolicy, setShowAddPolicy] = useState(false);
    const { data: policies, isLoading: isLoadingPoliciesList } = getPolicyList();

 
    const handleExportCSV = () => {
        if (selectedPolicy) {
            // Export employee acknowledgment data
            const headers = "Employee Name,Department,Acknowledgment Status,Acknowledged At\n";
            const rows = selectedPolicy.employees.map(emp =>
                `${emp.name},${emp.department},${emp.acknowledged ? 'Yes' : 'No'},${emp.acknowledgedAt || 'N/A'}`
            ).join("\n");
            const csvContent = "data:text/csv;charset=utf-8," + headers + rows;
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `policy_${selectedPolicy.id}_acknowledgments.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } else {
            // Export policy list
            const headers = "Policy Name,Description,Upload Date,Uploaded By,Requires Acknowledgment,Status,Expiry Date,Reminder Date,Acknowledged Count,Not Acknowledged Count\n";
            const rows = policies.map(policy =>
                `${policy.name},${policy.description},${policy.uploadDate},${policy.uploadedBy},${policy.requiresAcknowledgment},${policy.status},${policy.expiryDate || 'N/A'},${policy.reminderDate || 'N/A'},${policy.acknowledgedCount},${policy.notAcknowledgedCount}`
            ).join("\n");
            const csvContent = "data:text/csv;charset=utf-8," + headers + rows;
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "policies.csv");
            document.body.appendChild(link);
            link.click();
            link.remove();
        }
    };

    const handleAddPolicy = (formData) => {
        // Handle adding new policy
        console.log('New policy data:', formData);
        setShowAddPolicy(false);
    };

    const handleViewPolicy = (policy) => {
        setSelectedPolicy(policy);
    };

    const handleBack = () => {
        setSelectedPolicy(null);
    };

    const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
    const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

    const policyColumnDefs = useMemo(() => [
        {
            field: "title",
            headerName: "Policy Name",
            minWidth: 200,
            filter: "agTextColumnFilter",
            filterParams: { buttons: ['reset', 'apply', 'clear'] },
        },
        {
            field: "description",
            headerName: "Description",
            minWidth: 250,
            filter: "agTextColumnFilter",
            filterParams: { buttons: ['reset', 'apply', 'clear'] },
        },
        {
            field: "created_at",
            headerName: "Upload Date",
            minWidth: 150,
            valueFormatter: (params) => {
                return new Date(params.value).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
            }
        },
        {
            field: "uploaded_by",
            headerName: "Uploaded By",
            minWidth: 150,
            filter: "agTextColumnFilter",
            filterParams: { buttons: ['reset', 'apply', 'clear'] },
        },
        {
            field :'ack_required',  
            headerName: "Acknowledgment Required",
            minWidth: 150,
            cellRenderer: (params) => {
                return params.value === true ? 'Yes' : 'No';
            }
        },
        // {
        //     field: "acknowledgement_status",
        //     headerName: "Status",
        //     minWidth: 120,
        //     cellRenderer: (params) => (
        //         <div className={`px-2 py-2 mt-1 rounded-xl text-center  text-xs ${
        //             params.data.acknowledgement_status ==='Acknowledged' 
        //                 ? 'bg-green-100 text-green-800' 
        //                 : 'bg-yellow-100 text-yellow-800'
        //         }`}>
        //             {params.data.acknowledgement_status ==='Acknowledged' ? 'Acknowledged' : 'Not Acknowledged'}
        //         </div>
        //     ),
        // },
        {
            headerName: "Actions",
            minWidth: 120,
            cellRenderer: (params) => (
                <div className='flex space-x-2 text-xs mt-1 '> 
                <button
                    onClick={() => handleViewPolicy(params.data)}
                    className="flex items-center text-white bg-primary rounded-lg border border-primary p-2"
                >
                    <FaEye className="h-4 w-4 mr-1" />
                    <span>View Details</span>
                </button>
                
                </div>
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
    const filteredPolicies = useMemo(() => {
        if (!policies) return [];
        if (!searchTerm) return policies;

        const searchLower = searchTerm.toLowerCase();
        return policies.filter(policy =>
            policy.title.toLowerCase().includes(searchLower) ||
            policy.description.toLowerCase().includes(searchLower) ||
            policy.uploaded_by.toLowerCase().includes(searchLower) ||
            policy.created_at.toLowerCase().includes(searchLower)

        );
    }, [policies, searchTerm]);



    if (selectedPolicy) {
        return (
            <HRPolicyDetail
                policy={selectedPolicy}
                onBack={handleBack}
                onExport={handleExportCSV}
            />
        );
    }

    if (showAddPolicy) {
        return (
            <div className="p-4">

                <AddPolicyForm onSubmit={handleAddPolicy} setShowAddPolicy={setShowAddPolicy} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className=" p-4">
                <div className="py-5 ">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-semibold">Policy Documents</h2>
                            <p className="mt-2 text-sm text-gray-700">
                                Manage company policies and track employee acknowledgments
                            </p>
                        </div>
                        <button
                            onClick={() => setShowAddPolicy(true)}
                            className="flex items-center text-white bg-primary rounded-lg border border-primary p-2"
                        >
                            <PlusIcon className="h-5 w-5 mr-2" />
                            Add Policy
                        </button>
                    </div>
                </div>
                <div className="py-5">
                    <div className="flex flex-wrap justify-between items-center gap-4 py-2">
                        <div className="flex-grow md:flex md:items-center md:w-auto">
                            <div className="relative w-full">
                                <BsSearch className="absolute left-3 top-1/2 transform -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Search documents..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-3 py-2 w-full focus:outline-none border rounded-lg"
                                />
                            </div>
                        </div>
                        <button onClick={handleExportCSV} className="flex items-center  bg-white border rounded-lg p-2 text-sm">
                            <PiExport className="h-4 w-4 mr-1" />
                            <span>Export CSV</span>
                        </button>
                    </div>

                    <div style={containerStyle} className="min-h-screen bg-white">
                        <div style={gridStyle}>
                            <AgGridReact
                                rowData={filteredPolicies}
                                columnDefs={policyColumnDefs}
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

export default InEmploymentPolicyDocumentManagement; 