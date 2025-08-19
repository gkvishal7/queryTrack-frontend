"use client"

import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Button } from "./ui/button"
import { Separator } from "./ui/separator"
import {Home, FileText, Plus, Users, HelpCircle,
  User,
  BarChart3,
  Tag,
  Shield,
  LogOut,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { authService } from "@/utils/auth"

interface SidebarProps {
  userRole: "user" | "admin"
}

export function Sidebar({ userRole }: SidebarProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Prevent expanding on mobile
  const handleCollapseToggle = () => {
    if (window.innerWidth >= 768) {
      setIsCollapsed((prev) => !prev)
    }
  }

  const userNavItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/queries", label: "My Queries", icon: FileText },
    { href: "/queries/new", label: "New Query", icon: Plus },
    { href: "/profile", label: "Profile", icon: User },
    { href: "/help", label: "Help", icon: HelpCircle },
  ]

  const adminNavItems = [
    { href: "/admin/dashboard", label: "Admin Dashboard", icon: BarChart3 },
    { href: "/admin/queries", label: "All Queries", icon: FileText },
    { href: "/admin/users", label: "User Management", icon: Users },
    { href: "/admin/categories", label: "Categories", icon: Tag },
    { href: "/profile", label: "Profile", icon: User },
    { href: "/help", label: "Help", icon: HelpCircle },
  ]

  const navItems = userRole === "admin" ? adminNavItems : userNavItems

  const isActive = (href: string) => {
    if (href === "/dashboard" || href === "/admin/dashboard") {
      return location.pathname === href
    }
    // For /queries, only match exactly
    if (href === "/queries") {
      return location.pathname === "/queries"
    }
    // For /admin/queries, only match exactly
    if (href === "/admin/queries") {
      return location.pathname === "/admin/queries"
    }
    // For other links, use startsWith
    return location.pathname.startsWith(href)
  }

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("dark")
  }

  return (
    <div
      className={cn(
        `${isCollapsed ? "w-16" : "w-64"}`,
        "bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300",
        " static z-30 h-full"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-teal-600 to-teal-500 bg-clip-text text-transparent">
                  Query Track
                </h1>
            </div>
          )}
          {/* Hide collapse/expand button on mobile */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCollapseToggle}
            className="p-1.5 hidden md:inline-flex"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* User Info */}
      {!isCollapsed && (
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <img
              src="/placeholder.svg?height=40&width=40"
              alt="User Avatar"
              className="w-10 h-10 rounded-full object-cover mx-4"
            />
            <div className="min-w-0 text-left">
              <div className="text-sm font-medium text-gray-900 dark:text-white truncate ">John Smith</div>
              <div className="items-center">
                <div className="text-xs inline text-gray-500 dark:text-gray-400">Marketing</div>
                {userRole === "admin" && (
                  <div className="flex items-center space-x-1 px-2 py-0.5 bg-teal-100 dark:bg-teal-900/30 rounded-full">
                    <Shield className="w-3 h-3 text-teal-600 dark:text-teal-400" />
                    <span className="text-xs font-medium text-teal-700 dark:text-teal-300">Admin</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const active = isActive(item.href)

          return (
            <Link key={item.href} to={item.href}>
              <div
                className={`flex items-center py-2.5 rounded-lg w-full justify-start ${isCollapsed ? "px-0.5" : "px-3"} 
				${
                  active
                    ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-lg shadow-teal-500/25"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50" }
                  	${ isCollapsed && "justify-center"}
                `}
              >
                <Icon className={`${isCollapsed ? "w-5 h-5" : "w-5 h-5 mr-3"}`} />
                	{!isCollapsed && <span className="font-medium">{item.label}</span>}
              </div>
            </Link>
			
          )
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-200/60 dark:border-slate-700/60 space-y-2">
        {/* Theme Toggle */}
		
        <Button
          variant="ghost"
          onClick={toggleTheme}
          className={`w-full justify-start ${isCollapsed ? "px-2" : "px-3"}`}
        >
          {isDarkMode ? (
            <Sun className={`${isCollapsed ? "w-5 h-5" : "w-4 h-4 mr-3"}`} />
          ) : (
            <Moon className={`${isCollapsed ? "w-5 h-5" : "w-4 h-4 mr-3"}`} />
          )}
          {!isCollapsed && <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>}
        </Button>

        {!isCollapsed && <Separator />}

        {/* Logout */}
        <Button
          variant="ghost"
          onClick={async () => {
            try {
              await authService.logout();
              navigate('/'); // Redirect to home page after successful logout
            } catch (error) {
              console.error('Logout failed:', error);
              // Still redirect to home page even if logout fails
              navigate('/');
            }
          }}
          className={cn(
            "w-full justify-start  hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20",
            isCollapsed && "justify-center",
          )}
        >
          <LogOut className={cn("w-5 h-5", !isCollapsed && "mr-3")} />
          {!isCollapsed && <span>Logout</span>}
        </Button>
      </div>
    </div>
  )
}
