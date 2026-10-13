import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Loading from './Loading';

function ProtectedRoute({ children, role }) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loading message="Loading..." />;
  }

  // Jika belum terautentikasi, lempar ke halaman login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Jika route membutuhkan role "admin", validasi role_id milik user
  if (role === 'admin') {
    const isAdmin = user?.role_id === 1 || user?.role?.name?.toLowerCase() === 'admin';
    
    // Jika bukan admin, cegah akses dan kembalikan ke halaman utama
    if (!isAdmin) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
}

export default ProtectedRoute;