import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface CustomerRouteProps {
  children: React.ReactNode;
}

const CustomerRoute = ({ children }: CustomerRouteProps) => {
  const { isAdmin } = useAuth();

  // Redirect admins to admin dashboard
  if (isAdmin) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
};

export default CustomerRoute;
