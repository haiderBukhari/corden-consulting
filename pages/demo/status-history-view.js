import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/layout/layout';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const LOCAL_KEY = 'employeeData';

const StatusHistoryView = () => {
  const router = useRouter();
  const { id } = router.query;
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    if (!id) return;
    const stored = localStorage.getItem(LOCAL_KEY);
    if (stored) {
      try {
        const employees = JSON.parse(stored);
        const found = employees.find(e => String(e.id) === String(id));
        setEmployee(found);
      } catch {
        setEmployee(null);
      }
    }
  }, [id]);

  const handleBack = () => {
    router.push('/demo/status-history');
  };

  if (!employee) {
    return <Layout title="Employment History"><div className="p-8">Employee not found.</div></Layout>;
  }

  return (
    <Layout title={`Employment History - ${employee.name}`} subtitle="View all status changes for this employee">
      <div className="max-w-2xl mx-auto mt-8">
        <div className="mb-4 flex items-center">
          <button
            onClick={handleBack}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Status History
          </button>
        </div>
        <div className="p-8 bg-white rounded-lg shadow">
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-gray-900">{employee.name}</div>
            <div className="text-sm text-gray-600">{employee.jobTitle} | {employee.department}</div>
            <div className="text-xs text-gray-500">Email: {employee.email} | Phone: {employee.phone}</div>
            <div className="text-xs text-gray-500">Hire Date: {employee.hireDate}</div>
            <div className="text-xs text-gray-500">Current Status: <span className="font-semibold">{employee.currentStatus}</span> (since {employee.lastStatusChange})</div>
          </div>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {employee.history && employee.history.length > 0 ? (
              employee.history.map((event, index) => {
                const prev = index > 0 ? employee.history[index - 1] : null;
                return (
                  <div key={event.id || index} className={`border-l-4 pl-4 ${
                    event.status === 'Active' ? 'border-green-400 bg-green-50' :
                    event.status === 'On Leave' ? 'border-yellow-400 bg-yellow-50' :
                    event.status === 'Terminated' ? 'border-red-400 bg-red-50' :
                    'border-gray-400 bg-gray-50'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="text-base font-semibold text-gray-900">{event.status}</h5>
                        <div className="text-xs text-gray-500">Date: {event.date}</div>
                        {prev && (
                          <div className="text-xs text-gray-500">Previous Status: <span className="font-semibold">{prev.status}</span></div>
                        )}
                        <div className="text-xs text-gray-500">Reason: <span className="font-semibold">{event.reason}</span></div>
                        <div className="text-xs text-gray-500">Notes: {event.notes || <span className="italic text-gray-400">None</span>}</div>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-gray-500">No history found for this employee.</div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StatusHistoryView; 