import Sidebar from "./sidebar";
import React, { useState, useEffect } from "react";
import {
  HomeIcon, UserCircleIcon, UsersIcon, ArrowTrendingUpIcon, CalendarIcon, BanknotesIcon,ArrowRightStartOnRectangleIcon,ArrowLeftEndOnRectangleIcon,
  DocumentChartBarIcon, UserGroupIcon, UserPlusIcon, BookmarkSquareIcon, Cog6ToothIcon, BuildingOffice2Icon, ExclamationTriangleIcon, DocumentIcon
} from "@heroicons/react/24/outline";
import { Briefcase, ClockIcon, CogIcon } from "lucide-react";
import { ChartBarIcon, DocumentTextIcon } from "@heroicons/react/24/solid";


// Manager Navigation (View-Only Access)
const newManagerNavigation = [
  { name: "Dashboard", href: "/demo/dashboard", icon: HomeIcon, basePath: "/demo/dashboard" },
  { name: "Employee Directory", href: "/demo/employee-directory", icon: UsersIcon, basePath: "/demo/employee-directory" },
  { name: "Work Schedules", href: "/demo/work-schedules", icon: ClockIcon, basePath: "/demo/work-schedules" },
  { name: "Time Off & Leave Policies", href: "/demo/time-off-leave-policies", icon: DocumentTextIcon, basePath: "/demo/time-off-leave-policies" },
  { name: "Employment Status", href: "/demo/employment-status", icon: UserGroupIcon, basePath: "/demo/employment-status" },
  { name: "Employment History", href: "/demo/employment-history", icon: ChartBarIcon, basePath: "/demo/employment-history" },
];

// HR Manager Navigation (Edit Access with Controlled History Tracking)
const hrManagerNavigation = [
  { name: "Dashboard", href: "/demo/dashboard", icon: HomeIcon, basePath: "/demo/dashboard" },
  { name: "Manage Employees", href: "/demo/manage-employees", icon: UsersIcon, basePath: "/demo/manage-employees" },
  { name: "Job Info Updates", href: "/demo/job-info-updates", icon: DocumentTextIcon, basePath: "/demo/job-info-updates" },
  { name: "Compensation & Policies", href: "/demo/compensation-policies", icon: CogIcon, basePath: "/demo/compensation-policies" },
  { name: "Work Schedules", href: "/demo/work-schedules", icon: ClockIcon, basePath: "/demo/work-schedules" },
  { name: "Status & History", href: "/demo/status-history", icon: UserGroupIcon, basePath: "/demo/status-history" },
];

// Business Configuration Manager Navigation (Full System Admin + Configuration Access)
const businessManagerNavigation = [
  { name: "Dashboard", href: "/demo/dashboard", icon: HomeIcon, basePath: "/demo/dashboard" },
  { name: "Employee Management", href: "/demo/employee-management", icon: UsersIcon, basePath: "/demo/employee-management" },
  { name: "Policy & Configuration", href: "/demo/policy-configuration", icon: CogIcon, basePath: "/demo/policy-configuration" },
  { name: "Work Schedules", href: "/demo/work-schedules", icon: ClockIcon, basePath: "/demo/work-schedules" },
  { name: "Employment Types", href: "/demo/employment-types", icon: DocumentTextIcon, basePath: "/demo/employment-types" },
  { name: "Status & History", href: "/demo/status-history", icon: UserGroupIcon, basePath: "/demo/status-history" },
  { name: "System Drop-downs", href: "/demo/system-dropdowns", icon: CogIcon, basePath: "/demo/system-dropdowns" },
  { name: "Audit Logs", href: "/demo/audit-logs", icon: ChartBarIcon, basePath: "/demo/audit-logs" },
];

