import React, { useState, useEffect } from 'react';
import { BsSearch } from 'react-icons/bs';
import { PiExport } from 'react-icons/pi';
import { EyeIcon } from 'lucide-react';
import ConfigrationDetailPage from './ConfigrationDetailPage';

const DefaultConfigrationApprovalList = ({
    data,
    columns,
    action,
    type,

    exportFileName = 'configurations'
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [filterType, setFilterType] = useState('open');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);
    const [detailPage, setDetailPage] = useState(false);
    useEffect(() => {
        const pendingRequest = data?.find((item) => item.status?.toLowerCase() === 'pending');
        if (pendingRequest) {
            setSelectedItem(pendingRequest);
            setDetailPage(true);
        }
    }, [data]);

    useEffect(() => {
        let filtered = data;

        // Filter by status (Open/Closed)
        filtered = filtered?.filter((item) => {
            const status = item.status?.toLowerCase() || ''; // Normalize status to lowercase
            return filterType === 'open' ? status === 'pending' : status !== 'pending';
        });
        if (selectedStatus) {
            filtered = filtered.filter(
                (config) => config.repayment_method?.toLowerCase() === selectedStatus.toLowerCase()
            );
        }
        // Search functionality
        if (searchTerm) {
            const lowerSearchTerm = searchTerm.toLowerCase();

            filtered = filtered.filter((item) => {
                // Check approver names
                const approverNames = item.approvers?.map((approver) => approver.user_name?.toLowerCase()).join(' ') || '';
                // Check status
                const status = item.status?.toLowerCase() || '';
                // Check cut-off period
                const cutOffPeriod = new Date(item.cut_off_period).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                }).toLowerCase();

                // Match any of the criteria
                return (
                    approverNames.includes(lowerSearchTerm) ||
                    status.includes(lowerSearchTerm) ||
                    cutOffPeriod.includes(lowerSearchTerm)
                );
            });
        }
     
        setFilteredData(filtered);
    }, [data, filterType, searchTerm, selectedStatus]);

    const handleExportCSV = () => {
        const csvData = [
            columns.map((col) => col.label),
            ...filteredData.map((item) =>
                columns.map((col) => (typeof col.accessor === 'function' ? col.accessor(item) : item[col.accessor]))
            ),
        ];

        const csvContent = 'data:text/csv;charset=utf-8,' + csvData.map((row) => row.join(',')).join('\n');
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `${exportFileName}_${filterType}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div>
            {detailPage ? (
                <ConfigrationDetailPage type={type} data={selectedItem} onClose={() => setDetailPage(false)} action={action} />
            ) : (
                <div className="min-h-screen bg-white">
                    {/* Filter Buttons */}
                    <div className="my-4 grid grid-cols-2 gap-4 p-2">
                        <button
                            className={`px-4 py-2 h-12 rounded-lg ${filterType === 'open' ? 'bg-primary text-white' : 'bg-gray-100 text-default_text'}`}
                            onClick={() => setFilterType('open')}
                        >
                            Open Configurations
                        </button>
                        <button
                            className={`px-4 py-2 h-12 rounded-lg ${filterType === 'closed' ? 'bg-primary text-white' : 'bg-gray-100 text-default_text'}`}
                            onClick={() => setFilterType('closed')}
                        >
                            Closed Configurations
                        </button>
                    </div>
                    <div className="flex flex-wrap justify-between items-center gap-4 py-3">
                        <div className="flex-grow md:flex md:items-center md:w-auto">
                            <div className="relative w-full">
                                <BsSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-default_text" />
                                <input
                                    type="text"
                                    placeholder="Search by Approver Name"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 pr-3 py-2 w-full focus:outline-none border rounded-xl text-sm"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            {type == 'loan' &&
                                <select
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                    className="py-2 px-4 border rounded-xl text-sm"
                                >
                                    <option value="">All Repayment Methods</option>
                                    <option value="Term">Term</option>
                                    <option value="Percentage">Percentage</option>
                                </select>
                            }
                            <button
                                onClick={handleExportCSV}
                                className="py-2 px-4 border rounded-xl flex items-center gap-2 text-sm whitespace-nowrap"
                            >
                                <PiExport />
                                <span>Export CSV</span>
                            </button>

                        </div>
                        
                    </div>




                    {/* Data Table */}
                    <div className="mt-4">
                        <div className="overflow-x-auto border rounded-lg">
                            <table className="min-w-full bg-white">
                                <thead className="bg-gray-100 border-b">
                                    <tr>
                                        {columns.map((col, index) => (
                                            <th
                                                key={index}
                                                className="px-2 py-2 text-left text-default_text text-sm border-b"
                                            >
                                                {col.label}
                                            </th>
                                        ))}
                                        <th className="px-2 py-2 text-left text-default_text text-sm border-b">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredData?.length > 0 ? (
                                        filteredData?.map((item) => (
                                            <tr key={item.id} className="border-b text-sm text-gray-700">
                                                {columns.map((col, index) => (
                                                    <td
                                                        key={index}
                                                        className="px-2 py-3 text-default_text border-b"
                                                    >
                                                        {typeof col.accessor === 'function' ? col.accessor(item) : item[col.accessor]}
                                                    </td>
                                                ))}
                                                <td className="px-2 py-3 border-b">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedItem(item);
                                                            setDetailPage(true);
                                                        }}
                                                        className="group relative flex items-center justify-center rounded-md py-2 px-4 border border-primary text-primary text-base font-medium"
                                                    >
                                                        <EyeIcon className="h-4 w-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={columns.length + 1} className="text-center py-4 text-gray-500">
                                                No Configration Request found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DefaultConfigrationApprovalList;
