import { Navigate } from 'react-router-dom';
import { getAccessToken } from '../../utils/store/AccessTokenStore';
import { useAuthContext } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const token = getAccessToken();
  const { user, isAuthLoading } = useAuthContext();

  if (isAuthLoading) {
    return <div>Loading auth...</div>; // Or your <LoadingSpin />
  }

  if (!token && !user) {
    return <Navigate to='/' replace />;
  }

  return children;
};

export default ProtectedRoute;
