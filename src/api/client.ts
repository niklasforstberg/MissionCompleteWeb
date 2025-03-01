import axios from 'axios';
import { toast } from 'react-toastify';

// Log the full URL being used
console.log('API URL from env:', import.meta.env.VITE_API_URL);

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor logging
apiClient.interceptors.request.use(
  (config) => {
    const fullUrl = `${config.baseURL || ''}${config.url}`;
    console.log('Sending request to:', fullUrl);
    console.log('Request method:', config.method);
    console.log('Request headers:', config.headers);
    
    const token = localStorage.getItem('jwt');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Handle request errors
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor
apiClient.interceptors.response.use(
  (response) => {
    // Any status code within the range of 2xx triggers this function
    return response;
  },
  (error) => {
    // Handle specific error status codes
    if (error.response) {
      switch (error.response.status) {
        case 401:
          localStorage.removeItem('jwt');
          toast.error('Session expired. Please login again.');
          break;
        case 403:
          toast.error('You do not have permission to perform this action.');
          console.error('Forbidden access:', error.response.data);
          break;
        case 404:
          toast.error('The requested resource was not found.');
          console.error('Resource not found:', error.response.data);
          break;
        case 500:
          toast.error('An unexpected server error occurred. Please try again later.');
          console.error('Server error:', error.response.data);
          break;
        default:
          toast.error('An error occurred. Please try again.');
          console.error('API error:', error.response.data);
      }
    } else if (error.request) {
      toast.error('Unable to connect to the server. Please check your internet connection.');
      console.error('Network error:', error.request);
    } else {
      toast.error('An unexpected error occurred.');
      console.error('Error:', error.message);
    }

    return Promise.reject(error);
  }
);