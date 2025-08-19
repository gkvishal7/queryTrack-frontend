import { useState, useEffect } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Badge } from "../components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Sidebar } from "../components/Sidebar"
import { Search, Filter, Edit, Trash2, UserCheck, AlertCircle } from "lucide-react"
import { adminUserService, User } from "../utils/admin"
import FullScreenLoader from "../components/FullScreenLoader"

const getRoleColor = (role: string) => {
  switch (role) {
    case "Admin":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
    case "User":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
  }
}

// Helper function to format role and department strings from uppercase to proper case
const formatRoleOrDepartment = (value: string): string => {
	if (!value) return "";
	
	// If value is already lowercase or mixed case, return as is
	if (value !== value.toUpperCase()) return value;
	
	// Convert from "USER" to "User" or "IT_SUPPORT" to "It Support"
	return value
		.toLowerCase()
		.split('_')
		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
}

// Interface for our user display data (combines API data with UI-specific fields)
interface UserDisplayData extends User {
  status?: string;

}

export default function UserManagementPage() {
  const [users, setUsers] = useState<UserDisplayData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  
  // Fetch users data when component mounts
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await adminUserService.getAllUsers()
        
        if (response && response.data) {
          // Transform API data to include UI-specific fields and format values
          const transformedUsers = response.data.map(user => ({
            ...user,
            // Format role from "USER" to "User"
            role: formatRoleOrDepartment(user.role),
            // Format department from "DEPARTMENT" to "Department"
            department: formatRoleOrDepartment(user.department),
            status: "Active", // Default status since API doesn't provide it
            lastLogin: new Date().toISOString(), // Default lastLogin since API doesn't provide it
            joinedDate: new Date().toISOString(), // Default joinedDate since API doesn't provide it
            avatar: "/placeholder-user.jpg" // Default avatar
          }))
          setUsers(transformedUsers)
        } else {
          setError("No user data received from server")
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch users")
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchUsers()
  }, [])

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.emailId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    const matchesDepartment = departmentFilter === "all" || user.department === departmentFilter
    
    return matchesSearch && matchesRole && matchesDepartment;
  })

  // Handle user deletion
  const handleDeleteUser = async (userId: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        setIsLoading(true)
        await adminUserService.deleteUser(userId)
        // Remove deleted user from state
        setUsers(users.filter(user => user.id !== userId))
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete user")
      } finally {
        setIsLoading(false)
      }
    }
  }

  // If loading, show full-screen loader
  if (isLoading) {
    return <FullScreenLoader message="Loading users..." />
  }
  
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar userRole="admin" />

      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center sm:text-left">User Management</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage user accounts, roles, and permissions across the organization
              </p>
            </div>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Filters & Search
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Roles" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="User">User</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Departments" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Departments</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="IT Support">IT Support</SelectItem>
                    <SelectItem value="HR">HR</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="Facilities">Facilities</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Results Summary */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredUsers.length} of {users.length} users
            </p>
          </div>

          {/* Error State */}
          {!isLoading && error && (
            <Card className="border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
              <CardContent className="text-center py-12">
                <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-red-700 dark:text-red-300 mb-2">Error Loading Users</h3>
                <p className="text-red-600 dark:text-red-400 mb-4">
                  {error}
                </p>
                <Button 
                  onClick={() => window.location.reload()}
                  variant="outline" 
                  className="border-red-200 text-red-700 hover:bg-red-100 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-900/30"
                >
                  Try Again
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Users List */}
          {!isLoading && !error && (
            <div className="space-y-4">
              {filteredUsers.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <UserCheck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No users found</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      Try adjusting your filters or search terms to find the users you're looking for.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredUsers.map((user) => (
                    <Card key={user.id} className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src="/placeholder-user.jpg"
                              alt={user.username}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                            <div>
                              <h3 className="font-semibold text-gray-900 dark:text-white text-left">{user.username}</h3>
                              <p className="text-sm text-gray-500">{user.emailId}</p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Role</span>
                            <Badge className={getRoleColor(user.role)}>{user.role}</Badge>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Department</span>
                            <span className="text-sm font-medium">{user.department}</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Queries</span>
                            <span className="text-sm font-medium">{user.numberOfQueries}</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-500">Phone</span>
                            <span className="text-sm font-medium">{user.phoneNumber || "N/A"}</span>
                          </div>
                        </div>

                        <div className="flex space-x-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <Button variant="outline" size="sm" className="flex-1">
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1 text-red-600 hover:text-red-700"
                            onClick={() => handleDeleteUser(user.id)}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
