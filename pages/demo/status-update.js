import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/layout/layout';
import { ArrowLeftIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';

const LOCAL_KEY = 'employeeData';
const dummyData = {
  statusOptions: [
    "Active",
    "On Leave",
    "Suspended",
    "Terminated",
    "Retired"
  ]
};

const StatusUpdate = () => {
  const router = useRouter();
  const { id } = router.query;
  const [employee, setEmployee] = useState(null);
  const [form, setForm] = useState({
    newStatus: '',
    effectiveDate: '',
    reason: '',
    notes: ''
  });

  useEffect(() => {
    if (!id) return;
    // Try to load from localStorage first
    let found = null;
    const stored = localStorage.getItem(LOCAL_KEY);
    if (stored) {
      try {
        const employees = JSON.parse(stored);
        found = employees.find(e => String(e.id) === String(id));
      } catch {}
    }
    setEmployee(found);
    if (found) {
      setForm({
        newStatus: found.currentStatus,
        effectiveDate: new Date().toISOString().split('T')[0],
        reason: found.statusReason || '',
        notes: ''
      });
    }
  }, [id]);

  const handleInputChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Update in localStorage
    const stored = localStorage.getItem(LOCAL_KEY);
    if (stored) {
      try {
        let employees = JSON.parse(stored);
        employees = employees.map(e => {
          if (String(e.id) === String(id)) {
            // Add to history if exists
            const newHistory = e.history ? [...e.history] : [];
            newHistory.push({
              id: newHistory.length + 1,
              date: form.effectiveDate,
              status: form.newStatus,
              reason: form.reason,
              notes: form.notes
            });
            return {
              ...e,
              currentStatus: form.newStatus,
              lastStatusChange: form.effectiveDate,
              statusReason: form.reason,
              history: newHistory
            };
          }
          return e;
        });
        localStorage.setItem(LOCAL_KEY, JSON.stringify(employees));
      } catch {}
    }
    router.push('/demo/status-history');
  };

  const handleCancel = () => {
    router.push('/demo/status-history');
  };

  if (!employee) {
    return <Layout title="Update Status"><div className="p-8 text-red-600 font-semibold">Employee not found. Please check the employee list or refresh the page to re-initialize data.</div></Layout>;
  }

  return (
    <Layout title={`Update Status - ${employee.name}`} subtitle="Update employee status and create a new history line">
      <div className="max-w-2xl mx-auto mt-8">
        <div className="mb-4 flex items-center">
          <button
            onClick={handleCancel}
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
            <div className="text-xs text-gray-500">Current Status: <span className="font-semibold">{employee.currentStatus}</span> (since {employee.lastStatusChange})</div>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700">New Status</label>
              <select 
                value={form.newStatus}
                onChange={e => handleInputChange('newStatus', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
              >
                {dummyData.statusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Effective Date</label>
              <input 
                type="date" 
                value={form.effectiveDate}
                onChange={e => handleInputChange('effectiveDate', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Reason</label>
              <input 
                type="text" 
                value={form.reason}
                onChange={e => handleInputChange('reason', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" 
                placeholder="e.g., Annual Leave, Promotion, etc."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Notes/Comments</label>
              <textarea 
                value={form.notes}
                onChange={e => handleInputChange('notes', e.target.value)}
                rows={3}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2" 
                placeholder="Additional details about the status change..."
              />
            </div>
            <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center"
              >
                <XMarkIcon className="h-4 w-4 mr-2" />
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-[#009D9D] text-white rounded-md hover:bg-[#007a7a] flex items-center"
              >
                <CheckIcon className="h-4 w-4 mr-2" />
                Update Status
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default StatusUpdate; 