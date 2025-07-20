import { createContext, useState, useContext, useEffect } from 'react';
import { setToken, getAccessToken, logout } from '../utils/store/AccessTokenStore';
import { getCurrentUser } from '../services/AuthServices';
import { verifyJWT } from '../utils/helpers/jwtHelper';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from '../services/MSAuthService';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();
export const useAuthContext = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const { instance, accounts } = useMsal();
  const navigate = useNavigate();

  const login = (token) => {
    setToken(token);
    getUser();
  };

  const logoutUser = () => {
    logout(); // Clear your app's token
    setUser(undefined);

    const currentAccount = instance.getActiveAccount() || instance.getAllAccounts()[0];

    if (currentAccount) {
      instance.logoutRedirect({
        account: currentAccount,
        postLogoutRedirectUri: '/', // or your login page
      });
    } else {
      // fallback, just redirect manually
      window.location.href = '/';
    }
  };

  const loginWithMicrosoft = async () => {
    try {
      const response = await instance.acquireTokenSilent({
        ...loginRequest,
        account: accounts[0],
      });

      const accessToken = response.accessToken;

      const newUser = {
        name: accounts[0]?.name,
        email: accounts[0]?.username,
        source: 'microsoft',
        token: accessToken,
      };

      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));

      navigate('/dashboard'); // <-- auto-redirect after Microsoft login
    } catch (error) {
      instance.loginRedirect(loginRequest); // fallback if session expired
    }
  };

  const getUser = async () => {
    try {
      const user = await getCurrentUser();
      setUser({ ...user, source: 'custom' });
      localStorage.setItem('user', JSON.stringify({ ...user, source: 'custom' }));
    } catch (error) {
      console.error('Failed to get user', error);
      logout();
    }
  };

  useEffect(() => {
    const justLoggedOut = localStorage.getItem('justLoggedOut');

    if (justLoggedOut) {
      localStorage.removeItem('justLoggedOut');
      setIsAuthLoading(false);
      return;
    }

    const checkAuth = async () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      if (!user && accounts && accounts.length > 0 && !getAccessToken()) {
        await loginWithMicrosoft();
      } else if (getAccessToken()) {
        if (!verifyJWT(getAccessToken())) {
          logout();
        } else {
          await getUser();
        }
      }

      setIsAuthLoading(false);
    };

    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accounts]); // Keep this clean for reactivity with MSAL

  const value = {
    user,
    login,
    loginWithMicrosoft,
    getUser,
    logoutUser,
    isAuthLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
