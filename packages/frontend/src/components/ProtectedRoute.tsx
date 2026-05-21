import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

type ProtectedRouteProps = {
  requiredRole?: 'admin';
};

export default function ProtectedRoute({ requiredRole }: ProtectedRouteProps) {
  const { isAdmin, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate replace state={{ from: location }} to="/login" />;
  }

  if (requiredRole === 'admin' && !isAdmin) {
    return <Navigate replace to="/" />;
  }

  return <Outlet />;
}
