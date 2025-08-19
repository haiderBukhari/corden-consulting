import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from 'react-query';
import { BsSearch } from 'react-icons/bs';
import { FaEye, FaDownload, FaCheck, FaPlus } from 'react-icons/fa';
import { PiExport } from "react-icons/pi";
import { AgGridReact } from "ag-grid-react";
import { ClientSideRowModelModule, ModuleRegistry, TextFilterModule } from "ag-grid-community";
import { PlusIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { getPolicyList } from '../../../../hooks/query/documentManagment/getPolicyList';
import UserPersonalDocumentForm from './components/AddPersonalDocForm';
import { getPersonalDoc } from '../../../../hooks/query/documentManagment/getPersonalDoc';
import useDownloadDocument from '../../../../hooks/mutations/onboarding/downloadDocument';
import { handleDownloadDocument } from '../../../../utils/functions';
import DataLoader from '../../../ui/dataLoader';
ModuleRegistry.registerModules([
    ClientSideRowModelModule,
    TextFilterModule
]);

const InEmploymentPersonalDocs = () => {
    const [searchTerm, setSearchTerm] = useState('');
   
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [showAddDocument, setShowAddDocument] = useState(false);
    const {data:personalDoc , isLoading:isLoadingPersonalDoc} = getPersonalDoc();
   const downloadDocument=useDownloadDocument()
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

    const handleAddDocument = (formData) => {
        // Handle adding new policy
        console.log('New policy data:', formData);
        setShowAddDocument(false);
    };

    const handleViewDocument = (document) => {
        setSelectedDocument(document);
    };

    const handleBack = () => {
        setSelectedDocument(null);
    };

    const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
    const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

    const documentColumnDefs = useMemo(() => [
        {
            field: "user",
            headerName: "User",
            minWidth: 200,
            filter: "agTextColumnFilter",
            filterParams: { buttons: ['reset', 'apply', 'clear'] },
            cellRenderer: (params) => (
                <span>
                    {params.data.user?.fname + " " + params.data.user?.middle_name + " " + params.data.user?.lname}
                </span>
            ),
        },
        {
            field: "title",
            headerName: "Document Name",
            minWidth: 200,
            filter: "agTextColumnFilter",
            filterParams: { buttons: ['reset', 'apply', 'clear'] },
        },
       
        {
            field: "created_at",
            headerName: "Upload Date",
            minWidth: 150,
            cellRenderer: (params) => (
                <span>
                    {params.data.created_at.split("T")[0]}
                </span>
            ),
        },
        {
            field: "uploaded_by",
            headerName: "Uploaded By",
            minWidth: 150,
            filter: "agTextColumnFilter",
            filterParams: { buttons: ['reset', 'apply', 'clear'] },
           
        },
        {
            field: "isMandatory",
            headerName: "Is Mandatory",
            minWidth: 150,
            valueGetter: (params) => params.data.ack_required  ? 'Yes' : 'No',
        },
        
       
        
        
        {
            field:"status",
            headerName: "Status",
            minWidth: 200,
            
            valueGetter: (params) => params.data.acknowledgement_status === 'Acknowledged' ? 'Acknowledged' : 'Not Acknowledged',
            cellRenderer: (params) => (
                <span className={`${params.data.acknowledgement_status === 'Acknowledged' ? 'text-green-500' : 'text-red-500'} px-2 py-1 rounded-md `}>
                    {params.data.acknowledgement_status}
                </span>
            ),
        },
        {
            field:"acknowledged_at",
            headerName: "Acknlowedgement At",
            minWidth: 200,
            
           
            cellRenderer: (params) => (
                <span >
                    {params.data.acknowledged_at ? params.data.acknowledged_at?.split("T")[0] : 'Not Acknowledged'}
                </span>
            ),
        },

        {
            headerName: "Actions",
            minWidth: 120,
            cellRenderer: (params) => (
                <button
                    onClick={() => handleDownloadDocument(params.data.file_path, params.data.title , downloadDocument)}
                    className="flex items-center text-xs my-1 text-white bg-primary rounded-lg border border-primary p-2"
                >
                    <FaDownload className="h-4 w-4 mr-1" />
                    <span>Download</span>
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
    const filteredDocuments = useMemo(() => {
        if (!personalDoc) return [];
        if (!searchTerm) return personalDoc;

        const searchLower = searchTerm.toLowerCase();
        return personalDoc.filter(document =>
            document.name.toLowerCase().includes(searchLower) ||
            document.description.toLowerCase().includes(searchLower) ||
            document.uploadedBy.toLowerCase().includes(searchLower)
        );
    }, [personalDoc, searchTerm]);

    if (isLoadingPersonalDoc) {
        return (
           <DataLoader/>
        );
    }

        

    if (showAddDocument) {
        return (
            <div className="p-4">
               
                <UserPersonalDocumentForm onSubmit={handleAddDocument} setShowAddDocument={setShowAddDocument} />
            </div>
        );
    }

    return (
        <div className="space-y-6 min-h-screen bg-white">
            <div className=" p-4">
                <div className="py-5 ">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-semibold">Personal Documents</h2>
                            <p className="mt-2 text-sm text-gray-700">
                                Manage personal documents and track employee acknowledgments
                            </p>
                        </div>
                        <button
                            onClick={() => setShowAddDocument(true)}
                            className="flex items-center text-white bg-primary rounded-lg border border-primary p-2"
                        >
                            <PlusIcon className="h-5 w-5 mr-2" />
                            Add Document
                        </button>
                    </div>
                </div>
                <div className="py-5">
                    <div className="flex flex-wrap justify-between items-center gap-4 py-3">
                        <div className="flex-grow md:flex md:items-center md:w-auto">
                            <div className="relative w-full">
                                <BsSearch className="absolute left-3 top-1/2 transform -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Search policies..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-3 py-2 w-full focus:outline-none border rounded-lg"
                                />
                            </div>
                        </div>
                        <button
                            onClick={handleExportCSV}
                            className="flex items-center text-white bg-primary rounded-lg border border-primary p-2"
                        >
                            <PiExport className="h-4 w-4 mr-1" />
                            <span>Export CSV</span>
                        </button>
                    </div>

                    <div style={containerStyle} className="min-h-screen bg-white">
                        <div style={gridStyle}>
                            <AgGridReact
                                rowData={filteredDocuments}
                                columnDefs={documentColumnDefs}
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

export default InEmploymentPersonalDocs; 