// Legacy navigation for backward compatibility
const staffNavigation = [
  { name: "Dashboard", href: "/staff/dashboard", icon: HomeIcon, basePath: "/staff/dashboard" },
  { name: "Attendance", href: "/attendance", icon: Briefcase, basePath: "/attendance" },
  {
    name: "Office Management",
    icon: BuildingOffice2Icon,
    subItems: [
      {
        name: "Attendance",
        basePath: "/office_management/attendance",
        subItems: [
          { name: "Attendance List", href: "/office_management/attendance/list" },
          { name: "Attendance Report", href: "/office_management/attendance/report" }
        ]
      },
      {
        name: "Leave",
        basePath: "/office_management/leave",
        subItems: [
          { name: "Leave List", href: "/office_management/leave/list" },
          { name: "Leave Report", href: "/office_management/leave/report" },
        ]
      },
    ]
  },

  {
    name: "Leave Management", icon: CalendarIcon, basePath: "/leave_management",
    subItems: [
      { name: "Overview", href: "/leave_management/overview", },
      { name: "Request Leave", href: "/leave_management/request_leave" },
      { name: "Leave Calendar", href: "/leave_management/leave_calendar" },
    ]
  },
  { name: "Company Policy", href: "/company_handbook", icon: BookmarkSquareIcon, basePath: "/company_handbook" },
  {
    name: "Profile", icon: UserCircleIcon,
    subItems: [
      { name: "Overview", href: "/profile/overview" },
      { name: "Onboarding", href: "/profile/onboarding", isDisabled: true },
    ]
  },

  {
    name: "Finances",
    icon: BanknotesIcon,
    subItems: [
      { name: "Payroll", href: "/finances/payroll/overview" },
      { name: "Loan", href: "/finances/loan" },
      { name: "Advance Salary", href: "/finances/advance-salary" },

    ]
  },
  {
    name: "Document Management",
    icon: DocumentIcon,   basePath: "/document_management",
    subItems: [
      { name: "Onboarding", href: "/document-management/onboarding", basePath: "/document-management/onboarding" },
      { name: "In-Employment", href: "/document-management/in-employment", basePath: "/document-management/in-employment" },
      // { name: "Offboardings", href: "/document-management/offboarding", basePath: "/document-management/offboarding" },
    ]
  },  
  
];

const teamLeadNavigation = [
  { name: "Dashboard", href: "/team_lead/dashboard", icon: HomeIcon, basePath: "/team_lead/dashboard" },
  {
    name: "Team", icon: UsersIcon, basePath: "/team_lead/team",
    subItems: [
      { name: "Dashboard", href: "/team_lead/team/dashboard", basePath: "/team_lead/team/dashboard" },
      { name: "Member List", href: "/team_lead/team/members_list", basePath: "/team_lead/team/members_list" },
      { name: "Team Attendance", href: "/team_lead/team/attendance", basePath: "/team_lead/team/attendance" },
      { name: "Team Report", href: "/team_lead/team/team_report", basePath: "/team_lead/team/team_report" },
      { name: "Approvals", href: "/team_lead/team/approval", basePath: "/team_lead/team/approval" },
      { name: "Leave List", href: "/team_lead/team/leave_list", basePath: "/team_lead/team/leave_list" },
      { name: "Team Leave Calendar", href: "/team_lead/team/team_leave_calendar", basePath: "/team_lead/team/team_leave_calendar" },
    ]
  },
  { name: "Attendance", href: "/attendance", icon: Briefcase },

  {
    name: "Office Management",
    icon: BuildingOffice2Icon,
    subItems: [
      {
        name: "Attendance",
        basePath: "/office_management/attendance",
        subItems: [
          { name: "Attendance List", href: "/office_management/attendance/list" },
          { name: "Attendance Report", href: "/office_management/attendance/report" }
        ]
      },
      {
        name: "Leave",
        basePath: "/office_management/leave",
        subItems: [
          { name: "Leave List", href: "/office_management/leave/list" },
          { name: "Leave Report", href: "/office_management/leave/report" },
        ]
      },
    ]
  },
  { name: "Company Policy", href: "/company_handbook", icon: BookmarkSquareIcon, basePath: "/company_handbook" },
  {
    name: "Document Management",
    icon: DocumentIcon,   basePath: "/document_management",
    subItems: [
      { name: "Onboarding", href: "/document-management/onboarding", basePath: "/document-management/onboarding" },
      { name: "In-Employment", href: "/document-management/in-employment", basePath: "/document-management/in-employment" },
      { name: "Offboarding", href: "/document-management/offboarding", basePath: "/document-management/offboarding" },
    ]
  },  
  
  {
    name: "Leave Management", icon: CalendarIcon, basePath: "/leave_management",
    subItems: [
      { name: "Overview", href: "/leave_management/overview", },
      { name: "Request Leave", href: "/leave_management/request_leave" },
      { name: "Leave Calendar", href: "/leave_management/leave_calendar" },
    ]
  },
  {
    name: "Profile", icon: UserCircleIcon,
    subItems: [
      { name: "Overview", href: "/profile/overview" },
      { name: "Onboarding", href: "/profile/onboarding", isDisabled: true },
    ]
  },
  {
    name: "Finances",
    icon: BanknotesIcon,
    subItems: [
      { name: "Payroll", href: "/finances/payroll/overview" },
      { name: "Loan", href: "/finances/loan" },
      { name: "Advance Salary", href: "/finances/advance-salary" },

    ]
  },
  // { name: "Performance Mgt", href: "/performance", icon: ArrowTrendingUpIcon, isDisabled: true },
  // { name: "Training and Dev", href: "/training_and_dev", icon: DocumentChartBarIcon, isDisabled: true },
  // { name: "Help", href: "/help", icon: InformationCircleIcon },
];



