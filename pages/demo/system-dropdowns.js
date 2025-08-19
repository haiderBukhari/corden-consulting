import React, { useState, useEffect } from 'react';
import Layout from "../../components/layout/layout";
import { 
  CogIcon, 
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  UserGroupIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';

const LOCAL_KEY = 'systemDropdownsData';
const defaultDummyData = {
  employmentStatuses: [
    { id: 1, name: "Active", description: "Currently employed and working", isActive: true, employeeCount: 25, color: "green" },
    { id: 2, name: "On Leave", description: "Currently on leave (sick, annual, etc.)", isActive: true, employeeCount: 3, color: "yellow" },
    { id: 3, name: "Suspended", description: "Temporarily suspended from work", isActive: true, employeeCount: 1, color: "orange" },
    { id: 4, name: "Terminated", description: "Employment has been terminated", isActive: true, employeeCount: 2, color: "red" },
    { id: 5, name: "Retired", description: "Retired from employment", isActive: true, employeeCount: 0, color: "gray" }
  ],
  workLocations: [
    { 
      id: 1, 
      name: "London HQ", 
      description: "Main headquarters office in London", 
      isActive: true, 
      employeeCount: 12,
      locationType: "head_office",
      timeZone: "Europe/London",
      address: "123 Oxford Street, London, W1D 1BS, UK",
      country: "United Kingdom",
      region: "England",
      geoCoordinates: { lat: 51.5074, lng: -0.1278 },
      defaultShift: "9-5",
      holidayPolicy: "UK_Public_Holidays",
      hrAdminInCharge: "Sarah Johnson",
      taxJurisdiction: "UK",
      workPermitRequired: false,
      officeCapacity: 50,
      workstations: 45,
      meetingRooms: 8,
      parkingAvailable: true,
      amenities: ["WiFi", "Kitchen", "Prayer Room", "Gym"],
      wifiNetwork: "LondonHQ_WiFi",
      attendanceRules: "biometric",
      clockInRadius: 100,
      assetAllocationPolicy: "standard_devices",
      inactiveReason: null,
      createdAt: "2023-01-01",
      updatedAt: "2023-01-01"
    },
    { 
      id: 2, 
      name: "Manchester Branch", 
      description: "Regional office in Manchester", 
      isActive: true, 
      employeeCount: 8,
      locationType: "branch_office",
      timeZone: "Europe/London",
      address: "456 Deansgate, Manchester, M3 2FF, UK",
      country: "United Kingdom",
      region: "England",
      geoCoordinates: { lat: 53.4808, lng: -2.2426 },
      defaultShift: "9-5",
      holidayPolicy: "UK_Public_Holidays",
      hrAdminInCharge: "Mike Wilson",
      taxJurisdiction: "UK",
      workPermitRequired: false,
      officeCapacity: 30,
      workstations: 25,
      meetingRooms: 4,
      parkingAvailable: true,
      amenities: ["WiFi", "Kitchen"],
      wifiNetwork: "Manchester_WiFi",
      attendanceRules: "biometric",
      clockInRadius: 100,
      assetAllocationPolicy: "standard_devices",
      inactiveReason: null,
      createdAt: "2023-01-01",
      updatedAt: "2023-01-01"
    },
    { 
      id: 3, 
      name: "Birmingham Warehouse", 
      description: "Distribution center and warehouse", 
      isActive: true, 
      employeeCount: 5,
      locationType: "warehouse",
      timeZone: "Europe/London",
      address: "789 Industrial Estate, Birmingham, B1 1AA, UK",
      country: "United Kingdom",
      region: "England",
      geoCoordinates: { lat: 52.4862, lng: -1.8904 },
      defaultShift: "shift_based",
      holidayPolicy: "UK_Public_Holidays",
      hrAdminInCharge: "Lisa Brown",
      taxJurisdiction: "UK",
      workPermitRequired: false,
      officeCapacity: 20,
      workstations: 15,
      meetingRooms: 2,
      parkingAvailable: true,
      amenities: ["WiFi", "Kitchen", "Loading Bay"],
      wifiNetwork: "Birmingham_WiFi",
      attendanceRules: "kiosk",
      clockInRadius: 200,
      assetAllocationPolicy: "warehouse_devices",
      inactiveReason: null,
      createdAt: "2023-01-01",
      updatedAt: "2023-01-01"
    },
    { 
      id: 4, 
      name: "Dubai Office", 
      description: "Middle East regional office", 
      isActive: true, 
      employeeCount: 3,
      locationType: "regional_office",
      timeZone: "Asia/Dubai",
      address: "321 Sheikh Zayed Road, Dubai, UAE",
      country: "United Arab Emirates",
      region: "Dubai",
      geoCoordinates: { lat: 25.2048, lng: 55.2708 },
      defaultShift: "8-6",
      holidayPolicy: "UAE_Public_Holidays",
      hrAdminInCharge: "Fatima Al-Rashid",
      taxJurisdiction: "UAE",
      workPermitRequired: true,
      officeCapacity: 25,
      workstations: 20,
      meetingRooms: 3,
      parkingAvailable: true,
      amenities: ["WiFi", "Kitchen", "Prayer Room"],
      wifiNetwork: "Dubai_WiFi",
      attendanceRules: "biometric",
      clockInRadius: 100,
      assetAllocationPolicy: "standard_devices",
      inactiveReason: null,
      createdAt: "2023-02-01",
      updatedAt: "2023-02-01"
    },
    { 
      id: 5, 
      name: "Remote Hub - East Africa", 
      description: "Virtual office for remote workers in East Africa", 
      isActive: true, 
      employeeCount: 0,
      locationType: "remote_hub",
      timeZone: "Africa/Nairobi",
      address: "Virtual Office - East Africa",
      country: "Kenya",
      region: "East Africa",
      geoCoordinates: { lat: -1.2921, lng: 36.8219 },
      defaultShift: "flexible",
      holidayPolicy: "Kenya_Public_Holidays",
      hrAdminInCharge: "Remote HR Team",
      taxJurisdiction: "Kenya",
      workPermitRequired: false,
      officeCapacity: 0,
      workstations: 0,
      meetingRooms: 0,
      parkingAvailable: false,
      amenities: ["Virtual Meeting Rooms"],
      wifiNetwork: "N/A",
      attendanceRules: "gps_only",
      clockInRadius: 5000,
      assetAllocationPolicy: "remote_devices",
      inactiveReason: null,
      createdAt: "2023-03-01",
      updatedAt: "2023-03-01"
    },
    { 
      id: 6, 
      name: "Edinburgh Office", 
      description: "Scottish regional office (currently inactive)", 
      isActive: false, 
      employeeCount: 0,
      locationType: "branch_office",
      timeZone: "Europe/London",
      address: "654 Princes Street, Edinburgh, EH1 1AA, UK",
      country: "United Kingdom",
      region: "Scotland",
      geoCoordinates: { lat: 55.9533, lng: -3.1883 },
      defaultShift: "9-5",
      holidayPolicy: "UK_Public_Holidays",
      hrAdminInCharge: "Closed",
      taxJurisdiction: "UK",
      workPermitRequired: false,
      officeCapacity: 20,
      workstations: 0,
      meetingRooms: 0,
      parkingAvailable: false,
      amenities: [],
      wifiNetwork: "N/A",
      attendanceRules: "none",
      clockInRadius: 0,
      assetAllocationPolicy: "none",
      inactiveReason: "Office closed due to restructuring",
      createdAt: "2023-01-01",
      updatedAt: "2023-06-01"
    }
  ],
  policyCategories: [
    { id: 1, name: "Time Off", description: "Leave and time off policies", isActive: true, policyCount: 3 },
    { id: 2, name: "Compensation", description: "Salary and benefits policies", isActive: true, policyCount: 4 },
    { id: 3, name: "Work Arrangements", description: "Flexible work and remote policies", isActive: true, policyCount: 2 },
    { id: 4, name: "Performance", description: "Performance and evaluation policies", isActive: true, policyCount: 2 }
  ],
  approvalFlows: [
    { id: 1, name: "Manager Approval", description: "Standard manager approval flow", isActive: true, usageCount: 15 },
    { id: 2, name: "HR Approval", description: "HR department approval required", isActive: true, usageCount: 8 },
    { id: 3, name: "Director Approval", description: "Director level approval required", isActive: true, usageCount: 3 },
    { id: 4, name: "Auto Approval", description: "Automatic approval for certain requests", isActive: true, usageCount: 5 }
  ]
};

const SystemDropdowns = () => {
  const [userRole, setUserRole] = useState('');
  const [activeTab, setActiveTab] = useState('statuses');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingItem, setDeletingItem] = useState(null);
  const [localData, setLocalData] = useState(defaultDummyData);
  const router = useRouter();

  // Load from localStorage or initialize
  useEffect(() => {
    const role = localStorage.getItem('role');
    setUserRole(role);
    let stored = localStorage.getItem(LOCAL_KEY);
    let parsed = defaultDummyData;
    if (stored) {
      try {
        parsed = JSON.parse(stored);
        // Augment existing data with new fields if missing
        if (parsed.workLocations) {
          parsed.workLocations = parsed.workLocations.map(location => ({
            ...location,
            locationType: location.locationType || 'head_office',
            timeZone: location.timeZone || 'Europe/London',
            address: location.address || '',
            country: location.country || 'United Kingdom',
            region: location.region || 'England',
            geoCoordinates: location.geoCoordinates || { lat: 0, lng: 0 },
            defaultShift: location.defaultShift || '9-5',
            holidayPolicy: location.holidayPolicy || '',
            hrAdminInCharge: location.hrAdminInCharge || '',
            taxJurisdiction: location.taxJurisdiction || 'UK',
            workPermitRequired: location.workPermitRequired || false,
            officeCapacity: location.officeCapacity || 0,
            workstations: location.workstations || 0,
            meetingRooms: location.meetingRooms || 0,
            parkingAvailable: location.parkingAvailable || false,
            amenities: location.amenities || [],
            wifiNetwork: location.wifiNetwork || '',
            attendanceRules: location.attendanceRules || 'biometric',
            clockInRadius: location.clockInRadius || 100,
            assetAllocationPolicy: location.assetAllocationPolicy || 'standard_devices',
            inactiveReason: location.inactiveReason || '',
            createdAt: location.createdAt || '2023-01-01',
            updatedAt: location.updatedAt || '2023-01-01'
          }));
        }
      } catch {}
    } else {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(defaultDummyData));
    }
    setLocalData(parsed);
  }, []);

  // Helper to update localStorage and state
  const updateLocalData = (newData) => {
    setLocalData(newData);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(newData));
  };

  // Reset to default data
  const resetToDefaultData = () => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(defaultDummyData));
    setLocalData(defaultDummyData);
  };

  const getDropdownData = () => {
    switch (activeTab) {
      case 'statuses':
        return localData.employmentStatuses;
      case 'locations':
        return localData.workLocations;
      case 'categories':
        return localData.policyCategories;
      case 'approvals':
        return localData.approvalFlows;
      default:
        return localData.employmentStatuses;
    }
  };

  const getTabIcon = () => {
    switch (activeTab) {
      case 'statuses':
        return <UserGroupIcon className="h-5 w-5" />;
      case 'locations':
        return <MapPinIcon className="h-5 w-5" />;
      case 'categories':
        return <DocumentTextIcon className="h-5 w-5" />;
      case 'approvals':
        return <CogIcon className="h-5 w-5" />;
      default:
        return <CogIcon className="h-5 w-5" />;
    }
  };

  const getStatusColor = (color) => {
    switch (color) {
      case 'green':
        return 'bg-green-100 text-green-800';
      case 'yellow':
        return 'bg-yellow-100 text-yellow-800';
      case 'orange':
        return 'bg-orange-100 text-orange-800';
      case 'red':
        return 'bg-red-100 text-red-800';
      case 'gray':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLocationTypeColor = (type) => {
    switch (type) {
      case 'head_office':
        return 'bg-blue-100 text-blue-800';
      case 'branch_office':
        return 'bg-green-100 text-green-800';
      case 'warehouse':
        return 'bg-orange-100 text-orange-800';
      case 'regional_office':
        return 'bg-purple-100 text-purple-800';
      case 'remote_hub':
        return 'bg-teal-100 text-teal-800';
      case 'co_working_space':
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getLocationTypeLabel = (type) => {
    switch (type) {
      case 'head_office':
        return 'Head Office';
      case 'branch_office':
        return 'Branch Office';
      case 'warehouse':
        return 'Warehouse';
      case 'regional_office':
        return 'Regional Office';
      case 'remote_hub':
        return 'Remote Hub';
      case 'co_working_space':
        return 'Co-working Space';
      default:
        return type;
    }
  };

  const getAttendanceRulesLabel = (rules) => {
    switch (rules) {
      case 'biometric':
        return 'Biometric';
      case 'kiosk':
        return 'Kiosk';
      case 'gps_only':
        return 'GPS Only';
      case 'none':
        return 'None';
      default:
        return rules;
    }
  };

  const handleEditItem = (item) => {
    router.push(`/demo/system-dropdown-form?tab=${activeTab}&mode=edit&id=${item.id}`);
  };

  const handleDeleteItem = (item) => {
    setDeletingItem(item);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    const updated = { ...localData };
    const tabKey =
      activeTab === 'statuses' ? 'employmentStatuses' :
      activeTab === 'locations' ? 'workLocations' :
      activeTab === 'categories' ? 'policyCategories' :
      activeTab === 'approvals' ? 'approvalFlows' : activeTab;
    updated[tabKey] = updated[tabKey].filter((i) => i.id !== deletingItem.id);
    updateLocalData(updated);
    setShowDeleteModal(false);
    setDeletingItem(null);
  };

  const handleAddItem = () => {
    router.push(`/demo/system-dropdown-form?tab=${activeTab}&mode=create`);
  };

  const tabs = [
    { id: 'statuses', name: 'Employment Statuses', icon: UserGroupIcon },
    { id: 'locations', name: 'Work Locations', icon: MapPinIcon },
    { id: 'categories', name: 'Policy Categories', icon: DocumentTextIcon },
    { id: 'approvals', name: 'Approval Flows', icon: CogIcon }
  ];

  return (
    <Layout title={'System Drop-downs'} subtitle={'Manage all system dropdown values'}>
      <div className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <CogIcon className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Items</p>
                <p className="text-2xl font-bold text-gray-900">23</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckIcon className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Items</p>
                <p className="text-2xl font-bold text-gray-900">20</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                <BuildingOfficeIcon className="h-5 w-5 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Locations</p>
                <p className="text-2xl font-bold text-gray-900">6</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
                <CogIcon className="h-5 w-5 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Countries</p>
                <p className="text-2xl font-bold text-gray-900">3</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dropdown Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <tab.icon className="h-4 w-4 mr-2" />
                    {tab.name}
                  </div>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-medium text-gray-900">
                {tabs.find(tab => tab.id === activeTab)?.name}
              </h3>
              {userRole === 'business_manager' && (
                <div className="flex space-x-3">
                  <button
                    onClick={resetToDefaultData}
                    className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 flex items-center"
                    title="Reset to default data"
                  >
                    <CogIcon className="h-4 w-4 mr-2" />
                    Reset Data
                  </button>
                  <button
                    onClick={handleAddItem}
                    className="bg-[#009D9D] text-white px-4 py-2 rounded-md hover:bg-[#007a7a] flex items-center"
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add Item
                  </button>
                </div>
              )}
            </div>

            {/* Dropdown Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    {activeTab === 'locations' && (
                      <>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
                      </>
                    )}
                    {activeTab === 'statuses' && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Color</th>
                    )}
                    {activeTab !== 'locations' && activeTab !== 'statuses' && (
                      <>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
                      </>
                    )}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getDropdownData().map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                            {getTabIcon()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{item.name}</div>
                            {activeTab === 'statuses' && item.color && (
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.color)}`}>
                                {item.color}
                              </span>
                            )}
                            {activeTab === 'locations' && item.locationType && (
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getLocationTypeColor(item.locationType)}`}>
                                {getLocationTypeLabel(item.locationType)}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-xs truncate">{item.description}</td>
                      {activeTab === 'locations' && (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.country || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.officeCapacity ? `${item.employeeCount}/${item.officeCapacity}` : `${item.employeeCount} employees`}
                          </td>
                        </>
                      )}
                      {activeTab === 'statuses' && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.color || 'gray')}`}>
                            {item.color || 'gray'}
                          </span>
                        </td>
                      )}
                      {activeTab !== 'locations' && activeTab !== 'statuses' && (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              item.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {item.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {activeTab === 'categories' && `${item.policyCount} policies`}
                            {activeTab === 'approvals' && `${item.usageCount} uses`}
                          </td>
                        </>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {userRole === 'business_manager' && (
                            <>
                              <button 
                                onClick={() => handleEditItem(item)}
                                className="text-[#009D9D] hover:text-[#006D6D]"
                                title="Edit"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteItem(item)}
                                className="text-red-600 hover:text-red-900"
                                title="Delete"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Delete Item Modal */}
        {userRole === 'business_manager' && showDeleteModal && deletingItem && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-xl w-96 max-w-md mx-4">
              <div className="p-6 text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <TrashIcon className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Item</h3>
                <div className="mb-6">
                  <p className="text-sm text-gray-600">
                    Are you sure you want to delete <strong>{deletingItem.name}</strong>?
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    This action cannot be undone.
                  </p>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowDeleteModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleConfirmDelete}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Delete Item
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SystemDropdowns; 