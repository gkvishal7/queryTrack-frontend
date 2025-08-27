import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import { Badge } from "../components/ui/badge"
import { Progress } from "../components/ui/progress"
import { Sidebar } from "../components/Sidebar"
import {
  ArrowLeft,
  Send,
  AlertCircle,
  CheckCircle,
  Clock,
  AlertTriangle,
  Menu,
} from "lucide-react"
import { ModularButton } from "@/components/ModularButton"
import { queryService } from "../utils/query"
import { CategoryResponse } from "@/utils/admin"
import FullScreenLoader from "@/components/FullScreenLoader"

const priorities = [
  {
    value: "low",
    label: "Low",
    description: "Non-urgent, can wait several days",
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    icon: <Clock className="w-4 h-4" />,
  },
  {
    value: "medium",
    label: "Medium",
    description: "Important but not urgent, within 2-3 days",
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    icon: <AlertCircle className="w-4 h-4" />,
  },
  {
    value: "high",
    label: "High",
    description: "Urgent, needs attention within 24 hours",
    color: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
    icon: <AlertTriangle className="w-4 h-4" />,
  },
  {
    value: "critical",
    label: "Critical",
    description: "Emergency, immediate attention required",
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    icon: <AlertTriangle className="w-4 h-4" />,
  },
]


