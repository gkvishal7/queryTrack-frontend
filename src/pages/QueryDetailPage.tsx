import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Textarea } from "../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Separator } from "../components/ui/separator"
import { Sidebar } from "../components/Sidebar"
import EditQueryDialog from "../components/EditQueryDialog"
import {
  ArrowLeft,
  Edit,
  MessageSquare,
  Paperclip,
  User,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  Download,
  Eye,
  EyeOff,
  Send,
  RotateCcw,
  Trash2,
  UserCheck,
  Save,
} from "lucide-react"
import FullScreenLoader from "../components/FullScreenLoader"

// Mock data - in real app this would come from API
const mockQuery = {
  id: "QT-001",
  title: "Login issues with company portal",
  description: `I've been experiencing login issues with the company portal since yesterday morning. Here are the details:

**Problem:**
- Cannot log in to the company portal using my usual credentials
- Getting "Invalid username or password" error message
- This started happening after the system maintenance on Monday

**Steps I've tried:**
1. Cleared browser cache and cookies
2. Tried different browsers (Chrome, Firefox, Safari)
3. Reset my password using the "Forgot Password" link
4. Tried logging in from different devices

**Impact:**
- Cannot access important project documents
- Unable to submit my timesheet
- Blocking my work on the Johnson project

**Error Details:**
- Error appears immediately after clicking "Login"
- No loading time, instant error message
- Browser console shows no JavaScript errors

This is quite urgent as I have a client presentation tomorrow and need access to the project files.`,
  status: "In Progress",
  category: "IT Support",
  priority: "High",
  reporter: {
    name: "John Smith",
    email: "john.smith@company.com",
    department: "Marketing",
  },
  assignedTo: {
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    role: "IT Support Specialist",
  },
  createdAt: "2024-01-15T09:30:00Z",
  updatedAt: "2024-01-15T14:22:00Z",
  attachments: [
    {
      id: "1",
      name: "error-screenshot.png",
      size: 245760,
      type: "image/png",
      url: "/placeholder.svg?height=400&width=600",
    },
    {
      id: "2",
      name: "browser-console-log.txt",
      size: 1024,
      type: "text/plain",
      url: "#",
    },
  ],
  
}


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
  const navigate = useNavigate()
  const [query, setQuery] = useState(mockQuery)
  const [newComment, setNewComment] = useState("")
  const [isInternalComment, setIsInternalComment] = useState(false)
  const [showInternalNotes, setShowInternalNotes] = useState(true)
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isSavingEdit, setIsSavingEdit] = useState(false)

  // Simulate initial API fetch
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const handleQueryChange = (key: string, value: any) => {
    setQuery((prev) => ({
      ...prev,
      [key]: value,
    }))
    setHasChanges(true)
  }

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    setHasChanges(false)
  }

  // Mock user role - in real app this would come from auth context
  const [userRole] = useState<"user" | "admin">("user") // Change to 'user' to see user view
  const [currentUser] = useState("Sarah Johnson") // Mock current user

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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getStatusColor = (status: string) => {
    const statusObj = statuses.find(
      (s) => s.label.toLowerCase().replace(" ", "_") === status.toLowerCase().replace(" ", "_"),
    )
    return statusObj?.color || "bg-gray-100 text-gray-800"
  }

  const getPriorityColor = (priority: string) => {
    const priorityObj = priorities.find((p) => p.label.toLowerCase() === priority.toLowerCase())
    return priorityObj?.color || "bg-gray-100 text-gray-800"
  }

  const handleStatusChange = (newStatus: string) => {
    // In real app, this would make an API call
    // setQuery((prev) => ({ ...prev, status: newStatus }))
    handleQueryChange("status", newStatus)
  }

  const handlepriorityChange = (newPriority: string) => {
    // In real app, this would make an API call
    // setQuery((prev) => ({ ...prev, priority: newPriority }))
    handleQueryChange("priority", newPriority)
  }

  const handleEditQuery = () => {
    setIsEditDialogOpen(true)
  }

  const handleSaveEdit = async (editData: any) => {
    setIsSavingEdit(true)
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    // Update query with edited data
    setQuery((prev) => ({
      ...prev,
      title: editData.title,
      description: editData.description,
      category: editData.category,
      priority: editData.priority,
      attachments: editData.attachments,
    }))
    
    setIsSavingEdit(false)
    setIsEditDialogOpen(false)
  }

  const getEditDialogData = () => ({
    title: query.title,
    description: query.description,
    category: query.category.toLowerCase().replace(" ", "_"),
    priority: query.priority.toLowerCase(),
    attachments: query.attachments.map(att => ({
      id: att.id,
      name: att.name,
      size: att.size,
      type: att.type,
    })),
  })

  if (isLoading || isSaving) {
    return <FullScreenLoader message={isSaving ? "Saving..." : undefined} />
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar userRole={userRole} />

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
                  Created {formatDate(query.createdAt)} • Last updated {formatDate(query.updatedAt)}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              {userRole === "user" && (
                <>
                  <Button variant="outline" size="sm" onClick={handleEditQuery}>
                    <Edit className="w-4 h-4 mr-2" />
                    <span className="hidden sm:block">Edit Query</span>
                  </Button>
                  
                  {query.status === "Resolved" && (
                    <Button variant="outline" size="sm">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Reopen
                    </Button>
                  )}
                </>
              )}

              {userRole === "admin" && (
                <>
                  {hasChanges ? (
                    <Button 
                      onClick={handleSave}
                      disabled={isSaving}
                      variant="outline" 
                      size="sm"
                      className="bg-gradient-to-r from-teal-600 to-green-600 hover:from-green-700 hover:to-teal-700"
                    >
                      {isSaving ? (
                        <div className="flex items-center">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Saving...
                        </div>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  ) : (
                    <Button variant="outline" size="sm" onClick={handleEditQuery}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Details
                    </Button>
                  )}
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </>
              )}
            </div>
          </div>

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
                    <div className="text-left whitespace-pre-wrap text-gray-900 dark:text-gray-400">{query.description}</div>
                  </div>
                </CardContent>
              </Card>

              {/* Attachments */}
              {query.attachments.length > 0 && (
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
              )}

              
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
                    {userRole === "admin" ? (
                      <Select value={query.status.toLowerCase().replace(" ", "_")} onValueChange={(value) => handleQueryChange("status",value)}>
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
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-300">Priority</label>
                    <div className="mt-1">
						{userRole === "admin" ? 
							(
								<Select value={query.priority.toLowerCase().replace(" ", "_")} onValueChange={(value) => handleQueryChange("priority", value)}>
								<SelectTrigger className="mt-1">
								<SelectValue />
								</SelectTrigger>
								<SelectContent>
								{priorities.map((priority) => (
									<SelectItem key={priority.value} value={priority.value}>
									{priority.label}
									</SelectItem>
								))}
								</SelectContent>
							</Select>
							) : 
							(
								<div className="mt-1">
									<Badge className={getPriorityColor(query.priority)}>{query.priority}</Badge>
								</div>
							)
						}
                    
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-300">Category</label>
                    <p className="mt-1 text-gray-900 dark:text-white">{query.category}</p>
                  </div>

                  <Separator />


                  <div>
                    <label className="text-sm font-semibold text-gray-300">Created</label>
                    <div className="mt-1 flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900 dark:text-white">{formatDate(query.createdAt)}</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-semibold text-gray-300">Last Updated</label>
                    <div className="mt-1 flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900 dark:text-white">{formatDate(query.updatedAt)}</span>
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
        {
			userRole === "user" ? 
			(
				<EditQueryDialog
					isOpen={isEditDialogOpen}
					onClose={() => setIsEditDialogOpen(false)}
					onSave={handleSaveEdit}
					initialData={getEditDialogData()}
					isSaving={isSavingEdit}
        		/>
			) : (<></>)
		}
      </div>
    </div>
  )
}
