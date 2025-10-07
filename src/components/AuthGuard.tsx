import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import FullScreenLoader from './FullScreenLoader';

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: 'USER' | 'ADMIN';
  adminOnly?: boolean;
}

export default function AuthGuard({ children, requiredRole, adminOnly = false }: AuthGuardProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, getUserRole, isLoading } = useAuthStore();

  useEffect(() => {
    // Don't redirect if still loading
    if (isLoading) return;

    // If not authenticated, redirect to login
    if (!isAuthenticated) {
      navigate('/login', { 
        state: { from: location.pathname },
        replace: true 
      });
      return;
    }

    const userRole = getUserRole();

    // If admin only route but user is not admin
    if (adminOnly && userRole !== 'ADMIN') {
      navigate('/dashboard', { replace: true });
      return;
    }

    // If admin user is on regular user routes, redirect to admin dashboard
    if (userRole === 'ADMIN' && !adminOnly && !requiredRole) {
      // Check if this is a regular user route (not admin route)
      const isUserRoute = !location.pathname.startsWith('/admin');
      if (isUserRoute) {
        navigate('/admin/dashboard', { replace: true });
        return;
      }
    }

    // If specific role required but user doesn't have it
    if (requiredRole && userRole !== requiredRole) {
      // Redirect to appropriate dashboard based on user role
      if (userRole === 'ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
      return;
    }
  }, [isAuthenticated, getUserRole, isLoading, navigate, location.pathname, requiredRole, adminOnly]);

  // Show loading while checking authentication
  if (isLoading) {
    return <FullScreenLoader message="Checking authentication..." />;
  }

  // Show loading while not authenticated (will redirect)
  if (!isAuthenticated) {
    return <FullScreenLoader message="Redirecting to login..." />;
  }

  // Show loading while checking role permissions
  const userRole = getUserRole();
  
  if (adminOnly && userRole !== 'ADMIN') {
    return <FullScreenLoader message="Checking permissions..." />;
  }

  if (requiredRole && userRole !== requiredRole) {
    return <FullScreenLoader message="Checking permissions..." />;
  }

  // Render children if all checks pass
  return <>{children}</>;
}
