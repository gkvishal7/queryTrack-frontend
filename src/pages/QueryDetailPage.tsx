import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Separator } from "../components/ui/separator"
import { Sidebar } from "../components/Sidebar"
import EditQueryDialog from "../components/EditQueryDialog"
import {
  Edit,
  Calendar,
  RotateCcw,
} from "lucide-react"
import FullScreenLoader from "../components/FullScreenLoader"

import { queryService, Query } from "../utils/query"


const statuses = [
  { value: "open", label: "Open", color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" },
  {
    value: "in_progress",
    label: "In Progress",
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  },
  {
    value: "pending_user",
    label: "Pending User",
    color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  },
  { value: "resolved", label: "Resolved", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
  { value: "closed", label: "Closed", color: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200" },
]

const priorities = [
  { value: "low", label: "Low", color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" },
  { value: "medium", label: "Medium", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" },
  { value: "high", label: "High", color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200" },
  { value: "critical", label: "Critical", color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" },
]



export default function QueryDetailPage() {
  const { id } = useParams()
  const [query, setQuery] = useState<Query | null>(null);
  const [hasChanges, setHasChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isSavingEdit, setIsSavingEdit] = useState(false)
  const [error, setError] = useState<string>("")

  // Fetch query details
  useEffect(() => {
    const fetchQueryDetails = async () => {
      if (!id) return
      
      try {
        setIsLoading(true)
        setError("")
        const response = await queryService.getQueryById(id)
        setQuery(response.data)
      } catch (error: any) {
        setError(error.message || "Failed to fetch query details")
        console.error("Error fetching query details:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchQueryDetails()
  }, [id])

  const handleSave = async () => {
    if (!query || !id) return

    try {
      setIsSaving(true)
      setError("")
      const response = await queryService.updateQuery(id, query)
	  console.log(response);
	  
      setHasChanges(false)
    } catch (error: any) {
      setError(error.message || "Failed to save changes")
      console.error("Error saving query:", error)
    } finally {
      setIsSaving(false)
    }
  }

    const updateStatus = async(newStatus : string) => {
      if (!query || !id) return
  
      try {
        setIsSaving(true)
        setError("")
        
        const response = await queryService.updateQuery(id, {...query, status: newStatus })
        console.log(response);
  
        setQuery((prev: Query | null) => {
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
		setQuery({ ...query, status: newStatus });
		updateStatus(newStatus);
    }

  const formatDate = (dateString: string | null) => {
	if(!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusColor = (status: string | null) => {
    const statusObj = statuses.find(
      (s) => s.label.toLowerCase().replace(" ", "_") === status?.toLowerCase().replace(" ", "_"),
    )
    return statusObj?.color || "bg-gray-100 text-gray-800"
  }

  const getPriorityColor = (priority: string | null) => {
    const priorityObj = priorities.find((p) => p.label.toLowerCase() === priority?.toLowerCase())
    return priorityObj?.color || "bg-gray-100 text-gray-800"
  }


  const handleEditQuery = () => {
    setIsEditDialogOpen(true)
  }

	const handleSaveEdit = async (editData: Partial<Query>) => {
		if (!query || !query.queryId) return;
		
		try {
			setIsSavingEdit(true)
			setError("")

			console.log("Saving edit data:", editData);
			
			const response = await queryService.updateQuery(query.queryId, {
				title: editData.title,
				description: editData.description,
				categoryName: editData.categoryName, // note: match the API interface
				priority: editData.priority
			})

			console.log("Query updated successfully:", response);
			
			
			// Update local state with new data
			setQuery((prev: Query | null) => {
				if (!prev) return prev;
				return {
					...prev,
					title: response.data.title,
					description: response.data.description,
					categoryName: response.data.categoryName, // assuming API returns categoryName
					priority: response.data.priority
				};
			})
		} catch (error: any) {
			setError(error.message || "Failed to save changes")
		} finally {
			setIsSavingEdit(false)
			setIsEditDialogOpen(false)
		}
	}

	if (isLoading || isSaving) {
		return <FullScreenLoader message={isSaving ? "Saving..." : undefined} />
	}

  	if (!query) {
    	return <div>No query found</div>
	}

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar userRole={"user"} />

      <div className="flex-1 overflow-auto">
        <div className="p-6 max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <div className="flex items-center space-x-3">
                  <h1 className="xl:text-3xl text-2xl  font-bold text-gray-900 dark:text-white">{query.title}</h1>
                  {/* <Badge className={getStatusColor(query.status)}>{query.status}</Badge>
                  <Badge className={getPriorityColor(query.priority)}>{query.priority} Priority</Badge> */}
                </div>
                <p className="text-gray-600 dark:text-gray-400 mt-1 hidden xl:block">
                  Created {formatDate(query?.dateTime)}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={handleEditQuery}>
                    <Edit className="w-4 h-4 mr-2" />
                    <span className="hidden sm:block">Edit Query</span>
                  </Button>
                  
                  {query?.status === "RESOLVED" && (
                    <Button onClick={() => handleStatusChange("OPEN")} variant="outline" size="sm">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reopen
                    </Button>
                  )}
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-4 mb-4 text-sm text-red-800 bg-red-100 rounded-lg dark:bg-red-900 dark:text-red-200">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Query Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Description</CardTitle>
                  
                </CardHeader>
                <CardContent>
                  <div className="prose dark:prose-invert max-w-none">
                    <div className="text-left whitespace-pre-wrap text-gray-900 dark:text-gray-400">{query?.description}</div>
                  </div>
                </CardContent>
              </Card>

              {/* Attachments */}
              {/* {query.attachments.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Paperclip className="w-5 h-5 mr-2" />
                      Attachments ({query.attachments.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {query.attachments.map((attachment) => (
                        <div
                          key={attachment.id}
                          className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <FileText className="w-5 h-5 text-gray-400" />
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">{attachment.name}</p>
                              <p className="text-sm text-gray-500">{formatFileSize(attachment.size)}</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )} */}

              
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Query Info */}
              <Card>
                <CardHeader>
                  <CardTitle>Query Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-left">
                  <div>
                    <label className="text-sm font-semibold text-gray-300">Status</label>
                      <div className="mt-1">
                        <Badge className={getStatusColor(query?.status)}>{query?.status.replace("_", " ")}</Badge>
                      </div>

                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-300">Priority</label>
                    <div className="mt-1">
                          <div className="mt-1">
                            <Badge className={getPriorityColor(query?.priority)}>{query?.priority}</Badge>
                          </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-300">Category</label>
                    <p className="mt-1 text-gray-900 dark:text-white">{query?.categoryName}</p>
                  </div>

                  <Separator />


                  <div>
                    <label className="text-sm font-semibold text-gray-300">Created</label>
                    <div className="mt-1 flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900 dark:text-white">{formatDate(query?.dateTime)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              
            </div>
          </div>

          
        </div>

        {/* Save Changes Banner */}
        {hasChanges && (
          <div className="fixed bottom-6 right-6 bg-teal-600 text-white p-4 rounded-lg shadow-lg">
            <div className="flex items-center space-x-3">
              <div>
                <p className="font-medium text-md">You have unsaved changes</p>
                <p className="text-sm text-blue-100">Don't forget to save your changes</p>
              </div>
              <Button onClick={handleSave} disabled={isSaving} variant="secondary" size="sm">
                {isSaving ? "Saving..." : "Save Now"}
              </Button>
            </div>
          </div>
        )}

        {/* Edit Query Dialog */}
        
			
				<EditQueryDialog
					isOpen={isEditDialogOpen}
					onClose={() => setIsEditDialogOpen(false)}
					onSave={handleSaveEdit}
					initialData={query}
					isSaving={isSavingEdit}
        		/>
		
      </div>
    </div>
  )
}
