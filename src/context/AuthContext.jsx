import { createContext, useState, useContext, useEffect } from 'react';
import { setToken, getAccessToken, logout } from '../utils/store/AccessTokenStore';
import { getCurrentUser } from '../services/AuthServices';
import { verifyJWT } from '../utils/helpers/jwtHelper';

const AuthContext = createContext();

export const useAuthContext = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
	const [user, setUser] = useState();

	const login = (token) => {
		setToken(token);
		getUser();
	};

	const getUser = () => {
		getCurrentUser().then((user) => {
			setUser(user);
		});
	};

	useEffect(() => {
		if (getAccessToken()) {
			if (!verifyJWT(getAccessToken())) {
				logout();
			} else {
				getUser();
			}
		}
	}, []);

	const value = {
		user,
		login,
		getUser
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
