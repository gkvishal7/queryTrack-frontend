import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import {
  X,
  Paperclip,
  FileText,
  ImageIcon,
  Save,
  AlertCircle,
  AlertTriangle,
  Clock,
} from "lucide-react"

const categories = [
  {
    value: "IT Support",
    label: "IT Support",
    description: "Technical issues, software problems, hardware requests, network connectivity",
    icon: "💻",
  },
  {
    value: "Human Resources",
    label: "Human Resources",
    description: "Policy questions, benefits, workplace issues, employment matters",
    icon: "👥",
  },
  {
    value: "Facilities",
    label: "Facilities",
    description: "Building maintenance, office supplies, workspace issues, security",
    icon: "🏢",
  },
  {
    value: "Finance",
    label: "Finance",
    description: "Expense reports, budget questions, payment issues, accounting",
    icon: "💰",
  },
  {
    value: "General",
    label: "General",
    description: "Other inquiries not covered by specific categories",
    icon: "📋",
  },
]

const priorities = [
  {
    value: "Low",
    label: "Low",
    description: "Non-urgent, can wait several days",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    icon: <Clock className="w-4 h-4" />,
  },
  {
    value: "Medium",
    label: "Medium",
    description: "Important but not urgent, within 2-3 days",
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    icon: <AlertCircle className="w-4 h-4" />,
  },
  {
    value: "High",
    label: "High",
    description: "Urgent, needs attention within 24 hours",
    color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    icon: <AlertTriangle className="w-4 h-4" />,
  },
  {
    value: "Critical",
    label: "Critical",
    description: "Emergency, immediate attention required",
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    icon: <AlertTriangle className="w-4 h-4" />,
  },
]

interface AttachedFile {
  id: string
  name: string
  size: number
  type: string
}

interface QueryData {
  title: string
  description: string
  categoryName: string
  priority: string
  // attachments: AttachedFile[]
}

interface EditQueryDialogProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: QueryData) => void
  initialData: QueryData
  isSaving?: boolean
}

export default function EditQueryDialog({
  isOpen,
  onClose,
  onSave,
  initialData,
  isSaving = false,
}: EditQueryDialogProps) {
  const [formData, setFormData] = useState<QueryData>(initialData)

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const files = event.target.files
  //   if (files) {
  //     const newFiles: AttachedFile[] = Array.from(files).map((file) => ({
  //       id: Math.random().toString(36).substr(2, 9),
  //       name: file.name,
  //       size: file.size,
  //       type: file.type,
  //     }))
  //     setFormData((prev) => ({
  //       ...prev,
  //       attachments: [...prev.attachments, ...newFiles],
  //     }))
  //   }
  // }

  // const removeFile = (fileId: string) => {
  //   setFormData((prev) => ({
  //     ...prev,
  //     attachments: prev.attachments.filter((file) => file.id !== fileId),
  //   }))
  // }

  // const formatFileSize = (bytes: number) => {
  //   if (bytes === 0) return "0 Bytes"
  //   const k = 1024
  //   const sizes = ["Bytes", "KB", "MB", "GB"]
  //   const i = Math.floor(Math.log(bytes) / Math.log(k))
  //   return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  // }

  // const getFileIcon = (type: string) => {
  //   if (type.startsWith("image/")) return <ImageIcon className="w-4 h-4" />
  //   return <FileText className="w-4 h-4" />
  // }

  const handleSave = () => {
    onSave(formData)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Query</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="p-6 space-y-6">
          {/* Query Details */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="font-semibold text-md text-left block">
                Query Title
                <span className="text-red-700">*</span>
              </Label>
              <Input
                id="title"
                placeholder="Please provide a short Title"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="transition-all duration-200 focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="font-semibold text-md text-left block">
                Detailed Description
                <span className="text-red-700">*</span>
              </Label>
              <Textarea
                id="description"
                placeholder="Please provide detailed information"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={12}
                className="transition-all duration-200 focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          {/* Category & Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Label className="block text-left font-semibold text-md">
                Select Category <span className="text-red-700">*</span>
              </Label>
              <Select value={formData.categoryName} onValueChange={(value) => handleInputChange("categoryName", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      <div className="flex items-center space-x-2">
                        <span>{category.icon}</span>
                        <span>{category.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Label className="block text-left font-semibold text-md">
                Priority Level <span className="text-red-700">*</span>
              </Label>
              <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map((priority) => (
                    <SelectItem key={priority.value} value={priority.value}>
                      <div className="flex items-center space-x-2">
                        {priority.icon}
                        <span>{priority.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Attachments */}
          {/* <div className="space-y-4">
            <Label className="text-left block">Attachments</Label>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center hover:border-teal-400 transition-colors">
              <Paperclip className="w-6 h-6 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                Drag and drop files here, or click to browse
              </p>
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif,.txt,.log"
              />
              <Label htmlFor="file-upload">
                <Button type="button" variant="outline" size="sm" asChild>
                  <span>Choose Files</span>
                </Button>
              </Label>
            </div> */}

            {/* Attached Files */}
            {/* {formData.attachments.length > 0 && (
              <div className="space-y-2">
                <Label>Attached Files ({formData.attachments.length})</Label>
                <div className="space-y-2">
                  {formData.attachments.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        {getFileIcon(file.type)}
                        <div>
                          <p className="text-sm font-medium">{file.name}</p>
                          <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                        </div>
                      </div>
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeFile(file.id)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )} */}
          {/* </div> */}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving || !formData.title.trim() || !formData.description.trim() || !formData.categoryName}
            className="bg-gradient-to-r from-teal-600 to-green-600 hover:from-teal-700 hover:to-green-700"
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
        </div>
      </div>
    </div>
  )
} 