const hrNavigation = [
  { name: "Dashboard", href: "/HR/dashboard", icon: HomeIcon },
  {
    name: "WorkForce", icon: UsersIcon,
    subItems: [
      { name: "Dashboard", href: "/workforce/dashboard" },
      { name: "People", href: "/workforce/people/list", basePath: '/workforce/people' },
      { name: "Approvals", href: "/workforce/approvals" },
      {
        name: "Attendance",
        basePath: "/workforce/attendance",
        subItems: [
          { name: "Attendance List", href: "/workforce/attendance/list" },
          { name: "Attendance Report", href: "/workforce/attendance/report" }
        ]
      },
      {
        name: "Leave",
        basePath: "/workforce/leave",
        subItems: [
          { name: "Leave List", href: "/workforce/leave/list", basePath: '/workforce/leave/list' },
          { name: "Leave Report", href: "/workforce/leave/leave_report" },
          { name: "Leave Calender", href: "/workforce/leave/leave_calender" }
        ]
      },
      {
        name: "Staff Directory", icon: UserPlusIcon, basePath: "/workforce/staff_directory",
        subItems: [
          { name: "Staff list ", href: "/workforce/staff_directory/list", basePath: "/workforce/staff_directory/list" },
          { name: "Deactivated User List", href: "/workforce/staff_directory/deactive_list", },
        ]
      },
    ]
  },
  { name: "Company Policy", href: "/company_handbook", icon: BookmarkSquareIcon, basePath: "/company_handbook" },
  {
    name: "User Management", icon: UserPlusIcon, basePath: "/user_management",
    subItems: [
      { name: "Create User", href: "/user_management/create_user", basePath: "/user_management/create_user" },
      { name: "Teams", href: "/user_management/teams/list", basePath: "/user_management/teams" },
      { name: "Positions", href: "/user_management/positions/list", basePath: "/user_management/positions" },
      { name: "Branches", href: "/user_management/branch/list", basePath: "/user_management/branch" },
      { name: "Departments", href: "/user_management/departments/list", basePath: "/user_management/departments" },
      { name: "Locations", href: "/user_management/locations/list", basePath: "/user_management/locations" },
      { name: "Regions", href: "/user_management/regions/list", basePath: "/user_management/regions" },
    ]
  },
  { name: "Attendance", href: "/attendance", icon: Briefcase },
  {
    name: "Leave Management", icon: CalendarIcon, basePath: "/leave_management",
    subItems: [
      { name: "Overview", href: "/leave_management/overview", },
      { name: "Request Leave", href: "/leave_management/request_leave", },
      { name: "Leave Calendar", href: "/leave_management/leave_calendar" },
    ]
  },
  
  {
    name: "Document Management",
    icon: DocumentIcon,   basePath: "/document_management",
    subItems: [
      
      { 
        name: "Onboarding", 
        basePath: "/document-management/onboarding",
        subItems: [
          { name: "Onboarding Document", href: "/document-management/onboarding/document", basePath: "/document-management/onboarding/document" },
          { name: "Onboarding Policies", href: "/document-management/onboarding/policy" , basePath: "/document-management/onboarding/policy"}
        ]
      },
      { 
        name: "In-Employment", 
        basePath: "/document-management/in-employment",
        subItems: [
          { name: "Policy Document", href: "/document-management/in-employment/policy-document", basePath: "/document-management/in-employment/policy-document" },
          { name: "Personal Document", href: "/document-management/in-employment/personal-document" , basePath: "/document-management/in-employment/personal-document"}
        ]
      },
      { name: "Offboarding", href: "/document-management/offboarding", basePath: "/document-management/offboarding" },
    ]
  },  
  
  {
    name: "Onboarding", icon: ArrowRightStartOnRectangleIcon,
    subItems: [
     
      { 
        name: "Onboarding Dashbaord", 
        basePath: "/HR/onboarding/",
        subItems: [
          { name: "Onboarding Workflow", href: "/HR/onboarding/dashboard", basePath: "/HR/onboarding/dashboard" },
          { name: "Onboarding Status", href: "/HR/onboarding/user-dashboard" , basePath: "/HR/onboarding/user-dashboard"}
        ]
      },
     
      { 
        name: "Onboard New User ", 
        href: "/HR/onboarding/newuser",
        basePath: "/HR/onboarding"
        
      },
      { 
        name: "Configurations", 
        basePath: "/configurations/onboarding",
        subItems: [
          { name: "Documents", href: "/configurations/onboarding/documents", basePath: "/configurations/onboarding/documents" },
          { name: "Policies", href: "/configurations/onboarding/policies", basePath: "/configurations/onboarding/policies" }
        ]
      },
    ]
  },
  {
    name: "Offboarding", icon: ArrowLeftEndOnRectangleIcon,
    subItems: [
     
      { 
        name: "Dashbaord", 
        href: "/HR/offboarding/dashboard",
       
      },
      { 
        name: "Offboard User ", 
        href: "/HR/offboarding/new_offboarding",
        
      },
      { 
        name: "Configurations", 
        href: "/configurations/offboarding",
        
      }
    ]
  },
  {
    name: "Profile", icon: UserCircleIcon,
    subItems: [
      { name: "Overview", href: "/profile/overview" },
      { name: "Onboarding", href: "/profile/onboarding", isDisabled: true },
    ]
  },
  {
    name: "Finances",
    icon: BanknotesIcon,
    subItems: [
      { name: "Payroll", href: "/finances/payroll/overview" },
      { name: "Loan", href: "/finances/loan" },
      { name: "Advance Salary", href: "/finances/advance-salary" },
    ]
  },
  // { name: "Performance Mgt", href: "/performance", icon: ArrowTrendingUpIcon, isDisabled: true },
  // { name: "Training and Dev", href: "", icon: DocumentChartBarIcon, isDisabled: true },
  // { name: "Help", href: "", icon: InformationCircleIcon },
];

