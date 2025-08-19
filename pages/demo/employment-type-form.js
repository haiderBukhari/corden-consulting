import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from "../../components/layout/layout";
import { 
  CheckIcon, 
  XMarkIcon, 
  ArrowLeftIcon, 
  TrashIcon,
  AcademicCapIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

const LOCAL_KEY = 'employmentTypesData';

const EmploymentTypeForm = () => {
  const router = useRouter();
  const { mode, id } = router.query;
  const isEdit = mode === 'edit';
  const [userRole, setUserRole] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true,
    // Enhanced fields
    payStructure: 'monthly_salary',
    benefitsEligible: true,
    leavePolicyLink: '',
    workingHoursStandard: 40,
    endDateRequired: false,
    conversionAllowed: true,
    contractTemplate: '',
    probationPeriod: 90,
    noticePeriod: 30,
    regulatoryCategory: 'W2',
    taxableCategory: 'full_taxable',
    timeTrackingRequired: false,
    attendanceRequired: true,
    accessLevel: 'full_access',
    partTimeBanding: null,
    internshipType: null,
    subTypes: [],
    colorTag: 'blue',
    payPolicyLink: '',
    benefitsPolicyLink: '',
    overtimeEligible: true,
    holidayPayEligible: true,
    bonusEligible: true,
    insuranceEligible: true,
    retirementEligible: true,
    conversionWorkflow: '',
    autoAssignmentRules: true,
    complianceNotes: ''
  });

  // Load user role
  useEffect(() => {
    const role = localStorage.getItem('role');
    setUserRole(role);
  }, []);

  // Load existing employment type data for editing
  useEffect(() => {
    if (isEdit && id) {
      const stored = localStorage.getItem(LOCAL_KEY);
      if (stored) {
        const types = JSON.parse(stored);
        const type = types.find(t => t.id === parseInt(id));
        if (type) {
          setFormData({
            name: type.name || '',
            description: type.description || '',
            isActive: type.isActive !== undefined ? type.isActive : true,
            payStructure: type.payStructure || 'monthly_salary',
            benefitsEligible: type.benefitsEligible !== undefined ? type.benefitsEligible : true,
            leavePolicyLink: type.leavePolicyLink || '',
            workingHoursStandard: type.workingHoursStandard || 40,
            endDateRequired: type.endDateRequired || false,
            conversionAllowed: type.conversionAllowed !== undefined ? type.conversionAllowed : true,
            contractTemplate: type.contractTemplate || '',
            probationPeriod: type.probationPeriod || 90,
            noticePeriod: type.noticePeriod || 30,
            regulatoryCategory: type.regulatoryCategory || 'W2',
            taxableCategory: type.taxableCategory || 'full_taxable',
            timeTrackingRequired: type.timeTrackingRequired || false,
            attendanceRequired: type.attendanceRequired !== undefined ? type.attendanceRequired : true,
            accessLevel: type.accessLevel || 'full_access',
            partTimeBanding: type.partTimeBanding || null,
            internshipType: type.internshipType || null,
            subTypes: type.subTypes || [],
            colorTag: type.colorTag || 'blue',
            payPolicyLink: type.payPolicyLink || '',
            benefitsPolicyLink: type.benefitsPolicyLink || '',
            overtimeEligible: type.overtimeEligible !== undefined ? type.overtimeEligible : true,
            holidayPayEligible: type.holidayPayEligible !== undefined ? type.holidayPayEligible : true,
            bonusEligible: type.bonusEligible !== undefined ? type.bonusEligible : true,
            insuranceEligible: type.insuranceEligible !== undefined ? type.insuranceEligible : true,
            retirementEligible: type.retirementEligible !== undefined ? type.retirementEligible : true,
            conversionWorkflow: type.conversionWorkflow || '',
            autoAssignmentRules: type.autoAssignmentRules !== undefined ? type.autoAssignmentRules : true,
            complianceNotes: type.complianceNotes || ''
          });
        }
      }
    }
  }, [isEdit, id]);

  if (userRole !== 'business_manager') {
    return (
      <Layout title={isEdit ? 'Edit Employment Type' : 'Add Employment Type'} subtitle={'Not Authorized'}>
        <div className="max-w-2xl mx-auto mt-12 p-8 bg-white rounded-lg shadow text-center">
          <h2 className="text-xl font-bold mb-4">Not Authorized</h2>
          <p className="text-gray-700 mb-4">Only Business Configuration Managers can {isEdit ? 'edit' : 'add'} employment types.</p>
          <button
            onClick={() => router.push('/demo/employment-types')}
            className="mt-4 px-6 py-2 bg-[#009D9D] text-white rounded-md hover:bg-[#007a7a]"
          >
            Back to Employment Types
          </button>
        </div>
      </Layout>
    );
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubTypeChange = (index, value) => {
    const updatedSubTypes = [...formData.subTypes];
    updatedSubTypes[index] = value;
    setFormData({ ...formData, subTypes: updatedSubTypes });
  };

  const addSubType = () => {
    setFormData({ ...formData, subTypes: [...formData.subTypes, ''] });
  };

  const removeSubType = (index) => {
    const updatedSubTypes = formData.subTypes.filter((_, i) => i !== index);
    setFormData({ ...formData, subTypes: updatedSubTypes });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let stored = localStorage.getItem(LOCAL_KEY);
    let types = [];
    if (stored) {
      try {
        types = JSON.parse(stored);
      } catch {}
    }

    if (isEdit && id) {
      // Update existing
      types = types.map(t =>
        t.id === parseInt(id)
          ? { 
              ...t, 
              ...formData, 
              updatedAt: new Date().toISOString().slice(0, 10) 
            }
          : t
      );
    } else {
      // Add new
      const newId = types.length > 0 ? Math.max(...types.map(t => Number(t.id))) + 1 : 1;
      types.push({
        ...formData,
        id: newId,
        createdAt: new Date().toISOString().slice(0, 10),
        updatedAt: new Date().toISOString().slice(0, 10),
        employeeCount: 0
      });
    }
    
    localStorage.setItem(LOCAL_KEY, JSON.stringify(types));
    router.push('/demo/employment-types');
  };

  const handleCancel = () => {
    router.push('/demo/employment-types');
  };

  return (
    <Layout title={isEdit ? 'Edit Employment Type' : 'Add Employment Type'} subtitle={isEdit ? 'Update employment type details' : 'Create a new employment type'}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => router.push('/demo/employment-types')}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Employment Types
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="e.g., Full-Time, Part-Time, Contract"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color Tag</label>
                <select
                  value={formData.colorTag}
                  onChange={(e) => setFormData({...formData, colorTag: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                >
                  <option value="blue">Blue</option>
                  <option value="purple">Purple</option>
                  <option value="orange">Orange</option>
                  <option value="yellow">Yellow</option>
                  <option value="green">Green</option>
                  <option value="teal">Teal</option>
                  <option value="indigo">Indigo</option>
                  <option value="pink">Pink</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Describe this employment type and its characteristics"
                />
              </div>
            </div>
          </div>

          {/* Pay & Benefits Configuration */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Pay & Benefits Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pay Structure</label>
                  <select
                    value={formData.payStructure}
                    onChange={(e) => setFormData({...formData, payStructure: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="monthly_salary">Monthly Salary</option>
                    <option value="hourly_wage">Hourly Wage</option>
                    <option value="project_based">Project Based</option>
                    <option value="stipend">Stipend</option>
                    <option value="hourly_billing">Hourly Billing</option>
                    <option value="retainer_plus_bonus">Retainer + Bonus</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Working Hours Standard</label>
                  <input
                    type="number"
                    min="0"
                    max="168"
                    value={formData.workingHoursStandard}
                    onChange={(e) => setFormData({...formData, workingHoursStandard: parseInt(e.target.value) || 0})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="40"
                  />
                  <p className="mt-1 text-xs text-gray-500">Hours per week (0 for flexible)</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pay Policy Link</label>
                  <input
                    type="text"
                    value={formData.payPolicyLink}
                    onChange={(e) => setFormData({...formData, payPolicyLink: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="e.g., standard_pay_policy"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.benefitsEligible}
                      onChange={(e) => setFormData({...formData, benefitsEligible: e.target.checked})}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Benefits Eligible</span>
                  </label>
                </div>
                {formData.benefitsEligible && (
                  <>
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.insuranceEligible}
                          onChange={(e) => setFormData({...formData, insuranceEligible: e.target.checked})}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Insurance Eligible</span>
                      </label>
                    </div>
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.retirementEligible}
                          onChange={(e) => setFormData({...formData, retirementEligible: e.target.checked})}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="ml-2 text-sm text-gray-700">Retirement Eligible</span>
                      </label>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Benefits Policy Link</label>
                      <input
                        type="text"
                        value={formData.benefitsPolicyLink}
                        onChange={(e) => setFormData({...formData, benefitsPolicyLink: e.target.value})}
                        className="w-full border border-gray-300 rounded-md px-3 py-2"
                        placeholder="e.g., comprehensive_benefits"
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Compliance & Legal */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Compliance & Legal</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Regulatory Category</label>
                  <select
                    value={formData.regulatoryCategory}
                    onChange={(e) => setFormData({...formData, regulatoryCategory: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="W2">W2</option>
                    <option value="1099">1099</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Taxable Category</label>
                  <select
                    value={formData.taxableCategory}
                    onChange={(e) => setFormData({...formData, taxableCategory: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="full_taxable">Full Taxable</option>
                    <option value="reduced_taxable">Reduced Taxable</option>
                    <option value="self_employed">Self Employed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contract Template</label>
                  <input
                    type="text"
                    value={formData.contractTemplate}
                    onChange={(e) => setFormData({...formData, contractTemplate: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="e.g., full_time_contract.pdf"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Probation Period (days)</label>
                  <input
                    type="number"
                    min="0"
                    max="365"
                    value={formData.probationPeriod}
                    onChange={(e) => setFormData({...formData, probationPeriod: parseInt(e.target.value) || 0})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="90"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notice Period (days)</label>
                  <input
                    type="number"
                    min="0"
                    max="90"
                    value={formData.noticePeriod}
                    onChange={(e) => setFormData({...formData, noticePeriod: parseInt(e.target.value) || 0})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="30"
                  />
                </div>
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.endDateRequired}
                      onChange={(e) => setFormData({...formData, endDateRequired: e.target.checked})}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">End Date Required</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Work & Access Settings */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Work & Access Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Access Level</label>
                  <select
                    value={formData.accessLevel}
                    onChange={(e) => setFormData({...formData, accessLevel: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                  >
                    <option value="full_access">Full Access</option>
                    <option value="limited_access">Limited Access</option>
                    <option value="project_access">Project Access</option>
                    <option value="temporary_access">Temporary Access</option>
                    <option value="apprentice_access">Apprentice Access</option>
                    <option value="intern_access">Intern Access</option>
                    <option value="freelancer_access">Freelancer Access</option>
                    <option value="consultant_access">Consultant Access</option>
                  </select>
                </div>
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.timeTrackingRequired}
                      onChange={(e) => setFormData({...formData, timeTrackingRequired: e.target.checked})}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Time Tracking Required</span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.attendanceRequired}
                      onChange={(e) => setFormData({...formData, attendanceRequired: e.target.checked})}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Attendance Required</span>
                  </label>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.overtimeEligible}
                      onChange={(e) => setFormData({...formData, overtimeEligible: e.target.checked})}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Overtime Eligible</span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.holidayPayEligible}
                      onChange={(e) => setFormData({...formData, holidayPayEligible: e.target.checked})}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Holiday Pay Eligible</span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.bonusEligible}
                      onChange={(e) => setFormData({...formData, bonusEligible: e.target.checked})}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Bonus Eligible</span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.conversionAllowed}
                      onChange={(e) => setFormData({...formData, conversionAllowed: e.target.checked})}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Conversion Allowed</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Sub-types Configuration */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Sub-types Configuration</h3>
            <p className="text-sm text-gray-600 mb-4">Define sub-categories for this employment type (optional)</p>
            <div className="space-y-4">
              {formData.subTypes.map((subType, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <input
                    type="text"
                    value={subType}
                    onChange={(e) => handleSubTypeChange(index, e.target.value)}
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2"
                    placeholder="e.g., Regular, Seasonal, Project-based"
                  />
                  <button
                    type="button"
                    onClick={() => removeSubType(index)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addSubType}
                className="px-4 py-2 bg-[#009D9D] text-white rounded-md hover:bg-[#007a7a] text-sm flex items-center"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Sub-type
              </button>
            </div>
          </div>

          {/* Advanced Settings */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Advanced Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Leave Policy Link</label>
                  <input
                    type="text"
                    value={formData.leavePolicyLink}
                    onChange={(e) => setFormData({...formData, leavePolicyLink: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="e.g., standard_time_off"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Conversion Workflow</label>
                  <input
                    type="text"
                    value={formData.conversionWorkflow}
                    onChange={(e) => setFormData({...formData, conversionWorkflow: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="e.g., intern_to_fulltime"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.autoAssignmentRules}
                      onChange={(e) => setFormData({...formData, autoAssignmentRules: e.target.checked})}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Auto Assignment Rules</span>
                  </label>
                </div>
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.isActive}
                      onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Active</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Compliance Notes</label>
              <textarea
                rows={3}
                value={formData.complianceNotes}
                onChange={(e) => setFormData({...formData, complianceNotes: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Additional compliance or legal notes..."
              />
            </div>
          </div>

          {/* Form Actions */}
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
              {isEdit ? 'Save Changes' : 'Add Type'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default EmploymentTypeForm; 