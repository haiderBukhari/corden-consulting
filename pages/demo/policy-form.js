import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from "../../components/layout/layout";
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const LOCAL_KEY = 'policyConfigData';

const defaultFields = {
  timeOff: {
    name: '',
    description: '',
    daysPerYear: '',
    accrualMethod: 'fixed',
    companyYearStart: '2024-07-01',
    companyYearEnd: '2025-06-30',
    carryForwardDays: 0,
    eligibilityCriteria: 'staff',
    probationMonths: 0,
    approvalWorkflow: 'single',
    maxConsecutiveDays: 0,
    advanceNoticeDays: 0,
    // Enhanced leave type configuration
    leaveTypeConfig: {
      annual: { enabled: true, days: 20, description: 'Annual Leave' },
      sick: { enabled: true, days: 10, description: 'Sick Leave' },
      personal: { enabled: true, days: 5, description: 'Personal Leave' },
      maternity: { enabled: false, days: 90, description: 'Maternity Leave' },
      paternity: { enabled: false, days: 14, description: 'Paternity Leave' },
      bereavement: { enabled: false, days: 3, description: 'Bereavement Leave' },
      other: { enabled: false, days: 0, description: '', customName: '' }
    },
    blackoutPeriods: [],
    notifications: {
      type: 'all',
      details: {
        email: true,
        sms: false,
        inApp: true
      }
    },
    attachmentRequired: false,
    attachmentConfig: {
      annual: false,
      sick: true,
      personal: false,
      maternity: true,
      paternity: false,
      bereavement: false,
      other: false
    },
    departmentOverridesLeaves: [],
    autoApprovalDays: 0,
    customFields: [],
    policyHistory: [],
    linkedPolicies: [],
    advancedRules: [],
    status: 'Active',
  },
  overtime: {
    name: '',
    description: '',
    rate: '',
    maxHours: '',
    eligibilityCriteria: 'all',
    overtimeType: 'regular',
    dailyLimit: 0,
    weeklyCap: 0,
    monthlyCap: 0,
    minimumThreshold: 0,
    roundingLogic: '15min',
    approvalRequirement: 'auto',
    overtimeWindow: 'afterShift',
    breakDeduction: false,
    tieredRates: [],
    dayTypeRates: {
      weekday: '',
      weekend: '',
      holiday: ''
    },
    shiftBased: false,
    linkedShifts: [],
    splitShiftRules: false,
    linkedPolicies: [],
    policyHistory: [],
    customFields: [],
    complianceRules: [],
    status: 'Active',
  },
  flexibleWork: {
    name: '',
    description: '',
    workType: '',
    eligibilityCriteria: 'all',
    workingHoursRange: {
      startTime: '09:00',
      endTime: '17:00',
      coreHoursStart: '11:00',
      coreHoursEnd: '15:00'
    },
    minimumOfficeDays: 0,
    officeVisitPolicy: 'none',
    approvalWorkflow: 'manager',
    trialPeriod: 0,
    workLocationType: 'hybrid',
    timeTrackingRequirement: 'online_offline',
    policyTags: [],
    policyHistory: [],
    customFields: [],
    status: 'Active',
  },
  bankHoliday: {
    name: '',
    description: '',
    holidays: '',
    country: 'UK',
    region: '',
    holidayType: 'national',
    observedOn: 'weekday',
    locationBased: false,
    assignedLocations: [],
    roleBasedVisibility: false,
    eligibleRoles: [],
    autoMarkAttendance: true,
    impactOnLeaveBalance: 'exclude',
    shiftOverride: false,
    holidayList: [],
    calendarView: false,
    notificationEnabled: false,
    notificationDays: 7,
    autoAssignNewHires: true,
    policyHistory: [],
    customFields: [],
    status: 'Active',
  },
  pay: {
    name: '',
    description: '',
    payFrequency: 'monthly',
    currency: 'GBP',
    paymentMethod: 'bank',
    taxDeductionRule: 'gross',
    benefitsInclusion: 'separate',
    deductionsPolicy: 'standard',
    baseSalaryRange: {
      min: 0,
      max: 0
    },
    eligibilityCriteria: 'all',
    bonusCommissionFormula: '',
    probationPeriodPayRule: 'full',
    managementAllowances: false,
    allowances: [],
    autoDeductUnpaidLeave: true,
    prorationRules: 'standard',
    payslipTemplate: 'default',
    finalSettlementHandling: 'standard',
    endOfServiceBenefit: false,
    assignedEmployees: [],
    policyHistory: [],
    customFields: [],
    status: 'Active',
  }
};

const typeLabels = {
  timeOff: 'Time Off Policy',
  overtime: 'Overtime Policy',
  flexibleWork: 'Flexible Work Policy',
  bankHoliday: 'Public Holiday Policy',
  pay: 'Pay Policy',
};

