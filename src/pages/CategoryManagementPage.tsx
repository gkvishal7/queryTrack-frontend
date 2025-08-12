"use client"

import { useState, useEffect } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog"
import { Sidebar } from "../components/Sidebar"
import { Plus, Edit, Trash2, FileText, Settings, BarChart3, Tag, User } from "lucide-react"
import FullScreenLoader from "../components/FullScreenLoader"

// Mock category data
const mockCategories = [
  {
    id: "cat-001",
    name: "IT Support",
    description: "Technical issues, software problems, hardware requests, network connectivity",
    icon: "💻",
    color: "blue",
    isActive: true,
    queriesCount: 45,
    members: "20",
    assignedTeam: "IT Team",
    slaHours: 24,
    createdAt: "2023-01-15",
    updatedAt: "2024-01-10",
  },
  {
    id: "cat-002",
    name: "Human Resources",
    description: "Policy questions, benefits, workplace issues, employment matters",
    icon: "👥",
    color: "green",
    isActive: true,
    queriesCount: 32,
    members: "20",
    assignedTeam: "HR Team",
    slaHours: 48,
    createdAt: "2023-01-15",
    updatedAt: "2024-01-08",
  },
  {
    id: "cat-003",
    name: "Facilities",
    description: "Building maintenance, office supplies, workspace issues, security",
    icon: "🏢",
    color: "orange",
    isActive: true,
    queriesCount: 28,
    members: "20",
    assignedTeam: "Facilities Team",
    slaHours: 72,
    createdAt: "2023-01-15",
    updatedAt: "2024-01-05",
  },
  {
    id: "cat-004",
    name: "Finance",
    description: "Expense reports, budget questions, payment issues, accounting",
    icon: "💰",
    color: "purple",
    isActive: true,
    queriesCount: 26,
    members: "20",
    assignedTeam: "Finance Team",
    slaHours: 48,
    createdAt: "2023-01-15",
    updatedAt: "2024-01-12",
  },
  {
    id: "cat-005",
    name: "General",
    description: "Other inquiries not covered by specific categories",
    icon: "📋",
    color: "gray",
    isActive: false,
    queriesCount: 15,
    members: "20",
    assignedTeam: "General Support",
    slaHours: 96,
    createdAt: "2023-01-15",
    updatedAt: "2023-12-20",
  },
]

const colorOptions = [
  { value: "blue", label: "Blue", class: "bg-blue-100 text-blue-800" },
  { value: "green", label: "Green", class: "bg-green-100 text-green-800" },
  { value: "orange", label: "Orange", class: "bg-orange-100 text-orange-800" },
  { value: "purple", label: "Purple", class: "bg-purple-100 text-purple-800" },
  { value: "red", label: "Red", class: "bg-red-100 text-red-800" },
  { value: "gray", label: "Gray", class: "bg-gray-100 text-gray-800" },
]

const iconOptions = ["💻", "👥", "🏢", "💰", "📋", "🔧", "📞", "🎯", "📊", "🔒", "🌐", "📝", "⚡", "🎨", "📈"]

