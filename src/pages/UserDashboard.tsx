import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Button } from "../components/ui/button"
import { Progress } from "../components/ui/progress"
import { Sidebar } from "../components/Sidebar"
import { FileText, Clock, CheckCircle, AlertCircle, Plus, TrendingUp, Calendar, User, Menu } from "lucide-react"
import { Link } from "react-router-dom"
import { ModularButton } from "@/components/ModularButton"
import { useState, useEffect } from "react"
import FullScreenLoader from "../components/FullScreenLoader"

// Mock data
const userStats = {
  totalQueries: 24,
  newQueries: 3,
  resolvedQueries: 18,
  inProgressQueries: 3,
}

const recentQueries = [
  {
    id: "QT-001",
    title: "Login issues with company portal",
    status: "In Progress",
    category: "IT Support",
    createdAt: "2024-01-15",
    priority: "High",
  },
  {
    id: "QT-002",
    title: "Request for additional vacation days",
    status: "New",
    category: "HR",
    createdAt: "2024-01-14",
    priority: "Medium",
  },
  {
    id: "QT-003",
    title: "Office heating system not working",
    status: "Resolved",
    category: "Facilities",
    createdAt: "2024-01-13",
    priority: "High",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "Resolved":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
    case "In Progress":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
    case "New":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
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

export default function UserDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <FullScreenLoader />
  }

  const resolutionRate = Math.round((userStats.resolvedQueries / userStats.totalQueries) * 100)

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
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <div className="w-6 h-6" /> {/* Spacer for symmetry */}
        </div>
        
        <div className="p-2 sm:p-4 md:p-6 space-y-4 md:space-y-6">
          {/* Header */}
          <div className="hidden md:flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-start">Dashboard</h1>
              <p className="hidden sm:block text-gray-600 dark:text-gray-400 mt-1">Welcome back! Here's an overview of your queries.</p>
            </div>
            <Link to="/queries/new">
              <ModularButton size="md">
                <Plus className="w-5 h-5 mr-2" />
                New Query
              </ModularButton>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Queries</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userStats.totalQueries}</div>
                <p className="text-xs text-muted-foreground">
                  Queries
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">New</CardTitle>
                <Clock className="h-4 w-4 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{userStats.newQueries}</div>
                <p className="text-xs text-muted-foreground">Awaiting response</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                <AlertCircle className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{userStats.inProgressQueries}</div>
                <p className="text-xs text-muted-foreground">Being worked on</p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Resolved</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{userStats.resolvedQueries}</div>
                <p className="text-xs text-muted-foreground">Successfully completed</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Queries */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Recent Queries
                </CardTitle>
                
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentQueries.map((query) => (
                    <Link key={query.id} to={`/queries/${query.id}`}>
                      <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-sm font-mono text-gray-500">{query.id}</span>
                            <Badge className={getStatusColor(query.status)}>{query.status}</Badge>
                            <Badge variant="outline" className={getPriorityColor(query.priority)}>
                              {query.priority}
                            </Badge>
                          </div>
                          <h3 className="font-medium text-gray-900 dark:text-white mb-1">{query.title}</h3>
                          <div className="flex items-center text-sm text-gray-500 space-x-4">
                            <span className="flex items-center">
                              <User className="w-3 h-3 mr-1" />
                              {query.category}
                            </span>
                            <span className="flex items-center">
                              <Calendar className="w-3 h-3 mr-1" />
                              {query.createdAt}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
                <div className="mt-4">
                  <Link to="/queries">
                    <Button variant="outline" className="w-full">
                      View All Queries
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Resolution Rate */}
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
                    <span className="font-medium">{userStats.resolvedQueries}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">In Progress</span>
                    <span className="font-medium">{userStats.inProgressQueries}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">New</span>
                    <span className="font-medium">{userStats.newQueries}</span>
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
