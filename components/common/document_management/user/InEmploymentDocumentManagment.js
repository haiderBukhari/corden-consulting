import React, { useState, useMemo } from 'react';
import { useQuery } from 'react-query';
import { BsSearch } from 'react-icons/bs';
import { FaEye, FaDownload, FaCheck } from 'react-icons/fa';
import { PiExport } from "react-icons/pi";
import { AgGridReact } from "ag-grid-react";
import { ClientSideRowModelModule, ModuleRegistry, TextFilterModule } from "ag-grid-community";
import UserPolicyDetail from './components/UserPolicyDetail';
import { getMyDocs } from '../../../../hooks/query/documentManagment/getMyDocs';
import DataLoader from '../../../ui/dataLoader';
ModuleRegistry.registerModules([
    ClientSideRowModelModule,
    TextFilterModule
]);

const UserInEmploymentDocuments = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('policy'); // 'policy' or 'personal'
    const [selectedPolicy, setSelectedPolicy] = useState(null);
    const { data: myDocs, isLoading: isLoadingMyDocs } = getMyDocs();
    console.log(myDocs);
    // Dummy data for policy documents
    
   

    const policyDocuments = myDocs && myDocs?.filter(doc => doc.document_type === 'policy');
    const personalDocuments = myDocs && myDocs?.filter(doc => doc.document_type === 'personal');
    const handleExportCSV = () => {
        const documents = activeTab === 'policy' ? policyDocuments : personalDocuments;
        const headers = activeTab === 'policy' 
            ? "Policy Name,Description,Upload Date,Uploaded By,Status,Acknowledgment Status\n"
            : "Document Name,Description,Upload Date,Uploaded By,Status,Acknowledgment Status\n";
        
        const rows = documents.map(doc =>
            `${doc.name},${doc.description},${doc.uploadDate},${doc.uploadedBy},${doc.status},${doc.acknowledged ? 'Acknowledged' : 'Pending'}`
        ).join("\n");
        
        const csvContent = "data:text/csv;charset=utf-8," + headers + rows;
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${activeTab}_documents.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    const handleViewPolicy = (policy) => {
        setSelectedPolicy(policy);
    };

    const handleAcknowledge = (documentId) => {
        // Implement acknowledgment logic here
        console.log('Acknowledging document:', documentId);
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
        {
            field: "acknowledgement_status",
            headerName: "Status",
            minWidth: 120,
            cellRenderer: (params) => (
                <div className={`px-2 py-2 mt-1 rounded-xl text-center  text-xs ${
                    params.data.acknowledgement_status ==='Acknowledged' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                }`}>
                    {params.data.acknowledgement_status ==='Acknowledged' ? 'Acknowledged' : 'Not Acknowledged'}
                </div>
            ),
        },
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

    const personalColumnDefs = useMemo(() => [
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
        {
            field: "acknowledgement_status",
            headerName: "Status",
            minWidth: 120,
            cellRenderer: (params) => (
                <div className={`px-2 py-2 mt-1 rounded-xl text-center  text-xs ${
                    params.data.acknowledgement_status ==='Acknowledged' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                }`}>
                    {params.data.acknowledgement_status ==='Acknowledged' ? 'Acknowledged' : 'Not Acknowledged'}
                </div>
            ),
        },
        {
            headerName: "Actions",
            minWidth: 200,
            cellRenderer: (params) => (
                <div className="flex space-x-3 text-xs mt-2">
                    <button
                        onClick={() => handleViewPolicy(params.data , 'policy')}
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
    const filteredPolicyDocuments = useMemo(() => {
        if (!policyDocuments) return [];
        if (!searchTerm) return policyDocuments;

        const searchLower = searchTerm.toLowerCase();
        return policyDocuments.filter(doc =>
            doc.name.toLowerCase().includes(searchLower) ||
            doc.description.toLowerCase().includes(searchLower) ||
            doc.uploadedBy.toLowerCase().includes(searchLower)
        );
    }, [policyDocuments, searchTerm]);

    const filteredPersonalDocuments = useMemo(() => {
        if (!personalDocuments) return [];
        if (!searchTerm) return personalDocuments;

        const searchLower = searchTerm.toLowerCase();
        return personalDocuments.filter(doc =>
            doc.name.toLowerCase().includes(searchLower) ||
            doc.description.toLowerCase().includes(searchLower) ||
            doc.uploadedBy.toLowerCase().includes(searchLower)
        );
    }, [personalDocuments, searchTerm]);

    if (isLoadingMyDocs) {
        return (
            <DataLoader/>
        );
    }

    if (selectedPolicy) {
        return (
            <UserPolicyDetail 
                policy={selectedPolicy} 
                onBack={() => setSelectedPolicy(null)} 
                type={activeTab}
            />
        );
    }

    return (
        <div className="space-y-6">
            <div className="bg-white shadow rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-semibold">In-Employment Documents</h2>
                            <p className="mt-2 text-sm text-gray-700">
                                View and manage your employment documents
                            </p>
                        </div>
                      
                    </div>
                </div>
                <div className="px-4 py-5 sm:p-6">
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={() => setActiveTab('policy')}
                            className={`px-4 py-2 rounded-lg ${
                                activeTab === 'policy'
                                    ? 'bg-primary text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Policy Documents
                        </button>
                        <button
                            onClick={() => setActiveTab('personal')}
                            className={`px-4 py-2 rounded-lg ${
                                activeTab === 'personal'
                                    ? 'bg-primary text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                        >
                            Personal Documents
                        </button>
                    </div>

                    <div className="flex flex-wrap justify-between items-center gap-4 p-3">
                        <div className="flex-grow md:flex md:items-center md:w-auto">
                            <div className="relative w-full">
                                <BsSearch className="absolute left-3 top-1/2 transform -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder={`Search ${activeTab === 'policy' ? 'policies' : 'documents'}...`}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-3 py-2 w-full focus:outline-none border rounded-lg"
                                />
                            </div>
                        </div>
                    </div>

                    <div style={containerStyle} className="min-h-screen bg-white">
                        <div style={gridStyle}>
                            <AgGridReact
                                rowData={activeTab === 'policy' ? filteredPolicyDocuments : filteredPersonalDocuments}
                                columnDefs={activeTab === 'policy' ? policyColumnDefs : personalColumnDefs}
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

export default UserInEmploymentDocuments; 