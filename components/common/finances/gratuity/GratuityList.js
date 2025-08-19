import React, { useState, useMemo } from 'react';
import { BsSearch } from 'react-icons/bs';
import { EyeIcon } from 'lucide-react';
import { PiExport } from 'react-icons/pi';
import DataLoader from '../../../ui/dataLoader';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { UseGetAllUsers } from '../../../../hooks/query/admin/getAllUser';

export default function GratuityListComponent({ isDashBoard }) {
  const { data: allStaffUsers, isLoading } = UseGetAllUsers();
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  // Filter by Name only
  const filteredUsers = useMemo(() => {
    if (!allStaffUsers) return [];
    return allStaffUsers.filter(user =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allStaffUsers, searchTerm]);

  // Export CSV (Name & Gratuity columns)
  const handleExportCSV = () => {
    const headers = 'Name,Gratuity\n';
    const rows = filteredUsers
      .map(
        member =>
          `${member.name || ''},${member.gratuity_fund || ''}`
      )
      .join('\n');

    const csvContent = 'data:text/csv;charset=utf-8,' + headers + rows;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');

    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'gratuity_data.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  if (isLoading) {
    return <DataLoader />;
  }

  return (
    <div className="p-4 min-h-screen bg-white">
      {/* Only show the search and export bar if NOT on the dashboard */}
      {!isDashBoard && (
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          {/* Search by Name */}
          <div className="relative flex-grow ">
            <BsSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search By Name"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none"
            />
          </div>

          {/* Export CSV */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 py-2 px-4 border rounded-xl text-sm"
          >
            <PiExport />
            <span>Export CSV</span>
          </button>
        </div>
      )}

      {/* Table / No Data Section */}
      {filteredUsers.length > 0 ? (
        <div className="border rounded-xl overflow-x-auto">
          <table className="table-auto w-full border-collapse bg-white text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Gratuity</th>
                <th className="px-4 py-2 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user.id} className="border-b last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Image
                        src={user.avatar}
                        alt={user.name}
                        height={32}
                        width={32}
                        className="rounded-full"
                      />
                      <span className="capitalize">{user.name || ''}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {user.gratuity_fund || ''}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => router.push(`/finances/workforce/gratuity/${user.id}`)}
                      className="inline-flex items-center justify-center p-2 border border-gray-300 rounded-md"
                    >
                      <EyeIcon className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="mt-4 text-center text-gray-500 text-lg">
          No Gratuity Data!
        </div>
      )}
    </div>
  );
}
