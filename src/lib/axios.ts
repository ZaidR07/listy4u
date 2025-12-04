import axios from 'axios';
import { toast } from 'react-toastify';

// Same-origin by default so HttpOnly cookies are sent.
// Override with NEXT_PUBLIC_APP_URI only when the API is on a different domain.
const API_URL = '';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_URL, // '' means same-origin
  withCredentials: true, // Important: Send cookies with requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor to handle 401 errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const message = error.response?.data?.message || 'Session expired. Please login again.';

      // Show toast notification
      toast.error(message, {
        position: 'top-right',
        autoClose: 5000,
      });

      // Only auto-redirect to admin login when user is on admin routes
      if (typeof window !== 'undefined') {
        const path = window.location.pathname || '';
        if (path.startsWith('/admin')) {
          setTimeout(() => {
            window.location.href = '/admin';
          }, 1500);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
