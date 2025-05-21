import { Navigate } from 'react-router-dom';
import { getAccessToken } from '../../utils/store/AccessTokenStore';
import { useAuthContext } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const token = getAccessToken();
  const { user } = useAuthContext();

  if (!token && !user) {
    return <Navigate to='/' replace />;
  }

  return children;
};

export default ProtectedRoute;