export default function CategoryManagementPage() {
  const [categories, setCategories] = useState(mockCategories)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    icon: "📋",
    color: "blue",
    assignedTeam: "",
    slaHours: 24,
  })

  const filteredCategories = categories.filter((category) => {
    const matchesSearch =
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase())
   

    return matchesSearch;
  })

  const handleCreateCategory = () => {
    const category = {
      id: `cat-${Date.now()}`,
      ...newCategory,
      isActive: true,
      queriesCount: 0,
      members: "20",
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    }

    setCategories([...categories, category])
    setNewCategory({
      name: "",
      description: "",
      icon: "📋",
      color: "blue",
      assignedTeam: "",
      slaHours: 24,
    })
    setIsCreateDialogOpen(false)
  }

  const handleEditCategory = (category: any) => {
    setEditingCategory(category)
    setIsEditDialogOpen(true)
  }

  const handleUpdateCategory = () => {
    setCategories(
      categories.map((cat) =>
        cat.id === editingCategory.id ? { ...editingCategory, updatedAt: new Date().toISOString().split("T")[0] } : cat,
      ),
    )
    setIsEditDialogOpen(false)
    setEditingCategory(null)
  }

  const handleDeleteCategory = (categoryId: string) => {
    if (confirm("Are you sure you want to delete this category? This action cannot be undone.")) {
      setCategories(categories.filter((cat) => cat.id !== categoryId))
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return <FullScreenLoader />
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar userRole="admin" />

      <div className="flex-1 overflow-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center sm:text-left">Category Management</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1 md:block hidden">
                Manage query categories, their settings, and assigned teams
              </p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-teal-600 to-green-600 hover:from-green-700 hover:to-teal-700 md:flex hidden">
                  <Plus className="w-4 h-4 mr-2"/>
                  Add Category
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Create New Category</DialogTitle>
                  <DialogDescription>Add a new category to organize and route queries effectively</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Category Name</Label>
                    <Input
                      id="name"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                      placeholder="e.g., IT Support"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newCategory.description}
                      onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                      placeholder="Describe what types of queries this category handles..."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Icon</Label>
                      <Select
                        value={newCategory.icon}
                        onValueChange={(value) => setNewCategory({ ...newCategory, icon: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {iconOptions.map((icon) => (
                            <SelectItem key={icon} value={icon}>
                              <span className="flex items-center">
                                <span className="mr-2 text-lg">{icon}</span>
                                {icon}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Color</Label>
                      <Select
                        value={newCategory.color}
                        onValueChange={(value) => setNewCategory({ ...newCategory, color: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {colorOptions.map((color) => (
                            <SelectItem key={color.value} value={color.value}>
                              <div className="flex items-center">
                                <div className={`w-3 h-3 rounded-full mr-2 ${color.class}`}></div>
                                {color.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="team">Assigned Team</Label>
                    <Input
                      id="team"
                      value={newCategory.assignedTeam}
                      onChange={(e) => setNewCategory({ ...newCategory, assignedTeam: e.target.value })}
                      placeholder="e.g., IT Team"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sla">SLA (Hours)</Label>
                    <Input
                      id="sla"
                      type="number"
                      value={newCategory.slaHours}
                      onChange={(e) => setNewCategory({ ...newCategory, slaHours: Number.parseInt(e.target.value) })}
                      placeholder="24"
                    />
                  </div>

                  <div className="flex space-x-2 pt-4">
                    <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="flex-1">
                      Cancel
                    </Button>
                    <Button onClick={handleCreateCategory} className="flex-1">
                      Create Category
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
                          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Categories</CardTitle>
                <Tag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{categories.length}</div>
                <p className="text-xs text-muted-foreground">Available categories</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Categories</CardTitle>
                <Settings className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{categories.filter((c) => c.isActive).length}</div>
                <p className="text-xs text-muted-foreground">Currently active</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Queries</CardTitle>
                <FileText className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {categories.reduce((sum, cat) => sum + cat.queriesCount, 0)}
                </div>
                <p className="text-xs text-muted-foreground">Across all categories</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Resolution</CardTitle>
                <BarChart3 className="h-4 w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">2.4 days</div>
                <p className="text-xs text-muted-foreground">Average across categories</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Search & Filter</CardTitle>
              <CardDescription>Find and filter categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <Input
                  className="lg:w-1/2"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          <Button className="bg-gradient-to-r from-teal-600 to-green-600 hover:from-green-700 hover:to-teal-700 md:hidden ">
            <Plus className="w-4 h-4 mr-2" />
              Add Category
          </Button>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((category) => (
              <Card key={category.id} className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{category.icon}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{category.name}</h3>
                        
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      
                      
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 hidden sm:block">{category.description}</p>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Queries</span>
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium">{category.queriesCount}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500"> Members </span>
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium">{category.members}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between space-x-2 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <Button variant="outline" size="sm" onClick={() => handleEditCategory(category)}>
                        <Edit className="w-4 h-4" />
						Edit
                      </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      <Trash2 className="w-4 h-4" />
					  Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Edit Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Edit Category</DialogTitle>
                <DialogDescription>Update category settings and configuration</DialogDescription>
              </DialogHeader>
              {editingCategory && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Category Name</Label>
                    <Input
                      id="edit-name"
                      value={editingCategory.name}
                      onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-description">Description</Label>
                    <Textarea
                      id="edit-description"
                      value={editingCategory.description}
                      onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Icon</Label>
                      <Select
                        value={editingCategory.icon}
                        onValueChange={(value) => setEditingCategory({ ...editingCategory, icon: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {iconOptions.map((icon) => (
                            <SelectItem key={icon} value={icon}>
                              <span className="flex items-center">
                                <span className="mr-2 text-lg">{icon}</span>
                                {icon}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Color</Label>
                      <Select
                        value={editingCategory.color}
                        onValueChange={(value) => setEditingCategory({ ...editingCategory, color: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {colorOptions.map((color) => (
                            <SelectItem key={color.value} value={color.value}>
                              <div className="flex items-center">
                                <div className={`w-3 h-3 rounded-full mr-2 ${color.class}`}></div>
                                {color.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>


                  <div className="flex space-x-2 pt-4">
                    <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="flex-1">
                      Cancel
                    </Button>
                    <Button onClick={handleUpdateCategory} className="flex-1">
                      Update Category
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}
