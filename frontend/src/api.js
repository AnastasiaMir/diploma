import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

const api = axios.create({
    baseURL: API_BASE_URL,
});
  // Attach the token before every request
api.interceptors.request.use((config) => {
      const token = localStorage.getItem('token');
       if(token){
        config.headers['Authorization'] = `Bearer ${token}`;
    }
        return config;
}, (error) => {
       return Promise.reject(error);
});

  // Clear the token and redirect to the login page when the request is unauthorized
api.interceptors.response.use(
    (response) => response, // If the response is not an error, return it.
  async (error) => {
       const originalRequest = error.config;
     if (error.response?.status === 401 || error.response?.status === 403 ) {
       localStorage.removeItem('token');
       window.location.href = "/login" // Re-direct to login page
     }
     return Promise.reject(error);
});

export default api;