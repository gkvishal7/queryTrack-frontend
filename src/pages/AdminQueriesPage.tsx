"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Input } from "../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Checkbox } from "../components/ui/checkbox"
import { Sidebar } from "../components/Sidebar"
import {
  Search,
  Filter,
  AlertTriangle,
  Clock,
  CheckCircle,
  FileText,
} from "lucide-react"
import FullScreenLoader from "../components/FullScreenLoader"

// Mock data for admin queries view
const mockQueries = [
  {
    id: "QT-001",
    title: "Login issues with company portal",
    status: "In Progress",
    category: "IT Support",
    priority: "High",
    reporter: "John Smith",
    assignedTo: "Sarah Johnson",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
    department: "Marketing",
    sla: "2 hours remaining",
    tags: ["authentication", "portal"],
  },
  {
    id: "QT-002",
    title: "Request for additional vacation days",
    status: "Pending",
    category: "HR",
    priority: "Medium",
    reporter: "Emily Davis",
    assignedTo: "Mike Wilson",
    createdAt: "2024-01-14",
    updatedAt: "2024-01-14",
    department: "Sales",
    sla: "1 day remaining",
    tags: ["vacation", "policy"],
  },
  {
    id: "QT-003",
    title: "Office heating system not working",
    status: "Resolved",
    category: "Facilities",
    priority: "High",
    reporter: "Robert Brown",
    assignedTo: "Tom Anderson",
    createdAt: "2024-01-13",
    updatedAt: "2024-01-13",
    department: "Engineering",
    sla: "Completed",
    tags: ["heating", "maintenance"],
  },
  {
    id: "QT-004",
    title: "Software license renewal needed",
    status: "Open",
    category: "IT Support",
    priority: "Low",
    reporter: "Lisa Garcia",
    assignedTo: null,
    createdAt: "2024-01-12",
    updatedAt: "2024-01-12",
    department: "Finance",
    sla: "3 days remaining",
    tags: ["license", "software"],
  },
  {
    id: "QT-005",
    title: "Conference room booking system issues",
    status: "Closed",
    category: "Facilities",
    priority: "Medium",
    reporter: "David Lee",
    assignedTo: "Tom Anderson",
    createdAt: "2024-01-10",
    updatedAt: "2024-01-11",
    department: "Operations",
    sla: "Completed",
    tags: ["booking", "system"],
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "Resolved":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    case "In Progress":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
    case "Pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
    case "Open":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    case "Closed":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
  }
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "High":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    case "Medium":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
    case "Low":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    case "Critical":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
  }
}

const getSLAColor = (sla: string) => {
  if (sla === "Completed") return "text-green-600"
  if (sla.includes("hour")) return "text-red-600"
  if (sla.includes("1 day")) return "text-orange-600"
  return "text-gray-600"
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Resolved":
      return <CheckCircle className="w-4 h-4" />
    case "In Progress":
      return <Clock className="w-4 h-4" />
    case "Pending":
      return <AlertTriangle className="w-4 h-4" />
    case "Open":
      return <FileText className="w-4 h-4" />
    case "Closed":
      return <CheckCircle className="w-4 h-4" />
    default:
      return <FileText className="w-4 h-4" />
  }
}

export default function AdminQueriesPage() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [assigneeFilter, setAssigneeFilter] = useState("all")
  const [selectedQueries, setSelectedQueries] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<"table" | "cards">("cards")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <FullScreenLoader />
  }

  const filteredQueries = mockQueries.filter((query) => {
    const matchesSearch =
      query.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      query.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      query.reporter.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || query.status === statusFilter
    const matchesCategory = categoryFilter === "all" || query.category === categoryFilter
    const matchesPriority = priorityFilter === "all" || query.priority === priorityFilter
    const matchesAssignee =
      assigneeFilter === "all" ||
      (assigneeFilter === "unassigned" && !query.assignedTo) ||
      query.assignedTo?.toLowerCase().includes(assigneeFilter.toLowerCase())

    return matchesSearch && matchesStatus && matchesCategory && matchesPriority && matchesAssignee
  })

  const handleQueryClick = (queryId: string) => {
    navigate(`/queries/${queryId}`)
  }

  const handleSelectQuery = (queryId: string) => {
    setSelectedQueries((prev) => (prev.includes(queryId) ? prev.filter((id) => id !== queryId) : [...prev, queryId]))
  }

  const handleSelectAll = () => {
    if (selectedQueries.length === filteredQueries.length) {
      setSelectedQueries([])
    } else {
      setSelectedQueries(filteredQueries.map((q) => q.id))
    }
  }

  const handleBulkAction = (action: string) => {
    console.log(`Performing ${action} on queries:`, selectedQueries)
    // In real app, this would make API calls
    setSelectedQueries([])
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar userRole="admin" />

      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center sm:text-left">All Queries</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Manage and track all organizational queries from a centralized dashboard
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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search queries, users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                    <SelectItem value="Closed">Closed</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="IT Support">IT Support</SelectItem>
                    <SelectItem value="HR">HR</SelectItem>
                    <SelectItem value="Facilities">Facilities</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="General">General</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Priorities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>

                
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center justify-between">
                
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Sort by:</span>
                  <Select defaultValue="newest">
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="oldest">Oldest</SelectItem>
                      <SelectItem value="priority">Priority</SelectItem>
                      <SelectItem value="status">Status</SelectItem>
                      <SelectItem value="sla">SLA</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Summary & Bulk Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
			<div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Queries :</span>
                  <Select defaultValue="05">
						<SelectTrigger className="w-24">
							<SelectValue />
						</SelectTrigger>
                    <SelectContent>
                      <SelectItem value="05">05</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="15">15</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="All">All</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
            </div>
          </div>

          {/* Queries List */}
              
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            <Checkbox
                              checked={selectedQueries.length === filteredQueries.length && filteredQueries.length > 0}
                              onCheckedChange={handleSelectAll}
                            />
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Query
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Priority
                          </th>
                          <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Reporter
                          </th>
                          
                          <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredQueries.map((query) => (
                          <tr key={query.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <Checkbox
                                checked={selectedQueries.includes(query.id)}
                                onCheckedChange={() => handleSelectQuery(query.id)}
                              />
                            </td>
                            <td className="px-6 py-4">
                              <div className="cursor-pointer text-center" onClick={() => handleQueryClick(query.id)}>
                                <div className="text-sm font-medium text-gray-900 dark:text-white">{query.title}</div>
                                <div className="text-sm text-gray-500">{query.id}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <Badge className={getStatusColor(query.status)}>{query.status}</Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <Badge variant="outline" className={getPriorityColor(query.priority)}>
                                {query.priority}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-center">
                              <div className="text-sm text-gray-900 dark:text-white">{query.reporter}</div>
                              <div className="text-sm text-gray-500">{query.department}</div>
                            </td>
                            
                            <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                              <Button variant="ghost" size="sm" onClick={() => handleQueryClick(query.id)}>
                                View
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

          </div>
        </div>
      </div>

  )
}
