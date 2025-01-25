import { useNavigate } from 'react-router-dom';

export const ACCESS_TOKEN_KEY = 'ACCESS_TOKEN';

let accessToken = localStorage.getItem(ACCESS_TOKEN_KEY) || '';

export const setToken = (token) => {
	accessToken = token;
	localStorage.setItem(ACCESS_TOKEN_KEY, token);
};

export const getAccessToken = () => {
	return accessToken;
};

export const logout = () => {
	localStorage.removeItem(ACCESS_TOKEN_KEY);
	accessToken = ''; // Clear the in-memory token
};