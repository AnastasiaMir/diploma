import axios from "axios";

const API_BASE_URL = "/api";

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.response.use(
  (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem("token");
          throw new Error("Unauthorized");
      }
       return Promise.reject(error);
    }
);

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);


export default api;