export default function NewQueryPage() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [categories, setCategories] = useState<CategoryResponse[]>([]) // You can populate this with actual categories from your backend

  // Form data
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "medium",
    // attachments: [] as AttachedFile[],
  })

  const totalSteps = 3
  const progress = (currentStep / totalSteps) * 100

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

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return formData.title.trim().length > 0 && formData.description.trim().length > 0
      case 2:
        return formData.category.length > 0
      case 3:
        return true
      default:
        return false
    }
  }

  const fetchCategories = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await queryService.getCategories()
        if (response && response.data) {
          setCategories(response.data);
        } else {
          setError("No Categories data received from server")
        }
      }catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch users")
      }finally {
        setIsLoading(false)
      }
  }

  const handleNext = () => {
    if (canProceedToNext() && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    try {
      const queryData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        priority: formData.priority
      }

      console.log('Submitting query data:', queryData)

      // Make API call
      const response = await queryService.createQuery(queryData)
      console.log('Query created successfully:', response)
      
      setShowSuccess(true)
      // Redirect after success animation
      setTimeout(() => {
        navigate("/queries")
      }, 2000)
    } catch (error: any) {
      console.error('Error creating query:', error)
      // You might want to show an error message to the user here
      alert(error.message || 'Failed to create query. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const selectedCategory = categories.find((cat) => cat.categoryName === formData.category)
  const selectedPriority = priorities.find((pri) => pri.value === formData.priority)

  if (isLoading) {
    return <FullScreenLoader message="Loading ..." />
  }

  if (showSuccess) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar userRole="user" />
        <div className="flex-1 flex items-center justify-center">
          <Card className="w-full max-w-md text-center">
            <CardContent className="pt-6">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Query Submitted Successfully!</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Your query has been submitted and assigned ID{" "}
                
              </p>
              <p className="text-sm text-gray-500">Redirecting to your queries...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
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
        <div className="w-64 h-full bg-white dark:bg-gray-900 shadow-lg" onClick={e => e.stopPropagation()}>
          <Sidebar userRole="user" />
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        {/* Mobile header */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 shadow sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-700 dark:text-gray-200 focus:outline-none">
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">New Query</h1>
          <div className="w-6 h-6" /> {/* Spacer for symmetry */}
        </div>
        <div className="p-2 sm:p-4 md:p-6 max-w-3xl mx-auto space-y-4 md:space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Submit New Query</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Step {currentStep} of {totalSteps}:{" "}
                  {currentStep === 1
                    ? "Describe your query"
                    : currentStep === 2
                      ? "Categorize and prioritize"
                      : "Review and submit"}
                </p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Progress</span>
                <span className="text-sm text-gray-500">{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="w-full" />
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span className={currentStep >= 1 ? "text-teal-600 font-medium" : ""}>Query Details</span>
                <span className={currentStep >= 2 ? "text-teal-600 font-medium" : ""}>Category & Priority</span>
                <span className={currentStep >= 3 ? "text-teal-600 font-medium" : ""}>Review & Submit</span>
              </div>
            </CardContent>
          </Card>

          {/* Step Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-3">
              {/* Step 1: Query Details */}
              {currentStep === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Query Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
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
                        rows={10}
                        className="transition-all duration-200 focus:ring-2 focus:ring-teal-500"
                      />
                      
                    </div>

                    {/* <div className="space-y-2">
                      <Label className="text-left block">Attachments (Optional)</Label>
                      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-teal-400 transition-colors">
                        <Paperclip className="w-8 h-8 text-gray-400 mx-auto mb-2" />
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
                        <p className="text-xs text-gray-500 mt-2">
                          Supported: PDF, DOC, DOCX, JPG, PNG, GIF, TXT, LOG (Max 10MB each)
                        </p>
                      </div>

                     
                      {formData.attachments.length > 0 && (
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
                      )}
                    </div> */}
                  </CardContent>
                </Card>
              )}

              {/* Step 2: Category & Priority */}
              {currentStep === 2 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Category & Priority</CardTitle>
                    <CardDescription>
                      Help us route your query to the right team and set appropriate priority
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <Label className="block text-left font-semibold text-md">
                        Select Category <span className="text-red-700">*</span>
                      </Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {categories.map((category) => (
                          <div
                            key={category.id}
                            className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:border-teal-300 ${
                              formData.category === category.categoryName
                                ? "border-teal-500 bg-teal-50 dark:bg-teal-900/20"
                                : "border-gray-200 dark:border-gray-700"
                            }`}
                            onClick={() => handleInputChange("category", category.categoryName)}
                          >
                            <div className="flex items-start space-x-3">
                              <span className="text-2xl">{category.categoryIcon}</span>
                              <div>
                                <h3 className="font-medium text-gray-900 dark:text-white">{category.categoryName}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{category.categoryDescription}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                    <Label className="block text-left font-semibold text-md">
                        Priority Level <span className="text-red-700">*</span>
                      </Label>
                      <div className="space-y-3">
                        {priorities.map((priority) => (
                          <div
                            key={priority.value}
                            className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 hover:border-teal-300 ${
                              formData.priority === priority.value
                                ? "border-teal-500 bg-teal-50 dark:bg-teal-900/20"
                                : "border-gray-200 dark:border-gray-700"
                            }`}
                            onClick={() => handleInputChange("priority", priority.value)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                {priority.icon}
                                <div>
                                  <div className="flex items-center space-x-2">
                                    <span className="font-medium">{priority.label}</span>
                                    <Badge className={priority.color}>{priority.label}</Badge>
                                  </div>
                                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    {priority.description}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Step 3: Review & Submit */}
              {currentStep === 3 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Review Your Query</CardTitle>
                    <CardDescription>Please review all details before submitting your query</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="flex">
                        <Label className="text-lg font-medium text-gray-500 block text-left">Title : </Label>
                        <p className="text-lg font-medium text-gray-900 dark:text-white ml-6">{formData.title}</p>
                      </div>

                      <div>
                        <Label className="text-lg font-medium text-gray-500 block text-left">Description  :</Label>
                        <div className="mt-1 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                          <p className="text-gray-900 dark:text-white whitespace-pre-wrap text-left">{formData.description}</p>
                        </div>
                      </div>

                      <div>
                        <div className="flex">
                          <Label className="text-lg font-medium text-gray-500 block text-left">Category : </Label>
                          <div className="flex ml-6 space-x-2">
                            <span className="text-xl">{selectedCategory?.categoryIcon}</span>
                            <span className="font-medium">{selectedCategory?.categoryName}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="flex">
                          <Label className="text-lg font-medium text-gray-500 block text-left">Priority : </Label>
                          <div className="flex items-center space-x-2 ml-6">
                            <Badge className={selectedPriority?.color}>{selectedPriority?.label}</Badge>
                          </div>
                        </div>
                      </div>

                      {/* {formData.attachments.length > 0 && (
                        <div>
                          <Label className="text-sm font-medium text-gray-500">
                            Attachments ({formData.attachments.length})
                          </Label>
                          <div className="mt-1 space-y-2">
                            {formData.attachments.map((file) => (
                              <div
                                key={file.id}
                                className="flex items-center space-x-3 p-2 bg-gray-50 dark:bg-gray-800 rounded"
                              >
                                {getFileIcon(file.type)}
                                <span className="text-sm">{file.name}</span>
                                <span className="text-xs text-gray-500">({formatFileSize(file.size)})</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )} */}
                    </div>
                  </CardContent>
                </Card>
              )}
              <div className="flex justify-center my-10">
                    <ModularButton
                      
                      onClick={handlePrevious}
                      
                      disabled={currentStep === 1}
                      className={`flex-1 ml-2 bg-gradient-to-r from-teal-600 to-green-700 hover:from-teal-700 hover:to-green-800 
                        ${currentStep ===1 ? "hidden" :""}`}
                      size="lg"
                    >
                      Previous
                    </ModularButton>
                    {currentStep < totalSteps ? (
                      <ModularButton
                        onClick={handleNext}
                        disabled={!canProceedToNext()}
                        className={`flex-1 ml-2 bg-gradient-to-r from-green-600 to-teal-700 hover:from-teal-700 hover:to-green-800`}
                        size="lg"
                      >
                        Next
                      </ModularButton>
                    ) : (
                      <ModularButton
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className={`flex-1 ml-2 bg-gradient-to-r from-teal-600 to-green-700 hover:from-teal-700 hover:to-green-800`}
                        size="lg"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Submitting...
                          </div>
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Submit Query
                          </>
                        )}
                      </ModularButton>
                    )}
                  </div>
            </div>

            
          </div>
        </div>
      </div>
    </div>
  )
}
