import axios from 'axios';
import { getAccessToken, logout } from '../utils/store/AccessTokenStore';

const URL_BACKEND = import.meta.env.VITE_URL_BACKEND;
const createHttp = (useAccessToken = false) => {
  const http = axios.create({
    baseURL: `${URL_BACKEND}`,
  });

  http.interceptors.request.use(
    function (request) {
      if (useAccessToken && getAccessToken()) {
        request.headers.Authorization = `Bearer ${getAccessToken()}`;
      }
      return request;
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  http.interceptors.response.use(
    function (response) {
      return response.data;
    },
    function (error) {
      if (error?.response?.status && [401, 403].includes(error.response.status)) {
        if (getAccessToken()) {
          logout();
          if (window.location.pathname !== '/login') {
            window.location.assign('/login');
          }
        }
      }
      return Promise.reject(error);
    }
  );
  return http;
};

export default createHttp;