const PolicyForm = () => {
  const router = useRouter();
  const { mode, type, id } = router.query;
  const [formData, setFormData] = useState(defaultFields[type] || {});
  const [userRole, setUserRole] = useState('');
  const isEditMode = mode === 'edit';

  useEffect(() => {
    setFormData(defaultFields[type] || {});
    const role = localStorage.getItem('role');
    setUserRole(role);
    if (isEditMode && type && id) {
      let stored = localStorage.getItem(LOCAL_KEY);
      if (stored) {
        try {
          const policies = JSON.parse(stored);
          const arr = policies[`${type}Policies`] || [];
          const policy = arr.find(p => String(p.id) === String(id));
          if (policy) {
            // Ensure all fields are initialized with defaults
            const policyWithDefaults = {
              ...defaultFields[type],
              ...policy,
              
              // Migrate holiday structure for bankHoliday policies
              ...(type === 'bankHoliday' && {
                holidayList: (policy.holidayList || []).map(holiday => ({
                  startDate: holiday.startDate || holiday.date || '',
                  endDate: holiday.endDate || holiday.date || '',
                  title: holiday.title || '',
                  type: holiday.type || 'national',
                  mandatory: holiday.mandatory !== undefined ? holiday.mandatory : true
                }))
              }),
              // Time Off specific fields
              blackoutPeriods: policy.blackoutPeriods || [],
              departmentOverridesLeaves: policy.departmentOverridesLeaves || [],
              customFields: policy.customFields || [],
              policyHistory: policy.policyHistory || [],
              linkedPolicies: policy.linkedPolicies || [],
              advancedRules: policy.advancedRules || [],
              
              // Enhanced leave type configuration
              leaveTypeConfig: policy.leaveTypeConfig || defaultFields[type].leaveTypeConfig || {
                annual: { enabled: true, days: 20, description: 'Annual Leave' },
                sick: { enabled: true, days: 10, description: 'Sick Leave' },
                personal: { enabled: true, days: 5, description: 'Personal Leave' },
                maternity: { enabled: false, days: 90, description: 'Maternity Leave' },
                paternity: { enabled: false, days: 14, description: 'Paternity Leave' },
                bereavement: { enabled: false, days: 3, description: 'Bereavement Leave' },
                other: { enabled: false, days: 0, description: '', customName: '' }
              },
              
              notifications: policy.notifications || {
                type: 'all',
                details: {
                  email: true,
                  sms: false,
                  inApp: true
                }
              },
              attachmentRequired: policy.attachmentRequired || false,
              attachmentConfig: policy.attachmentConfig || {
                annual: false,
                sick: true,
                personal: false,
                maternity: true,
                paternity: false,
                bereavement: false,
                other: false
              },
              autoApprovalDays: policy.autoApprovalDays || 0,
              
              // Overtime specific fields
              eligibilityCriteria: policy.eligibilityCriteria || 'all',
              overtimeType: policy.overtimeType || 'regular',
              dailyLimit: policy.dailyLimit || 0,
              weeklyCap: policy.weeklyCap || 0,
              monthlyCap: policy.monthlyCap || 0,
              minimumThreshold: policy.minimumThreshold || 0,
              roundingLogic: policy.roundingLogic || '15min',
              approvalRequirement: policy.approvalRequirement || 'auto',
              overtimeWindow: policy.overtimeWindow || 'afterShift',
              breakDeduction: policy.breakDeduction || false,
              tieredRates: policy.tieredRates || [],
              dayTypeRates: policy.dayTypeRates || { weekday: '', weekend: '', holiday: '' },
              shiftBased: policy.shiftBased || false,
              linkedShifts: policy.linkedShifts || [],
              splitShiftRules: policy.splitShiftRules || false,
              complianceRules: policy.complianceRules || [],
              
              // Flexible Work specific fields
              workingHoursRange: policy.workingHoursRange || { startTime: '09:00', endTime: '17:00', coreHoursStart: '11:00', coreHoursEnd: '15:00' },
              minimumOfficeDays: policy.minimumOfficeDays || 0,
              officeVisitPolicy: policy.officeVisitPolicy || 'none',
              trialPeriod: policy.trialPeriod || 0,
              workLocationType: policy.workLocationType || 'hybrid',
              timeTrackingRequirement: policy.timeTrackingRequirement || 'online_offline',
              policyTags: policy.policyTags || [],
            };
            setFormData(policyWithDefaults);
          }
        } catch {}
      }
    }
  }, [type, id, isEditMode]);

  if (!type || !defaultFields[type]) {
    return <Layout title="Invalid Policy Type"><div className="p-8">Invalid policy type.</div></Layout>;
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Enhanced leave type configuration handler
  const handleLeaveTypeConfigChange = (leaveType, field, value) => {
    setFormData(prev => {
      const newConfig = { ...prev.leaveTypeConfig };
      newConfig[leaveType] = { ...newConfig[leaveType], [field]: value };
      
      // Update leaveTypes array based on enabled status
      const enabledTypes = Object.keys(newConfig).filter(type => newConfig[type].enabled);
      
      return { 
        ...prev, 
        leaveTypeConfig: newConfig,
        leaveTypes: enabledTypes
      };
    });
  };

  // Calculate total days from leave type configuration
  const calculateTotalDays = (config) => {
    return Object.values(config || {}).reduce((total, type) => {
      return total + (type.enabled ? (parseInt(type.days) || 0) : 0);
    }, 0);
  };

  // Enhanced department override handler with individual leave type settings
  const handleDepartmentOverrideChange = (index, field, value) => {
    setFormData(prev => {
      const newOverrides = [...(prev.departmentOverridesLeaves || [])];
      newOverrides[index] = { ...newOverrides[index], [field]: value };
      
      // If updating leave type config, recalculate total
      if (field === 'leaveTypeConfig') {
        newOverrides[index].totalDays = calculateTotalDays(value);
      }
      
      return { ...prev, departmentOverridesLeaves: newOverrides };
    });
  };

  const addDepartmentOverride = () => {
    setFormData(prev => ({
      ...prev,
      departmentOverridesLeaves: [...(prev.departmentOverridesLeaves || []), { 
        departmentName: '', 
        maxDays: '',
        leaveTypeConfig: { ...prev.leaveTypeConfig }, // Copy current leave type config
        totalDays: calculateTotalDays(prev.leaveTypeConfig)
      }]
    }));
  };

  const removeDepartmentOverride = (index) => {
    setFormData(prev => ({
      ...prev,
      departmentOverridesLeaves: prev.departmentOverridesLeaves.filter((_, i) => i !== index)
    }));
  };

  const handleCustomFieldChange = (index, field, value) => {
    setFormData(prev => {
      const newCustomFields = [...(prev.customFields || [])];
      newCustomFields[index] = { ...newCustomFields[index], [field]: value };
      return { ...prev, customFields: newCustomFields };
    });
  };

  const addCustomField = () => {
    setFormData(prev => ({
      ...prev,
      customFields: [...(prev.customFields || []), { name: '', type: 'text' }]
    }));
  };

  const removeCustomField = (index) => {
    setFormData(prev => ({
      ...prev,
      customFields: prev.customFields.filter((_, i) => i !== index)
    }));
  };

  const handleTieredRateChange = (index, field, value) => {
    setFormData(prev => {
      const newTieredRates = [...(prev.tieredRates || [])];
      newTieredRates[index] = { ...newTieredRates[index], [field]: value };
      return { ...prev, tieredRates: newTieredRates };
    });
  };

  const addTieredRate = () => {
    setFormData(prev => ({
      ...prev,
      tieredRates: [...(prev.tieredRates || []), { hours: '', rate: '' }]
    }));
  };

  const removeTieredRate = (index) => {
    setFormData(prev => ({
      ...prev,
      tieredRates: prev.tieredRates.filter((_, i) => i !== index)
    }));
  };

  const handleGeoRestrictionChange = (index, field, value) => {
    setFormData(prev => {
      const newGeoRestrictions = [...(prev.geoRestrictions || [])];
      newGeoRestrictions[index] = { ...newGeoRestrictions[index], [field]: value };
      return { ...prev, geoRestrictions: newGeoRestrictions };
    });
  };

  const addGeoRestriction = () => {
    setFormData(prev => ({
      ...prev,
      geoRestrictions: [...(prev.geoRestrictions || []), { country: '', reason: '' }]
    }));
  };

  const removeGeoRestriction = (index) => {
    setFormData(prev => ({
      ...prev,
      geoRestrictions: prev.geoRestrictions.filter((_, i) => i !== index)
    }));
  };

  const handlePolicyTagChange = (index, value) => {
    setFormData(prev => {
      const newPolicyTags = [...(prev.policyTags || [])];
      newPolicyTags[index] = value;
      return { ...prev, policyTags: newPolicyTags };
    });
  };

  const addPolicyTag = () => {
    setFormData(prev => ({
      ...prev,
      policyTags: [...(prev.policyTags || []), '']
    }));
  };

  const removePolicyTag = (index) => {
    setFormData(prev => ({
      ...prev,
      policyTags: prev.policyTags.filter((_, i) => i !== index)
    }));
  };

  const handleAssignedEmployeeChange = (index, value) => {
    setFormData(prev => {
      const newAssignedEmployees = [...(prev.assignedEmployees || [])];
      newAssignedEmployees[index] = value;
      return { ...prev, assignedEmployees: newAssignedEmployees };
    });
  };

  const addAssignedEmployee = () => {
    setFormData(prev => ({
      ...prev,
      assignedEmployees: [...(prev.assignedEmployees || []), '']
    }));
  };

  const removeAssignedEmployee = (index) => {
    setFormData(prev => ({
      ...prev,
      assignedEmployees: prev.assignedEmployees.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let stored = localStorage.getItem(LOCAL_KEY);
    let policies = {};
    if (stored) {
      try {
        policies = JSON.parse(stored);
      } catch {}
    }
    const arr = policies[`${type}Policies`] || [];
    
          // Ensure all fields are properly structured for Time Off policies
      const policyData = { ...formData };
      if (type === 'timeOff') {
        // Ensure all arrays and objects are properly initialized
        policyData.blackoutPeriods = formData.blackoutPeriods || [];
        policyData.departmentOverridesLeaves = formData.departmentOverridesLeaves || [];
        policyData.customFields = formData.customFields || [];
        policyData.policyHistory = formData.policyHistory || [];
        policyData.linkedPolicies = formData.linkedPolicies || [];
        policyData.advancedRules = formData.advancedRules || [];
        
        // Ensure leaveTypeConfig is properly structured
        policyData.leaveTypeConfig = formData.leaveTypeConfig || {
          annual: { enabled: true, days: 20, description: 'Annual Leave' },
          sick: { enabled: true, days: 10, description: 'Sick Leave' },
          personal: { enabled: true, days: 5, description: 'Personal Leave' },
          maternity: { enabled: false, days: 90, description: 'Maternity Leave' },
          paternity: { enabled: false, days: 14, description: 'Paternity Leave' },
          bereavement: { enabled: false, days: 3, description: 'Bereavement Leave' },
          other: { enabled: false, days: 0, description: '', customName: '' }
        };
        
        // Calculate total days from leave type configuration
        policyData.daysPerYear = calculateTotalDays(policyData.leaveTypeConfig);
        
        policyData.notifications = formData.notifications || {
          type: 'all',
          details: {
            email: true,
            sms: false,
            inApp: true
          }
        };
        policyData.attachmentRequired = formData.attachmentRequired || false;
        policyData.attachmentConfig = formData.attachmentConfig || {
          annual: false,
          sick: true,
          personal: false,
          maternity: true,
          paternity: false,
          bereavement: false,
          other: false
        };
        policyData.autoApprovalDays = formData.autoApprovalDays || 0;
    } else if (type === 'overtime') {
      // Ensure all arrays and objects are properly initialized for overtime
      policyData.tieredRates = formData.tieredRates || [];
      policyData.dayTypeRates = formData.dayTypeRates || { weekday: '', weekend: '', holiday: '' };
      policyData.linkedShifts = formData.linkedShifts || [];
      policyData.linkedPolicies = formData.linkedPolicies || [];
      policyData.policyHistory = formData.policyHistory || [];
      policyData.customFields = formData.customFields || [];
      policyData.complianceRules = formData.complianceRules || [];
      policyData.eligibilityCriteria = formData.eligibilityCriteria || 'all';
      policyData.overtimeType = formData.overtimeType || 'regular';
      policyData.dailyLimit = formData.dailyLimit || 0;
      policyData.weeklyCap = formData.weeklyCap || 0;
      policyData.monthlyCap = formData.monthlyCap || 0;
      policyData.minimumThreshold = formData.minimumThreshold || 0;
      policyData.roundingLogic = formData.roundingLogic || '15min';
      policyData.approvalRequirement = formData.approvalRequirement || 'auto';
      policyData.overtimeWindow = formData.overtimeWindow || 'afterShift';
      policyData.breakDeduction = formData.breakDeduction || false;
      policyData.shiftBased = formData.shiftBased || false;
      policyData.splitShiftRules = formData.splitShiftRules || false;
    } else if (type === 'flexibleWork') {
      // Ensure all arrays and objects are properly initialized for flexible work
      policyData.eligibilityCriteria = formData.eligibilityCriteria || 'all';
      policyData.workingHoursRange = formData.workingHoursRange || { startTime: '09:00', endTime: '17:00', coreHoursStart: '11:00', coreHoursEnd: '15:00' };
      policyData.minimumOfficeDays = formData.minimumOfficeDays || 0;
      policyData.officeVisitPolicy = formData.officeVisitPolicy || 'none';
      policyData.approvalWorkflow = formData.approvalWorkflow || 'manager';
      policyData.trialPeriod = formData.trialPeriod || 0;
      policyData.workLocationType = formData.workLocationType || 'hybrid';
      policyData.timeTrackingRequirement = formData.timeTrackingRequirement || 'online_offline';
      policyData.policyTags = formData.policyTags || [];
      policyData.policyHistory = formData.policyHistory || [];
      policyData.customFields = formData.customFields || [];
    }
    
    if (isEditMode && id) {
      // Update
      policies[`${type}Policies`] = arr.map(p =>
        String(p.id) === String(id)
          ? { ...p, ...policyData, updatedAt: new Date().toISOString().slice(0, 10) }
          : p
      );
    } else {
      // Add
      const newId = arr.length > 0 ? Math.max(...arr.map(p => Number(p.id))) + 1 : 1;
      policies[`${type}Policies`] = [
        ...arr,
        {
          ...policyData,
          id: newId,
          createdAt: new Date().toISOString().slice(0, 10),
          updatedAt: new Date().toISOString().slice(0, 10),
        }
      ];
    }
    localStorage.setItem(LOCAL_KEY, JSON.stringify(policies));
    router.push('/demo/policy-configuration');
  };

  const handleCancel = () => {
    router.push('/demo/policy-configuration');
  };

  // Helper functions for better UX
  const getAccrualMethodDescription = (method) => {
    const descriptions = {
      fixed: "All days available at the start of the year",
      monthly: "Days accrue monthly (e.g., 2.08 days per month for 25 days/year)",
      hourly: "Accrual based on hours worked",
      anniversary: "Days reset on employee's work anniversary"
    };
    return descriptions[method] || "";
  };

  const getLeaveYearDescription = (type) => {
    const descriptions = {
      calendar: "January 1st to December 31st",
      fiscal: "Based on company's fiscal year",
      anniversary: "Based on employee's hire date"
    };
    return descriptions[type] || "";
  };

  const getApprovalWorkflowDescription = (workflow) => {
    const descriptions = {
      single: "Direct manager approval only",
      dual: "Manager approval, then HR review",
      multi: "Manager → HR → Director approval chain",
      auto: "Automatic approval for eligible requests"
    };
    return descriptions[workflow] || "";
  };

  // Render fields based on type
  const renderFields = () => {
    switch (type) {
      case 'timeOff':
        return <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Policy Name *</label>
            <input type="text" required value={formData.name} onChange={e => handleInputChange('name', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea rows={2} value={formData.description} onChange={e => handleInputChange('description', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2" />
          </div>
          
          {/* Enhanced Leave Configuration */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Leave Configuration</h3>
            
            {/* Individual Leave Type Configuration */}
            <div className="mb-6">
              <h4 className="text-md font-medium text-gray-800 mb-3">Individual Leave Types</h4>
              <div className="space-y-4">
                {Object.entries(formData.leaveTypeConfig || {}).map(([leaveType, config]) => (
                  <div key={leaveType} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={config.enabled}
                          onChange={(e) => handleLeaveTypeConfigChange(leaveType, 'enabled', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm font-medium text-gray-700 capitalize">
                          {leaveType === 'other' ? (config.customName || 'Other') : leaveType}
                        </span>
                      </label>
                    </div>
                    
                    {config.enabled && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {leaveType === 'other' && (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Custom Leave Name</label>
                            <input
                              type="text"
                              value={config.customName || ''}
                              onChange={(e) => handleLeaveTypeConfigChange(leaveType, 'customName', e.target.value)}
                              className="w-full border border-gray-300 rounded-md px-3 py-2"
                              placeholder="e.g., Study Leave, Sabbatical"
                            />
                          </div>
                        )}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Days Allocated</label>
                          <input
                            type="number"
                            value={config.days || 0}
                            onChange={(e) => handleLeaveTypeConfigChange(leaveType, 'days', parseInt(e.target.value) || 0)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                            min="0"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                          <input
                            type="text"
                            value={config.description || ''}
                            onChange={(e) => handleLeaveTypeConfigChange(leaveType, 'description', e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2"
                            placeholder="Brief description of this leave type"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Total Days Summary */}
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Total Days Configured:</span>
                  <span className="text-lg font-bold text-blue-600">
                    {calculateTotalDays(formData.leaveTypeConfig)} days
                  </span>
                </div>
              </div>
            </div>

            {/* Basic Configuration */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Days/Year (Auto-calculated)</label>
                <input 
                  type="number" 
                  value={calculateTotalDays(formData.leaveTypeConfig)} 
                  className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-50" 
                  readOnly 
                />
                <p className="mt-1 text-sm text-gray-500">Automatically calculated from individual leave types</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Accrual Method *</label>
                <select value={formData.accrualMethod} onChange={e => handleInputChange('accrualMethod', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <option value="fixed">Fixed Upfront</option>
                  <option value="monthly">Monthly Accrual</option>
                  <option value="hourly">Per Hour Worked</option>
                  <option value="anniversary">Anniversary Based</option>
                </select>
                <p className="mt-1 text-sm text-gray-500">{getAccrualMethodDescription(formData.accrualMethod)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Year *</label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-500">From</label>
                    <input 
                      type="date" 
                      value={formData.companyYearStart || ''} 
                      onChange={e => handleInputChange('companyYearStart', e.target.value)} 
                      className="w-full border border-gray-300 rounded-md px-3 py-2" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500">To</label>
                    <input 
                      type="date" 
                      value={formData.companyYearEnd || ''} 
                      onChange={e => handleInputChange('companyYearEnd', e.target.value)} 
                      className="w-full border border-gray-300 rounded-md px-3 py-2" 
                    />
                  </div>
                </div>
                <p className="mt-1 text-sm text-gray-500">Configure your company&apos;s fiscal year period</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Carry Forward Days</label>
                <input type="number" value={formData.carryForwardDays} onChange={e => handleInputChange('carryForwardDays', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2" placeholder="0" />
              </div>
            </div>
          </div>

          {/* Eligibility & Restrictions */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Eligibility & Restrictions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Eligibility Criteria</label>
                <select value={formData.eligibilityCriteria} onChange={e => handleInputChange('eligibilityCriteria', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <option value="staff">Staff</option>
                  <option value="team_lead">Team Lead</option>
                  <option value="employee">Employee</option>
                  <option value="manager">Manager</option>
                  <option value="all">All Employees</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Probation Period (Months)</label>
                <input type="number" value={formData.probationMonths} onChange={e => handleInputChange('probationMonths', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2" placeholder="0" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Consecutive Days</label>
                <input type="number" value={formData.maxConsecutiveDays} onChange={e => handleInputChange('maxConsecutiveDays', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2" placeholder="No limit" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Advance Notice (Days)</label>
                <input type="number" value={formData.advanceNoticeDays} onChange={e => handleInputChange('advanceNoticeDays', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2" placeholder="0" />
              </div>
            </div>
          </div>

          {/* Approval Workflow */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Approval Workflow</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Approval Type</label>
              <select value={formData.approvalWorkflow} onChange={e => handleInputChange('approvalWorkflow', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2">
                <option value="single">Single Level (Manager)</option>
                <option value="dual">Dual Level (Manager → HR)</option>
                <option value="multi">Multi Level (Manager → HR → Director)</option>
                <option value="auto">Auto Approval</option>
              </select>
              <p className="mt-1 text-sm text-gray-500">{getApprovalWorkflowDescription(formData.approvalWorkflow)}</p>
            </div>
          </div>

          {/* Notifications */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Notifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notification Type</label>
                <select value={formData.notifications?.type || 'all'} onChange={e => handleInputChange('notifications', { ...formData.notifications, type: e.target.value })} className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <option value="all">All Notifications</option>
                  <option value="approval">Approval Only</option>
                  <option value="reminder">Reminders Only</option>
                  <option value="none">No Notifications</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notification Details</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.notifications?.details?.email || false}
                      onChange={(e) => handleInputChange('notifications', { 
                        ...formData.notifications, 
                        details: { ...formData.notifications?.details, email: e.target.checked }
                      })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Email</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.notifications?.details?.sms || false}
                      onChange={(e) => handleInputChange('notifications', { 
                        ...formData.notifications, 
                        details: { ...formData.notifications?.details, sms: e.target.checked }
                      })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">SMS</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.notifications?.details?.inApp || false}
                      onChange={(e) => handleInputChange('notifications', { 
                        ...formData.notifications, 
                        details: { ...formData.notifications?.details, inApp: e.target.checked }
                      })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">In-App</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Blackout Periods */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Blackout Periods</h3>
            <div className="space-y-4">
              {(formData.blackoutPeriods || []).map((period, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Period {index + 1}</label>
                    <input type="text" value={period.name || ''} onChange={e => handleBlackoutPeriodChange(index, 'name', e.target.value)} className="w-full border border-gray-300 rounded-md px-2 py-1" />
                  </div>
                  <div className="flex-1 ml-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input type="date" value={period.startDate || ''} onChange={e => handleBlackoutPeriodChange(index, 'startDate', e.target.value)} className="w-full border border-gray-300 rounded-md px-2 py-1" />
                  </div>
                  <div className="flex-1 ml-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input type="date" value={period.endDate || ''} onChange={e => handleBlackoutPeriodChange(index, 'endDate', e.target.value)} className="w-full border border-gray-300 rounded-md px-2 py-1" />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeBlackoutPeriod(index)}
                    className="ml-2 text-red-600 hover:text-red-900"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addBlackoutPeriod}
                className="mt-4 px-4 py-2 bg-[#009D9D] text-white rounded-md hover:bg-[#007a7a]"
              >
                Add Blackout Period
              </button>
            </div>
          </div>

          {/* Attachment Requirements */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Attachment Requirements</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Global Attachment Setting</label>
                <select value={formData.attachmentRequired ? 'true' : 'false'} onChange={e => handleInputChange('attachmentRequired', e.target.value === 'true')} className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <option value="false">No Attachment Required</option>
                  <option value="true">Attachment Required</option>
                </select>
                <p className="mt-1 text-sm text-gray-500">Enable to configure individual leave type attachments below</p>
              </div>
              
              {formData.attachmentRequired && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Individual Leave Type Attachments</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(formData.attachmentConfig || {}).map(([leaveType, required]) => (
                      <label key={leaveType} className="flex items-center p-3 bg-gray-50 rounded-lg">
                        <input
                          type="checkbox"
                          checked={required}
                          onChange={(e) => handleInputChange('attachmentConfig', {
                            ...formData.attachmentConfig,
                            [leaveType]: e.target.checked
                          })}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm font-medium text-gray-700 capitalize">
                          {leaveType === 'other' ? (formData.leaveTypeConfig?.other?.customName || 'Other') : leaveType} Leave
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Department Overrides Leaves */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Department Overrides Leaves</h3>
            <div className="space-y-6">
              {(formData.departmentOverridesLeaves || []).map((override, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-md font-medium text-gray-800">Department Override {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeDepartmentOverride(index)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Remove
                    </button>
                  </div>
                  
                  {/* Department Name */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Department Name</label>
                    <select 
                      value={override.departmentName || ''} 
                      onChange={e => handleDepartmentOverrideChange(index, 'departmentName', e.target.value)} 
                      className="w-full border border-gray-300 rounded-md px-3 py-2"
                    >
                      <option value="">Select Department</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Sales">Sales</option>
                      <option value="Marketing">Marketing</option>
                      <option value="HR">Human Resources</option>
                      <option value="Finance">Finance</option>
                      <option value="IT">Information Technology</option>
                      <option value="Operations">Operations</option>
                      <option value="Customer Support">Customer Support</option>
                      <option value="Product">Product</option>
                      <option value="Design">Design</option>
                      <option value="Legal">Legal</option>
                      <option value="Administration">Administration</option>
                    </select>
                  </div>

                  {/* Individual Leave Type Settings */}
                  <div className="mb-4">
                    <h5 className="text-sm font-medium text-gray-700 mb-3">Leave Type Configuration</h5>
                    <div className="space-y-3">
                      {Object.entries(override.leaveTypeConfig || formData.leaveTypeConfig || {}).map(([leaveType, config]) => (
                        <div key={leaveType} className="flex items-center justify-between p-3 bg-white rounded border">
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={config.enabled}
                              onChange={(e) => {
                                const newConfig = { ...override.leaveTypeConfig };
                                newConfig[leaveType] = { ...newConfig[leaveType], enabled: e.target.checked };
                                handleDepartmentOverrideChange(index, 'leaveTypeConfig', newConfig);
                              }}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm font-medium text-gray-700 capitalize">
                              {leaveType === 'other' ? (config.customName || 'Other') : leaveType}
                            </span>
                          </div>
                          
                          {config.enabled && (
                            <div className="flex items-center space-x-2">
                              {leaveType === 'other' && (
                                <input
                                  type="text"
                                  value={config.customName || ''}
                                  onChange={(e) => {
                                    const newConfig = { ...override.leaveTypeConfig };
                                    newConfig[leaveType] = { ...newConfig[leaveType], customName: e.target.value };
                                    handleDepartmentOverrideChange(index, 'leaveTypeConfig', newConfig);
                                  }}
                                  className="w-32 border border-gray-300 rounded-md px-2 py-1 text-sm"
                                  placeholder="Leave name"
                                />
                              )}
                              <input
                                type="number"
                                value={config.days || 0}
                                onChange={(e) => {
                                  const newConfig = { ...override.leaveTypeConfig };
                                  newConfig[leaveType] = { ...newConfig[leaveType], days: parseInt(e.target.value) || 0 };
                                  handleDepartmentOverrideChange(index, 'leaveTypeConfig', newConfig);
                                }}
                                className="w-20 border border-gray-300 rounded-md px-2 py-1 text-sm"
                                min="0"
                                placeholder="Days"
                              />
                              <span className="text-sm text-gray-500">days</span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Total Days Summary */}
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">Total Days for this Department:</span>
                      <span className="text-lg font-bold text-blue-600">
                        {override.totalDays || calculateTotalDays(override.leaveTypeConfig)} days
                      </span>
                    </div>
                  </div>

                  {/* Max Days Override */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Total Days (Optional Override)</label>
                    <input 
                      type="number" 
                      value={override.maxDays || ''} 
                      onChange={e => handleDepartmentOverrideChange(index, 'maxDays', e.target.value)} 
                      className="w-full border border-gray-300 rounded-md px-3 py-2" 
                      placeholder="Leave empty to use calculated total"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      If set, this will override the calculated total from individual leave types
                    </p>
                  </div>
                </div>
              ))}
              
              <button
                type="button"
                onClick={addDepartmentOverride}
                className="mt-4 px-4 py-2 bg-[#009D9D] text-white rounded-md hover:bg-[#007a7a]"
              >
                Add Department Override Leaves
              </button>
            </div>
          </div>

          {/* Auto Approval Days */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Auto Approval Days</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Days for Auto Approval</label>
              <input type="number" value={formData.autoApprovalDays} onChange={e => handleInputChange('autoApprovalDays', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2" placeholder="0" />
            </div>
          </div>

          {/* Custom Fields */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Custom Fields</h3>
            <div className="space-y-4">
              {(formData.customFields || []).map((field, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Field {index + 1}</label>
                    <input type="text" value={field.name || ''} onChange={e => handleCustomFieldChange(index, 'name', e.target.value)} className="w-full border border-gray-300 rounded-md px-2 py-1" />
                  </div>
                  <div className="flex-1 ml-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                    <select value={field.type || 'text'} onChange={e => handleCustomFieldChange(index, 'type', e.target.value)} className="w-full border border-gray-300 rounded-md px-2 py-1">
                      <option value="text">Text</option>
                      <option value="number">Number</option>
                      <option value="date">Date</option>
                      <option value="boolean">Boolean</option>
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeCustomField(index)}
                    className="ml-2 text-red-600 hover:text-red-900"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addCustomField}
                className="mt-4 px-4 py-2 bg-[#009D9D] text-white rounded-md hover:bg-[#007a7a]"
              >
                Add Custom Field
              </button>
            </div>
          </div>

          {/* Policy History */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Policy History</h3>
            <div className="space-y-4">
              {(formData.policyHistory || []).map((history, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm text-gray-700 mb-1">Version {index + 1}</p>
                  <p className="text-sm text-gray-500">Created: {history.createdAt}</p>
                  <p className="text-sm text-gray-500">Updated: {history.updatedAt}</p>
                  <p className="text-sm text-gray-700 mt-2">Changes:</p>
                  <ul className="list-disc list-inside text-sm text-gray-700">
                    {Object.entries(history.changes).map(([key, value]) => (
                      <li key={key}>{key}: {JSON.stringify(value)}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Linked Policies */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Linked Policies</h3>
            <div className="space-y-4">
              {(formData.linkedPolicies || []).map((linkedPolicy, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm text-gray-700 mb-1">Linked Policy {index + 1}</p>
                  <p className="text-sm text-gray-500">Policy Type: {linkedPolicy.type}</p>
                  <p className="text-sm text-gray-500">Policy ID: {linkedPolicy.id}</p>
                  <p className="text-sm text-gray-500">Changed By: {linkedPolicy.changedBy || 'System'}</p>
                  <p className="text-sm text-gray-500">Change Date: {linkedPolicy.changeDate || 'N/A'}</p>
                  <button
                    type="button"
                    onClick={() => handleInputChange(`linkedPolicies`, formData.linkedPolicies.filter((_, i) => i !== index))}
                    className="mt-2 text-red-600 hover:text-red-900"
                  >
                    Remove Link
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  // Generate random date within last 6 months
                  const randomDate = new Date();
                  randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 180));
                  const randomDateStr = randomDate.toISOString().slice(0, 10);
                  
                  handleInputChange('linkedPolicies', [...(formData.linkedPolicies || []), { 
                    type: 'timeOff', 
                    id: 'new_policy_id',
                    changedBy: userRole || 'Unknown',
                    changeDate: randomDateStr
                  }]);
                }}
                className="mt-4 px-4 py-2 bg-[#009D9D] text-white rounded-md hover:bg-[#007a7a]"
              >
                Add Linked Policy
              </button>
            </div>
          </div>

          {/* Advanced Rules */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Advanced Rules</h3>
            <div className="space-y-4">
              {(formData.advancedRules || []).map((rule, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm text-gray-700 mb-1">Rule {index + 1}</p>
                  <p className="text-sm text-gray-500">Condition: {rule.condition}</p>
                  <p className="text-sm text-gray-500">Action: {rule.action}</p>
                  <button
                    type="button"
                    onClick={() => handleInputChange(`advancedRules`, formData.advancedRules.filter((_, i) => i !== index))}
                    className="mt-2 text-red-600 hover:text-red-900"
                  >
                    Remove Rule
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => handleInputChange('advancedRules', [...(formData.advancedRules || []), { condition: 'Always', action: 'Approve' }])}
                className="mt-4 px-4 py-2 bg-[#009D9D] text-white rounded-md hover:bg-[#007a7a]"
              >
                Add Advanced Rule
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select value={formData.status} onChange={e => handleInputChange('status', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2">
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
        </>;
      case 'overtime':
        return <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Policy Name *</label>
            <input type="text" required value={formData.name} onChange={e => handleInputChange('name', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea rows={2} value={formData.description} onChange={e => handleInputChange('description', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2" />
          </div>
          
          {/* Basic Overtime Configuration */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Overtime Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Base Rate *</label>
                <input type="text" required value={formData.rate} onChange={e => handleInputChange('rate', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2" placeholder="e.g., 1.5x" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Hours</label>
                <input type="number" value={formData.maxHours} onChange={e => handleInputChange('maxHours', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2" placeholder="0" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Overtime Type</label>
                <select value={formData.overtimeType} onChange={e => handleInputChange('overtimeType', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <option value="regular">Regular Overtime</option>
                  <option value="holiday">Holiday Overtime</option>
                  <option value="nightShift">Night Shift Overtime</option>
                  <option value="weekend">Weekend Overtime</option>
                  <option value="emergency">Emergency Overtime</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Eligibility Criteria</label>
                <select value={formData.eligibilityCriteria} onChange={e => handleInputChange('eligibilityCriteria', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <option value="all">All Employees</option>
                  <option value="fulltime">Full-time Only</option>
                  <option value="parttime">Part-time Only</option>
                  <option value="hourly">Hourly Workers Only</option>
                  <option value="exempt">Non-Exempt Only</option>
                </select>
              </div>
            </div>
          </div>

          {/* Limits & Thresholds */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Limits & Thresholds</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Daily Limit (Hours)</label>
                <input type="number" value={formData.dailyLimit} onChange={e => handleInputChange('dailyLimit', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2" placeholder="0" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Weekly Cap (Hours)</label>
                <input type="number" value={formData.weeklyCap} onChange={e => handleInputChange('weeklyCap', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2" placeholder="0" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Cap (Hours)</label>
                <input type="number" value={formData.monthlyCap} onChange={e => handleInputChange('monthlyCap', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2" placeholder="0" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Threshold (Minutes)</label>
                <input type="number" value={formData.minimumThreshold} onChange={e => handleInputChange('minimumThreshold', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2" placeholder="0" />
              </div>
            </div>
          </div>

          {/* Calculation & Approval */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Calculation & Approval</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rounding Logic</label>
                <select value={formData.roundingLogic} onChange={e => handleInputChange('roundingLogic', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <option value="15min">15 Minutes</option>
                  <option value="30min">30 Minutes</option>
                  <option value="1hour">1 Hour</option>
                  <option value="none">No Rounding</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Approval Requirement</label>
                <select value={formData.approvalRequirement} onChange={e => handleInputChange('approvalRequirement', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <option value="auto">Auto-approve</option>
                  <option value="manager">Manager Pre-approval</option>
                  <option value="hr">HR Approval Required</option>
                  <option value="director">Director Approval</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Overtime Window</label>
                <select value={formData.overtimeWindow} onChange={e => handleInputChange('overtimeWindow', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <option value="afterShift">After Shift Ends</option>
                  <option value="restDays">Rest Days Only</option>
                  <option value="anytime">Anytime</option>
                  <option value="scheduled">Scheduled Only</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Break Deduction</label>
                <select value={formData.breakDeduction ? 'true' : 'false'} onChange={e => handleInputChange('breakDeduction', e.target.value === 'true')} className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <option value="false">No Deduction</option>
                  <option value="true">Deduct Breaks</option>
                </select>
              </div>
            </div>
          </div>

          {/* Advanced Rate Configuration */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Advanced Rate Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Weekday Rate</label>
                <input type="text" value={formData.dayTypeRates?.weekday || ''} onChange={e => handleInputChange('dayTypeRates', { ...formData.dayTypeRates, weekday: e.target.value })} className="w-full border border-gray-300 rounded-md px-3 py-2" placeholder="e.g., 1.5x" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Weekend Rate</label>
                <input type="text" value={formData.dayTypeRates?.weekend || ''} onChange={e => handleInputChange('dayTypeRates', { ...formData.dayTypeRates, weekend: e.target.value })} className="w-full border border-gray-300 rounded-md px-3 py-2" placeholder="e.g., 2.0x" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Holiday Rate</label>
                <input type="text" value={formData.dayTypeRates?.holiday || ''} onChange={e => handleInputChange('dayTypeRates', { ...formData.dayTypeRates, holiday: e.target.value })} className="w-full border border-gray-300 rounded-md px-3 py-2" placeholder="e.g., 2.5x" />
              </div>
            </div>
          </div>

          {/* Tiered Rates */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Tiered Rates</h3>
            <div className="space-y-4">
              {(formData.tieredRates || []).map((tier, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tier {index + 1}</label>
                    <input type="text" value={tier.hours || ''} onChange={e => handleTieredRateChange(index, 'hours', e.target.value)} className="w-full border border-gray-300 rounded-md px-2 py-1" placeholder="e.g., 2 hours" />
                  </div>
                  <div className="flex-1 ml-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rate</label>
                    <input type="text" value={tier.rate || ''} onChange={e => handleTieredRateChange(index, 'rate', e.target.value)} className="w-full border border-gray-300 rounded-md px-2 py-1" placeholder="e.g., 1.5x" />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeTieredRate(index)}
                    className="ml-2 text-red-600 hover:text-red-900"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addTieredRate}
                className="mt-4 px-4 py-2 bg-[#009D9D] text-white rounded-md hover:bg-[#007a7a]"
              >
                Add Tiered Rate
              </button>
            </div>
          </div>

          {/* Shift Integration */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Shift Integration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Shift-Based Overtime</label>
                <select value={formData.shiftBased ? 'true' : 'false'} onChange={e => handleInputChange('shiftBased', e.target.value === 'true')} className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Split Shift Rules</label>
                <select value={formData.splitShiftRules ? 'true' : 'false'} onChange={e => handleInputChange('splitShiftRules', e.target.value === 'true')} className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select value={formData.status} onChange={e => handleInputChange('status', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2">
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
        </>;
      case 'flexibleWork':
        return <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Policy Name *</label>
            <input type="text" required value={formData.name} onChange={e => handleInputChange('name', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea rows={2} value={formData.description} onChange={e => handleInputChange('description', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2" />
          </div>
          
          {/* Basic Configuration */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Work Type *</label>
                <input type="text" required value={formData.workType} onChange={e => handleInputChange('workType', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2" placeholder="e.g., Hybrid, Remote, Flexible" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Eligibility Criteria</label>
                <select value={formData.eligibilityCriteria} onChange={e => handleInputChange('eligibilityCriteria', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <option value="all">All Employees</option>
                  <option value="fulltime">Full-time Only</option>
                  <option value="parttime">Part-time Only</option>
                  <option value="permanent">Permanent Only</option>
                  <option value="contract">Contractors Only</option>
                </select>
              </div>
            </div>
          </div>

          {/* Working Hours Configuration */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Working Hours Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Working Hours Range</label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-500">Start Time</label>
                    <input type="time" value={formData.workingHoursRange?.startTime || '09:00'} onChange={e => handleInputChange('workingHoursRange', { ...formData.workingHoursRange, startTime: e.target.value })} className="w-full border border-gray-300 rounded-md px-2 py-1" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500">End Time</label>
                    <input type="time" value={formData.workingHoursRange?.endTime || '17:00'} onChange={e => handleInputChange('workingHoursRange', { ...formData.workingHoursRange, endTime: e.target.value })} className="w-full border border-gray-300 rounded-md px-2 py-1" />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Core Hours (Mandatory)</label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-500">Start</label>
                    <input type="time" value={formData.workingHoursRange?.coreHoursStart || '11:00'} onChange={e => handleInputChange('workingHoursRange', { ...formData.workingHoursRange, coreHoursStart: e.target.value })} className="w-full border border-gray-300 rounded-md px-2 py-1" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500">End</label>
                    <input type="time" value={formData.workingHoursRange?.coreHoursEnd || '15:00'} onChange={e => handleInputChange('workingHoursRange', { ...formData.workingHoursRange, coreHoursEnd: e.target.value })} className="w-full border border-gray-300 rounded-md px-2 py-1" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Office Requirements */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Office Requirements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Office Days (per week)</label>
                <input type="number" min="0" max="5" value={formData.minimumOfficeDays} onChange={e => handleInputChange('minimumOfficeDays', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2" placeholder="0" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Office Visit Policy</label>
                <select value={formData.officeVisitPolicy} onChange={e => handleInputChange('officeVisitPolicy', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <option value="none">No Office Visits Required</option>
                  <option value="monthly">Monthly Visit Required</option>
                  <option value="quarterly">Quarterly Visit Required</option>
                  <option value="annually">Annual Visit Required</option>
                  <option value="conditional">Conditional on Business Need</option>
                </select>
              </div>
            </div>
          </div>

          {/* Approval & Trial */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Approval & Trial Period</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Approval Workflow</label>
                <select value={formData.approvalWorkflow} onChange={e => handleInputChange('approvalWorkflow', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <option value="manager">Manager Approval</option>
                  <option value="hr">HR Approval Required</option>
                  <option value="dual">Manager + HR Approval</option>
                  <option value="auto">Auto Approval</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Trial Period (Months)</label>
                <input type="number" min="0" max="12" value={formData.trialPeriod} onChange={e => handleInputChange('trialPeriod', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2" placeholder="0" />
              </div>
            </div>
          </div>

          {/* Work Location & Tracking */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Work Location & Time Tracking</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Work Location Type</label>
                <select value={formData.workLocationType} onChange={e => handleInputChange('workLocationType', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <option value="hybrid">Hybrid (Office & Remote)</option>
                  <option value="remote">Remote Only</option>
                  <option value="office">Office Only</option>
                  <option value="field">Field-based</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Online Status Tracking</label>
                <select value={formData.timeTrackingRequirement} onChange={e => handleInputChange('timeTrackingRequirement', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <option value="online_offline">Track Online/Offline Status</option>
                  <option value="manual">Manual Status Updates</option>
                  <option value="none">No Status Tracking</option>
                </select>
                <p className="mt-1 text-sm text-gray-500">Monitor employee availability and calculate time based on status changes</p>
              </div>
            </div>
          </div>







          {/* Policy Tags */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Policy Tags</h3>
            <p className="text-sm text-gray-600 mb-4">Tags represent the policy&apos;s overall purpose and are helpful for search, filtering, and categorization. Use descriptive tags to make policies easier to find and manage.</p>
            <div className="space-y-4">
              {(formData.policyTags || []).map((tag, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tag {index + 1}</label>
                    <input type="text" value={tag || ''} onChange={e => handlePolicyTagChange(index, e.target.value)} className="w-full border border-gray-300 rounded-md px-2 py-1" placeholder="e.g., Remote-First, Hybrid-Pilot" />
                  </div>
                  <button
                    type="button"
                    onClick={() => removePolicyTag(index)}
                    className="ml-2 text-red-600 hover:text-red-900"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addPolicyTag}
                className="mt-4 px-4 py-2 bg-[#009D9D] text-white rounded-md hover:bg-[#007a7a]"
              >
                Add Policy Tag
              </button>
            </div>
          </div>



          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select value={formData.status} onChange={e => handleInputChange('status', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2">
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
        </>;
      case 'bankHoliday':
        return <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Policy Name *</label>
            <input type="text" required value={formData.name} onChange={e => handleInputChange('name', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea rows={2} value={formData.description} onChange={e => handleInputChange('description', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2" />
          </div>
          
          {/* Basic Configuration */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                <select value={formData.country} onChange={e => handleInputChange('country', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <option value="UK">United Kingdom</option>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="AU">Australia</option>
                  <option value="DE">Germany</option>
                  <option value="FR">France</option>
                  <option value="UAE">United Arab Emirates</option>
                  <option value="SO">Somalia</option>
                  <option value="IN">India</option>
                  <option value="PK">Pakistan</option>
                  <option value="Global">Global</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Region/State</label>
                <input type="text" value={formData.region} onChange={e => handleInputChange('region', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2" placeholder="e.g., England, California" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Holiday Type</label>
                <select value={formData.holidayType} onChange={e => handleInputChange('holidayType', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <option value="national">National Holidays</option>
                  <option value="religious">Religious Holidays</option>
                  <option value="optional">Optional Holidays</option>
                  <option value="company">Company Holidays</option>
                  <option value="mixed">Mixed (National + Religious)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Observed On</label>
                <select value={formData.observedOn} onChange={e => handleInputChange('observedOn', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <option value="weekday">Next Weekday (if falls on weekend)</option>
                  <option value="exact">Exact Date (no adjustment)</option>
                  <option value="previous">Previous Friday (if falls on weekend)</option>
                  <option value="next">Next Monday (if falls on weekend)</option>
                </select>
              </div>
            </div>
          </div>



          {/* Location & Role Assignment */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Location & Role Assignment</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location-Based Assignment</label>
                <select value={formData.locationBased ? 'true' : 'false'} onChange={e => handleInputChange('locationBased', e.target.value === 'true')} className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <option value="false">No (Apply to all locations)</option>
                  <option value="true">Yes (Specific locations only)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role-Based Visibility</label>
                <select value={formData.roleBasedVisibility ? 'true' : 'false'} onChange={e => handleInputChange('roleBasedVisibility', e.target.value === 'true')} className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <option value="false">No (All roles)</option>
                  <option value="true">Yes (Specific roles only)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Assigned Locations */}
          {formData.locationBased && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Assigned Locations</h3>
              <div className="space-y-4">
                {(formData.assignedLocations || []).map((location, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location {index + 1}</label>
                      <input type="text" value={location || ''} onChange={e => handleAssignedLocationChange(index, e.target.value)} className="w-full border border-gray-300 rounded-md px-2 py-1" placeholder="e.g., London Office" />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAssignedLocation(index)}
                      className="ml-2 text-red-600 hover:text-red-900"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addAssignedLocation}
                  className="mt-4 px-4 py-2 bg-[#009D9D] text-white rounded-md hover:bg-[#007a7a]"
                >
                  Add Location
                </button>
              </div>
            </div>
          )}

          {/* Eligible Roles */}
          {formData.roleBasedVisibility && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Eligible Roles</h3>
              <div className="space-y-4">
                {(formData.eligibleRoles || []).map((role, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Role {index + 1}</label>
                      <input type="text" value={role || ''} onChange={e => handleEligibleRoleChange(index, e.target.value)} className="w-full border border-gray-300 rounded-md px-2 py-1" placeholder="e.g., Manager, Employee" />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeEligibleRole(index)}
                      className="ml-2 text-red-600 hover:text-red-900"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addEligibleRole}
                  className="mt-4 px-4 py-2 bg-[#009D9D] text-white rounded-md hover:bg-[#007a7a]"
                >
                  Add Role
                </button>
              </div>
            </div>
          )}

          {/* Policy Logic */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Policy Logic</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Auto-Mark Attendance</label>
                <select value={formData.autoMarkAttendance ? 'true' : 'false'} onChange={e => handleInputChange('autoMarkAttendance', e.target.value === 'true')} className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <option value="true">Yes (Mark as Holiday)</option>
                  <option value="false">No (Manual marking required)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Impact on Leave Balance</label>
                <select value={formData.impactOnLeaveBalance} onChange={e => handleInputChange('impactOnLeaveBalance', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <option value="exclude">Exclude from leave balance</option>
                  <option value="include">Include in leave balance</option>
                  <option value="conditional">Conditional (based on leave type)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Shift Override</label>
                <select value={formData.shiftOverride ? 'true' : 'false'} onChange={e => handleInputChange('shiftOverride', e.target.value === 'true')} className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <option value="false">No (Follow normal shift)</option>
                  <option value="true">Yes (Override shift on holidays)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Holiday List */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              {formData.holidayType === 'national' ? 'National Holidays' : 
               formData.holidayType === 'religious' ? 'Religious Holidays' : 
               formData.holidayType === 'optional' ? 'Optional Holidays' : 
               formData.holidayType === 'company' ? 'Company Holidays' : 
               formData.holidayType === 'mixed' ? 'Mixed Holidays' : 'Holidays'} List
            </h3>
            <div className="space-y-4">
              {(formData.holidayList || []).map((holiday, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-2 flex-1">
                    <div>
                      <label className="block text-xs font-medium text-gray-500">Start Date</label>
                      <input type="date" value={holiday.startDate || ''} onChange={e => handleHolidayChange(index, 'startDate', e.target.value)} className="w-full border border-gray-300 rounded-md px-2 py-1" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500">End Date</label>
                      <input type="date" value={holiday.endDate || ''} onChange={e => handleHolidayChange(index, 'endDate', e.target.value)} className="w-full border border-gray-300 rounded-md px-2 py-1" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500">Title</label>
                      <input type="text" value={holiday.title || ''} onChange={e => handleHolidayChange(index, 'title', e.target.value)} className="w-full border border-gray-300 rounded-md px-2 py-1" placeholder="e.g., Christmas Day" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500">Type</label>
                      <select value={holiday.type || 'national'} onChange={e => handleHolidayChange(index, 'type', e.target.value)} className="w-full border border-gray-300 rounded-md px-2 py-1">
                        <option value="national">National</option>
                        <option value="religious">Religious</option>
                        <option value="optional">Optional</option>
                        <option value="company">Company</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500">Mandatory</label>
                      <select value={holiday.mandatory ? 'true' : 'false'} onChange={e => handleHolidayChange(index, 'mandatory', e.target.value === 'true')} className="w-full border border-gray-300 rounded-md px-2 py-1">
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeHoliday(index)}
                    className="ml-2 text-red-600 hover:text-red-900"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addHoliday}
                className="mt-4 px-4 py-2 bg-[#009D9D] text-white rounded-md hover:bg-[#007a7a]"
              >
                Add Holiday
              </button>
            </div>
          </div>

          {/* Notifications & Automation */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Notifications & Automation</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Enable Notifications</label>
                <select value={formData.notificationEnabled ? 'true' : 'false'} onChange={e => handleInputChange('notificationEnabled', e.target.value === 'true')} className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notification Days (in advance)</label>
                <input type="number" min="1" max="30" value={formData.notificationDays} onChange={e => handleInputChange('notificationDays', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2" placeholder="7" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Auto-Assign to New Hires</label>
                <select value={formData.autoAssignNewHires ? 'true' : 'false'} onChange={e => handleInputChange('autoAssignNewHires', e.target.value === 'true')} className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select value={formData.status} onChange={e => handleInputChange('status', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2">
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
        </>;
      case 'pay':
        return <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Policy Name *</label>
            <input type="text" required value={formData.name} onChange={e => handleInputChange('name', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea rows={2} value={formData.description} onChange={e => handleInputChange('description', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2" />
          </div>
          
          {/* Basic Pay Configuration */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Pay Configuration</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pay Frequency</label>
                <select value={formData.payFrequency} onChange={e => handleInputChange('payFrequency', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Bi-weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly</option>
                  <option value="annually">Annually</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                <select value={formData.currency} onChange={e => handleInputChange('currency', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <option value="GBP">GBP (£)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="KES">KES (KSh)</option>
                  <option value="AED">AED (د.إ)</option>
                  <option value="INR">INR (₹)</option>
                  <option value="PKR">PKR (₨)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                <select value={formData.paymentMethod} onChange={e => handleInputChange('paymentMethod', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <option value="bank">Bank Transfer</option>
                  <option value="mobile">Mobile Wallet</option>
                  <option value="cheque">Cheque</option>
                  <option value="cash">Cash</option>
                  <option value="payroll">Payroll Card</option>
                </select>
              </div>
            </div>
          </div>

          {/* Tax & Deductions */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Tax & Deductions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tax Deduction Rule</label>
                <select value={formData.taxDeductionRule} onChange={e => handleInputChange('taxDeductionRule', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <option value="gross">Gross Pay (before deductions)</option>
                  <option value="net">Net Pay (after deductions)</option>
                  <option value="none">No Tax Deduction</option>
                  <option value="custom">Custom Formula</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Benefits Inclusion</label>
                <select value={formData.benefitsInclusion} onChange={e => handleInputChange('benefitsInclusion', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <option value="separate">Separate from Base Pay</option>
                  <option value="included">Included in Base Pay</option>
                  <option value="partial">Partially Included</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Deductions Policy</label>
                <select value={formData.deductionsPolicy} onChange={e => handleInputChange('deductionsPolicy', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <option value="standard">Standard Deductions</option>
                  <option value="minimal">Minimal Deductions</option>
                  <option value="comprehensive">Comprehensive Deductions</option>
                  <option value="custom">Custom Deductions</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Auto-Deduct Unpaid Leave</label>
                <select value={formData.autoDeductUnpaidLeave ? 'true' : 'false'} onChange={e => handleInputChange('autoDeductUnpaidLeave', e.target.value === 'true')} className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </div>
            </div>
          </div>

          {/* Salary Structure */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Salary Structure</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Base Salary Range (Min)</label>
                <input type="number" min="0" value={formData.baseSalaryRange?.min || 0} onChange={e => handleSalaryRangeChange('min', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2" placeholder="0" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Base Salary Range (Max)</label>
                <input type="number" min="0" value={formData.baseSalaryRange?.max || 0} onChange={e => handleSalaryRangeChange('max', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2" placeholder="0" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Eligibility Criteria</label>
                <select value={formData.eligibilityCriteria} onChange={e => handleInputChange('eligibilityCriteria', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <option value="all">All Employees</option>
                  <option value="fulltime">Full-time Only</option>
                  <option value="contract">Contract Only</option>
                  <option value="management">Management Only</option>
                  <option value="sales">Sales Staff Only</option>
                  <option value="custom">Custom Criteria</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Probation Period Pay Rule</label>
                <select value={formData.probationPeriodPayRule} onChange={e => handleInputChange('probationPeriodPayRule', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <option value="full">Full Pay</option>
                  <option value="partial">Partial Pay (80%)</option>
                  <option value="fixed">Fixed Amount</option>
                  <option value="negotiable">Negotiable</option>
                </select>
              </div>
            </div>
          </div>

          {/* Bonus & Commission */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Bonus & Commission</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Bonus/Commission Formula</label>
                <textarea rows={3} value={formData.bonusCommissionFormula} onChange={e => handleInputChange('bonusCommissionFormula', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2" placeholder="e.g., 10% of base salary for performance rating > 4.0" />
                <p className="mt-1 text-sm text-gray-500">Describe the formula or conditions for bonus/commission calculation</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Management Allowances</label>
                <select value={formData.managementAllowances ? 'true' : 'false'} onChange={e => handleInputChange('managementAllowances', e.target.value === 'true')} className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <option value="false">No</option>
                  <option value="true">Yes (Enhanced pay for leadership)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Allowances */}
          {formData.managementAllowances && (
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Management Allowances</h3>
              <div className="space-y-4">
                {(formData.allowances || []).map((allowance, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded-md">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 flex-1">
                      <div>
                        <label className="block text-xs font-medium text-gray-500">Allowance Type</label>
                        <input type="text" value={allowance.type || ''} onChange={e => handleAllowanceChange(index, 'type', e.target.value)} className="w-full border border-gray-300 rounded-md px-2 py-1" placeholder="e.g., Housing, Car" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500">Amount</label>
                        <input type="number" min="0" value={allowance.amount || 0} onChange={e => handleAllowanceChange(index, 'amount', e.target.value)} className="w-full border border-gray-300 rounded-md px-2 py-1" placeholder="0" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500">Frequency</label>
                        <select value={allowance.frequency || 'monthly'} onChange={e => handleAllowanceChange(index, 'frequency', e.target.value)} className="w-full border border-gray-300 rounded-md px-2 py-1">
                          <option value="monthly">Monthly</option>
                          <option value="quarterly">Quarterly</option>
                          <option value="annually">Annually</option>
                          <option value="one-time">One-time</option>
                        </select>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAllowance(index)}
                      className="ml-2 text-red-600 hover:text-red-900"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addAllowance}
                  className="mt-4 px-4 py-2 bg-[#009D9D] text-white rounded-md hover:bg-[#007a7a]"
                >
                  Add Allowance
                </button>
              </div>
            </div>
          )}

          {/* Proration & Settlement */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Proration & Settlement</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Proration Rules</label>
                <select value={formData.prorationRules} onChange={e => handleInputChange('prorationRules', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <option value="standard">Standard (Daily calculation)</option>
                  <option value="monthly">Monthly (Full month if 15+ days)</option>
                  <option value="weekly">Weekly (Full week if 3+ days)</option>
                  <option value="custom">Custom Formula</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Final Settlement Handling</label>
                <select value={formData.finalSettlementHandling} onChange={e => handleInputChange('finalSettlementHandling', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <option value="standard">Standard (Prorated salary)</option>
                  <option value="full">Full Month Salary</option>
                  <option value="custom">Custom Calculation</option>
                  <option value="negotiable">Negotiable</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End of Service Benefit</label>
                <select value={formData.endOfServiceBenefit ? 'true' : 'false'} onChange={e => handleInputChange('endOfServiceBenefit', e.target.value === 'true')} className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <option value="false">No</option>
                  <option value="true">Yes (EOSB/Gratuity)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payslip Template</label>
                <select value={formData.payslipTemplate} onChange={e => handleInputChange('payslipTemplate', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2">
                  <option value="default">Default Template</option>
                  <option value="detailed">Detailed Template</option>
                  <option value="simple">Simple Template</option>
                  <option value="custom">Custom Template</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select value={formData.status} onChange={e => handleInputChange('status', e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-2">
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
        </>;
      default:
        return null;
    }
  };

  // Helper functions for Public Holiday Policy
  const addHoliday = () => {
    setFormData(prev => ({
      ...prev,
      holidayList: [...(prev.holidayList || []), { startDate: '', endDate: '', title: '', type: 'national', mandatory: true }]
    }));
  };

  const removeHoliday = (index) => {
    setFormData(prev => ({
      ...prev,
      holidayList: prev.holidayList.filter((_, i) => i !== index)
    }));
  };

  const handleHolidayChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      holidayList: prev.holidayList.map((holiday, i) => 
        i === index ? { ...holiday, [field]: value } : holiday
      )
    }));
  };

  const addAssignedLocation = () => {
    setFormData(prev => ({
      ...prev,
      assignedLocations: [...(prev.assignedLocations || []), '']
    }));
  };

  const removeAssignedLocation = (index) => {
    setFormData(prev => ({
      ...prev,
      assignedLocations: prev.assignedLocations.filter((_, i) => i !== index)
    }));
  };

  const handleAssignedLocationChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      assignedLocations: prev.assignedLocations.map((location, i) => 
        i === index ? value : location
      )
    }));
  };

  const addEligibleRole = () => {
    setFormData(prev => ({
      ...prev,
      eligibleRoles: [...(prev.eligibleRoles || []), '']
    }));
  };

  const removeEligibleRole = (index) => {
    setFormData(prev => ({
      ...prev,
      eligibleRoles: prev.eligibleRoles.filter((_, i) => i !== index)
    }));
  };

  const handleEligibleRoleChange = (index, value) => {
    setFormData(prev => ({
      ...prev,
      eligibleRoles: prev.eligibleRoles.map((role, i) => 
        i === index ? value : role
      )
    }));
  };

  // Helper functions for Pay Policy
  const handleSalaryRangeChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      baseSalaryRange: {
        ...prev.baseSalaryRange,
        [field]: parseInt(value) || 0
      }
    }));
  };

  const addAllowance = () => {
    setFormData(prev => ({
      ...prev,
      allowances: [...(prev.allowances || []), { type: '', amount: 0, frequency: 'monthly' }]
    }));
  };

  const removeAllowance = (index) => {
    setFormData(prev => ({
      ...prev,
      allowances: prev.allowances.filter((_, i) => i !== index)
    }));
  };

  const handleAllowanceChange = (index, field, value) => {
    setFormData(prev => ({
      ...prev,
      allowances: prev.allowances.map((allowance, i) => 
        i === index ? { ...allowance, [field]: field === 'amount' ? parseInt(value) || 0 : value } : allowance
      )
    }));
  };

  // Helper functions for complex nested objects
  const handleBlackoutPeriodChange = (index, field, value) => {
    setFormData(prev => {
      const newBlackoutPeriods = [...(prev.blackoutPeriods || [])];
      newBlackoutPeriods[index] = { ...newBlackoutPeriods[index], [field]: value };
      return { ...prev, blackoutPeriods: newBlackoutPeriods };
    });
  };

  const addBlackoutPeriod = () => {
    setFormData(prev => ({
      ...prev,
      blackoutPeriods: [...(prev.blackoutPeriods || []), { name: '', startDate: '', endDate: '' }]
    }));
  };

  const removeBlackoutPeriod = (index) => {
    setFormData(prev => ({
      ...prev,
      blackoutPeriods: prev.blackoutPeriods.filter((_, i) => i !== index)
    }));
  };

  return (
    <Layout title={isEditMode ? `Edit ${typeLabels[type]}` : `Add ${typeLabels[type]}`}
      subtitle={isEditMode ? `Update an existing ${typeLabels[type]}` : `Create a new ${typeLabels[type]}`}
    >
      <div className="max-w-2xl mx-auto mt-8">
        <div className="mb-4 flex items-center">
          <button
            onClick={handleCancel}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Policies
          </button>
        </div>
        <div className="p-8 bg-white rounded-lg shadow">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {renderFields()}
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
                {isEditMode ? 'Update Policy' : 'Add Policy'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default PolicyForm;