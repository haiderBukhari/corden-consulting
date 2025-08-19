import React, { useState, useEffect } from 'react';
import Layout from "../../components/layout/layout";
import { 
  AcademicCapIcon, 
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CheckIcon,
  XMarkIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';

const LOCAL_KEY = 'employmentTypesData';
const defaultTypes = [
  {
    id: 1,
    name: "Full-Time",
    description: "Standard full-time employment with comprehensive benefits",
    isActive: true,
    employeeCount: 15,
    createdAt: "2023-01-01",
    updatedAt: "2023-01-01",
    // Enhanced fields
    payStructure: "monthly_salary",
    benefitsEligible: true,
    leavePolicyLink: "standard_time_off",
    workingHoursStandard: 40,
    endDateRequired: false,
    conversionAllowed: true,
    contractTemplate: "full_time_contract.pdf",
    probationPeriod: 90,
    noticePeriod: 30,
    regulatoryCategory: "W2",
    taxableCategory: "full_taxable",
    timeTrackingRequired: false,
    attendanceRequired: true,
    accessLevel: "full_access",
    partTimeBanding: null,
    internshipType: null,
    subTypes: [],
    colorTag: "blue",
    payPolicyLink: "standard_pay_policy",
    benefitsPolicyLink: "comprehensive_benefits",
    overtimeEligible: true,
    holidayPayEligible: true,
    bonusEligible: true,
    insuranceEligible: true,
    retirementEligible: true,
    conversionWorkflow: "intern_to_fulltime",
    autoAssignmentRules: true,
    complianceNotes: "Standard full-time employment compliant with local labor laws"
  },
  {
    id: 2,
    name: "Part-Time",
    description: "Part-time employment with reduced hours and prorated benefits",
    isActive: true,
    employeeCount: 8,
    createdAt: "2023-01-01",
    updatedAt: "2023-01-01",
    payStructure: "hourly_wage",
    benefitsEligible: true,
    leavePolicyLink: "prorated_time_off",
    workingHoursStandard: 20,
    endDateRequired: false,
    conversionAllowed: true,
    contractTemplate: "part_time_contract.pdf",
    probationPeriod: 60,
    noticePeriod: 14,
    regulatoryCategory: "W2",
    taxableCategory: "full_taxable",
    timeTrackingRequired: true,
    attendanceRequired: true,
    accessLevel: "limited_access",
    partTimeBanding: "20_hours",
    internshipType: null,
    subTypes: ["Regular", "Seasonal"],
    colorTag: "purple",
    payPolicyLink: "part_time_pay_policy",
    benefitsPolicyLink: "prorated_benefits",
    overtimeEligible: true,
    holidayPayEligible: true,
    bonusEligible: false,
    insuranceEligible: true,
    retirementEligible: true,
    conversionWorkflow: "parttime_to_fulltime",
    autoAssignmentRules: true,
    complianceNotes: "Part-time employment with prorated benefits and reduced working hours"
  },
  {
    id: 3,
    name: "Contract",
    description: "Fixed-term contract employment for specific projects",
    isActive: true,
    employeeCount: 5,
    createdAt: "2023-01-01",
    updatedAt: "2023-01-01",
    payStructure: "project_based",
    benefitsEligible: false,
    leavePolicyLink: "contract_time_off",
    workingHoursStandard: 40,
    endDateRequired: true,
    conversionAllowed: true,
    contractTemplate: "contract_agreement.pdf",
    probationPeriod: 0,
    noticePeriod: 7,
    regulatoryCategory: "1099",
    taxableCategory: "self_employed",
    timeTrackingRequired: true,
    attendanceRequired: false,
    accessLevel: "project_access",
    partTimeBanding: null,
    internshipType: null,
    subTypes: ["Project-based", "Retainer", "Consultant"],
    colorTag: "orange",
    payPolicyLink: "contract_pay_policy",
    benefitsPolicyLink: "no_benefits",
    overtimeEligible: false,
    holidayPayEligible: false,
    bonusEligible: true,
    insuranceEligible: false,
    retirementEligible: false,
    conversionWorkflow: "contract_to_fulltime",
    autoAssignmentRules: true,
    complianceNotes: "Contract employment with specific project deliverables and end dates"
  },
  {
    id: 4,
    name: "Temporary",
    description: "Temporary employment for specific projects or coverage",
    isActive: true,
    employeeCount: 3,
    createdAt: "2023-01-01",
    updatedAt: "2023-01-01",
    payStructure: "hourly_wage",
    benefitsEligible: false,
    leavePolicyLink: "temporary_time_off",
    workingHoursStandard: 40,
    endDateRequired: true,
    conversionAllowed: true,
    contractTemplate: "temporary_contract.pdf",
    probationPeriod: 0,
    noticePeriod: 3,
    regulatoryCategory: "W2",
    taxableCategory: "full_taxable",
    timeTrackingRequired: true,
    attendanceRequired: true,
    accessLevel: "temporary_access",
    partTimeBanding: null,
    internshipType: null,
    subTypes: ["Coverage", "Project", "Seasonal"],
    colorTag: "yellow",
    payPolicyLink: "temporary_pay_policy",
    benefitsPolicyLink: "no_benefits",
    overtimeEligible: true,
    holidayPayEligible: false,
    bonusEligible: false,
    insuranceEligible: false,
    retirementEligible: false,
    conversionWorkflow: "temporary_to_fulltime",
    autoAssignmentRules: true,
    complianceNotes: "Temporary employment with specific end dates and limited benefits"
  },
  {
    id: 5,
    name: "Apprentice",
    description: "Apprenticeship program employment with learning objectives",
    isActive: true,
    employeeCount: 2,
    createdAt: "2023-02-01",
    updatedAt: "2023-02-01",
    payStructure: "stipend",
    benefitsEligible: true,
    leavePolicyLink: "apprentice_time_off",
    workingHoursStandard: 35,
    endDateRequired: true,
    conversionAllowed: true,
    contractTemplate: "apprenticeship_contract.pdf",
    probationPeriod: 30,
    noticePeriod: 14,
    regulatoryCategory: "W2",
    taxableCategory: "reduced_taxable",
    timeTrackingRequired: true,
    attendanceRequired: true,
    accessLevel: "apprentice_access",
    partTimeBanding: null,
    internshipType: null,
    subTypes: ["Technical", "Trade", "Professional"],
    colorTag: "green",
    payPolicyLink: "apprentice_pay_policy",
    benefitsPolicyLink: "apprentice_benefits",
    overtimeEligible: false,
    holidayPayEligible: true,
    bonusEligible: false,
    insuranceEligible: true,
    retirementEligible: false,
    conversionWorkflow: "apprentice_to_fulltime",
    autoAssignmentRules: true,
    complianceNotes: "Apprenticeship program with structured learning and certification requirements"
  },
  {
    id: 6,
    name: "Intern",
    description: "Internship program employment for students and recent graduates",
    isActive: false,
    employeeCount: 0,
    createdAt: "2023-03-01",
    updatedAt: "2023-06-01",
    payStructure: "stipend",
    benefitsEligible: false,
    leavePolicyLink: "intern_time_off",
    workingHoursStandard: 30,
    endDateRequired: true,
    conversionAllowed: true,
    contractTemplate: "internship_contract.pdf",
    probationPeriod: 0,
    noticePeriod: 7,
    regulatoryCategory: "W2",
    taxableCategory: "reduced_taxable",
    timeTrackingRequired: true,
    attendanceRequired: true,
    accessLevel: "intern_access",
    partTimeBanding: null,
    internshipType: "paid",
    subTypes: ["Summer", "Academic", "Graduate"],
    colorTag: "teal",
    payPolicyLink: "intern_pay_policy",
    benefitsPolicyLink: "no_benefits",
    overtimeEligible: false,
    holidayPayEligible: false,
    bonusEligible: false,
    insuranceEligible: false,
    retirementEligible: false,
    conversionWorkflow: "intern_to_fulltime",
    autoAssignmentRules: true,
    complianceNotes: "Internship program with educational focus and limited duration"
  },
  {
    id: 7,
    name: "Freelancer",
    description: "Freelance employment with time-tracked billing",
    isActive: true,
    employeeCount: 4,
    createdAt: "2023-04-01",
    updatedAt: "2023-04-01",
    payStructure: "hourly_billing",
    benefitsEligible: false,
    leavePolicyLink: "freelancer_time_off",
    workingHoursStandard: 0,
    endDateRequired: false,
    conversionAllowed: true,
    contractTemplate: "freelancer_agreement.pdf",
    probationPeriod: 0,
    noticePeriod: 3,
    regulatoryCategory: "1099",
    taxableCategory: "self_employed",
    timeTrackingRequired: true,
    attendanceRequired: false,
    accessLevel: "freelancer_access",
    partTimeBanding: null,
    internshipType: null,
    subTypes: ["Designer", "Developer", "Writer", "Consultant"],
    colorTag: "indigo",
    payPolicyLink: "freelancer_pay_policy",
    benefitsPolicyLink: "no_benefits",
    overtimeEligible: false,
    holidayPayEligible: false,
    bonusEligible: false,
    insuranceEligible: false,
    retirementEligible: false,
    conversionWorkflow: "freelancer_to_contract",
    autoAssignmentRules: true,
    complianceNotes: "Freelance employment with flexible hours and project-based billing"
  },
  {
    id: 8,
    name: "Consultant",
    description: "Consulting employment with monthly retainer and project bonuses",
    isActive: true,
    employeeCount: 3,
    createdAt: "2023-05-01",
    updatedAt: "2023-05-01",
    payStructure: "retainer_plus_bonus",
    benefitsEligible: false,
    leavePolicyLink: "consultant_time_off",
    workingHoursStandard: 0,
    endDateRequired: false,
    conversionAllowed: true,
    contractTemplate: "consultant_agreement.pdf",
    probationPeriod: 0,
    noticePeriod: 14,
    regulatoryCategory: "1099",
    taxableCategory: "self_employed",
    timeTrackingRequired: false,
    attendanceRequired: false,
    accessLevel: "consultant_access",
    partTimeBanding: null,
    internshipType: null,
    subTypes: ["Strategy", "Technical", "Business", "Specialist"],
    colorTag: "pink",
    payPolicyLink: "consultant_pay_policy",
    benefitsPolicyLink: "no_benefits",
    overtimeEligible: false,
    holidayPayEligible: false,
    bonusEligible: true,
    insuranceEligible: false,
    retirementEligible: false,
    conversionWorkflow: "consultant_to_fulltime",
    autoAssignmentRules: true,
    complianceNotes: "Consulting employment with outcome-based deliverables and flexible engagement"
  }
];

const EmploymentTypes = () => {
  const [userRole, setUserRole] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingType, setDeletingType] = useState(null);
  const [types, setTypes] = useState(defaultTypes);
  const router = useRouter();

  // Load from localStorage or initialize
  useEffect(() => {
    const role = localStorage.getItem('role');
    setUserRole(role);
    let stored = localStorage.getItem(LOCAL_KEY);
    let parsed = defaultTypes;
    if (stored) {
      try {
        parsed = JSON.parse(stored);
      } catch {}
    } else {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(defaultTypes));
    }
    setTypes(parsed);
  }, []);

  // Helper to update localStorage and state
  const updateTypes = (newTypes) => {
    setTypes(newTypes);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(newTypes));
  };

  const handleAddType = () => {
    router.push('/demo/employment-type-form?mode=create');
  };

  const resetToDefaultData = () => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(defaultTypes));
    setTypes(defaultTypes);
  };

  const handleEditType = (type) => {
    router.push(`/demo/employment-type-form?mode=edit&id=${type.id}`);
  };

  const handleDeleteType = (type) => {
    setDeletingType(type);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    const newTypes = types.filter((t) => t.id !== deletingType.id);
    updateTypes(newTypes);
    setShowDeleteModal(false);
    setDeletingType(null);
  };

  return (
    <Layout title={'Employment Types'} subtitle={'Manage employment type dropdown values'}>
      <div className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <AcademicCapIcon className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Types</p>
                <p className="text-2xl font-bold text-gray-900">{types.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckIcon className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Types</p>
                <p className="text-2xl font-bold text-gray-900">
                  {types.filter(type => type.isActive).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                <UsersIcon className="h-5 w-5 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Employees</p>
                <p className="text-2xl font-bold text-gray-900">
                  {types.reduce((sum, type) => sum + type.employeeCount, 0)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
                <AcademicCapIcon className="h-5 w-5 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Benefits Eligible</p>
                <p className="text-2xl font-bold text-gray-900">
                  {types.filter(type => type.benefitsEligible).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Employment Types Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Employment Types</h3>
              <div className="flex space-x-2">
                {userRole === 'business_manager' && (
                  <button
                    onClick={resetToDefaultData}
                    className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 flex items-center"
                    title="Reset to default sample data"
                  >
                    Reset Data
                  </button>
                )}
                {userRole === 'business_manager' && (
                  <button
                    onClick={handleAddType}
                    className="bg-[#009D9D] text-white px-4 py-2 rounded-md hover:bg-[#007a7a] flex items-center"
                  >
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Add Type
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pay Structure</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employees</th>
                  {userRole === 'business_manager' && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {types.map((type) => (
                  <tr key={type.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                          type.colorTag === 'blue' ? 'bg-blue-100' :
                          type.colorTag === 'purple' ? 'bg-purple-100' :
                          type.colorTag === 'orange' ? 'bg-orange-100' :
                          type.colorTag === 'yellow' ? 'bg-yellow-100' :
                          type.colorTag === 'green' ? 'bg-green-100' :
                          type.colorTag === 'teal' ? 'bg-teal-100' :
                          type.colorTag === 'indigo' ? 'bg-indigo-100' :
                          type.colorTag === 'pink' ? 'bg-pink-100' :
                          'bg-gray-100'
                        }`}>
                          <AcademicCapIcon className={`h-4 w-4 ${
                            type.colorTag === 'blue' ? 'text-blue-600' :
                            type.colorTag === 'purple' ? 'text-purple-600' :
                            type.colorTag === 'orange' ? 'text-orange-600' :
                            type.colorTag === 'yellow' ? 'text-yellow-600' :
                            type.colorTag === 'green' ? 'text-green-600' :
                            type.colorTag === 'teal' ? 'text-teal-600' :
                            type.colorTag === 'indigo' ? 'text-indigo-600' :
                            type.colorTag === 'pink' ? 'text-pink-600' :
                            'text-gray-600'
                          }`} />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{type.name}</div>
                          {type.subTypes && type.subTypes.length > 0 && (
                            <div className="text-xs text-gray-500">
                              {type.subTypes.slice(0, 2).join(', ')}
                              {type.subTypes.length > 2 && '...'}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 max-w-xs truncate">{type.description}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        type.payStructure === 'monthly_salary' ? 'bg-blue-100 text-blue-800' :
                        type.payStructure === 'hourly_wage' ? 'bg-green-100 text-green-800' :
                        type.payStructure === 'project_based' ? 'bg-orange-100 text-orange-800' :
                        type.payStructure === 'stipend' ? 'bg-purple-100 text-purple-800' :
                        type.payStructure === 'hourly_billing' ? 'bg-indigo-100 text-indigo-800' :
                        type.payStructure === 'retainer_plus_bonus' ? 'bg-pink-100 text-pink-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {type.payStructure?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        type.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {type.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{type.employeeCount}</td>
                     {userRole === 'business_manager' && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleEditType(type)}
                            className="text-[#009D9D] hover:text-[#006D6D]"
                            title="Edit"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDeleteType(type)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Delete Employment Type Modal */}
        {userRole === 'business_manager' && showDeleteModal && deletingType && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-xl w-96 max-w-md mx-4">
              <div className="p-6 text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <TrashIcon className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Employment Type</h3>
                <div className="mb-6">
                  <p className="text-sm text-gray-600">
                    Are you sure you want to delete <strong>{deletingType.name}</strong>?
                  </p>
                  {deletingType.employeeCount > 0 && (
                    <p className="text-xs text-red-500 mt-2">
                      Warning: {deletingType.employeeCount} employees are currently assigned to this type.
                    </p>
                  )}
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
                    Delete Type
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

export default EmploymentTypes; 