import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Textarea } from "../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Separator } from "../components/ui/separator"
import { Sidebar } from "../components/Sidebar"
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
} from "lucide-react"

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
  activities: [
    {
      id: "1",
      type: "created",
      user: "John Smith",
      timestamp: "2024-01-15T09:30:00Z",
      content: "Query created",
      isInternal: false,
    },
    {
      id: "2",
      type: "assigned",
      user: "System",
      timestamp: "2024-01-15T09:32:00Z",
      content: "Assigned to IT Support team",
      isInternal: false,
    },
    {
      id: "3",
      type: "status_change",
      user: "Sarah Johnson",
      timestamp: "2024-01-15T10:15:00Z",
      content: 'Status changed from "Open" to "In Progress"',
      isInternal: false,
    },
    {
      id: "4",
      type: "comment",
      user: "Sarah Johnson",
      timestamp: "2024-01-15T10:16:00Z",
      content:
        "Hi John, I've received your query and I'm looking into this issue. I can see from your description that you've already tried the basic troubleshooting steps, which is great.\n\nI'm going to check if there are any known issues with the portal authentication system following Monday's maintenance. I'll also verify your account status in our system.\n\nI should have an update for you within the next 2 hours.",
      isInternal: false,
    },
    {
      id: "5",
      type: "internal_note",
      user: "Sarah Johnson",
      timestamp: "2024-01-15T11:30:00Z",
      content:
        "Checked with the infrastructure team - there was an issue with the LDAP sync after Monday's maintenance. Several users are affected. Working on a fix.",
      isInternal: true,
    },
    {
      id: "6",
      type: "comment",
      user: "Sarah Johnson",
      timestamp: "2024-01-15T14:22:00Z",
      content:
        "Update: I've identified the issue. There was a problem with our authentication system following Monday's maintenance that affected several user accounts.\n\nI've reset your account permissions and the issue should now be resolved. Please try logging in again and let me know if you still experience any problems.\n\nIf you're still having issues, please try the following:\n1. Clear your browser cache completely\n2. Try an incognito/private browsing window\n3. If that doesn't work, please let me know and I'll escalate this further.",
      isInternal: false,
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

export default function AdminQueryDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [query, setQuery] = useState(mockQuery)
  const [newComment, setNewComment] = useState("")
  const [isInternalComment, setIsInternalComment] = useState(false)
  const [showInternalNotes, setShowInternalNotes] = useState(true)
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)

  // Mock user role - in real app this would come from auth context
  const [userRole] = useState<"user" | "admin">("admin") // Change to 'user' to see user view
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
    setQuery((prev) => ({ ...prev, status: newStatus }))
  }

  const handleAddComment = async () => {
    if (!newComment.trim()) return

    setIsSubmittingComment(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newActivity = {
      id: Date.now().toString(),
      type: isInternalComment ? "internal_note" : "comment",
      user: currentUser,
      timestamp: new Date().toISOString(),
      content: newComment,
      isInternal: isInternalComment,
    }

    setQuery((prev) => ({
      ...prev,
      activities: [...prev.activities, newActivity],
    }))

    setNewComment("")
    setIsSubmittingComment(false)
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "created":
        return <FileText className="w-4 h-4" />
      case "assigned":
        return <UserCheck className="w-4 h-4" />
      case "status_change":
        return <AlertCircle className="w-4 h-4" />
      case "comment":
        return <MessageSquare className="w-4 h-4" />
      case "internal_note":
        return <Eye className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const filteredActivities = showInternalNotes
    ? query.activities
    : query.activities.filter((activity) => !activity.isInternal)

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar userRole={userRole} />

      <div className="flex-1 overflow-auto">
        <div className="p-6 max-w-6xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => navigate("/queries")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Queries
              </Button>
              <div>
                <div className="flex items-center space-x-3">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Query {query.id}</h1>
                  <Badge className={getStatusColor(query.status)}>{query.status}</Badge>
                  <Badge className={getPriorityColor(query.priority)}>{query.priority} Priority</Badge>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Created {formatDate(query.createdAt)} • Last updated {formatDate(query.updatedAt)}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              {userRole === "user" && (
                <>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Query
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
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Details
                  </Button>
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
                  <CardTitle className="text-xl">{query.title}</CardTitle>
                  <CardDescription>
                    Reported by {query.reporter.name} • {query.category}
                  </CardDescription>
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

              {/* Activity Timeline */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <Clock className="w-5 h-5 mr-2" />
                      Activity Timeline
                    </CardTitle>
                    {userRole === "admin" && (
                      <Button variant="outline" size="sm" onClick={() => setShowInternalNotes(!showInternalNotes)}>
                        {showInternalNotes ? (
                          <>
                            <EyeOff className="w-4 h-4 mr-2" />
                            Hide Internal
                          </>
                        ) : (
                          <>
                            <Eye className="w-4 h-4 mr-2" />
                            Show Internal
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredActivities.map((activity, index) => (
                      <div key={activity.id} className="flex space-x-4">
                        <div className="flex flex-col items-center">
                          <div
                            className={`p-2 rounded-full ${
                              activity.isInternal
                                ? "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400"
                                : "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400"
                            }`}
                          >
                            {getActivityIcon(activity.type)}
                          </div>
                          {index < filteredActivities.length - 1 && (
                            <div className="w-px h-8 bg-gray-200 dark:bg-gray-700 mt-2" />
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center space-x-2">
                              <span className="font-medium text-gray-900 dark:text-white">{activity.user}</span>
                              {activity.isInternal && (
                                <Badge variant="outline" className="text-xs">
                                  Internal
                                </Badge>
                              )}
                            </div>
                            <span className="text-sm text-gray-500">{formatDate(activity.timestamp)}</span>
                          </div>
                          <div
                            className={`text-gray-700 dark:text-gray-300 whitespace-pre-wrap ${
                              activity.isInternal
                                ? "bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border-l-4 border-purple-500"
                                : ""
                            }`}
                          >
                            {activity.content}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Add Comment */}
              <Card>
                <CardHeader>
                  <CardTitle>Add Comment</CardTitle>
                  <CardDescription>
                    {userRole === "admin"
                      ? "Add a comment or internal note to this query"
                      : "Add a comment to communicate with the support team"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Type your comment here..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />

                  <div className="flex items-center justify-between">
                    {userRole === "admin" && (
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="internal-comment"
                          checked={isInternalComment}
                          onChange={(e) => setIsInternalComment(e.target.checked)}
                          className="rounded border-gray-300"
                        />
                        <label htmlFor="internal-comment" className="text-sm text-gray-600 dark:text-gray-400">
                          Internal note (not visible to user)
                        </label>
                      </div>
                    )}

                    <Button
                      onClick={handleAddComment}
                      disabled={!newComment.trim() || isSubmittingComment}
                      className="ml-auto"
                    >
                      {isSubmittingComment ? (
                        <div className="flex items-center">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          Adding...
                        </div>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Add Comment
                        </>
                      )}
                    </Button>
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
                  <div>
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
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Priority</label>
                    <div className="mt-1">
                      <Badge className={getPriorityColor(query.priority)}>{query.priority}</Badge>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Category</label>
                    <p className="mt-1 text-gray-900 dark:text-white">{query.category}</p>
                  </div>

                  <Separator />

                  <div>
                    <label className="text-sm font-medium text-gray-500">Reporter</label>
                    <div className="mt-1">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{query.reporter.name}</p>
                          <p className="text-sm text-gray-500">{query.reporter.department}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {query.assignedTo && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Assigned To</label>
                      <div className="mt-1">
                        <div className="flex items-center space-x-2">
                          <UserCheck className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{query.assignedTo.name}</p>
                            <p className="text-sm text-gray-500">{query.assignedTo.role}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <Separator />

                  <div>
                    <label className="text-sm font-medium text-gray-500">Created</label>
                    <div className="mt-1 flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900 dark:text-white">{formatDate(query.createdAt)}</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">Last Updated</label>
                    <div className="mt-1 flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-900 dark:text-white">{formatDate(query.updatedAt)}</span>
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
                  {userRole === "user" ? (
                    <>
                      {query.status === "Pending User" && (
                        <Button className="w-full" variant="outline">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Provide Additional Info
                        </Button>
                      )}
                      {query.status === "Resolved" && (
                        <>
                          <Button className="w-full bg-green-600 hover:bg-green-700">
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Mark as Resolved
                          </Button>
                          <Button className="w-full" variant="outline">
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Reopen Query
                          </Button>
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <Button className="w-full" variant="outline">
                        <UserCheck className="w-4 h-4 mr-2" />
                        Reassign Query
                      </Button>
                      <Button className="w-full" variant="outline">
                        <AlertCircle className="w-4 h-4 mr-2" />
                        Change Priority
                      </Button>
                      <Button className="w-full bg-green-600 hover:bg-green-700">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Mark as Resolved
                      </Button>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
