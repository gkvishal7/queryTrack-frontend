import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Input } from "../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Sidebar } from "../components/Sidebar"
import {
  Search,
  Filter,
  FileText,
} from "lucide-react"
import FullScreenLoader from "../components/FullScreenLoader"
import { getStatusColor, getPriorityColor } from "@/constants/constants"
import { AdminQuerySummaryResponse, adminQueryService } from "@/utils/admin"


export default function AdminQueriesPage() {
	const navigate = useNavigate()
	const [searchTerm, setSearchTerm] = useState("")
	const [statusFilter, setStatusFilter] = useState("all")
	const [categoryFilter, setCategoryFilter] = useState("all")
	const [priorityFilter, setPriorityFilter] = useState("all")
	const [isLoading, setIsLoading] = useState(true)
	const [queryCount, setQueryCount] = useState("05")
	const [error, setError] = useState<string>("")
    const [queries, setQueries] = useState<AdminQuerySummaryResponse[]>([])
	
	const fetchQueries = async () => {
		try {
			setIsLoading(true);
			setError("");

			const response = await adminQueryService.getAllQueries({
			page: 0,
			size: parseInt(queryCount),
			})
			console.log("Fetched queries:", response.data)
			setQueries(response.data.queries)

			
		} catch (error: any) {
			setError(error.message);
			console.error("Error fetching queries:", error);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchQueries();
	}, [queryCount]);

  if (isLoading) {
    return <FullScreenLoader />
  }

  const filteredQueries = queries.filter((query) => {
    const matchesSearch =
      query.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      query.queryId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      query.emailId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || query.status === statusFilter
    const matchesCategory = categoryFilter === "all" || query.categoryName === categoryFilter
    const matchesPriority = priorityFilter === "all" || query.priority === priorityFilter

    return matchesSearch && matchesStatus && matchesCategory && matchesPriority
  })

  const handleQueryClick = (queryId: string) => {
    navigate(`/admin/queries/${queryId}`)
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
                  <Select value={queryCount} onValueChange={setQueryCount} defaultValue="05">
						<SelectTrigger className="w-24">
							<SelectValue />
						</SelectTrigger>
                    <SelectContent>
                      <SelectItem value="05">05</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="15">15</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="100">All</SelectItem>
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
                            S No.
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
                        {filteredQueries.length > 0 ? (
                          filteredQueries.map((query, index) => (
                            <tr key={query.queryId} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                {index + 1}
                              </td>
                              <td className="px-6 py-4 font-bold whitespace-nowrap text-center">
                                <div className="cursor-pointer text-center " onClick={() => handleQueryClick(query.queryId)}>
                                  <div className="text-sm font-medium text-gray-900 dark:text-white">{query.title}</div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                <Badge className={getStatusColor(query.status.replace("_", " "))}>{query.status.replace("_", " ")}</Badge>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                <Badge variant="outline" className={getPriorityColor(query.priority)}>
                                  {query.priority}
                                </Badge>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-center">
                                <div className="text-sm text-gray-900 dark:text-white">{query.username}</div>
                                <div className="text-sm text-gray-500">{query.department}</div>
                              </td>
                              
                              <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                <Button variant="ghost" size="sm" onClick={() => handleQueryClick(query.queryId)}>
                                  View
                                </Button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan={6} className="text-center py-8">
                              <div className="flex flex-col items-center justify-center">
                                <FileText className="w-12 h-12 text-gray-400 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Queries Found</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                  There are no queries matching your criteria.
                                </p>
                              </div>
                            </td>
                          </tr>
                        )}
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
