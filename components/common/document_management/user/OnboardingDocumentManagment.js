import React, { useState, useMemo } from 'react';
import { useQuery } from 'react-query';
import { BsSearch } from 'react-icons/bs';
import { FaEye, FaDownload, FaCheck } from 'react-icons/fa';
import { PiExport } from "react-icons/pi";
import { AgGridReact } from "ag-grid-react";
import { ClientSideRowModelModule, ModuleRegistry, TextFilterModule } from "ag-grid-community";
import UserPolicyDetail from './components/UserPolicyDetail';
import OnboardingDocumentManagmentUser from './components/UserOnboardingDocuments';
import OnboardingPolicyDocumentManagmentUser from './components/UserOnboardingPolicies';
import { UseGetProfile } from '../../../../hooks/query/getProfile';
import DataLoader from '../../../ui/dataLoader';

ModuleRegistry.registerModules([
    ClientSideRowModelModule,
    TextFilterModule
]);

const OnboardingDocumentManagment = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('policy'); // 'policy' or 'personal'
    const [selectedPolicy, setSelectedPolicy] = useState(null);
    const { data: user } = UseGetProfile()
    // Dummy data for policy documents
    const dummyPolicyDocuments = [
        {
            id: 1,
            name: 'Company Policies',
            description: 'Updated company policies for 2024',
            uploadDate: '2024-03-15 09:30 AM',
            uploadedBy: 'HR Manager',
            viewUrl: '#',
            downloadUrl: '#',
            requiresAcknowledgment: true,
            expiryDate: '2024-12-31',
            reminderDate: '2024-12-15',
            acknowledged: false,
            acknowledgedAt: null,
            status: 'Active'
        },
        {
            id: 2,
            name: 'Security Protocols',
            description: 'Company security protocols and guidelines',
            uploadDate: '2024-03-15 09:35 AM',
            uploadedBy: 'HR Admin',
            viewUrl: '#',
            downloadUrl: '#',
            requiresAcknowledgment: true,
            expiryDate: null,
            reminderDate: null,
            acknowledged: true,
            acknowledgedAt: '2024-03-16 10:00 AM',
            status: 'Active'
        }
    ];

    // Dummy data for personal documents
    const dummyPersonalDocuments = [
        {
            id: 1,
            name: 'Salary Slip',
            description: 'March 2024 Salary Slip',
            uploadDate: '2024-03-15 09:30 AM',
            uploadedBy: 'HR Manager',
            viewUrl: '#',
            downloadUrl: '#',
            requiresAcknowledgment: true,
            acknowledged: true,
            acknowledgedAt: '2024-03-16 10:00 AM',
            status: 'Active'
        },
        {
            id: 2,
            name: 'Appraisal Letter',
            description: 'Annual Performance Review 2024',
            uploadDate: '2024-03-15 09:35 AM',
            uploadedBy: 'HR Admin',
            viewUrl: '#',
            downloadUrl: '#',
            requiresAcknowledgment: true,
            acknowledged: false,
            acknowledgedAt: null,
            status: 'Active'
        }
    ];

    // Simulate API calls with dummy data
    const { data: policyDocuments, isLoading: isLoadingPolicy } = useQuery(
        'policyDocuments',
        async () => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            return dummyPolicyDocuments;
        }
    );

    const { data: personalDocuments, isLoading: isLoadingPersonal } = useQuery(
        'personalDocuments',
        async () => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            return dummyPersonalDocuments;
        }
    );

    const handleViewPolicy = (policy) => {
        setSelectedPolicy(policy);
    };



    if (isLoadingPolicy || isLoadingPersonal) {
        return (
           <DataLoader/>
        );
    }

    if (selectedPolicy) {
        return (
            <UserPolicyDetail
                policy={selectedPolicy}
                onBack={() => setSelectedPolicy(null)}
            />
        );
    }

    return (
        <div className="space-y-6">
            <div className="bg-white shadow rounded-lg">

                <div className="px-4">
                    <div className="gap-2 grid grid-cols-2">
                        <button
                            onClick={() => setActiveTab('document')}
                            className={`px-4 py-2 rounded-lg ${activeTab === 'document'
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Documents
                        </button>
                        <button
                            onClick={() => setActiveTab('policy')}
                            className={`px-4 py-2 rounded-lg ${activeTab === 'policy'
                                ? 'bg-primary text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Policies
                        </button>
                    </div>


                </div>
                {
                    activeTab === 'policy' && (
                        <OnboardingPolicyDocumentManagmentUser user={user} />
                    )
                }
                {
                    activeTab === 'document' && (
                        <OnboardingDocumentManagmentUser user={user} />
                    )
                }

            </div>
        </div>
    );
};

export default OnboardingDocumentManagment; 