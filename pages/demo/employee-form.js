import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from "../../components/layout/layout";
import { CheckIcon, XMarkIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';

const LOCAL_KEY = 'employeeData';
const defaultFields = {
  name: '',
  email: '',
  jobTitle: '',
  department: '',
  status: 'Active',
  hireDate: '',
  salary: '',
  employmentType: '',
  workLocation: '',
  phone: ''
};

const EmployeeForm = () => {
  const router = useRouter();
  const { mode, id } = router.query;
  const [formData, setFormData] = useState(defaultFields);
  const [userRole, setUserRole] = useState('');
  const isEditMode = mode === 'edit';

  useEffect(() => {
    setFormData(defaultFields);
    const role = localStorage.getItem('role');
    setUserRole(role);
    if (isEditMode && id) {
      let stored = localStorage.getItem(LOCAL_KEY);
      if (stored) {
        try {
          const employees = JSON.parse(stored);
          const emp = employees.find(e => String(e.id) === String(id));
          if (emp) setFormData(emp);
        } catch {}
      }
    }
  }, [id, isEditMode]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let stored = localStorage.getItem(LOCAL_KEY);
    let employees = [];
    if (stored) {
      try {
        employees = JSON.parse(stored);
      } catch {}
    }
    if (isEditMode && id) {
      employees = employees.map(e =>
        String(e.id) === String(id)
          ? { ...e, ...formData }
          : e
      );
    } else {
      const newId = employees.length > 0 ? Math.max(...employees.map(e => Number(e.id))) + 1 : 1;
      employees.push({
        ...formData,
        id: newId
      });
    }
    localStorage.setItem(LOCAL_KEY, JSON.stringify(employees));
    router.push('/demo/manage-employees');
  };

  const handleCancel = () => {
    router.push('/demo/manage-employees');
  };

  return (
    <Layout title={isEditMode ? 'Edit Employee' : 'Add Employee'} subtitle={isEditMode ? 'Update employee details' : 'Add a new employee'}>
      <div className="max-w-2xl mx-auto mt-8">
        <div className="mb-4 flex items-center">
          <button
            onClick={handleCancel}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Employees
          </button>
        </div>
        <div className="p-8 bg-white rounded-lg shadow">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
              <input type="text" required value={formData.name} onChange={e => handleInputChange('name', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <input type="email" required value={formData.email} onChange={e => handleInputChange('email', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Title *</label>
              <input type="text" required value={formData.jobTitle} onChange={e => handleInputChange('jobTitle', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Department *</label>
              <input type="text" required value={formData.department} onChange={e => handleInputChange('department', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select value={formData.status} onChange={e => handleInputChange('status', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2">
                <option>Active</option>
                <option>On Leave</option>
                <option>Terminated</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hire Date *</label>
              <input type="date" required value={formData.hireDate} onChange={e => handleInputChange('hireDate', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Salary</label>
              <input type="text" value={formData.salary} onChange={e => handleInputChange('salary', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Employment Type</label>
              <input type="text" value={formData.employmentType} onChange={e => handleInputChange('employmentType', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Work Location</label>
              <input type="text" value={formData.workLocation} onChange={e => handleInputChange('workLocation', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
              <input type="text" value={formData.phone} onChange={e => handleInputChange('phone', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2" />
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
                {isEditMode ? 'Update Employee' : 'Add Employee'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default EmployeeForm; 