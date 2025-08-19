export const getOffboardingCases = async () => {
  // Mock data that matches our component structure
  return [
    {
      id: 1,
      employee: {
        id: 3,
        fname: "Bilal",
        lname: "Ameen",
        employee_id: "EMP003",
        department: {
          departments_name: "QA"
        },
        position: {
          name: "IT Officer"
        },
        reports_to_manager: "Waqas khan",
        avatar: "https://hr-backend-talo.com//storage/profile/6HqFbu6Ndx7wkroG1741946801.png"
      },
      exitType: "resignation",
      lastWorkingDay: "2025-05-15",
      reason: "Career growth opportunity",
      documents: [],
      checklist: [
        {
          id: 1,
          task: "Return Laptop & Accessories",
          status: "in_progress",
          completedDate: null,
          assignedTo: "IT",
          isMandatory: true
        },
        {
          id: 2,
          task: "Backup/Remove Personal Data",
          status: "not_started",
          completedDate: null,
          assignedTo: "IT",
          isMandatory: true
        },
        {
          id: 3,
          task: "Final Meeting with HR/Manager",
          status: "completed",
          completedDate: "2024-04-28",
          assignedTo: "HR",
          isMandatory: true
        },
        {
          id: 4,
          task: "Collect Relieving Letter / Experience Certificate",
          status: "not_started",
          completedDate: null,
          assignedTo: "HR",
          isMandatory: true
        }
      ],
      status: "in_progress",
      initiatedDate: "2024-04-25",
      exitRating: 4,
      feedback: "Positive experience overall"
    },
    {
      id: 2,
      employee: {
        id: 5,
        fname: "Robert",
        lname: "John",
        employee_id: "EMP005",
        department: {
          departments_name: "QA"
        },
        position: {
          name: "Director"
        },
        reports_to_manager: "No Manager",
        avatar: "https://hr-backend-talo.com//storage/profile/no-image.png"
      },
      exitType: "retirement",
      lastWorkingDay: "2025-06-30",
      reason: "Retirement after 20 years of service",
      documents: [],
      checklist: [
        {
          id: 1,
          task: "Return Laptop & Accessories",
          status: "completed",
          completedDate: "2024-04-20",
          assignedTo: "IT",
          isMandatory: true
        },
        {
          id: 2,
          task: "Backup/Remove Personal Data",
          status: "completed",
          completedDate: "2024-04-21",
          assignedTo: "IT",
          isMandatory: true
        },
        {
          id: 3,
          task: "Final Meeting with HR/Manager",
          status: "completed",
          completedDate: "2024-04-22",
          assignedTo: "HR",
          isMandatory: true
        },
        {
          id: 4,
          task: "Collect Relieving Letter / Experience Certificate",
          status: "completed",
          completedDate: "2024-04-23",
          assignedTo: "HR",
          isMandatory: true
        }
      ],
      status: "completed",
      initiatedDate: "2024-04-15",
      exitRating: 5,
      feedback: "Excellent service and dedication"
    },
    {
      id: 3,
      employee: {
        id: 7,
        fname: "Sarah",
        lname: "Smith",
        employee_id: "EMP007",
        department: {
          departments_name: "IT"
        },
        position: {
          name: "Senior Developer"
        },
        reports_to_manager: "John Doe",
        avatar: "https://hr-backend-talo.com//storage/profile/default-avatar.png"
      },
      exitType: "end_of_contract",
      lastWorkingDay: "2024-05-31",
      reason: "Contract completion",
      documents: [],
      checklist: [
        {
          id: 1,
          task: "Return Laptop & Accessories",
          status: "not_started",
          completedDate: null,
          assignedTo: "IT",
          isMandatory: true
        },
        {
          id: 2,
          task: "Backup/Remove Personal Data",
          status: "not_started",
          completedDate: null,
          assignedTo: "IT",
          isMandatory: true
        },
        {
          id: 3,
          task: "Final Meeting with HR/Manager",
          status: "not_started",
          completedDate: null,
          assignedTo: "HR",
          isMandatory: true
        },
        {
          id: 4,
          task: "Collect Relieving Letter / Experience Certificate",
          status: "not_started",
          completedDate: null,
          assignedTo: "HR",
          isMandatory: true
        }
      ],
      status: "pending",
      initiatedDate: "2024-04-30",
      exitRating: null,
      feedback: null
    }
  ];
}; 