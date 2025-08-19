import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from "../../components/layout/layout";
import { 
  CheckIcon, 
  XMarkIcon, 
  ArrowLeftIcon, 
  TrashIcon,
  PlusIcon,
  MapPinIcon,
  BuildingOfficeIcon,
  ClockIcon,
  UserGroupIcon,
  CogIcon
} from '@heroicons/react/24/outline';

const LOCAL_KEY = 'systemDropdownsData';

const SystemDropdownForm = () => {
  const router = useRouter();
  const { tab, mode, id } = router.query;
  const isEdit = mode === 'edit';
  const [userRole, setUserRole] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true,
    // Enhanced work location fields
    locationType: 'head_office',
    timeZone: 'Europe/London',
    address: '',
    country: '',
    region: '',
    geoCoordinates: { lat: 0, lng: 0 },
    defaultShift: '9-5',
    holidayPolicy: '',
    hrAdminInCharge: '',
    taxJurisdiction: '',
    workPermitRequired: false,
    officeCapacity: 0,
    workstations: 0,
    meetingRooms: 0,
    parkingAvailable: false,
    amenities: [],
    wifiNetwork: '',
    attendanceRules: 'biometric',
    clockInRadius: 100,
    assetAllocationPolicy: 'standard_devices',
    inactiveReason: '',
    // Employment status fields
    color: 'green',
    // Policy category fields
    policyCount: 0,
    // Approval flow fields
    usageCount: 0
  });

  // Load user role
  useEffect(() => {
    const role = localStorage.getItem('role');
    setUserRole(role);
  }, []);

  // Load existing data for editing
  useEffect(() => {
    if (isEdit && id && tab) {
      const stored = localStorage.getItem(LOCAL_KEY);
      if (stored) {
        try {
          const data = JSON.parse(stored);
          const tabKey = getTabKey(tab);
          if (data[tabKey]) {
            const item = data[tabKey].find(t => t.id === parseInt(id));
            if (item) {
              setFormData({
                name: item.name || '',
                description: item.description || '',
                isActive: item.isActive !== undefined ? item.isActive : true,
                // Work location fields
                locationType: item.locationType || 'head_office',
                timeZone: item.timeZone || 'Europe/London',
                address: item.address || '',
                country: item.country || 'United Kingdom',
                region: item.region || 'England',
                geoCoordinates: item.geoCoordinates || { lat: 0, lng: 0 },
                defaultShift: item.defaultShift || '9-5',
                holidayPolicy: item.holidayPolicy || '',
                hrAdminInCharge: item.hrAdminInCharge || '',
                taxJurisdiction: item.taxJurisdiction || 'UK',
                workPermitRequired: item.workPermitRequired || false,
                officeCapacity: item.officeCapacity || 0,
                workstations: item.workstations || 0,
                meetingRooms: item.meetingRooms || 0,
                parkingAvailable: item.parkingAvailable || false,
                amenities: item.amenities || [],
                wifiNetwork: item.wifiNetwork || '',
                attendanceRules: item.attendanceRules || 'biometric',
                clockInRadius: item.clockInRadius || 100,
                assetAllocationPolicy: item.assetAllocationPolicy || 'standard_devices',
                inactiveReason: item.inactiveReason || '',
                // Employment status fields
                color: item.color || 'green',
                // Policy category fields
                policyCount: item.policyCount || 0,
                // Approval flow fields
                usageCount: item.usageCount || 0
              });
            }
          }
        } catch (error) {
          console.error('Error loading form data:', error);
        }
      }
    }
  }, [isEdit, id, tab]);

  const getTabKey = (tab) => {
    switch (tab) {
      case 'statuses': return 'employmentStatuses';
      case 'locations': return 'workLocations';
      case 'categories': return 'policyCategories';
      case 'approvals': return 'approvalFlows';
      default: return 'employmentStatuses';
    }
  };

  const getTabTitle = (tab) => {
    switch (tab) {
      case 'statuses': return 'Employment Status';
      case 'locations': return 'Work Location';
      case 'categories': return 'Policy Category';
      case 'approvals': return 'Approval Flow';
      default: return 'Item';
    }
  };

  if (userRole !== 'business_manager') {
    return (
      <Layout title={isEdit ? 'Edit Item' : 'Add Item'} subtitle={'Not Authorized'}>
        <div className="max-w-2xl mx-auto mt-12 p-8 bg-white rounded-lg shadow text-center">
          <h2 className="text-xl font-bold mb-4">Not Authorized</h2>
          <p className="text-gray-700 mb-4">Only Business Configuration Managers can {isEdit ? 'edit' : 'add'} system dropdown items.</p>
          <button
            onClick={() => router.push('/demo/system-dropdowns')}
            className="mt-4 px-6 py-2 bg-[#009D9D] text-white rounded-md hover:bg-[#007a7a]"
          >
            Back to System Drop-downs
          </button>
        </div>
      </Layout>
    );
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAmenityChange = (amenity, checked) => {
    const updatedAmenities = checked 
      ? [...formData.amenities, amenity]
      : formData.amenities.filter(a => a !== amenity);
    setFormData({ ...formData, amenities: updatedAmenities });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let stored = localStorage.getItem(LOCAL_KEY);
    let data = {};
    if (stored) {
      try {
        data = JSON.parse(stored);
      } catch {}
    }

    const tabKey = getTabKey(tab);
    if (!data[tabKey]) {
      data[tabKey] = [];
    }

    if (isEdit && id) {
      // Update existing
      data[tabKey] = data[tabKey].map(item =>
        item.id === parseInt(id)
          ? { 
              ...item, 
              ...formData, 
              updatedAt: new Date().toISOString().slice(0, 10) 
            }
          : item
      );
    } else {
      // Add new
      const newId = data[tabKey].length > 0 ? Math.max(...data[tabKey].map(t => Number(t.id))) + 1 : 1;
      data[tabKey].push({
        ...formData,
        id: newId,
        createdAt: new Date().toISOString().slice(0, 10),
        updatedAt: new Date().toISOString().slice(0, 10),
        employeeCount: 0
      });
    }
    
    localStorage.setItem(LOCAL_KEY, JSON.stringify(data));
    router.push('/demo/system-dropdowns');
  };

  const handleCancel = () => {
    router.push('/demo/system-dropdowns');
  };

  const handleDelete = () => {
    let stored = localStorage.getItem(LOCAL_KEY);
    let parsed = stored ? JSON.parse(stored) : {};
    const dataKey = getTabKey(tab);
    if (!dataKey) return;
    parsed[dataKey] = parsed[dataKey].filter((item) => String(item.id) !== String(id));
    localStorage.setItem(LOCAL_KEY, JSON.stringify(parsed));
    router.push('/demo/system-dropdowns');
  };

  const renderWorkLocationFields = () => (
    <>
      {/* Basic Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <BuildingOfficeIcon className="h-5 w-5 mr-2" />
          Basic Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="e.g., London HQ, Manchester Branch"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Location Type</label>
            <select
              value={formData.locationType}
              onChange={(e) => setFormData({...formData, locationType: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="head_office">Head Office</option>
              <option value="branch_office">Branch Office</option>
              <option value="warehouse">Warehouse</option>
              <option value="regional_office">Regional Office</option>
              <option value="remote_hub">Remote Hub</option>
              <option value="co_working_space">Co-working Space</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Describe this work location..."
            />
          </div>
        </div>
      </div>

      {/* Location Details */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <MapPinIcon className="h-5 w-5 mr-2" />
          Location Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
            <textarea
              rows={3}
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="Full address including postal code"
            />
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({...formData, country: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="e.g., United Kingdom"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Region</label>
              <input
                type="text"
                value={formData.region}
                onChange={(e) => setFormData({...formData, region: e.target.value})}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="e.g., England, Scotland"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Zone</label>
            <select
              value={formData.timeZone}
              onChange={(e) => setFormData({...formData, timeZone: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="Europe/London">Europe/London (GMT)</option>
              <option value="Europe/Paris">Europe/Paris (CET)</option>
              <option value="America/New_York">America/New_York (EST)</option>
              <option value="America/Los_Angeles">America/Los_Angeles (PST)</option>
              <option value="Asia/Dubai">Asia/Dubai (GST)</option>
              <option value="Asia/Tokyo">Asia/Tokyo (JST)</option>
              <option value="Africa/Nairobi">Africa/Nairobi (EAT)</option>
              <option value="Australia/Sydney">Australia/Sydney (AEDT)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Default Shift</label>
            <select
              value={formData.defaultShift}
              onChange={(e) => setFormData({...formData, defaultShift: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="9-5">9:00 AM - 5:00 PM</option>
              <option value="8-6">8:00 AM - 6:00 PM</option>
              <option value="shift_based">Shift Based</option>
              <option value="flexible">Flexible Hours</option>
            </select>
          </div>
        </div>
      </div>

      {/* Facility Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <BuildingOfficeIcon className="h-5 w-5 mr-2" />
          Facility Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Office Capacity</label>
            <input
              type="number"
              min="0"
              value={formData.officeCapacity}
              onChange={(e) => setFormData({...formData, officeCapacity: parseInt(e.target.value) || 0})}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Workstations</label>
            <input
              type="number"
              min="0"
              value={formData.workstations}
              onChange={(e) => setFormData({...formData, workstations: parseInt(e.target.value) || 0})}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="45"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Meeting Rooms</label>
            <input
              type="number"
              min="0"
              value={formData.meetingRooms}
              onChange={(e) => setFormData({...formData, meetingRooms: parseInt(e.target.value) || 0})}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="8"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">WiFi Network</label>
            <input
              type="text"
              value={formData.wifiNetwork}
              onChange={(e) => setFormData({...formData, wifiNetwork: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="e.g., Office_WiFi"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Amenities</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {['WiFi', 'Kitchen', 'Prayer Room', 'Gym', 'Parking', 'Loading Bay', 'Virtual Meeting Rooms'].map((amenity) => (
                <label key={amenity} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.amenities.includes(amenity)}
                    onChange={(e) => handleAmenityChange(amenity, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">{amenity}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Compliance & Operations */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <CogIcon className="h-5 w-5 mr-2" />
          Compliance & Operations
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tax Jurisdiction</label>
            <input
              type="text"
              value={formData.taxJurisdiction}
              onChange={(e) => setFormData({...formData, taxJurisdiction: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="e.g., UK, UAE"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Holiday Policy</label>
            <input
              type="text"
              value={formData.holidayPolicy}
              onChange={(e) => setFormData({...formData, holidayPolicy: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="e.g., UK_Public_Holidays"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">HR Admin in Charge</label>
            <input
              type="text"
              value={formData.hrAdminInCharge}
              onChange={(e) => setFormData({...formData, hrAdminInCharge: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="e.g., Sarah Johnson"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Asset Allocation Policy</label>
            <select
              value={formData.assetAllocationPolicy}
              onChange={(e) => setFormData({...formData, assetAllocationPolicy: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="standard_devices">Standard Devices</option>
              <option value="warehouse_devices">Warehouse Devices</option>
              <option value="remote_devices">Remote Devices</option>
              <option value="none">None</option>
            </select>
          </div>
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.workPermitRequired}
                onChange={(e) => setFormData({...formData, workPermitRequired: e.target.checked})}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Work Permit Required</span>
            </label>
          </div>
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.parkingAvailable}
                onChange={(e) => setFormData({...formData, parkingAvailable: e.target.checked})}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Parking Available</span>
            </label>
          </div>
        </div>
      </div>

      {/* Attendance & Access */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
          <ClockIcon className="h-5 w-5 mr-2" />
          Attendance & Access
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Attendance Rules</label>
            <select
              value={formData.attendanceRules}
              onChange={(e) => setFormData({...formData, attendanceRules: e.target.value})}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            >
              <option value="biometric">Biometric</option>
              <option value="kiosk">Kiosk</option>
              <option value="gps_only">GPS Only</option>
              <option value="none">None</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Clock-in Radius (meters)</label>
            <input
              type="number"
              min="0"
              value={formData.clockInRadius}
              onChange={(e) => setFormData({...formData, clockInRadius: parseInt(e.target.value) || 0})}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              placeholder="100"
            />
          </div>
        </div>
      </div>
    </>
  );

  const renderEmploymentStatusFields = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
        <UserGroupIcon className="h-5 w-5 mr-2" />
        Employment Status Details
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status Name *</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            placeholder="e.g., Active, On Leave, Terminated"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
          <select
            value={formData.color}
            onChange={(e) => setFormData({...formData, color: e.target.value})}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
          >
            <option value="green">Green</option>
            <option value="yellow">Yellow</option>
            <option value="orange">Orange</option>
            <option value="red">Red</option>
            <option value="gray">Gray</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            placeholder="Describe this employment status..."
          />
        </div>
      </div>
    </div>
  );

  const renderPolicyCategoryFields = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
        <CogIcon className="h-5 w-5 mr-2" />
        Policy Category Details
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category Name *</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            placeholder="e.g., Time Off, Compensation, Work Arrangements"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Policy Count</label>
          <input
            type="number"
            min="0"
            value={formData.policyCount}
            onChange={(e) => setFormData({...formData, policyCount: parseInt(e.target.value) || 0})}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            placeholder="0"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            placeholder="Describe this policy category..."
          />
        </div>
      </div>
    </div>
  );

  const renderApprovalFlowFields = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
        <CogIcon className="h-5 w-5 mr-2" />
        Approval Flow Details
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Flow Name *</label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            placeholder="e.g., Manager Approval, HR Approval"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Usage Count</label>
          <input
            type="number"
            min="0"
            value={formData.usageCount}
            onChange={(e) => setFormData({...formData, usageCount: parseInt(e.target.value) || 0})}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            placeholder="0"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="w-full border border-gray-300 rounded-md px-3 py-2"
            placeholder="Describe this approval flow..."
          />
        </div>
      </div>
    </div>
  );

  const renderFields = () => {
    switch (tab) {
      case 'locations':
        return renderWorkLocationFields();
      case 'statuses':
        return renderEmploymentStatusFields();
      case 'categories':
        return renderPolicyCategoryFields();
      case 'approvals':
        return renderApprovalFlowFields();
      default:
        return renderWorkLocationFields();
    }
  };

  return (
    <Layout title={isEdit ? 'Edit Item' : 'Add Item'} subtitle={`${isEdit ? 'Edit' : 'Add a new'} ${getTabTitle(tab)}`}>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => router.push('/demo/system-dropdowns')}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to System Drop-downs
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {renderFields()}

          {/* Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Status</h3>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Active</span>
            </div>
            {!formData.isActive && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Inactive Reason</label>
                <textarea
                  rows={2}
                  value={formData.inactiveReason}
                  onChange={(e) => setFormData({...formData, inactiveReason: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Reason for deactivating this item..."
                />
              </div>
            )}
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
              {isEdit ? 'Save Changes' : 'Add Item'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default SystemDropdownForm; 