const managerNavigation = [
  { name: "Dashboard", href: "/manager/dashboard", icon: HomeIcon },
  {
    name: "WorkForce",
    icon: UsersIcon,
    subItems: [
      { name: "Dashboard", href: "/workforce/dashboard" },
      { name: "People", href: "/workforce/people/list", basePath: "/workforce/people" },
      { name: "Leave Approval ", href: "/workforce/approvals" },
      // { name: "Requests List", href: "/workforce/requests_history", basePath: "/workforce/requests_history" },
      {
        name: "Attendance",
        basePath: "/workforce/attendance",
        subItems: [
          { name: "Attendance List", href: "/workforce/attendance/list" },
          { name: "Attendance Report", href: "/workforce/attendance/report" }
        ]
      },
      {
        name: "Leave",
        basePath: "/workforce/leave",
        subItems: [
          { name: "Leave List", href: "/workforce/leave/requests_history" },
          { name: "Leave Report", href: "/workforce/leave/leave_report" },
          { name: "Leave Calender", href: "/workforce/leave/leave_calender" }
        ]
      },
    ]
  },
  {
    name: "User Management",
    icon: UserPlusIcon,
    basePath: "/user_management",
    subItems: [
      { name: "Create User", href: "/user_management/create_user", basePath: "/user_management/create_user" },
      { name: "Teams", href: "/user_management/teams/list", basePath: "/user_management/teams" },
      { name: "Positions", href: "/user_management/positions/list", basePath: "/user_management/positions" },
      { name: "Branches", href: "/user_management/branch/list", basePath: "/user_management/branch" },
      { name: "Departments", href: "/user_management/departments/list", basePath: "/user_management/departments" },
      { name: "Locations", href: "/user_management/locations/list", basePath: "/user_management/locations" },
      { name: "Regions", href: "/user_management/regions/list", basePath: "/user_management/regions" },
    ]
  },
  { name: "Attendance", href: "/attendance", icon: Briefcase },
  {
    name: "Document Management",
    icon: DocumentIcon,   basePath: "/document_management",
    subItems: [
      { name: "Onboarding", href: "/document-management/onboarding", basePath: "/document-management/onboarding" },
      { name: "In-Employment", href: "/document-management/in-employment", basePath: "/document-management/in-employment" },
      { name: "Offboarding", href: "/document-management/offboarding", basePath: "/document-management/offboarding" },
    ]
  },  
  
  {
    name: "Office Management",
    icon: BuildingOffice2Icon,
    subItems: [
      {
        name: "Attendance",
        basePath: "/office_management/attendance",
        subItems: [
          { name: "Attendance List", href: "/office_management/attendance/list" },
          { name: "Attendance Report", href: "/office_management/attendance/report" }
        ]
      },
      {
        name: "Leave",
        basePath: "/office_management/leave",
        subItems: [
          { name: "Leave List", href: "/office_management/leave/list" },
          { name: "Leave Report", href: "/office_management/leave/report" },
        ]
      },
    ]
  },
  { name: "Company Policy", href: "/company_handbook", icon: BookmarkSquareIcon, basePath: "/company_handbook" },
  {
    name: "Leave Management", icon: CalendarIcon, basePath: "/leave_management",
    subItems: [
      { name: "Overview", href: "/leave_management/overview", },
      { name: "Request Leave", href: "/leave_management/request_leave", },
      { name: "Leave Calendar", href: "/leave_management/leave_calendar" },
    ]
  },

  {
    name: "Profile",
    icon: UserCircleIcon,
    subItems: [
      { name: "Overview", href: "/profile/overview" },
      { name: "Onboarding", href: "/profile/onboarding", isDisabled: true },
    ]
  },
  {
    name: "Personal Finance",
    icon: BanknotesIcon,
    subItems: [
      { name: "Loan", href: "/finances/loan" },
      { name: "Advance Salary", href: "/finances/advance-salary" },
      { name: "Personal Payroll", href: "/finances/payroll/overview", basePath: "/finances/payroll" },
    ],
  },
  {
    name: "Workforce Finance",
    icon: BanknotesIcon,
    subItems: [
      { name: "Loan", href: "/finances/workforce/loan" },
      { name: "Advance Salary", href: "/finances/workforce/advance-salary" },
      { name: "Workforce Payroll", href: "/finances/workforce/payroll/overview", basePath: "/finances/workforce/payroll" },
      { name: "Gratuity", href: "/finances/workforce/gratuity/list", basePath: "/finances/workforce/gratuity" },
      { name: "Configurations", href: "/finances/configurations" },
      { name: "Configurations Request", href: "/finances/configuration-request" },
    ]
  },
];

