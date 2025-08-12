import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Input } from "../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Sidebar } from "../components/Sidebar"
import { Search, Filter, Plus, Calendar, Clock, AlertCircle, CheckCircle, FileText, Menu, RefreshCw } from "lucide-react"
import { ModularButton } from "@/components/ModularButton"
import FullScreenLoader from "../components/FullScreenLoader"

// Mock data
const mockQueries = [
  {
    id: "QT-001",
    title: "Login issues with company portal",
    status: "In Progress",
    category: "IT Support",
    priority: "High",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: "QT-002",
    title: "Request for additional vacation days",
    status: "Pending",
    category: "HR",
    priority: "Medium",
    createdAt: "2024-01-14",
    updatedAt: "2024-01-14",
  },
  {
    id: "QT-003",
    title: "Office heating system not working",
    status: "Resolved",
    category: "Facilities",
    priority: "High",
    createdAt: "2024-01-13",
    updatedAt: "2024-01-13",
  },
  {
    id: "QT-004",
    title: "Software license renewal needed",
    status: "Open",
    category: "IT Support",
    priority: "Low",
    createdAt: "2024-01-12",
    updatedAt: "2024-01-12",
  },
  {
    id: "QT-005",
    title: "Conference room booking system issues",
    status: "Closed",
    category: "Facilities",
    priority: "Medium",
    createdAt: "2024-01-10",
    updatedAt: "2024-01-11",
    
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
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Resolved":
      return <CheckCircle className="w-4 h-4" />
    case "In Progress":
      return <Clock className="w-4 h-4" />
    case "Pending":
      return <AlertCircle className="w-4 h-4" />
    case "Open":
      return <FileText className="w-4 h-4" />
    case "Closed":
      return <CheckCircle className="w-4 h-4" />
    default:
      return <FileText className="w-4 h-4" />
  }
}

export default function QueriesPage() {
	const navigate = useNavigate()
	const [searchTerm, setSearchTerm] = useState("")
	const [statusFilter, setStatusFilter] = useState("all")
	const [categoryFilter, setCategoryFilter] = useState("all")
	const [priorityFilter, setPriorityFilter] = useState("all")
  	const [queryCount, setQueryCount] = useState("05")
	const [sidebarOpen, setSidebarOpen] = useState(false)
	const [isLoading, setIsLoading] = useState(true)
	const [isRefreshing, setIsRefreshing] = useState(false)

  	const filteredQueries = mockQueries.filter((query) => {
	const matchesSearch =
		query.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
		query.id.toLowerCase().includes(searchTerm.toLowerCase())

	const matchesStatus = statusFilter === "all" || query.status === statusFilter
	const matchesCategory = categoryFilter === "all" || query.category === categoryFilter
	const matchesPriority = priorityFilter === "all" || query.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesCategory && matchesPriority
  })

  const handleQueryClick = (queryId: string) => {
    navigate(`/queries/${queryId}`)
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    // Simulate API call to refresh data
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsRefreshing(false)
  }

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <FullScreenLoader />
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar for desktop, overlay for mobile */}
      <div className="hidden md:block">
        <Sidebar userRole="user" />
      </div>
      <div className={`fixed inset-0 z-40 md:hidden transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ background: sidebarOpen ? 'rgba(0,0,0,0.3)' : 'transparent' }}
        onClick={() => setSidebarOpen(false)}
      >
        <Sidebar userRole="user" />
      </div>
      <div className="flex-1 overflow-auto">
        {/* Mobile header */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 shadow sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-700 dark:text-gray-200 focus:outline-none">
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">My Queries</h1>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
        <div className="p-2 sm:p-4 md:p-6 max-w-6xl space-y-4 md:space-y-6 mx-auto">
          {/* Header */}
          <div className="hidden md:flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-start">My Queries</h1>
              <p className="hidden sm:block text-gray-600 dark:text-gray-400 mt-1">Track and manage all your submitted queries</p>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="flex items-center space-x-2"
              >
                <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
              <Link to="/queries/new">
                <ModularButton size="md">
                  <Plus className="w-5 h-5 mr-2" />
                  New Query
                </ModularButton>
              </Link>
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search queries..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 text-sm md:text-base"
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
            </CardContent>
          </Card>

          {/* Results Summary */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredQueries.length} of {mockQueries.length} queries
            </p>
			<div className="flex justify-between px-4">
				<div className="flex items-center space-x-2 px-10">
					<span className="text-sm text-gray-600 dark:text-gray-400">Queries : </span>
					<Select value={queryCount} onValueChange={setQueryCount} defaultValue="05">
						<SelectTrigger className="w-32">
						<SelectValue />
						</SelectTrigger>
						<SelectContent>
						<SelectItem value="05">05</SelectItem>
						<SelectItem value="10">10</SelectItem>
						<SelectItem value="15">15</SelectItem>
						<SelectItem value="20">20</SelectItem>
						</SelectContent>
					</Select>
				</div>
				
			</div>
          </div>

          {/* Queries List */}
          <div className="space-y-4">
            {filteredQueries.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg text-start font-medium text-gray-900 dark:text-white mb-2">No queries found</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {searchTerm || statusFilter !== "all" || categoryFilter !== "all" || priorityFilter !== "all"
                      ? "Try adjusting your filters or search terms."
                      : "You haven't submitted any queries yet."}
                  </p>
                  <Button
                    onClick={() => navigate("/queries/new")}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Submit Your First Query
                  </Button>
                </CardContent>
              </Card>
            ) : (
              filteredQueries.map((query) => (
                <Card
                  key={query.id}
                  className="hover:shadow-lg transition-all duration-200 cursor-pointer hover:-translate-y-1"
                  onClick={() => handleQueryClick(query.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-sm font-mono text-gray-500">{query.id}</span>
                          <Badge className={getStatusColor(query.status)}>
                            {getStatusIcon(query.status)}
                            <span className="ml-1">{query.status}</span>
                          </Badge>
                          <Badge variant="outline" className={getPriorityColor(query.priority)}>
                            {query.priority}
                          </Badge>
                        </div>

                        <h3 className="text-lg text-start font-semibold text-gray-900 dark:text-white mb-2">{query.title}</h3>

                        <div className="flex items-center text-sm text-gray-500 space-x-6">
                          <span className="flex items-center">
                            <FileText className="w-4 h-4 mr-1" />
                            {query.category}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            Created {query.createdAt}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            Updated {query.updatedAt}
                          </span>
                          
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
