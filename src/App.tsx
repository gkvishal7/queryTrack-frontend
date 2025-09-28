import { Routes, Route } from "react-router-dom"
import { ThemeProvider } from "./components/theme-provider"
import AuthGuard from "./components/AuthGuard"
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
import HelpPage from "./pages/HelpPage"
import NotFoundPage from "./pages/NotFoundPage"
import "./App.css"
import AdminQueryDetailPage from "./pages/AdminQueryDetailsPage"

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="query-track-theme">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 transition-colors duration-300">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          

          <Route path="/dashboard" element={
            <AuthGuard>
              <UserDashboard />
            </AuthGuard>
          } />
          <Route path="/queries" element={
            <AuthGuard>
              <QueriesPage />
            </AuthGuard>
          } />
          <Route path="/queries/new" element={
            <AuthGuard>
              <NewQueryPage />
            </AuthGuard>
          } />
          <Route path="/queries/:id" element={
            <AuthGuard>
              <QueryDetailPage />
            </AuthGuard>
          } />
          <Route path="/profile" element={
            <AuthGuard>
              <ProfilePage userRole="user" />
            </AuthGuard>
          } />
          
          {/* Protected admin routes */}
          <Route path="/admin/dashboard" element={
            <AuthGuard adminOnly>
              <AdminDashboard />
            </AuthGuard>
          } />
          <Route path="/admin/queries" element={
            <AuthGuard adminOnly>
              <AdminQueriesPage />
            </AuthGuard>
          } />
          <Route path="/admin/queries/:id" element={
            <AuthGuard adminOnly>
              <AdminQueryDetailPage />
            </AuthGuard>
          } />
          <Route path="/admin/users" element={
            <AuthGuard adminOnly>
              <UserManagementPage />
            </AuthGuard>
          } />
          <Route path="/admin/categories" element={
            <AuthGuard adminOnly>
              <CategoryManagementPage />
            </AuthGuard>
          } />
          <Route path="/admin/profile" element={
            <AuthGuard adminOnly>
              <ProfilePage userRole="admin" />
            </AuthGuard>
          } />
          
          <Route path="/help" element={<HelpPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
        
    </ThemeProvider>
  )
}

export default App
