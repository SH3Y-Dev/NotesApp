import axios from 'axios';
import Cookies from 'js-cookie';

const axiosInstance = axios.create({
  baseURL: process.env.BE_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (config.url?.includes('/login') || config.url?.includes('/register')) {
      return config;
    }

    const token = Cookies.get('accessToken');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove('accessToken');

      window.location.href = '/login';

      console.error('Session expired. Please log in again.');
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;