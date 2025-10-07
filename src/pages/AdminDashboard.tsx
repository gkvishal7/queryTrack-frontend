import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { Sidebar } from "../components/Sidebar"
import {
  FileText,
  Users,
  TrendingUp,
  Menu,
} from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import FullScreenLoader from "../components/FullScreenLoader"
import { getStatusColor, getPriorityColor } from "../constants/constants"
import {adminQueryService, type AdminQuerySummaryResponse } from "@/utils/admin"
import { format } from "date-fns"
import { Progress } from "@/components/ui/progress"
import QueryStatsComponent from "@/components/QueryStatsComponent"


interface QueryStats {
  totalQueries: number;
  newQueries: number;
  resolvedQueries: number;
  inProgressQueries: number;
}

export default function AdminDashboard() {
	const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [queries, setQueries] = useState<AdminQuerySummaryResponse[]>([])
    const [stats, setStats] = useState<QueryStats>({
      totalQueries: 0,
      newQueries: 0,
      resolvedQueries: 0,
      inProgressQueries: 0
    })

	const [error, setError] = useState<string>("")

	useEffect(() => {
		fetchQueries()
	}, [])

	const fetchQueries = async () => {
		try {
      const response = await adminQueryService.getAllQueries()
      setQueries(response.data.queries)
      
      const totalQueries = response.data.queryStats.openQueries + response.data.queryStats.inProgressQueries  + response.data.queryStats.resolvedQueries
      const newQueries = response.data.queryStats.openQueries
      const resolvedQueries = response.data.queryStats.resolvedQueries
      const inProgressQueries = response.data.queryStats.inProgressQueries

      setStats({ totalQueries, newQueries, resolvedQueries, inProgressQueries })

      setIsLoading(false)

		} catch (error: any) {
      setError(error.message)
      setIsLoading(false)
		}
	}

	const handleQueryClick = (queryId: string) => {
		navigate(`/admin/queries/${queryId}`)
	}

	const formatDate = (dateString: string) => {
		return format(new Date(dateString), 'yyyy-MM-dd')
	}

  if (isLoading) {
    return <FullScreenLoader />
  }
  
  const resolutionRate = stats.totalQueries > 0 
  ? Math.round((stats.resolvedQueries / stats.totalQueries) * 100)
  : 0

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
        <div className="w-64 h-full bg-white dark:bg-gray-900 shadow-lg" onClick={e => e.stopPropagation()}>
          <Sidebar />
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        {/* Mobile header */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 shadow sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-700 dark:text-gray-200 focus:outline-none">
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
          <div className="w-6 h-6" /> {/* Spacer for symmetry */}
        </div>
        <div className="p-2 sm:p-4 md:p-6 space-y-4 md:space-y-6 max-w-full">
          {/* Header */}
          <div className="hidden md:flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-left">Admin Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Comprehensive overview of all organizational queries and system metrics.
              </p>
            </div>
            <div className="flex space-x-3">
              <Link to="/admin/queries">
                <Button variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  View All Queries
                </Button>
              </Link>
              <Link to="/admin/users">
                <Button className="bg-gradient-to-r from-teal-600 to-green-600 hover:from-green-700 hover:to-teal-700">
                  <Users className="w-4 h-4 mr-2" />
                  Manage Users
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <QueryStatsComponent stats={stats} />


          <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 md:gap-6">
            {/* Recent Queries */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Recent Queries
                </CardTitle>
                
              </CardHeader>
              <CardContent>
               
                  {
                    queries.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <FileText className="w-12 h-12 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Queries Yet</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                          No Queries have been raised yet.
                        </p>
                        
                      </div>
                    ) : (
					<div className="space-y-2 md:space-y-4">
						{queries.map((query) => (
							<div key={query.queryId} onClick={() => handleQueryClick(query.queryId)}>
							<div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-2 md:p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer gap-2">
								<div className="flex-1">
								<div className="flex flex-wrap items-center space-x-2 mb-2">
									<Badge className={getStatusColor(query.status.replace("_", " "))}>{query.status.replace("_", " ")}</Badge>
									<Badge variant="outline" className={getPriorityColor(query.priority)}>
									{query.priority}
									</Badge>
								</div>
								<div className="text-base md:text-lg font-semibold text-gray-900 dark:text-white">{query.title}</div>
								<div className="text-xs md:text-sm text-gray-500">{query.categoryName} | {formatDate(query.dateTime)}</div>
								</div>
							</div>
							</div>
						))}
						<div className="mt-4">
							<Link to="/admin/queries">
								<Button variant="outline" className="w-full">
								View All Queries
								</Button>
							</Link>
						</div>
					</div>)
                  }
                
              </CardContent>
            </Card>

            {/* Query Categories */}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Resolution Rate
                </CardTitle>
                <CardDescription>Percentage of your queries that have been resolved</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{resolutionRate}%</div>
                  <p className="text-sm text-gray-500">of queries resolved</p>
                </div>
                <Progress value={resolutionRate} className="w-full" />
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Resolved</span>
                    <span className="font-medium">{stats.resolvedQueries}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">In Progress</span>
                    <span className="font-medium">{stats.inProgressQueries}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">New</span>
                    <span className="font-medium">{stats.newQueries}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
