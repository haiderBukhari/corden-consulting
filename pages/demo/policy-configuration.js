import React, { useState, useEffect } from 'react';
import Layout from "../../components/layout/layout";
import { 
  DocumentTextIcon, 
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CogIcon,
  ClockIcon,
  CurrencyPoundIcon,
  CalendarIcon,
  CheckIcon,
  UsersIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';

const PolicyConfiguration = () => {
  const [userRole, setUserRole] = useState('');
  const [activeTab, setActiveTab] = useState('timeOff');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState(null);
  const [deletingPolicy, setDeletingPolicy] = useState(null);

  const LOCAL_KEY = 'policyConfigData';
  const defaultPolicies = {
    timeOffPolicies: [
      {
        id: 1,
        name: "Standard Time Off",
        description: "25 days annual leave + bank holidays",
        daysPerYear: 25,
        accrualMethod: "fixed",
        companyYearStart: "2024-07-01",
        companyYearEnd: "2025-06-30",
        carryForwardDays: 5,
        eligibilityCriteria: "staff",
        probationMonths: 3,
        approvalWorkflow: "single",
        maxConsecutiveDays: 15,
        advanceNoticeDays: 14,
        notifications: {
          type: "all",
          details: {
            email: true,
            sms: false,
            inApp: true
          }
        },
        blackoutPeriods: [
          { name: "Year End", startDate: "2023-12-20", endDate: "2024-01-05" },
          { name: "Summer Freeze", startDate: "2023-07-01", endDate: "2023-08-31" }
        ],
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
        departmentOverridesLeaves: [
          { departmentName: "IT", maxDays: 30 },
          { departmentName: "Finance", maxDays: 22 }
        ],
        autoApprovalDays: 0,
        customFields: [
          { name: "Reason Code", type: "text" },
          { name: "Project Code", type: "text" },
          { name: "Manager Approval", type: "boolean" }
        ],
        policyHistory: [
          {
            version: "1.0",
            createdAt: "2023-01-01",
            updatedAt: "2023-01-01",
            changes: { "daysPerYear": "25", "carryForwardDays": "5" }
          },
          {
            version: "1.1",
            createdAt: "2023-03-15",
            updatedAt: "2023-03-15",
            changes: { "blackoutPeriods": "Added Summer Freeze" }
          }
        ],
        linkedPolicies: [
          { type: "overtime", id: "1", changedBy: "business_manager", changeDate: "2024-03-15" },
          { type: "pay", id: "1", changedBy: "business_manager", changeDate: "2024-01-22" }
        ],
        advancedRules: [
          { condition: "Days > 10", action: "Require Director Approval" },
          { condition: "Employee Level = Senior", action: "Auto Approve" }
        ],
        status: "Active",
        createdAt: "2023-01-01",
        updatedAt: "2023-03-15"
      },
      {
        id: 2,
        name: "Flexible Time Off",
        description: "Unlimited time off with manager approval",
        daysPerYear: "Unlimited",
        accrualMethod: "monthly",
        companyYearStart: "2024-08-01",
        companyYearEnd: "2025-07-31",
        carryForwardDays: 0,
        eligibilityCriteria: "team_lead",
        probationMonths: 6,
        approvalWorkflow: "dual",
        maxConsecutiveDays: 30,
        advanceNoticeDays: 30,
        notifications: {
          type: "approval",
          details: {
            email: true,
            sms: true,
            inApp: true
          }
        },
        blackoutPeriods: [
          { name: "Q4 Freeze", startDate: "2023-10-01", endDate: "2023-12-31" },
          { name: "Quarter End", startDate: "2023-03-25", endDate: "2023-03-31" }
        ],
        attachmentRequired: true,
        attachmentConfig: {
          annual: false,
          sick: true,
          personal: true,
          maternity: true,
          paternity: false,
          bereavement: false,
          other: true
        },
        departmentOverridesLeaves: [
          { departmentName: "Sales", maxDays: 20 },
          { departmentName: "Engineering", maxDays: 25 },
          { departmentName: "Marketing", maxDays: 18 }
        ],
        autoApprovalDays: 3,
        customFields: [
          { name: "Business Justification", type: "text" },
          { name: "Impact Assessment", type: "text" },
          { name: "Team Coverage Plan", type: "text" },
          { name: "Client Impact", type: "boolean" }
        ],
        policyHistory: [
          {
            version: "1.0",
            createdAt: "2023-03-15",
            updatedAt: "2023-03-15",
            changes: { "daysPerYear": "Unlimited", "approvalWorkflow": "dual" }
          },
          {
            version: "1.1",
            createdAt: "2023-05-01",
            updatedAt: "2023-05-01",
            changes: { "autoApprovalDays": "3", "attachmentRequired": "true" }
          }
        ],
        linkedPolicies: [
          { type: "overtime", id: "1", changedBy: "business_manager", changeDate: "2024-02-08" },
          { type: "flexibleWork", id: "1", changedBy: "business_manager", changeDate: "2024-04-12" }
        ],
        advancedRules: [
          { condition: "Days > 10", action: "Require HR Approval" },
          { condition: "Department = Sales", action: "Require VP Approval" },
          { condition: "Client Impact = Yes", action: "Require Client Approval" }
        ],
        status: "Active",
        createdAt: "2023-03-15",
        updatedAt: "2023-05-01"
      },
      {
        id: 3,
        name: "Enhanced Time Off",
        description: "30 days annual leave + additional benefits",
        daysPerYear: 30,
        accrualMethod: "anniversary",
        companyYearStart: "2024-09-01",
        companyYearEnd: "2025-08-31",
        carryForwardDays: 10,
        eligibilityCriteria: "manager",
        probationMonths: 0,
        approvalWorkflow: "multi",
        maxConsecutiveDays: 20,
        advanceNoticeDays: 7,
        notifications: {
          type: "all",
          details: {
            email: true,
            sms: false,
            inApp: true
          }
        },
        blackoutPeriods: [
          { name: "Critical Period", startDate: "2023-11-01", endDate: "2023-11-30" }
        ],
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
        departmentOverridesLeaves: [
          { departmentName: "Management", maxDays: 35 },
          { departmentName: "Executive", maxDays: 40 }
        ],
        autoApprovalDays: 5,
        customFields: [
          { name: "Manager Approval", type: "boolean" },
          { name: "HR Review", type: "boolean" },
          { name: "Executive Approval", type: "boolean" },
          { name: "Succession Plan", type: "text" }
        ],
        policyHistory: [
          {
            version: "1.0",
            createdAt: "2023-06-01",
            updatedAt: "2023-06-01",
            changes: { "daysPerYear": "30", "accrualMethod": "anniversary" }
          },
          {
            version: "1.1",
            createdAt: "2023-08-01",
            updatedAt: "2023-08-01",
            changes: { "approvalWorkflow": "multi", "autoApprovalDays": "5" }
          }
        ],
        linkedPolicies: [
          { type: "pay", id: "3", changedBy: "business_manager", changeDate: "2024-05-20" },
          { type: "bankHoliday", id: "1", changedBy: "business_manager", changeDate: "2024-06-03" }
        ],
        advancedRules: [
          { condition: "Employee Level = Senior", action: "Auto Approve" },
          { condition: "Department = Executive", action: "Require CEO Approval" },
          { condition: "Days > 15", action: "Require Board Approval" }
        ],
        status: "Active",
        createdAt: "2023-06-01",
        updatedAt: "2023-08-01"
      },
      {
        id: 4,
        name: "Part-Time Time Off",
        description: "Pro-rated time off for part-time employees",
        daysPerYear: 15,
        accrualMethod: "hourly",
        companyYearStart: "2024-10-01",
        companyYearEnd: "2025-09-30",
        carryForwardDays: 3,
        eligibilityCriteria: "employee",
        probationMonths: 3,
        approvalWorkflow: "single",
        maxConsecutiveDays: 10,
        advanceNoticeDays: 21,
        notifications: {
          type: "reminder",
          details: {
            email: true,
            sms: false,
            inApp: true
          }
        },
        blackoutPeriods: [],
        attachmentRequired: false,
        attachmentConfig: {
          annual: false,
          sick: true,
          personal: false,
          maternity: false,
          paternity: false,
          bereavement: false,
          other: false
        },
        departmentOverridesLeaves: [],
        autoApprovalDays: 2,
        customFields: [
          { name: "Hours Worked", type: "number" },
          { name: "Pro-rated Days", type: "number" }
        ],
        policyHistory: [
          {
            version: "1.0",
            createdAt: "2023-09-01",
            updatedAt: "2023-09-01",
            changes: { "daysPerYear": "15", "accrualMethod": "hourly" }
          }
        ],
        linkedPolicies: [],
        advancedRules: [
          { condition: "Hours < 20/week", action: "Require Manager Approval" }
        ],
        status: "Active",
        createdAt: "2023-09-01",
        updatedAt: "2023-09-01"
      },
      {
        id: 5,
        name: "Contractor Time Off",
        description: "Limited time off for contract workers",
        daysPerYear: 10,
        accrualMethod: "monthly",
        companyYearStart: "2024-11-01",
        companyYearEnd: "2025-10-31",
        carryForwardDays: 0,
        eligibilityCriteria: "staff",
        probationMonths: 1,
        approvalWorkflow: "auto",
        maxConsecutiveDays: 5,
        advanceNoticeDays: 14,
        notifications: {
          type: "none",
          details: {
            email: false,
            sms: false,
            inApp: false
          }
        },
        blackoutPeriods: [
          { name: "Project Deadlines", startDate: "2023-12-01", endDate: "2023-12-31" }
        ],
        attachmentRequired: true,
        attachmentConfig: {
          annual: true,
          sick: true,
          personal: false,
          maternity: false,
          paternity: false,
          bereavement: false,
          other: false
        },
        departmentOverridesLeaves: [],
        autoApprovalDays: 1,
        customFields: [
          { name: "Contract End Date", type: "date" },
          { name: "Project Assignment", type: "text" }
        ],
        policyHistory: [
          {
            version: "1.0",
            createdAt: "2023-10-01",
            updatedAt: "2023-10-01",
            changes: { "daysPerYear": "10", "approvalWorkflow": "auto" }
          }
        ],
        linkedPolicies: [],
        advancedRules: [
          { condition: "Contract End < 30 days", action: "Deny All Requests" }
        ],
        status: "Active",
        createdAt: "2023-10-01",
        updatedAt: "2023-10-01"
      }
    ],
    overtimePolicies: [
      {
        id: 1,
        name: "Standard Overtime Policy",
        description: "1.5x rate for overtime hours",
        rate: "1.5x",
        maxHours: 20,
        eligibilityCriteria: "all",
        overtimeType: "regular",
        dailyLimit: 4,
        weeklyCap: 20,
        monthlyCap: 80,
        minimumThreshold: 15,
        roundingLogic: "15min",
        approvalRequirement: "manager",
        overtimeWindow: "afterShift",
        breakDeduction: false,
        tieredRates: [
          { hours: "First 2 hours", rate: "1.5x" },
          { hours: "Next 2 hours", rate: "2.0x" }
        ],
        dayTypeRates: {
          weekday: "1.5x",
          weekend: "2.0x",
          holiday: "2.5x"
        },
        shiftBased: false,
        linkedShifts: [],
        splitShiftRules: false,
        linkedPolicies: [
          { type: "timeOff", id: "1" }
        ],
        policyHistory: [
          {
            version: "1.0",
            createdAt: "2023-01-01",
            updatedAt: "2023-01-01",
            changes: { "rate": "1.5x", "maxHours": "20" }
          }
        ],
        customFields: [
          { name: "Project Code", type: "text" },
          { name: "Emergency OT", type: "boolean" }
        ],
        complianceRules: [
          { rule: "FLSA Compliance", description: "Follows Fair Labor Standards Act" }
        ],
        status: "Active",
        createdAt: "2023-01-01",
        updatedAt: "2023-01-01"
      },
      {
        id: 2,
        name: "Premium Overtime Policy",
        description: "2x rate for overtime hours",
        rate: "2.0x",
        maxHours: 15,
        eligibilityCriteria: "fulltime",
        overtimeType: "holiday",
        dailyLimit: 8,
        weeklyCap: 15,
        monthlyCap: 60,
        minimumThreshold: 30,
        roundingLogic: "30min",
        approvalRequirement: "hr",
        overtimeWindow: "anytime",
        breakDeduction: true,
        tieredRates: [
          { hours: "First 4 hours", rate: "2.0x" },
          { hours: "After 4 hours", rate: "3.0x" }
        ],
        dayTypeRates: {
          weekday: "2.0x",
          weekend: "2.5x",
          holiday: "3.0x"
        },
        shiftBased: true,
        linkedShifts: ["Night Shift", "Weekend Shift"],
        splitShiftRules: true,
        linkedPolicies: [
          { type: "timeOff", id: "2" },
          { type: "pay", id: "2" }
        ],
        policyHistory: [
          {
            version: "1.0",
            createdAt: "2023-02-01",
            updatedAt: "2023-02-01",
            changes: { "rate": "2.0x", "maxHours": "15" }
          },
          {
            version: "1.1",
            createdAt: "2023-04-01",
            updatedAt: "2023-04-01",
            changes: { "approvalRequirement": "hr", "breakDeduction": "true" }
          }
        ],
        customFields: [
          { name: "Department Approval", type: "text" },
          { name: "Business Justification", type: "text" },
          { name: "Client Impact", type: "boolean" }
        ],
        complianceRules: [
          { rule: "State Compliance", description: "Follows state-specific labor laws" },
          { rule: "Union Compliance", description: "Follows union agreement terms" }
        ],
        status: "Active",
        createdAt: "2023-02-01",
        updatedAt: "2023-04-01"
      },
      {
        id: 3,
        name: "Emergency Overtime Policy",
        description: "Emergency overtime for critical situations",
        rate: "2.5x",
        maxHours: 12,
        eligibilityCriteria: "hourly",
        overtimeType: "emergency",
        dailyLimit: 6,
        weeklyCap: 12,
        monthlyCap: 40,
        minimumThreshold: 0,
        roundingLogic: "none",
        approvalRequirement: "auto",
        overtimeWindow: "anytime",
        breakDeduction: false,
        tieredRates: [
          { hours: "First 2 hours", rate: "2.5x" },
          { hours: "After 2 hours", rate: "3.5x" }
        ],
        dayTypeRates: {
          weekday: "2.5x",
          weekend: "3.0x",
          holiday: "3.5x"
        },
        shiftBased: false,
        linkedShifts: [],
        splitShiftRules: false,
        linkedPolicies: [],
        policyHistory: [
          {
            version: "1.0",
            createdAt: "2023-03-01",
            updatedAt: "2023-03-01",
            changes: { "rate": "2.5x", "overtimeType": "emergency" }
          }
        ],
        customFields: [
          { name: "Emergency Type", type: "text" },
          { name: "Manager Approval", type: "boolean" }
        ],
        complianceRules: [
          { rule: "Emergency Protocol", description: "Follows emergency response procedures" }
        ],
        status: "Active",
        createdAt: "2023-03-01",
        updatedAt: "2023-03-01"
      },
      {
        id: 4,
        name: "Night Shift Overtime",
        description: "Overtime for night shift workers",
        rate: "1.75x",
        maxHours: 16,
        eligibilityCriteria: "hourly",
        overtimeType: "nightShift",
        dailyLimit: 6,
        weeklyCap: 16,
        monthlyCap: 64,
        minimumThreshold: 15,
        roundingLogic: "15min",
        approvalRequirement: "manager",
        overtimeWindow: "afterShift",
        breakDeduction: true,
        tieredRates: [
          { hours: "First 4 hours", rate: "1.75x" },
          { hours: "After 4 hours", rate: "2.25x" }
        ],
        dayTypeRates: {
          weekday: "1.75x",
          weekend: "2.0x",
          holiday: "2.5x"
        },
        shiftBased: true,
        linkedShifts: ["Night Shift", "Graveyard Shift"],
        splitShiftRules: true,
        linkedPolicies: [
          { type: "timeOff", id: "3" }
        ],
        policyHistory: [
          {
            version: "1.0",
            createdAt: "2023-05-01",
            updatedAt: "2023-05-01",
            changes: { "rate": "1.75x", "overtimeType": "nightShift" }
          }
        ],
        customFields: [
          { name: "Shift Type", type: "text" },
          { name: "Night Differential", type: "boolean" }
        ],
        complianceRules: [
          { rule: "Night Work Regulations", description: "Follows night work safety regulations" }
        ],
        status: "Active",
        createdAt: "2023-05-01",
        updatedAt: "2023-05-01"
      },
      {
        id: 5,
        name: "Part-Time Overtime",
        description: "Overtime for part-time employees",
        rate: "1.25x",
        maxHours: 8,
        eligibilityCriteria: "parttime",
        overtimeType: "regular",
        dailyLimit: 2,
        weeklyCap: 8,
        monthlyCap: 32,
        minimumThreshold: 30,
        roundingLogic: "30min",
        approvalRequirement: "auto",
        overtimeWindow: "afterShift",
        breakDeduction: false,
        tieredRates: [],
        dayTypeRates: {
          weekday: "1.25x",
          weekend: "1.5x",
          holiday: "2.0x"
        },
        shiftBased: false,
        linkedShifts: [],
        splitShiftRules: false,
        linkedPolicies: [],
        policyHistory: [
          {
            version: "1.0",
            createdAt: "2023-06-01",
            updatedAt: "2023-06-01",
            changes: { "rate": "1.25x", "eligibilityCriteria": "parttime" }
          }
        ],
        customFields: [
          { name: "Hours Worked", type: "number" },
          { name: "Regular Schedule", type: "text" }
        ],
        complianceRules: [
          { rule: "Part-Time Regulations", description: "Follows part-time employment laws" }
        ],
        status: "Active",
        createdAt: "2023-06-01",
        updatedAt: "2023-06-01"
      }
    ],
    flexibleWorkPolicies: [
      {
        id: 1,
        name: "Hybrid Work Policy",
        description: "3 days office, 2 days remote with flexible hours",
        workType: "Hybrid",
        eligibilityCriteria: "fulltime",
        workingHoursRange: {
          startTime: "08:00",
          endTime: "18:00",
          coreHoursStart: "10:00",
          coreHoursEnd: "16:00"
        },
        minimumOfficeDays: 3,
        officeVisitPolicy: "monthly",
        approvalWorkflow: "manager",
        trialPeriod: 3,
        workLocationType: "hybrid",
        timeTrackingRequirement: "system",
        availabilityRules: {
          responseTime: 2,
          onlineHours: "core",
          asyncAllowed: false
        },
        deskBookingRequirement: true,
        equipmentPolicy: "company",
        vpnComplianceRequired: true,
        policyExpiryDate: "2024-12-31",
        geoRestrictions: [
          { country: "United Kingdom", reason: "Tax compliance" },
          { country: "European Union", reason: "Data protection" }
        ],
        policyTags: ["Hybrid-Pilot", "Flexible-Hours", "Office-Required"],
        assignedEmployees: ["John Smith", "Sarah Johnson", "Mike Wilson"],
        policyHistory: [
          {
            version: "1.0",
            createdAt: "2023-01-01",
            updatedAt: "2023-01-01",
            changes: { "workType": "Hybrid", "minimumOfficeDays": "3" }
          }
        ],
        customFields: [
          { name: "Home Office Setup", type: "text" },
          { name: "Internet Speed", type: "number" }
        ],
        status: "Active",
        createdAt: "2023-01-01",
        updatedAt: "2023-01-01"
      },
      {
        id: 2,
        name: "Remote-First Policy",
        description: "Fully remote with async-friendly working",
        workType: "Remote",
        eligibilityCriteria: "all",
        workingHoursRange: {
          startTime: "06:00",
          endTime: "22:00",
          coreHoursStart: "12:00",
          coreHoursEnd: "16:00"
        },
        minimumOfficeDays: 0,
        officeVisitPolicy: "quarterly",
        approvalWorkflow: "auto",
        trialPeriod: 1,
        workLocationType: "remote",
        timeTrackingRequirement: "manual",
        availabilityRules: {
          responseTime: 4,
          onlineHours: "flexible",
          asyncAllowed: true
        },
        deskBookingRequirement: false,
        equipmentPolicy: "employee",
        vpnComplianceRequired: true,
        policyExpiryDate: "2024-06-30",
        geoRestrictions: [
          { country: "United States", reason: "Employment law compliance" }
        ],
        policyTags: ["Remote-First", "Async-Friendly", "Global"],
        assignedEmployees: ["Alex Chen", "Maria Garcia", "David Brown"],
        policyHistory: [
          {
            version: "1.0",
            createdAt: "2023-02-01",
            updatedAt: "2023-02-01",
            changes: { "workType": "Remote", "asyncAllowed": "true" }
          }
        ],
        customFields: [
          { name: "Time Zone", type: "text" },
          { name: "Work Environment", type: "text" }
        ],
        status: "Active",
        createdAt: "2023-02-01",
        updatedAt: "2023-02-01"
      },
      {
        id: 3,
        name: "Flexible Office Policy",
        description: "Office-based with flexible start/end times",
        workType: "Flexible Office",
        eligibilityCriteria: "permanent",
        workingHoursRange: {
          startTime: "07:00",
          endTime: "19:00",
          coreHoursStart: "10:00",
          coreHoursEnd: "15:00"
        },
        minimumOfficeDays: 5,
        officeVisitPolicy: "none",
        approvalWorkflow: "hr",
        trialPeriod: 0,
        workLocationType: "office",
        timeTrackingRequirement: "hybrid",
        availabilityRules: {
          responseTime: 1,
          onlineHours: "full",
          asyncAllowed: false
        },
        deskBookingRequirement: false,
        equipmentPolicy: "company",
        vpnComplianceRequired: false,
        policyExpiryDate: "",
        geoRestrictions: [],
        policyTags: ["Office-First", "Flexible-Hours", "Core-Hours"],
        assignedEmployees: ["Lisa Anderson", "Tom Davis", "Emma Wilson"],
        policyHistory: [
          {
            version: "1.0",
            createdAt: "2023-03-01",
            updatedAt: "2023-03-01",
            changes: { "workType": "Flexible Office", "minimumOfficeDays": "5" }
          }
        ],
        customFields: [
          { name: "Preferred Start Time", type: "time" },
          { name: "Department", type: "text" }
        ],
        status: "Active",
        createdAt: "2023-03-01",
        updatedAt: "2023-03-01"
      },
      {
        id: 4,
        name: "Field Work Policy",
        description: "Field-based work with mobile office setup",
        workType: "Field Work",
        eligibilityCriteria: "contract",
        workingHoursRange: {
          startTime: "06:00",
          endTime: "20:00",
          coreHoursStart: "09:00",
          coreHoursEnd: "17:00"
        },
        minimumOfficeDays: 1,
        officeVisitPolicy: "monthly",
        approvalWorkflow: "manager",
        trialPeriod: 2,
        workLocationType: "field",
        timeTrackingRequirement: "system",
        availabilityRules: {
          responseTime: 3,
          onlineHours: "flexible",
          asyncAllowed: true
        },
        deskBookingRequirement: true,
        equipmentPolicy: "hybrid",
        vpnComplianceRequired: true,
        policyExpiryDate: "2024-03-31",
        geoRestrictions: [
          { country: "United Kingdom", reason: "Local regulations" }
        ],
        policyTags: ["Field-Based", "Mobile-Office", "Client-Facing"],
        assignedEmployees: ["James Miller", "Sophie Taylor", "Robert Johnson"],
        policyHistory: [
          {
            version: "1.0",
            createdAt: "2023-04-01",
            updatedAt: "2023-04-01",
            changes: { "workType": "Field Work", "equipmentPolicy": "hybrid" }
          }
        ],
        customFields: [
          { name: "Client Locations", type: "text" },
          { name: "Vehicle Required", type: "boolean" }
        ],
        status: "Active",
        createdAt: "2023-04-01",
        updatedAt: "2023-04-01"
      },
      {
        id: 5,
        name: "Part-Time Flexible Policy",
        description: "Flexible working for part-time employees",
        workType: "Part-Time Flexible",
        eligibilityCriteria: "parttime",
        workingHoursRange: {
          startTime: "08:00",
          endTime: "18:00",
          coreHoursStart: "12:00",
          coreHoursEnd: "14:00"
        },
        minimumOfficeDays: 1,
        officeVisitPolicy: "none",
        approvalWorkflow: "auto",
        trialPeriod: 0,
        workLocationType: "hybrid",
        timeTrackingRequirement: "manual",
        availabilityRules: {
          responseTime: 6,
          onlineHours: "core",
          asyncAllowed: true
        },
        deskBookingRequirement: false,
        equipmentPolicy: "employee",
        vpnComplianceRequired: false,
        policyExpiryDate: "",
        geoRestrictions: [],
        policyTags: ["Part-Time", "Flexible", "Student-Friendly"],
        assignedEmployees: ["Anna White", "Chris Lee", "Rachel Green"],
        policyHistory: [
          {
            version: "1.0",
            createdAt: "2023-05-01",
            updatedAt: "2023-05-01",
            changes: { "workType": "Part-Time Flexible", "eligibilityCriteria": "parttime" }
          }
        ],
        customFields: [
          { name: "Study Schedule", type: "text" },
          { name: "Preferred Days", type: "text" }
        ],
        status: "Active",
        createdAt: "2023-05-01",
        updatedAt: "2023-05-01"
      }
    ],
    bankHolidayPolicies: [
      {
        id: 1,
        name: 'UK Public Holidays',
        description: 'Standard UK bank holidays including Christmas, Easter, and summer bank holiday',
        holidays: 8,
        country: 'UK',
        region: 'England',
        holidayType: 'national',
        observedOn: 'weekday',
        floatingHolidays: 2,
        locationBased: true,
        assignedLocations: ['London Office', 'Manchester Office', 'Birmingham Office'],
        roleBasedVisibility: false,
        eligibleRoles: [],
        autoMarkAttendance: true,
        impactOnLeaveBalance: 'exclude',
        shiftOverride: true,
        holidayList: [
          { date: '2025-01-01', title: 'New Year\'s Day', type: 'national', mandatory: true },
          { date: '2025-04-18', title: 'Good Friday', type: 'religious', mandatory: true },
          { date: '2025-04-21', title: 'Easter Monday', type: 'religious', mandatory: true },
          { date: '2025-05-05', title: 'Early May Bank Holiday', type: 'national', mandatory: true },
          { date: '2025-05-26', title: 'Spring Bank Holiday', type: 'national', mandatory: true },
          { date: '2025-08-25', title: 'Summer Bank Holiday', type: 'national', mandatory: true },
          { date: '2025-12-25', title: 'Christmas Day', type: 'religious', mandatory: true },
          { date: '2025-12-26', title: 'Boxing Day', type: 'national', mandatory: true }
        ],
        calendarView: true,
        notificationEnabled: true,
        notificationDays: 7,
        autoAssignNewHires: true,
        policyHistory: [],
        customFields: [],
        status: 'Active',
        lastUpdated: '2023-01-01'
      },
      {
        id: 2,
        name: 'UAE Public Holidays',
        description: 'UAE national and religious holidays including Eid and National Day',
        holidays: 12,
        country: 'UAE',
        region: 'Dubai',
        holidayType: 'mixed',
        observedOn: 'exact',
        floatingHolidays: 3,
        locationBased: true,
        assignedLocations: ['Dubai Office', 'Abu Dhabi Office'],
        roleBasedVisibility: true,
        eligibleRoles: ['Local Staff', 'Expat Staff'],
        autoMarkAttendance: true,
        impactOnLeaveBalance: 'exclude',
        shiftOverride: false,
        holidayList: [
          { date: '2025-01-01', title: 'New Year\'s Day', type: 'national', mandatory: true },
          { date: '2025-03-21', title: 'Eid al-Fitr', type: 'religious', mandatory: true },
          { date: '2025-03-22', title: 'Eid al-Fitr Holiday', type: 'religious', mandatory: true },
          { date: '2025-03-23', title: 'Eid al-Fitr Holiday', type: 'religious', mandatory: true },
          { date: '2025-06-28', title: 'Eid al-Adha', type: 'religious', mandatory: true },
          { date: '2025-06-29', title: 'Eid al-Adha Holiday', type: 'religious', mandatory: true },
          { date: '2025-06-30', title: 'Eid al-Adha Holiday', type: 'religious', mandatory: true },
          { date: '2025-07-19', title: 'Islamic New Year', type: 'religious', mandatory: true },
          { date: '2025-09-27', title: 'Prophet Muhammad\'s Birthday', type: 'religious', mandatory: true },
          { date: '2025-12-02', title: 'UAE National Day', type: 'national', mandatory: true },
          { date: '2025-12-03', title: 'UAE National Day Holiday', type: 'national', mandatory: true }
        ],
        calendarView: true,
        notificationEnabled: true,
        notificationDays: 14,
        autoAssignNewHires: true,
        policyHistory: [],
        customFields: [],
        status: 'Active',
        lastUpdated: '2023-02-15'
      },
      {
        id: 3,
        name: 'Somalia Public Holidays',
        description: 'Somalia national holidays and Islamic religious observances',
        holidays: 10,
        country: 'SO',
        region: 'Mogadishu',
        holidayType: 'mixed',
        observedOn: 'exact',
        floatingHolidays: 1,
        locationBased: false,
        assignedLocations: [],
        roleBasedVisibility: false,
        eligibleRoles: [],
        autoMarkAttendance: true,
        impactOnLeaveBalance: 'exclude',
        shiftOverride: false,
        holidayList: [
          { date: '2025-01-01', title: 'New Year\'s Day', type: 'national', mandatory: true },
          { date: '2025-03-21', title: 'Eid al-Fitr', type: 'religious', mandatory: true },
          { date: '2025-03-22', title: 'Eid al-Fitr Holiday', type: 'religious', mandatory: true },
          { date: '2025-06-28', title: 'Eid al-Adha', type: 'religious', mandatory: true },
          { date: '2025-06-29', title: 'Eid al-Adha Holiday', type: 'religious', mandatory: true },
          { date: '2025-07-01', title: 'Independence Day', type: 'national', mandatory: true },
          { date: '2025-07-19', title: 'Islamic New Year', type: 'religious', mandatory: true },
          { date: '2025-09-27', title: 'Prophet Muhammad\'s Birthday', type: 'religious', mandatory: true }
        ],
        calendarView: false,
        notificationEnabled: false,
        notificationDays: 7,
        autoAssignNewHires: true,
        policyHistory: [],
        customFields: [],
        status: 'Active',
        lastUpdated: '2023-03-01'
      },
      {
        id: 4,
        name: 'Global Remote Team',
        description: 'Flexible holiday policy for remote workers across different time zones',
        holidays: 15,
        country: 'Global',
        region: '',
        holidayType: 'optional',
        observedOn: 'weekday',
        floatingHolidays: 5,
        locationBased: false,
        assignedLocations: [],
        roleBasedVisibility: true,
        eligibleRoles: ['Remote Worker', 'Digital Nomad', 'Contractor'],
        autoMarkAttendance: false,
        impactOnLeaveBalance: 'conditional',
        shiftOverride: false,
        holidayList: [
          { date: '2025-01-01', title: 'New Year\'s Day', type: 'national', mandatory: false },
          { date: '2025-12-25', title: 'Christmas Day', type: 'religious', mandatory: false },
          { date: '2025-12-26', title: 'Boxing Day', type: 'national', mandatory: false }
        ],
        calendarView: true,
        notificationEnabled: true,
        notificationDays: 3,
        autoAssignNewHires: false,
        policyHistory: [],
        customFields: [],
        status: 'Active',
        lastUpdated: '2023-04-10'
      },
      {
        id: 5,
        name: 'US Federal Holidays',
        description: 'Standard US federal holidays observed by government and many private sector employees',
        holidays: 10,
        country: 'US',
        region: 'Federal',
        holidayType: 'national',
        observedOn: 'weekday',
        floatingHolidays: 2,
        locationBased: true,
        assignedLocations: ['New York Office', 'California Office', 'Texas Office'],
        roleBasedVisibility: false,
        eligibleRoles: [],
        autoMarkAttendance: true,
        impactOnLeaveBalance: 'exclude',
        shiftOverride: true,
        holidayList: [
          { date: '2025-01-01', title: 'New Year\'s Day', type: 'national', mandatory: true },
          { date: '2025-01-20', title: 'Martin Luther King Jr. Day', type: 'national', mandatory: true },
          { date: '2025-02-17', title: 'Presidents\' Day', type: 'national', mandatory: true },
          { date: '2025-05-26', title: 'Memorial Day', type: 'national', mandatory: true },
          { date: '2025-07-04', title: 'Independence Day', type: 'national', mandatory: true },
          { date: '2025-09-01', title: 'Labor Day', type: 'national', mandatory: true },
          { date: '2025-10-13', title: 'Columbus Day', type: 'national', mandatory: true },
          { date: '2025-11-11', title: 'Veterans Day', type: 'national', mandatory: true },
          { date: '2025-11-27', title: 'Thanksgiving Day', type: 'national', mandatory: true },
          { date: '2025-12-25', title: 'Christmas Day', type: 'religious', mandatory: true }
        ],
        calendarView: true,
        notificationEnabled: true,
        notificationDays: 7,
        autoAssignNewHires: true,
        policyHistory: [],
        customFields: [],
        status: 'Active',
        lastUpdated: '2023-05-20'
      }
    ],
    payPolicies: [
      {
        id: 1,
        name: 'Standard UK Salary',
        description: 'Standard monthly salary with UK tax deductions and benefits',
        payFrequency: 'monthly',
        currency: 'GBP',
        paymentMethod: 'bank',
        taxDeductionRule: 'gross',
        benefitsInclusion: 'separate',
        deductionsPolicy: 'standard',
        baseSalaryRange: { min: 25000, max: 75000 },
        eligibilityCriteria: 'fulltime',
        bonusCommissionFormula: 'Annual bonus of 10-15% based on performance rating',
        probationPeriodPayRule: 'full',
        managementAllowances: true,
        allowances: [
          { type: 'Housing Allowance', amount: 500, frequency: 'monthly' },
          { type: 'Transport Allowance', amount: 200, frequency: 'monthly' },
          { type: 'Performance Bonus', amount: 5000, frequency: 'annually' }
        ],
        autoDeductUnpaidLeave: true,
        prorationRules: 'standard',
        payslipTemplate: 'detailed',
        finalSettlementHandling: 'standard',
        endOfServiceBenefit: true,
        assignedEmployees: ['John Smith', 'Sarah Johnson', 'Michael Brown'],
        policyHistory: [],
        customFields: [],
        status: 'Active',
        lastUpdated: '2023-01-15'
      },
      {
        id: 2,
        name: 'US Hourly Rate',
        description: 'Hourly wage structure for US-based employees with overtime',
        payFrequency: 'biweekly',
        currency: 'USD',
        paymentMethod: 'bank',
        taxDeductionRule: 'gross',
        benefitsInclusion: 'separate',
        deductionsPolicy: 'comprehensive',
        baseSalaryRange: { min: 15, max: 45 },
        eligibilityCriteria: 'contract',
        bonusCommissionFormula: 'Overtime at 1.5x rate after 40 hours/week',
        probationPeriodPayRule: 'full',
        managementAllowances: false,
        allowances: [],
        autoDeductUnpaidLeave: true,
        prorationRules: 'weekly',
        payslipTemplate: 'simple',
        finalSettlementHandling: 'standard',
        endOfServiceBenefit: false,
        assignedEmployees: ['Emily Davis', 'David Wilson'],
        policyHistory: [],
        customFields: [],
        status: 'Active',
        lastUpdated: '2023-02-20'
      },
      {
        id: 3,
        name: 'UAE Expat Package',
        description: 'Comprehensive expat compensation package for UAE employees',
        payFrequency: 'monthly',
        currency: 'AED',
        paymentMethod: 'bank',
        taxDeductionRule: 'none',
        benefitsInclusion: 'included',
        deductionsPolicy: 'minimal',
        baseSalaryRange: { min: 15000, max: 50000 },
        eligibilityCriteria: 'management',
        bonusCommissionFormula: 'Annual bonus of 20-30% based on company performance',
        probationPeriodPayRule: 'full',
        managementAllowances: true,
        allowances: [
          { type: 'Housing Allowance', amount: 8000, frequency: 'monthly' },
          { type: 'Transport Allowance', amount: 2000, frequency: 'monthly' },
          { type: 'Education Allowance', amount: 15000, frequency: 'annually' },
          { type: 'Relocation Allowance', amount: 50000, frequency: 'one-time' }
        ],
        autoDeductUnpaidLeave: false,
        prorationRules: 'monthly',
        payslipTemplate: 'detailed',
        finalSettlementHandling: 'full',
        endOfServiceBenefit: true,
        assignedEmployees: ['Ahmed Hassan', 'Fatima Al-Zahra'],
        policyHistory: [],
        customFields: [],
        status: 'Active',
        lastUpdated: '2023-03-10'
      },
      {
        id: 4,
        name: 'Somalia Local Staff',
        description: 'Local compensation package for Somalia-based employees',
        payFrequency: 'monthly',
        currency: 'USD',
        paymentMethod: 'mobile',
        taxDeductionRule: 'none',
        benefitsInclusion: 'separate',
        deductionsPolicy: 'minimal',
        baseSalaryRange: { min: 800, max: 3000 },
        eligibilityCriteria: 'all',
        bonusCommissionFormula: 'Performance bonus of 5-10% quarterly',
        probationPeriodPayRule: 'partial',
        managementAllowances: false,
        allowances: [
          { type: 'Transport Allowance', amount: 100, frequency: 'monthly' },
          { type: 'Meal Allowance', amount: 150, frequency: 'monthly' }
        ],
        autoDeductUnpaidLeave: true,
        prorationRules: 'standard',
        payslipTemplate: 'simple',
        finalSettlementHandling: 'standard',
        endOfServiceBenefit: false,
        assignedEmployees: ['Abdi Mohamed', 'Amina Hassan'],
        policyHistory: [],
        customFields: [],
        status: 'Active',
        lastUpdated: '2023-04-05'
      },
      {
        id: 5,
        name: 'Sales Commission',
        description: 'Commission-based pay structure for sales and business development roles',
        payFrequency: 'monthly',
        currency: 'GBP',
        paymentMethod: 'bank',
        taxDeductionRule: 'gross',
        benefitsInclusion: 'separate',
        deductionsPolicy: 'standard',
        baseSalaryRange: { min: 20000, max: 40000 },
        eligibilityCriteria: 'sales',
        bonusCommissionFormula: '10% commission on sales up to £100k, 15% above £100k',
        probationPeriodPayRule: 'full',
        managementAllowances: false,
        allowances: [
          { type: 'Car Allowance', amount: 400, frequency: 'monthly' },
          { type: 'Phone Allowance', amount: 50, frequency: 'monthly' }
        ],
        autoDeductUnpaidLeave: false,
        prorationRules: 'custom',
        payslipTemplate: 'detailed',
        finalSettlementHandling: 'custom',
        endOfServiceBenefit: true,
        assignedEmployees: ['Lisa Anderson', 'James Thompson'],
        policyHistory: [],
        customFields: [],
        status: 'Active',
        lastUpdated: '2023-05-12'
      }
    ]
  };

  const [policies, setPolicies] = useState(defaultPolicies);
  const router = useRouter();

  // Load from localStorage or initialize
  useEffect(() => {
    const role = localStorage.getItem('role');
    setUserRole(role);
    
    const stored = localStorage.getItem(LOCAL_KEY);
    let parsed;
    
    if (stored) {
      try {
        parsed = JSON.parse(stored);
        // Ensure Time Off policies have all new fields (preserve user edits)
        if (parsed.timeOffPolicies) {
          parsed.timeOffPolicies = parsed.timeOffPolicies.map(policy => ({
            ...policy,
            blackoutPeriods: policy.blackoutPeriods || [],
            departmentOverridesLeaves: policy.departmentOverridesLeaves || policy.departmentOverrides || [],
            customFields: policy.customFields || [],
            policyHistory: policy.policyHistory || [],
            linkedPolicies: policy.linkedPolicies || [],
            advancedRules: policy.advancedRules || [],
            companyYearStart: policy.companyYearStart || '2024-07-01',
            companyYearEnd: policy.companyYearEnd || '2025-06-30',
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
          }));
        }
        // Ensure Overtime policies have all new fields (preserve user edits)
        if (parsed.overtimePolicies) {
          parsed.overtimePolicies = parsed.overtimePolicies.map(policy => ({
            ...policy,
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
            linkedPolicies: policy.linkedPolicies || [],
            policyHistory: policy.policyHistory || [],
            customFields: policy.customFields || [],
            complianceRules: policy.complianceRules || [],
          }));
        }
        // Ensure Flexible Work policies have all new fields (preserve user edits)
        if (parsed.flexibleWorkPolicies) {
          parsed.flexibleWorkPolicies = parsed.flexibleWorkPolicies.map(policy => ({
            ...policy,
            eligibilityCriteria: policy.eligibilityCriteria || 'all',
            workingHoursRange: policy.workingHoursRange || { startTime: '09:00', endTime: '17:00', coreHoursStart: '11:00', coreHoursEnd: '15:00' },
            minimumOfficeDays: policy.minimumOfficeDays || 0,
            officeVisitPolicy: policy.officeVisitPolicy || 'none',
            approvalWorkflow: policy.approvalWorkflow || 'manager',
            trialPeriod: policy.trialPeriod || 0,
            workLocationType: policy.workLocationType || 'hybrid',
            timeTrackingRequirement: policy.timeTrackingRequirement || 'system',
            availabilityRules: policy.availabilityRules || { responseTime: 2, onlineHours: 'core', asyncAllowed: false },
            deskBookingRequirement: policy.deskBookingRequirement || false,
            equipmentPolicy: policy.equipmentPolicy || 'company',
            vpnComplianceRequired: policy.vpnComplianceRequired || true,
            policyExpiryDate: policy.policyExpiryDate || '',
            geoRestrictions: policy.geoRestrictions || [],
            policyTags: policy.policyTags || [],
            assignedEmployees: policy.assignedEmployees || [],
            policyHistory: policy.policyHistory || [],
            customFields: policy.customFields || [],
          }));
        }
        // Check Public Holiday policies
        if (parsed.bankHolidayPolicies) {
          parsed.bankHolidayPolicies = parsed.bankHolidayPolicies.map(policy => {
            const hasAllFields = policy.country !== undefined && 
                               policy.holidayType !== undefined &&
                               policy.floatingHolidays !== undefined;
            if (!hasAllFields) needsUpdate = true;
            return {
              ...policy,
              country: policy.country || 'UK',
              region: policy.region || '',
              holidayType: policy.holidayType || 'national',
              observedOn: policy.observedOn || 'weekday',
              floatingHolidays: policy.floatingHolidays || 0,
              locationBased: policy.locationBased || false,
              assignedLocations: policy.assignedLocations || [],
              roleBasedVisibility: policy.roleBasedVisibility || false,
              eligibleRoles: policy.eligibleRoles || [],
              autoMarkAttendance: policy.autoMarkAttendance !== undefined ? policy.autoMarkAttendance : true,
              impactOnLeaveBalance: policy.impactOnLeaveBalance || 'exclude',
              shiftOverride: policy.shiftOverride || false,
              holidayList: policy.holidayList || [],
              calendarView: policy.calendarView || false,
              notificationEnabled: policy.notificationEnabled || false,
              notificationDays: policy.notificationDays || 7,
              autoAssignNewHires: policy.autoAssignNewHires !== undefined ? policy.autoAssignNewHires : true,
              policyHistory: policy.policyHistory || [],
              customFields: policy.customFields || [],
            };
          });
        }
        // Check Pay policies
        if (parsed.payPolicies) {
          parsed.payPolicies = parsed.payPolicies.map(policy => {
            const hasAllFields = policy.payFrequency !== undefined && 
                               policy.currency !== undefined &&
                               policy.baseSalaryRange !== undefined;
            if (!hasAllFields) needsUpdate = true;
            return {
              ...policy,
              payFrequency: policy.payFrequency || 'monthly',
              currency: policy.currency || 'GBP',
              paymentMethod: policy.paymentMethod || 'bank',
              taxDeductionRule: policy.taxDeductionRule || 'gross',
              benefitsInclusion: policy.benefitsInclusion || 'separate',
              deductionsPolicy: policy.deductionsPolicy || 'standard',
              baseSalaryRange: policy.baseSalaryRange || { min: 0, max: 0 },
              eligibilityCriteria: policy.eligibilityCriteria || 'all',
              bonusCommissionFormula: policy.bonusCommissionFormula || '',
              probationPeriodPayRule: policy.probationPeriodPayRule || 'full',
              managementAllowances: policy.managementAllowances || false,
              allowances: policy.allowances || [],
              autoDeductUnpaidLeave: policy.autoDeductUnpaidLeave !== undefined ? policy.autoDeductUnpaidLeave : true,
              prorationRules: policy.prorationRules || 'standard',
              payslipTemplate: policy.payslipTemplate || 'default',
              finalSettlementHandling: policy.finalSettlementHandling || 'standard',
              endOfServiceBenefit: policy.endOfServiceBenefit || false,
              assignedEmployees: policy.assignedEmployees || [],
              policyHistory: policy.policyHistory || [],
              customFields: policy.customFields || [],
            };
          });
        }
        setPolicies(parsed);
      } catch (error) {
        console.error('Error parsing localStorage data:', error);
        // Only reset to defaults if there's a parsing error
        localStorage.removeItem(LOCAL_KEY);
        localStorage.setItem(LOCAL_KEY, JSON.stringify(defaultPolicies));
        setPolicies(defaultPolicies);
      }
    } else {
      // Only initialize with defaults if no data exists
      localStorage.setItem(LOCAL_KEY, JSON.stringify(defaultPolicies));
      setPolicies(defaultPolicies);
    }
  }, []);

  // Refresh data when page becomes visible (e.g., returning from form)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        const stored = localStorage.getItem(LOCAL_KEY);
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            // Only update if data is missing required fields
            let needsUpdate = false;
            
            // Check Time Off policies
            if (parsed.timeOffPolicies) {
              parsed.timeOffPolicies = parsed.timeOffPolicies.map(policy => {
                const hasAllFields = policy.blackoutPeriods !== undefined && 
                                   policy.departmentOverridesLeaves !== undefined &&
                                   policy.customFields !== undefined;
                if (!hasAllFields) needsUpdate = true;
                return {
                  ...policy,
                  blackoutPeriods: policy.blackoutPeriods || [],
                  departmentOverridesLeaves: policy.departmentOverridesLeaves || policy.departmentOverrides || [],
                  customFields: policy.customFields || [],
                  policyHistory: policy.policyHistory || [],
                  linkedPolicies: policy.linkedPolicies || [],
                  advancedRules: policy.advancedRules || [],
                  companyYearStart: policy.companyYearStart || '2024-07-01',
                  companyYearEnd: policy.companyYearEnd || '2025-06-30',
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
                };
              });
            }
            
            // Check Overtime policies
            if (parsed.overtimePolicies) {
              parsed.overtimePolicies = parsed.overtimePolicies.map(policy => {
                const hasAllFields = policy.eligibilityCriteria !== undefined && 
                                   policy.overtimeType !== undefined &&
                                   policy.dailyLimit !== undefined;
                if (!hasAllFields) needsUpdate = true;
                return {
                  ...policy,
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
                  linkedPolicies: policy.linkedPolicies || [],
                  policyHistory: policy.policyHistory || [],
                  customFields: policy.customFields || [],
                  complianceRules: policy.complianceRules || [],
                };
              });
            }
            
            // Check Flexible Work policies
            if (parsed.flexibleWorkPolicies) {
              parsed.flexibleWorkPolicies = parsed.flexibleWorkPolicies.map(policy => {
                const hasAllFields = policy.eligibilityCriteria !== undefined && 
                                   policy.workingHoursRange !== undefined &&
                                   policy.minimumOfficeDays !== undefined;
                if (!hasAllFields) needsUpdate = true;
                return {
                  ...policy,
                  eligibilityCriteria: policy.eligibilityCriteria || 'all',
                  workingHoursRange: policy.workingHoursRange || { startTime: '09:00', endTime: '17:00', coreHoursStart: '11:00', coreHoursEnd: '15:00' },
                  minimumOfficeDays: policy.minimumOfficeDays || 0,
                  officeVisitPolicy: policy.officeVisitPolicy || 'none',
                  approvalWorkflow: policy.approvalWorkflow || 'manager',
                  trialPeriod: policy.trialPeriod || 0,
                  workLocationType: policy.workLocationType || 'hybrid',
                  timeTrackingRequirement: policy.timeTrackingRequirement || 'system',
                  availabilityRules: policy.availabilityRules || { responseTime: 2, onlineHours: 'core', asyncAllowed: false },
                  deskBookingRequirement: policy.deskBookingRequirement || false,
                  equipmentPolicy: policy.equipmentPolicy || 'company',
                  vpnComplianceRequired: policy.vpnComplianceRequired || true,
                  policyExpiryDate: policy.policyExpiryDate || '',
                  geoRestrictions: policy.geoRestrictions || [],
                  policyTags: policy.policyTags || [],
                  assignedEmployees: policy.assignedEmployees || [],
                  policyHistory: policy.policyHistory || [],
                  customFields: policy.customFields || [],
                };
              });
            }
            
            // Check Public Holiday policies
            if (parsed.bankHolidayPolicies) {
              parsed.bankHolidayPolicies = parsed.bankHolidayPolicies.map(policy => {
                const hasAllFields = policy.country !== undefined && 
                                   policy.holidayType !== undefined &&
                                   policy.floatingHolidays !== undefined;
                if (!hasAllFields) needsUpdate = true;
                return {
                  ...policy,
                  country: policy.country || 'UK',
                  region: policy.region || '',
                  holidayType: policy.holidayType || 'national',
                  observedOn: policy.observedOn || 'weekday',
                  floatingHolidays: policy.floatingHolidays || 0,
                  locationBased: policy.locationBased || false,
                  assignedLocations: policy.assignedLocations || [],
                  roleBasedVisibility: policy.roleBasedVisibility || false,
                  eligibleRoles: policy.eligibleRoles || [],
                  autoMarkAttendance: policy.autoMarkAttendance !== undefined ? policy.autoMarkAttendance : true,
                  impactOnLeaveBalance: policy.impactOnLeaveBalance || 'exclude',
                  shiftOverride: policy.shiftOverride || false,
                  holidayList: policy.holidayList || [],
                  calendarView: policy.calendarView || false,
                  notificationEnabled: policy.notificationEnabled || false,
                  notificationDays: policy.notificationDays || 7,
                  autoAssignNewHires: policy.autoAssignNewHires !== undefined ? policy.autoAssignNewHires : true,
                  policyHistory: policy.policyHistory || [],
                  customFields: policy.customFields || [],
                };
              });
            }
            
            // Check Pay policies
            if (parsed.payPolicies) {
              parsed.payPolicies = parsed.payPolicies.map(policy => {
                const hasAllFields = policy.payFrequency !== undefined && 
                                   policy.currency !== undefined &&
                                   policy.baseSalaryRange !== undefined;
                if (!hasAllFields) needsUpdate = true;
                return {
                  ...policy,
                  payFrequency: policy.payFrequency || 'monthly',
                  currency: policy.currency || 'GBP',
                  paymentMethod: policy.paymentMethod || 'bank',
                  taxDeductionRule: policy.taxDeductionRule || 'gross',
                  benefitsInclusion: policy.benefitsInclusion || 'separate',
                  deductionsPolicy: policy.deductionsPolicy || 'standard',
                  baseSalaryRange: policy.baseSalaryRange || { min: 0, max: 0 },
                  eligibilityCriteria: policy.eligibilityCriteria || 'all',
                  bonusCommissionFormula: policy.bonusCommissionFormula || '',
                  probationPeriodPayRule: policy.probationPeriodPayRule || 'full',
                  managementAllowances: policy.managementAllowances || false,
                  allowances: policy.allowances || [],
                  autoDeductUnpaidLeave: policy.autoDeductUnpaidLeave !== undefined ? policy.autoDeductUnpaidLeave : true,
                  prorationRules: policy.prorationRules || 'standard',
                  payslipTemplate: policy.payslipTemplate || 'default',
                  finalSettlementHandling: policy.finalSettlementHandling || 'standard',
                  endOfServiceBenefit: policy.endOfServiceBenefit || false,
                  assignedEmployees: policy.assignedEmployees || [],
                  policyHistory: policy.policyHistory || [],
                  customFields: policy.customFields || [],
                };
              });
            }
            
            // Only update state if we actually made changes
            if (needsUpdate) {
              localStorage.setItem(LOCAL_KEY, JSON.stringify(parsed));
              setPolicies(parsed);
            }
          } catch (error) {
            console.error('Error refreshing data:', error);
            // Only reset to defaults if there's a parsing error
            localStorage.removeItem(LOCAL_KEY);
            localStorage.setItem(LOCAL_KEY, JSON.stringify(defaultPolicies));
            setPolicies(defaultPolicies);
          }
        } else {
          // If no data exists, initialize with defaults
          localStorage.setItem(LOCAL_KEY, JSON.stringify(defaultPolicies));
          setPolicies(defaultPolicies);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Helper to update localStorage and state
  const updatePolicies = (newPolicies) => {
    setPolicies(newPolicies);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(newPolicies));
  };

  // Function to manually clear and reinitialize localStorage (for debugging)
  const clearAndReinitialize = () => {
    // Always reset to default data when Reset Data button is clicked
    localStorage.removeItem(LOCAL_KEY);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(defaultPolicies));
    setPolicies(defaultPolicies);
    console.log('Data reset completed');
  };

  // Make function available globally for debugging
  if (typeof window !== 'undefined') {
    window.clearPolicyData = clearAndReinitialize;
  }

  const getPolicyData = () => {
    switch (activeTab) {
      case 'timeOff':
        return policies.timeOffPolicies;
      case 'overtime':
        return policies.overtimePolicies;
      case 'flexibleWork':
        return policies.flexibleWorkPolicies;
      case 'bankHoliday':
        return policies.bankHolidayPolicies;
      case 'pay':
        return policies.payPolicies;
      default:
        return policies.timeOffPolicies;
    }
  };

  const getPolicyIcon = () => {
    switch (activeTab) {
      case 'timeOff':
        return <CalendarIcon className="h-5 w-5" />;
      case 'overtime':
        return <ClockIcon className="h-5 w-5" />;
      case 'flexibleWork':
        return <CogIcon className="h-5 w-5" />;
      case 'bankHoliday':
        return <CalendarIcon className="h-5 w-5" />;
      case 'pay':
        return <CurrencyPoundIcon className="h-5 w-5" />;
      default:
        return <DocumentTextIcon className="h-5 w-5" />;
    }
  };

  // Remove modal logic for add/edit/delete. Will use navigation to form/confirmation page.

  const tabs = [
    { id: 'timeOff', name: 'Time Off Policies', icon: CalendarIcon },
    { id: 'overtime', name: 'Overtime Policies', icon: ClockIcon },
    { id: 'flexibleWork', name: 'Flexible Work Policies', icon: CogIcon },
    { id: 'bankHoliday', name: 'Public Holiday Policies', icon: CalendarIcon },
    { id: 'pay', name: 'Pay Policies', icon: CurrencyPoundIcon }
  ];

  return (
    <Layout title={'Policy & Configuration'} subtitle={'Create and manage all system policies'}>
      <div className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DocumentTextIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Policies</p>
                <p className="text-2xl font-semibold text-gray-900">25</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Policies</p>
                <p className="text-2xl font-semibold text-gray-900">23</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <UsersIcon className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Assigned Employees</p>
                <p className="text-2xl font-semibold text-gray-900">42</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <ClockIcon className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Recent Changes</p>
                <p className="text-2xl font-semibold text-gray-900">18</p>
              </div>
            </div>
          </div>
        </div>

        {/* Policy Tabs */}
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
              <div className="flex space-x-2">
                <button
                  onClick={clearAndReinitialize}
                  className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 text-sm"
                >
                  Reset Data
                </button>
              {userRole === 'business_manager' && (
                <button
                    onClick={() => router.push(`/demo/policy-form?mode=create&type=${activeTab}`)}
                    className="px-4 py-2 bg-[#009D9D] text-white rounded-md hover:bg-[#007a7a] flex items-center space-x-2"
                >
                    {getPolicyIcon()}
                    <span>Add Policy</span>
                </button>
              )}
              </div>
            </div>

            {/* Policy Table */}
            <div className="overflow-x-auto">
              <table className="w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Policy Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-64">Description</th>
                    {activeTab === 'timeOff' && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                    )}
                    {activeTab === 'overtime' && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                    )}
                    {activeTab === 'flexibleWork' && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Working Hours</th>
                    )}
                    {activeTab === 'bankHoliday' && (
                      <>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
                      </>
                    )}

                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {getPolicyData().map((policy) => (
                    <tr key={policy.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                            {getPolicyIcon()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{policy.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className={`px-6 py-4 text-sm text-gray-900 ${activeTab === 'bankHoliday' ? '' : 'max-w-xs'}`} style={activeTab === 'bankHoliday' ? { width: '300px' } : {}}>
                        <div className="break-words">{policy.description}</div>
                      </td>
                      {activeTab === 'timeOff' && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {`${policy.daysPerYear} days/year`}
                        </td>
                      )}
                      {activeTab === 'overtime' && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {`${policy.rate} rate`}
                        </td>
                      )}
                      {activeTab === 'flexibleWork' && (
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          <div className="text-xs">
                            <div>Start: {policy.workingHoursRange?.startTime || 'N/A'}</div>
                            <div>End: {policy.workingHoursRange?.endTime || 'N/A'}</div>
                            <div>Core: {policy.workingHoursRange?.coreHoursStart || 'N/A'} - {policy.workingHoursRange?.coreHoursEnd || 'N/A'}</div>
                          </div>
                        </td>
                      )}
                      {activeTab === 'bankHoliday' && (
                        <>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {`${policy.holidays} holidays`}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{policy.country}</td>
                        </>
                      )}

                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          policy.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {policy.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{policy.updatedAt}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          {userRole === 'business_manager' && (
                            <>
                              <button 
                                onClick={() => router.push(`/demo/policy-form?mode=edit&type=${activeTab}&id=${policy.id}`)}
                                className="text-[#009D9D] hover:text-[#006D6D]"
                                title="Edit"
                              >
                                <PencilIcon className="h-4 w-4" />
                              </button>
                              <button 
                                onClick={() => {
                                  // For now, delete inline for simplicity
                                  const newPolicies = { ...policies };
                                  newPolicies[`${activeTab}Policies`] = newPolicies[`${activeTab}Policies`].filter(p => p.id !== policy.id);
                                  updatePolicies(newPolicies);
                                }}
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

        {/* Removed Add/Edit/Delete Policy Modals. All actions now use navigation or inline logic. */}
      </div>
    </Layout>
  );
};

export default PolicyConfiguration; 