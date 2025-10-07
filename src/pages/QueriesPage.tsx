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
import { queryService, type QuerySummaryResponse } from "../utils/query"
import { format } from "date-fns"
import { categories, getPriorityColor } from "@/constants/constants"
import NoQueriesCard from "@/components/NoQueriesCard"


const statuses = [
  { value: "OPEN", label: "Open" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "RESOLVED", label: "Resolved" },
  { value: "CLOSED", label: "Closed" }
]

const priorities = [
//   { value: "all", label: "All Priorities" },
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" }, 
  { value: "CRITICAL", label: "Critical" }
]

const getStatusColor = (status: string) => {
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

const getStatusIcon = (status: string) => {
  switch (status) {
    case "RESOLVED":
      return <CheckCircle className="w-4 h-4" />
    case "IN PROGRESS":
      return <Clock className="w-4 h-4" />
    case "PENDING":
      return <AlertCircle className="w-4 h-4" />
    case "OPEN":
      return <FileText className="w-4 h-4" />
    case "CLOSED":
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

	const [error, setError] = useState<string>("")
	const [queries, setQueries] = useState<QuerySummaryResponse[]>([])

  // Filter queries based on current filters
  const filteredQueries = queries.filter((query) => {
    const matchesSearch = searchTerm.trim() === "" || 
      query.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      query.queryId.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || query.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || query.categoryName === categoryFilter;
    const matchesPriority = priorityFilter === "all" || query.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesCategory && matchesPriority;
  });

  // Fetch queries with current filters and pagination
  const fetchQueries = async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await queryService.getQueries({
        page: 0,
        size: parseInt(queryCount),
      })
	  console.log("Fetched queries:", response.data)
	  setQueries(response.data.queries);

      
    } catch (error: any) {
      setError(error.message);
      console.error("Error fetching queries:", error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Handle refresh button click
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchQueries();
  };

  const handleQueryClick = (queryId: string) => {
    navigate(`/queries/${queryId}`);
  };

  // Fetch queries only once on component mount
  useEffect(() => {
    fetchQueries();
  }, [queryCount]); // Empty dependency array means it only runs once on mount

  if (isLoading) {
    return <FullScreenLoader />
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar for desktop, overlay for mobile */}
      <div className="hidden md:block">
        <Sidebar />
      </div>
      <div className={`fixed inset-0 z-40 md:hidden transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ background: sidebarOpen ? 'rgba(0,0,0,0.3)' : 'transparent' }}
        onClick={() => setSidebarOpen(false)}
      >
        <Sidebar />
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
                    {statuses.map(status => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Priorities" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    {priorities.map(priority => (
                      <SelectItem key={priority.value} value={priority.value}>
                        {priority.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Error Display */}
          {error && (
            <div className="p-4 mb-4 text-sm text-red-800 bg-red-100 rounded-lg dark:bg-red-900 dark:text-red-200">
              {error}
            </div>
          )}

          {/* Results Summary */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing {Math.min(parseInt(queryCount), filteredQueries.length)} of {filteredQueries.length} queries
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
              <NoQueriesCard  />
            ) : (
              filteredQueries.map((query) => (
                <Card
                  key={query.queryId}
                  className="hover:shadow-lg transition-all duration-200 cursor-pointer hover:-translate-y-1"
                  onClick={() => handleQueryClick(query.queryId)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <Badge className={getStatusColor(query.status.replace("_", " "))}>
                            {getStatusIcon(query.status.replace("_", " "))}
                            <span className="ml-1">{query.status.replace("_", " ")}</span>
                          </Badge>
                          <Badge variant="outline" className={getPriorityColor(query.priority)}>
                            {query.priority}
                          </Badge>
                        </div>

                        <h3 className="text-lg text-start font-semibold text-gray-900 dark:text-white mb-2">{query.title}</h3>

                        <div className="flex items-center text-sm text-gray-500 space-x-6">
                          <span className="flex items-center">
                            <FileText className="w-4 h-4 mr-1" />
                            {query.categoryName}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            Created {format(new Date(query.dateTime), 'yyyy-MM-dd')}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            Last updated {format(new Date(query.dateTime), 'HH:mm')}
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
