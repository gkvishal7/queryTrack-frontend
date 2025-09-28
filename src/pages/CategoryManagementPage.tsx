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
import { Plus, Edit, Trash2, FileText, AlertCircle } from "lucide-react"
import FullScreenLoader from "../components/FullScreenLoader"
import { adminCategoryService, CategoryResponse, CategoryCreateRequest } from "../utils/admin"


const iconOptions = ["💻", "👥", "🏢", "💰", "📋", "🔧", "📞", "🎯", "📊", "🔒", "🌐", "📝", "⚡", "🎨", "📈"]

export default function CategoryManagementPage() {
  const [categories, setCategories] = useState<CategoryResponse[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null)
  const [editingCategory, setEditingCategory] = useState<CategoryResponse | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    icon: "📋",
  })

	const filteredCategories = categories.filter((category: CategoryResponse) => {
		const matchesSearch =
		category.categoryName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
		category.categoryDescription?.toLowerCase().includes(searchTerm.toLowerCase())

		return matchesSearch;
	})

  // Fetch categories when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const response = await adminCategoryService.getAllCategories()
        if (response && response.data) {
          // Transform API data to include UI-specific fields
          const transformedCategories = response.data.map((category) => ({
            ...category,
            name: category.categoryName,
            description: category.categoryDescription,
            icon: category.categoryIcon || "📋",
          }))
          setCategories(transformedCategories)
        } else {
          setError("No category data received from server")
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch categories")
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchCategories()
  }, [])

  const handleCreateCategory = async () => {
    try {
      setIsLoading(true)
      
      const categoryData: CategoryCreateRequest = {
        name: newCategory.name,
        description: newCategory.description,
        icon: newCategory.icon,
      }
      
      const response = await adminCategoryService.addCategory(categoryData)
      
      if (response && response.data) {
        // Transform the new category to match our display format
        const newCategoryData: CategoryResponse = {
            id: response.data.id,
            categoryName: response.data.categoryName,
            categoryDescription: response.data.categoryDescription,
            categoryIcon: response.data.categoryIcon,
            queryCount: 0,
        }
        
        setCategories([...categories, newCategoryData])
        
        setNewCategory({
          name: "",
          description: "",
          icon: "📋",
        })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create category")
    } finally {
      setIsLoading(false)
      setIsCreateDialogOpen(false)
    }
  }

  const handleEditCategory = (category: CategoryResponse) => {
    setEditingCategory(category)
    setIsEditDialogOpen(true)
  }

  const handleUpdateCategory = async () => {
    if (!editingCategory) return;
    
    try {
      setIsLoading(true)
      
      const categoryData: CategoryCreateRequest = {
        name: editingCategory.categoryName,
        description: editingCategory.categoryDescription,
        icon: editingCategory.categoryIcon,
      }
      
      const response = await adminCategoryService.updateCategory(editingCategory.id, categoryData)
      
      if (response && response.data) {
        // Update the category in our local state
        const updatedCategories = categories.map((cat: CategoryResponse) => 
          cat.id === editingCategory.id ? {
            ...cat,
            categoryName: response.data.categoryName,
            categoryDescription: response.data.categoryDescription,
            categoryIcon: response.data.categoryIcon,
          } : cat
        )
        
        setCategories(updatedCategories)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update category")
    } finally {
      setIsLoading(false)
      setIsEditDialogOpen(false)
      setEditingCategory(null)
    }
  }

  // Show delete confirmation dialog
  const handleOpenDeleteDialog = (categoryId: string) => {
    setCategoryToDelete(categoryId);
    setIsDeleteDialogOpen(true);
  };

  // Handle the actual delete operation after confirmation
  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;
    
    try {
		setIsLoading(true);
		
		const responseAfterDeletion  = await adminCategoryService.deleteCategory(categoryToDelete);
		console.log("Category deleted successfully:", responseAfterDeletion);
		// Remove the deleted category from our local state
		setCategories(categories.filter((cat: CategoryResponse) => cat.id !== categoryToDelete));
		
		// Close the dialog
		setIsDeleteDialogOpen(false);
		setCategoryToDelete(null);
    } catch (err) {
		setError(err instanceof Error ? err.message : "Failed to delete category");
	} finally {
      	setIsLoading(false);
    }
  }

  // Delete function has been replaced with handleOpenDeleteDialog and handleConfirmDelete

  if (isLoading) {
    return <FullScreenLoader message="Loading categories..." />
  }
  
  // Error state
  if (error) {
    return (
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <Sidebar  />
        <div className="flex-1 overflow-auto p-6">
          <Card className="border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
            <CardContent className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-red-700 dark:text-red-300 mb-2">Error Loading Categories</h3>
              <p className="text-red-600 dark:text-red-400 mb-4">
                {error}
              </p>
              <Button 
                onClick={() => window.location.reload()}
                variant="outline" 
                className="border-red-200 text-red-700 hover:bg-red-100 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-900/30"
              >
                Try Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar  />

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
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                      <span className="text-2xl">{category.categoryIcon}</span>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">{category.categoryName}</h3>

                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      
                      
                    </div>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 hidden sm:block">{category.categoryDescription}</p>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Queries</span>
                      <div className="flex items-center space-x-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium">{category.queryCount || 0}</span>
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
                      onClick={() => handleOpenDeleteDialog(category.id)}
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
                      value={editingCategory.categoryName}
                      onChange={(e) => setEditingCategory({ ...editingCategory, categoryName : e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-description">Description</Label>
                    <Textarea
                      id="edit-description"
                      value={editingCategory.categoryDescription}
                      onChange={(e) => setEditingCategory({ ...editingCategory, categoryDescription: e.target.value })}
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Icon</Label>
                      <Select
                        value={editingCategory.categoryIcon}
                        onValueChange={(value) => setEditingCategory({ ...editingCategory, categoryIcon: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {iconOptions.map((icon) => (
                            <SelectItem key={icon} value={icon}>
                              <span className="flex items-center">
                                <span className="mr-2 text-lg">{icon}</span>
                              </span>
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

          {/* Delete Confirmation Dialog */}
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="text-red-600 dark:text-red-400">Delete Category</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-400">
                  Are you sure ? This action cannot be undone. Any queries associated with this category may be affected.
                </p>
                
                <div className="flex space-x-2 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsDeleteDialogOpen(false);
                      setCategoryToDelete(null);
                    }} 
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleConfirmDelete} 
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  >
                    Delete Category
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  )
}
