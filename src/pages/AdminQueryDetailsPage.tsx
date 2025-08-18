import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Separator } from "../components/ui/separator"
import { Sidebar } from "../components/Sidebar"
import { ArrowLeft, User, Calendar, CheckCircle, RotateCcw, Trash2 } from "lucide-react"
import { getStatusColor, getPriorityColor } from "../constants/constants"
import { queryService } from "@/utils/query"
import FullScreenLoader from "@/components/FullScreenLoader"
import { AdminQueryResponse, adminQueryService } from "@/utils/admin"

export default function AdminQueryDetailPage() {
	const { id } = useParams()
	const navigate = useNavigate()
	const [query, setQuery] = useState<AdminQueryResponse | null>(null);
	const [isSaving, setIsSaving] = useState(false)
	const [isLoading, setIsLoading] = useState(true)
	const [error, setError] = useState<string>("")

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  useEffect(() => {
    const fetchQueryDetails = async () => {
		if (!id) return
		
		try {
			setIsLoading(true)
			setError("")
			const response = await adminQueryService.getQueryDetails(id)
			setQuery(response.data)
			console.log("Query details fetched:", response.data)
		} catch (error: any) {
			setError(error.message || "Failed to fetch query details")
			console.error("Error fetching query details:", error)
		} finally {
			setIsLoading(false)
		}
    }

    fetchQueryDetails()
  }, [id])

	const updateStatus = async(newStatus : string) => {
		if (!query || !id) return

		try {
			setIsSaving(true)
			setError("")
			
			const response = await queryService.updateQuery(id, {...query, status: newStatus })
			console.log(response);

			setQuery((prev: AdminQueryResponse | null) => {
				if (!prev) return prev;
				return {
					...prev,
					title: response.data.title,
					description: response.data.description,
					categoryName: response.data.categoryName,
					priority: response.data.priority,
					status: response.data.status,
				};
			})

			console.log("Query updated successfully:", query);
		
		} catch (error: any) {
			setError(error.message || "Failed to save changes")
			console.error("Error saving query:", error)
			} finally {
			setIsSaving(false)
		}
	}

	const handleStatusChange = (newStatus: string) => {
		if (!query || !id) return;

		// Optimistically update UI
		setQuery({ ...query, status: newStatus });

		// Send latest status directly
		updateStatus(newStatus);
  	}

  	if (isLoading || isSaving) {
		return <FullScreenLoader message={isSaving ? "Saving..." : undefined} />
	}
  
		if (!query) {
		return <div>No query found</div>
	}

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar userRole={"admin"} />

      <div className="flex-1 overflow-auto">
        <div className="p-6 max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="lg" onClick={() => navigate("/admin/queries")}>
                <ArrowLeft className="w-8 h-16 mr-2" />
                
              </Button>
              <div>
                <div className="flex items-center space-x-3">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Query Details</h1>
                  <Badge className={getStatusColor(query.status?.replace("_", " "))}>{query.status?.replace("_", " ")}</Badge>
                  <Badge className={getPriorityColor(query.priority)}>{query.priority} Priority</Badge>
                </div>
                
              </div>
            </div>

            <div className="flex space-x-2">
				<Button variant="outline" size="lg" className="text-red-600 hover:text-red-700">
					<Trash2 className="w-4 h-4 mr-2" />
					Delete
				</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Query Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">{query.title}</CardTitle>
                  <CardDescription>
                    Reported by {query.username} • {query.categoryName}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="prose dark:prose-invert max-w-none">
                    <div className="text-left whitespace-pre-wrap text-gray-900 dark:text-gray-400">{query.description}</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Query Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Query Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    {userRole === "admin" ? (
                      <Select value={query.status.toLowerCase().replace(" ", "_")} onValueChange={handleStatusChange}>
                        <SelectTrigger className="mt-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {statuses.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <div className="mt-1">
                        <Badge className={getStatusColor(query.status)}>{query.status}</Badge>
                      </div>
                    )}
                  </div> */}

                  <div>
                    <label className="text-sm font-medium text-gray-500">Priority</label>
                    <div className="mt-1">
                      <Badge className={getPriorityColor(query.priority)}>{query.priority}</Badge>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Category</label>
                    <p className="mt-1 text-gray-900 dark:text-white">{query.categoryName}</p>
                  </div>

                  <Separator />

                  <div>
                    <label className="text-sm font-medium text-gray-500">Reporter</label>
                    <div className="mt-1">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{query.username}</p>
                          <p className="text-sm text-gray-500">{query.username}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <label className="text-sm font-medium text-gray-500">Created</label>
                    <div className="mt-1 flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900 dark:text-white">{formatDate(query.dateTime)}</span>
                    </div>
                  </div>


                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
					{
						query.status === "IN PROGRESS" ? (
							<>
								<Button onClick={() => handleStatusChange("OPEN")} className="w-full bg-zinc-600 hover:bg-zinc-700 dark:bg-zinc-200 dark:hover:bg-zinc-300" >
									<RotateCcw className="w-4 h-4 mr-2" />
									Reopen Query
								</Button>
								<Button onClick={() => handleStatusChange("RESOLVED")} className="w-full bg-green-600 hover:bg-green-700">
									<CheckCircle className="w-4 h-4 mr-2" />
									Mark as Resolved
								</Button>
							</>
						) : query.status === "OPEN" ? (
							<>
								<Button onClick={() => handleStatusChange("IN_PROGRESS")} className="w-full  bg-zinc-600 hover:bg-zinc-700 dark:bg-zinc-200 dark:hover:bg-zinc-300">
									<RotateCcw className="w-4 h-4 mr-2" />
									Change To In Progress
								</Button>
								<Button onClick={() => handleStatusChange("RESOLVED")} className="w-full bg-green-600 hover:bg-green-700">
									<CheckCircle className="w-4 h-4 mr-2" />
									Mark as Resolved
								</Button>
							</>
						) : (
							<>
								<Button onClick={() => handleStatusChange("OPEN")} className="w-full" variant="outline">
									<RotateCcw className="w-4 h-4 mr-2" />
									Reopen Query
								</Button>
							</>
						)
					}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
