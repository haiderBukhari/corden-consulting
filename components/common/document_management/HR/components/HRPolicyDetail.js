import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { FaDownload } from 'react-icons/fa';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { FaEye } from 'react-icons/fa';
import { handleDownloadDocument } from '../../../../../utils/functions';
import useDownloadDocument from '../../../../../hooks/mutations/onboarding/downloadDocument';
import EmployeeAcknowledgments from './EmployeeAcknowledgments';
import { getPolicyDetail } from '../../../../../hooks/query/documentManagment/getPolicyDetail';
ChartJS.register(ArcElement, Tooltip, Legend); // Register chart.js components

const HRPolicyDetail = ({ policy, onBack }) => {
  const totalEmployees = policy.employees?.length || 0;
  const acknowledgedCount = policy.employees?.filter(emp => emp.acknowledged)?.length || 0;
  const notAcknowledgedCount = totalEmployees - acknowledgedCount;
  const downloadDocument=useDownloadDocument()

  const { data: policyDetail } = getPolicyDetail(policy.id);
  console.log("policyDetail", policyDetail);
  const pieData = {
    labels: ['Acknowledged', 'Not Acknowledged'],
    datasets: [
      {
        data: [policyDetail?.acknowledgemnetCount, policyDetail?.pendingAcknowledgmentsCount],
        backgroundColor: ['#534FEB', '#EF4444'],
        borderColor: ['#ffffff', '#ffffff'],
        borderWidth: 2,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#4B5563',
        },
      },
    },
  };

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onBack()}
          className="flex space-x-2 items-center px-2 py-1 text-white bg-primary rounded-xl  mb-3"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>
        {/* <button
          onClick={() => { /* Handle export 
          className="flex items-center px-4 py-2 text-sm font-medium text-white bg-[#009D9D] rounded-md hover:bg-[#007a7a]"
        >
          <FaDownload className="w-4 h-4 mr-2" />
          Export CSV
        </button> */}
      </div>

      <div className='grid grid-cols-2 gap-4'>
        {/* Policy Info */}
        <div className="p-6 bg-white rounded-lg shadow">
          <h2 className="text-2xl font-semibold text-gray-900 capitalize">{policy.title}</h2>
          <p className="mt-2 text-gray-600">{policy.description}</p>

          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <p className="text-sm text-gray-500">Upload Date</p>
              <p className="font-medium">{policy.created_at}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Uploaded By</p>
              <p className="font-medium">{policy.uploaded_by}</p>
            </div>
            {/* <div>
            <p className="text-sm text-gray-500">Status</p>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${policy.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
              {policy.status}
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-500">Expiry Date</p>
            <p className="font-medium">{policy.expiryDate}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Reminder Date</p>
            <p className="font-medium">{policy.reminderDate}</p>
          </div> */}
          </div>
        </div>

        {/* Acknowledgment Pie Chart */}
        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Acknowledgment Status</h3>
          <div className="h-64 w-full flex justify-center items-center">
            <Pie data={pieData} options={pieOptions} />
          </div>
        </div>
      </div>
      <div className="flex space-x-4 mb-4">
        <a
          href={policy.file_path}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <FaEye className="w-4 h-4 mr-2" />
          View Policy
        </a>
        <button
          onClick={() => handleDownloadDocument(policy.file_path, policy.title , downloadDocument)}
          // disabled={downloadPolicy.isLoading}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
        >
          <FaDownload className="w-4 h-4 mr-2" />
          Download
          {/* {downloadPolicy.isLoading ? 'Downloading...' : 'Download Policy'} */}
        </button>
      </div>
      {/* Document Preview */}
      <div className="p-6 bg-white rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Document Preview</h3>
        <iframe
          src={policy.file_path}
          className="w-full h-[600px] border-0"
          title="Policy Document"
        />
      </div>


      {/* Employee Acknowledgments */}
      <div className="p-6 bg-white rounded-lg shadow">
        <EmployeeAcknowledgments acknowledgedEmployees={policyDetail?.acknowledgments} pendingEmployees={policyDetail?.pendingAcknowledgments} />
      </div>
    </div>
  );
};

export default HRPolicyDetail;
