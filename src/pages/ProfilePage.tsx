"use client"

import { useState, useEffect } from "react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Sidebar } from "../components/Sidebar"
import { User, Shield, Key, Edit, Menu, Save } from "lucide-react"
import { ModularButton } from "@/components/ModularButton"
import { Profile, profileService } from "../utils/profile"
import FullScreenLoader from "../components/FullScreenLoader";

export default function ProfilePage() {
  const [user, setUser] = useState<Profile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const [activeTab, setActiveTab] = useState("profile")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true)
        setError("")
        const response = await profileService.getProfile()
        setUser(response.data)
      } catch (error: any) {
        setError(error.message || "Failed to fetch profile")
        console.error("Error fetching profile:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const handleSave = async () => {
    if (!user) return;
    
    try {
      setIsSaving(true)
      const response = await profileService.updateProfile({
        emailId: user.emailId,
        username: user.username,
        department: user.department,
        phoneNumber: user.phoneNumber,
      })
      setUser(response.data)
      setIsEditing(false)
    } catch (error: any) {
      console.error("Error updating profile:", error)
      setError(error.message || "Failed to update profile")
    } finally {
      setIsSaving(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    if (!user) return;
    
    setUser((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        [field]: value
      }
    })
  }

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Shield },
  ]

  if (isLoading) {
    return <FullScreenLoader />
  }

  if (isSaving) {
    return <FullScreenLoader message="Saving changes..." />
  }

  if (!user || error) {
    return <FullScreenLoader message={error || "Failed to load profile"} />
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
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">Profile</h1>
          <div className="w-6 h-6" /> {/* Spacer for symmetry */}
        </div>
        <div className="p-2 sm:p-4 md:p-6 max-w-4xl mx-auto space-y-4 md:space-y-6">
          {/* Header */}
          <div className="hidden md:flex items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-3xl font-bold text-gray-900 dark:text-white text-left">Profile Settings</h1>
              <p className=" hidden sm:block text-gray-600 dark:text-gray-400 mt-1">Manage your account settings and preferences</p>
            </div>
            <div className="flex space-x-2">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <ModularButton onClick={handleSave} disabled={isSaving}>
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
                  </ModularButton>
                </>
              ) : (
                <ModularButton onClick={() => setIsEditing(true)}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Profile
                </ModularButton>
              )}
            </div>
          </div>

          {/* Profile Header Card */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <div className="relative">
                  <img
                    src="/placeholder.svg"
                    alt={user?.username}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-4 border-white shadow-lg"
                  />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                    {user?.username}
                  </h2>
                  <p className="text-gray-500 text-xs sm:text-sm">{user?.department}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Open Queries</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{user?.queryStats?.openQueries || 0}</div>
                <p className="text-xs text-muted-foreground">Awaiting response</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Progress</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{user?.queryStats?.inProgressQueries || 0}</div>
                <p className="text-xs text-muted-foreground">Currently being processed</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Resolved</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{user?.queryStats?.resolvedQueries || 0}</div>
                <p className="text-xs text-muted-foreground">Successfully completed</p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap space-x-0 sm:space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`flex items-center px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors focus:outline-none ${activeTab === tab.id ? 'bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow' : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <tab.icon className="w-4 h-4 mr-1" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="block text-left text-md" htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={user?.username || ''}
                      onChange={(e) => handleInputChange("username", e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className = "block text-left text-md" htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={user?.emailId || ''}
                      onChange={(e) => handleInputChange("emailId", e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className = "block text-left text-md" htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        value={user?.phoneNumber || ''}
                        onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                        disabled={!isEditing}
                      />
                    </div>

                    {
                      isEditing ? (
                        <div className="space-y-2">
                      <Label className="block text-left text-md" htmlFor="department">Department</Label>
                      <Select 
                        value={user?.department || 'Depar'} 
                        onValueChange={(value) => handleInputChange("department", value)} 
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Marketing">Marketing</SelectItem>
                          <SelectItem value="Sales">Sales</SelectItem>
                          <SelectItem value="Engineering">Engineering</SelectItem>
                          <SelectItem value="HR">Human Resources</SelectItem>
                          <SelectItem value="Finance">Finance</SelectItem>
                          <SelectItem value="Operations">Operations</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                      ) : (
                        <div className="space-y-2">
                          <Label className="block text-left text-md">Department</Label>
                          <p className="text-gray-500">{user?.department || 'N/A'}</p>
                        </div>
                      )
                    }
                    
                    
                    
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* {activeTab === "notifications" && (
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className = "block text-left text-md">Email Notifications</Label>
                      <p className="text-sm text-gray-500">Receive email notifications for query updates</p>
                    </div>
                    <Switch
                      checked={user.preferences.emailNotifications}
                      onCheckedChange={(checked) => handleInputChange("preferences.emailNotifications", checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className = "block text-left text-md">Push Notifications</Label>
                      <p className="text-sm text-gray-500">Receive push notifications in your browser</p>
                    </div>
                    <Switch
                      checked={user.preferences.pushNotifications}
                      onCheckedChange={(checked) => handleInputChange("preferences.pushNotifications", checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className = "block text-left text-md">Weekly Digest</Label>
                      <p className="text-sm text-gray-500">Get a weekly summary of your query activity</p>
                    </div>
                    <Switch
                      checked={user.preferences.weeklyDigest}
                      onCheckedChange={(checked) => handleInputChange("preferences.weeklyDigest", checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className = "block text-left text-md">Query Updates</Label>
                      <p className="text-sm text-gray-500">Get notified when your queries are updated</p>
                    </div>
                    <Switch
                      checked={user.preferences.queryUpdates}
                      onCheckedChange={(checked) => handleInputChange("preferences.queryUpdates", checked)}
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label className = "block text-left text-md">System Maintenance</Label>
                      <p className="text-sm text-gray-500">Receive notifications about scheduled maintenance</p>
                    </div>
                    <Switch
                      checked={user.preferences.systemMaintenance}
                      onCheckedChange={(checked) => handleInputChange("preferences.systemMaintenance", checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )} */}

          {activeTab === "security" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Password & Security</CardTitle>
                  <CardDescription>Manage your password and security settings</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className = "block text-left text-md">Current Password</Label>
                    <Input type="password" placeholder="Enter current password" />
                  </div>
                  <div className="space-y-2">
                    <Label className = "block text-left text-md">New Password</Label>
                    <Input type="password" placeholder="Enter new password" />
                  </div>
                  <div className="space-y-2">
                    <Label className = "block text-left text-md">Confirm New Password</Label>
                    <Input type="password" placeholder="Confirm new password" />
                  </div>
                  <ModularButton className="w-full">
                    <Key className="w-4 h-4 mr-2" />
                    Update Password
                  </ModularButton>
                </CardContent>
              </Card>

              
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
