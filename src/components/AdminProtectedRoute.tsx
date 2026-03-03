import { Navigate } from 'react-router-dom';
import { isAdminLoggedIn } from '@/lib/adminAuth';

const AdminProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  if (!isAdminLoggedIn()) {
    return <Navigate to="/admin" replace />;
  }
  return <>{children}</>;
};

export default AdminProtectedRoute;
