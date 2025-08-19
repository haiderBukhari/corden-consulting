import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from 'react-query';
import { FaEye, FaDownload } from 'react-icons/fa';
import { BsSearch } from 'react-icons/bs';
import { PiExport } from "react-icons/pi";
import { ArrowLeft } from 'lucide-react';
import { AgGridReact } from "ag-grid-react";
import { ClientSideRowModelModule, ModuleRegistry, TextFilterModule } from "ag-grid-community";
import { useRouter } from 'next/router';
import { handleDownloadDocument } from '../../../../../utils/functions';
import { getAcknlowedgePolicy } from '../../../../../hooks/query/documentManagment/getAcknlowedgePolicy';
import useDownloadDocument from '../../../../../hooks/mutations/onboarding/downloadDocument';
ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  TextFilterModule
]);

const OnboardingPolicyDocumentManagmentUser = ({ user, setSelectedEmployee, detail }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: policies, isLoading: isLoadingPolicies } = getAcknlowedgePolicy(user?.id)
  const downloadDocument=useDownloadDocument()

  const router = useRouter();

  const handleExportCSV = () => {
    const headers = "Policy Name,Description,Acknowledge Date,Acknowledge Time,Policy Type,Uploaded By\n";
    const rows = policies.map(policy =>
      `${policy.policy_name},${policy.policy_description},${policy.acknowledged_at},${policy.acknowledgeTime},${policy.policy_type},${policy.uploaded_by}`
    ).join("\n");

    const csvContent = "data:text/csv;charset=utf-8," + headers + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", user?.name ? `${user?.name}_policies.csv` : "my_policies.csv");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  const columnDefs = useMemo(() => [
    {
      field: "policy_name",
      headerName: "Policy Name",
      minWidth: 180,
      filter: "agTextColumnFilter",
      filterParams: { buttons: ['reset', 'apply', 'clear'] },
    },

    {
      field: "policy_description",
      headerName: "Description",
      minWidth: 180,
      filter: "agTextColumnFilter",
      filterParams: { buttons: ['reset', 'apply', 'clear'] },
    },
    {
      field: "acknowledged_at",
      headerName: "Acknowledge Date",
      minWidth: 150,
      cellRenderer: (params) => (
        <span>
          {params.data?.acknowledged_at
            ? params.data.acknowledged_at.split(" ")[0]
            : "13-05-2025"}
        </span>
      ),
    },
    {
      field: "acknowledgeTime",
      headerName: "Acknowledge Time",
      minWidth: 150,
      cellRenderer: (params) => (
        <span>
          {params.data?.acknowledged_at
            ? params.data.acknowledged_at.split(" ")[1] + " " + params.data.acknowledged_at.split(" ")[2]
            : "11:49:13 AM"}
        </span>
      ),
    },

    {
      field: "policy_type",
      headerName: "Policy Type",
      minWidth: 150,
      cellRenderer: (params) => (
        <span>
          {params.data?.policy_type}
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
      headerName: "Actions",
      minWidth: 150,
      cellRenderer: (params) => (
        <div className="flex space-x-3 my-2 text-xs">
          <button
            onClick={() => window.open(params.data.file_path, '_blank')}
            className="flex items-center text-primary    bg-white border border-primary rounded-lg px-2 py-1"
          >
            <FaEye className="h-4 w-4 mr-1" />
            <span>View</span>
          </button>
          <button
            onClick={() => handleDownloadDocument(params.data.file_path, params.data.policy_name , downloadDocument)}
            className="flex items-center text-primary bg-white border border-primary rounded-lg px-2 py-1"
          >
            <FaDownload className="h-4 w-4 mr-1" />
            <span>Download</span>
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
  const filteredDocuments = useMemo(() => {
    if (!policies) return [];
    if (!searchTerm) return policies;

    const searchLower = searchTerm.toLowerCase();
    return policies.filter(doc =>
      doc.policy_name.toLowerCase().includes(searchLower) ||
      doc.policy_description.toLowerCase().includes(searchLower) ||
      doc.uploaded_by.toLowerCase().includes(searchLower)
    );
  }, [policies, searchTerm]);
 

  if (isLoadingPolicies) {
    return (
      <div className="flex items-center justify-center min-h-screen  bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-5">
        {detail && (
          <button onClick={() => { setSelectedEmployee(null) }} type='button' className='flex space-x-2 items-center px-2 py-1 text-white bg-primary rounded-xl  mb-3'>
            <ArrowLeft className='text-white h-5 w-5' />
            <span>Back</span>
          </button>
        )}
        <div className=" py-5 ">
          <div className="flex justify-between items-center">
            <div>
              <h2 className='text-2xl font-semibold'>
                {user?.name ? user?.name : ' My'} Onboarding Polcies
              </h2>
            </div>
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
                rowData={filteredDocuments}
                columnDefs={columnDefs}
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

export default OnboardingPolicyDocumentManagmentUser; 