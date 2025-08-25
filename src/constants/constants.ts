export const categories = [
  {
    value: "IT Support",
    label: "IT Support",
    description: "Technical issues, software problems, hardware requests, network connectivity",
    icon: "💻",
  },
  {
    value: "Human Resources",
    label: "Human Resources",
    description: "Policy questions, benefits, workplace issues, employment matters",
    icon: "👥",
  },
  {
    value: "Facilities",
    label: "Facilities",
    description: "Building maintenance, office supplies, workspace issues, security",
    icon: "🏢",
  },
  {
    value: "Finance",
    label: "Finance",
    description: "Expense reports, budget questions, payment issues, accounting",
    icon: "💰",
  },
  {
    value: "General",
    label: "General",
    description: "Other inquiries not covered by specific categories",
    icon: "📋",
  },
]

export const priority = [
  {
    value: "HIGH",
    label: "High",
    description: "Critical issues that require immediate attention",
  },
  {
    value: "MEDIUM",
    label: "Medium",
    description: "Important issues that should be addressed soon",
  },
  {
    value: "LOW",
    label: "Low",
    description: "Non-urgent issues that can be resolved later",
  },
  {
    value: "CRTICAL",
    label: "Critical",
    description: "Minor issues that have little impact on operations",
  },
]

export const departments = [
	{ value : "MARKETING", label: "Marketing" },
	{ value : "IT_SUPPORT", label: "IT Support" },
	{ value : "SALES", label: "Sales" },
	{ value : "HR", label: "Human Resources" },
	{ value : "FINANCE", label: "Finance" },
	{ value : "ENGINEERING", label: "Engineering" },
]

export const getStatusColor = (status: string) => {
  switch (status) {
    case "RESOLVED":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    case "OPEN":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
    case "IN PROGRESS":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
  }
}

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "HIGH":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
    case "MEDIUM":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    case "LOW":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    case "CRITICAL":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
  }
}

export const getRoleColor = (role: string) => {
  switch (role) {
    case "Admin":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
    case "User":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
  }
}