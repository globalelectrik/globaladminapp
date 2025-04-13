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

      setUser({
        name: accounts[0]?.name,
        email: accounts[0]?.username,
        source: 'microsoft',
        token: accessToken,
      });

      navigate('/dashboard'); // <-- auto-redirect after Microsoft login

    } catch (error) {
      instance.loginRedirect(loginRequest); // fallback if session expired
    }
  };

  const getUser = () => {
    getCurrentUser().then((user) => {
      setUser({ ...user, source: 'custom' });
    });
  };


	useEffect(() => {
  const justLoggedOut = localStorage.getItem('justLoggedOut');

  if (justLoggedOut) {
    localStorage.removeItem('justLoggedOut');
    return; // Stop here — user just logged out
  }

  // only login if we don’t already have a user or token
  if (!user && accounts && accounts.length > 0 && !getAccessToken()) {
			loginWithMicrosoft();
		} else if (getAccessToken()) {
			if (!verifyJWT(getAccessToken())) {
				logout();
			} else {
				getUser();
			}
		}
	}, [accounts]);


  const value = {
    user,
    login,
    loginWithMicrosoft,
    getUser,
		logoutUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