const adminNavigation = [
  { name: "Dashboard", href: "/admin/dashboard", icon: HomeIcon, basePath: "/admin/dashboard" },
  {
    name: "User Management", icon: UserPlusIcon, basePath: "/user_management",
    subItems: [
      { name: "Create User", href: "/user_management/create_user", basePath: "/user_management/create_user" },
      { name: "Teams", href: "/user_management/teams/list", basePath: "/user_management/teams" },
      { name: "Positions", href: "/user_management/positions/list", basePath: "/user_management/positions" },
      { name: "Branches", href: "/user_management/branch/list", basePath: "/user_management/branch" },
      { name: "Departments", href: "/user_management/departments/list", basePath: "/user_management/departments" },
      { name: "Locations", href: "/user_management/locations/list", basePath: "/user_management/locations" },
      { name: "Regions", href: "/user_management/regions/list", basePath: "/user_management/regions" },
    ]
  },
  { name: "Attendance", href: "/admin/attendance", icon: Briefcase, basePath: "/admin/attendance" },
  { name: "Company Policy", href: "/company_handbook", icon: BookmarkSquareIcon, basePath: "/admin/company_handbook" },
  {
    name: "Staff Directory", icon: UserPlusIcon, basePath: "/admin/staff_directory",
    subItems: [
      { name: "Staff list ", href: "/admin/staff_directory/list", basePath: "/admin/staff_directory/list" },
      { name: "Deactivated User List", href: "/admin/staff_directory/deactive_list", },
    ]
  },

  { 
    name: "Configurations", 
    icon: Cog6ToothIcon, 
    basePath: "/configurations",
    subItems: [
      { name: "Overview", href: "/configurations", basePath: "/configurations" },
      { 
        name: "Onboarding", 
        basePath: "/configurations/onboarding",
        subItems: [
          { name: "Documents", href: "/configurations/onboarding/documents", basePath: "/configurations/onboarding/documents" },
          { name: "Policies", href: "/configurations/onboarding/policies", basePath: "/configurations/onboarding/policies" },
        ]
      },
      { 
        name: "Offboarding", 
        basePath: "/configurations/offboarding",
        subItems: [
          { name: "Checklist", href: "/configurations/offboarding/checklist", basePath: "/configurations/offboarding/checklist" },
        ]
      },
    ]
  },
  { name: "Payroll", href: "/admin/payroll", icon: BanknotesIcon, basePath: "/admin/payroll" },
  {
    name: "Profile", icon: UserCircleIcon,
    subItems: [
      { name: "Overview", href: "/profile/overview" },
    ]
  },
];

