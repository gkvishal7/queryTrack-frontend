import { Routes, Route } from "react-router-dom"
import { ThemeProvider } from "./components/theme-provider"
import LandingPage from "./pages/LandingPage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import UserDashboard from "./pages/UserDashboard"
import AdminDashboard from "./pages/AdminDashboard"
import QueriesPage from "./pages/QueriesPage"
import NewQueryPage from "./pages/NewQueryPage"
import QueryDetailPage from "./pages/QueryDetailPage"
import ProfilePage from "./pages/ProfilePage"
import AdminQueriesPage from "./pages/AdminQueriesPage"
import UserManagementPage from "./pages/UserManagementPage"
import CategoryManagementPage from "./pages/CategoryManagementPage"
import SettingsPage from "./pages/SettingsPage"
import HelpPage from "./pages/HelpPage"
import NotFoundPage from "./pages/NotFoundPage"
import "./App.css"

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="query-track-theme">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/queries" element={<QueriesPage />} />
          <Route path="/queries/new" element={<NewQueryPage />} />
          <Route path="/queries/:id" element={<QueryDetailPage />} />
          <Route path="/admin/queries" element={<AdminQueriesPage />} />
          <Route path="/admin/users" element={<UserManagementPage />} />
          <Route path="/admin/categories" element={<CategoryManagementPage />} />
          <Route path="/admin/settings" element={<SettingsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
        
    </ThemeProvider>
  )
}

export default App
