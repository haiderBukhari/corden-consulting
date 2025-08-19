// Dummy data for onboarding users
const dummyOnboardingUsers = [
  {
    id: 1,
    fullName: "John Doe",
    email: "john.doe@example.com",
    department: "Engineering",
    jobTitle: "Senior Developer",
    status: "completed",
    startDate: "2023-05-15",
    photo: "https://randomuser.me/api/portraits/men/1.jpg",
    manager: "Jane Smith",
    profileCompleted: true,
    profileCompletedDate: "2023-05-10",
    documentsSubmitted: true,
    documentsSubmittedDate: "2023-05-12",
    acknowledgmentCompleted: true,
    acknowledgmentCompletedDate: "2023-05-14",
    documents: [
      {
        id: 1,
        name: "Resume",
        uploadDate: "2023-05-12",
        url: "#",
        thumbnail: "https://via.placeholder.com/40?text=PDF"
      },
      {
        id: 2,
        name: "ID Proof",
        uploadDate: "2023-05-12",
        url: "#",
        thumbnail: "https://via.placeholder.com/40?text=ID"
      }
    ]
  },
  {
    id: 2,
    fullName: "Jane Smith",
    email: "jane.smith@example.com",
    department: "Marketing",
    jobTitle: "Marketing Manager",
    status: "in_progress",
    startDate: "2023-06-01",
    photo: "https://randomuser.me/api/portraits/women/2.jpg",
    manager: "Robert Johnson",
    profileCompleted: true,
    profileCompletedDate: "2023-05-25",
    documentsSubmitted: false,
    acknowledgmentCompleted: false,
    documents: []
  },
  {
    id: 3,
    fullName: "Michael Brown",
    email: "michael.brown@example.com",
    department: "Sales",
    jobTitle: "Sales Representative",
    status: "pending",
    startDate: "2023-06-15",
    photo: "https://randomuser.me/api/portraits/men/3.jpg",
    manager: "Sarah Williams",
    profileCompleted: false,
    documentsSubmitted: false,
    acknowledgmentCompleted: false,
    documents: []
  },
  {
    id: 4,
    fullName: "Emily Davis",
    email: "emily.davis@example.com",
    department: "Human Resources",
    jobTitle: "HR Specialist",
    status: "in_progress",
    startDate: "2023-05-20",
    photo: "https://randomuser.me/api/portraits/women/4.jpg",
    manager: "David Wilson",
    profileCompleted: true,
    profileCompletedDate: "2023-05-18",
    documentsSubmitted: true,
    documentsSubmittedDate: "2023-05-19",
    acknowledgmentCompleted: false,
    documents: [
      {
        id: 1,
        name: "Resume",
        uploadDate: "2023-05-19",
        url: "#",
        thumbnail: "https://via.placeholder.com/40?text=PDF"
      }
    ]
  },
  {
    id: 5,
    fullName: "Robert Johnson",
    email: "robert.johnson@example.com",
    department: "Finance",
    jobTitle: "Financial Analyst",
    status: "completed",
    startDate: "2023-04-10",
    photo: "https://randomuser.me/api/portraits/men/5.jpg",
    manager: "Lisa Anderson",
    profileCompleted: true,
    profileCompletedDate: "2023-04-05",
    documentsSubmitted: true,
    documentsSubmittedDate: "2023-04-07",
    acknowledgmentCompleted: true,
    acknowledgmentCompletedDate: "2023-04-09",
    documents: [
      {
        id: 1,
        name: "Resume",
        uploadDate: "2023-04-07",
        url: "#",
        thumbnail: "https://via.placeholder.com/40?text=PDF"
      },
      {
        id: 2,
        name: "Tax Form",
        uploadDate: "2023-04-07",
        url: "#",
        thumbnail: "https://via.placeholder.com/40?text=PDF"
      }
    ]
  }
];

/**
 * Get all onboarding users
 * @returns {Promise<Array>} Array of onboarding users
 */
export const getOnboardingUsers = async () => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Return dummy data
  return dummyOnboardingUsers;
};

/**
 * Get a single onboarding user by ID
 * @param {number} id - User ID
 * @returns {Promise<Object>} Onboarding user object
 */
export const getOnboardingUserById = async (id) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Find user in dummy data
  const user = dummyOnboardingUsers.find(user => user.id === id);
  
  if (!user) {
    throw new Error(`User with ID ${id} not found`);
  }
  
  return user;
};

/**
 * Create a new onboarding user
 * @param {Object} userData - User data
 * @returns {Promise<Object>} Created user object
 */
export const createOnboardingUser = async (userData) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Create new user with ID
  const newUser = {
    id: dummyOnboardingUsers.length + 1,
    ...userData,
    status: "pending",
    profileCompleted: false,
    documentsSubmitted: false,
    acknowledgmentCompleted: false,
    documents: []
  };
  
  // Add to dummy data
  dummyOnboardingUsers.push(newUser);
  
  return newUser;
};

/**
 * Update an onboarding user
 * @param {number} id - User ID
 * @param {Object} userData - Updated user data
 * @returns {Promise<Object>} Updated user object
 */
export const updateOnboardingUser = async (id, userData) => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Find user index
  const userIndex = dummyOnboardingUsers.findIndex(user => user.id === id);
  
  if (userIndex === -1) {
    throw new Error(`User with ID ${id} not found`);
  }
  
  // Update user
  dummyOnboardingUsers[userIndex] = {
    ...dummyOnboardingUsers[userIndex],
    ...userData
  };
  
  return dummyOnboardingUsers[userIndex];
}; 