const sidebarItems = {
  HR: [
    // ... existing HR items ...
    {
      name: 'Document Management',
      icon: DocumentIcon,
      items: [
        {
          name: 'Onboarding Documents',
          href: '/document-management/onboarding',
        },
        {
          name: 'In-Employment Documents',
          href: '/document-management/in-employment',
        },
        {
          name: 'Offboarding Documents',
          href: '/document-management/offboarding',
        },
      ],
    },
    // ... other HR items ...
  ],
  staff: [
    // ... existing staff items ...
    {
      name: 'My Documents',
      icon: DocumentIcon,
      items: [
        {
          name: 'Onboarding Documents',
          href: '/document-management/onboarding',
        },
        {
          name: 'In-Employment Documents',
          href: '/document-management/in-employment',
        },
        {
          name: 'Offboarding Documents',
          href: '/document-management/offboarding',
        },
      ],
    },
    // ... other staff items ...
  ],
  // ... other role configurations ...
};

const SidebarLayout = ({ role, isConfigurationApprover, isOfficeManager, accessFinanceSection, isGratuityEnable }) => {
  // Get role from localStorage if not provided
  const [userRole, setUserRole] = useState('');
  
  useEffect(() => {
    const storedRole = localStorage.getItem('role');
    setUserRole(storedRole || role);
  }, [role]);

  const getNavigationForRole = (baseNavigation) => {
    return baseNavigation
      .filter(item => {
        if (item.name === "Office Management") {
          return isOfficeManager === 1;
        }
        if (item.name === "Workforce Finance") {
          return accessFinanceSection === 1;
        }
        return true;
      })
      .map(item => {
        if (item.name === "Finances" && item.subItems) {
          return {
            ...item,
            subItems: item.subItems.filter(
              subItem =>
                subItem.name !== "Configurations Request" || isConfigurationApprover
            ),
          };
        }

        if (item.name === "Workforce Finance" && item.subItems) {
          return {
            ...item,
            subItems: item.subItems.filter(subItem => {
              if (subItem.name === "Gratuity") {
                return isGratuityEnable === 1;
              }
              return true;
            }),
          };
        }

        return item;
      });
    }
  let navigation;
  switch (userRole) {
    case "admin":
      navigation = getNavigationForRole(adminNavigation);
      break;
    case "staff":
      navigation = getNavigationForRole(staffNavigation);
      break;
    case "team_lead":
      navigation = getNavigationForRole(teamLeadNavigation);
      break;
    case "department_head":
      navigation = getNavigationForRole(departmentHeadNavigation);
      break;
    case "HR":
      navigation = getNavigationForRole(hrNavigation);
      break;
    case "manager":
      navigation = getNavigationForRole(newManagerNavigation);
      break;
    case "hr_manager":
      navigation = getNavigationForRole(hrManagerNavigation);
      break;
    case "business_manager":
      navigation = getNavigationForRole(businessManagerNavigation);
      break;
    default:
      navigation = getNavigationForRole(newManagerNavigation);
  }

  return <Sidebar navigation={navigation} />;
};

export default SidebarLayout;
