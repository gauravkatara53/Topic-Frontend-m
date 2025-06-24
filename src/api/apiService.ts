// // src/api/apiService.js
// import axios from "axios";

// // ✅ Set your main API URL here
// const BASE_URL = "/api/v1/";
// // Example: const BASE_URL = "https://bmw-backend-l85a.onrender.com/api/v1/";

// const api = axios.create({
//   baseURL: BASE_URL,
//   timeout: 60000, // 60 seconds timeout
//   headers: {
//     "Content-Type": "application/json",
//   },
//   withCredentials: true, // Send cookies with every request
// });

// // ✅ Interceptor: You can add token logic here later
// api.interceptors.request.use(
//   (config) => {
//     console.log("🔄 Making request to:", config.url);
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // ✅ Define types for consistent responses
// /**
//  * @typedef {Object} ApiService
//  * @property {function(string, object=): Promise<any>} get
//  * @property {function(string, any, object=): Promise<any>} post
//  * @property {function(string, any): Promise<any>} put
//  * @property {function(string, any, object=): Promise<any>} patch
//  * @property {function(string): Promise<any>} delete
//  */

// // ✅ API service with generic methods
// export const apiService = {
//   get: (url: string, params: object = {}) =>
//     api.get(url, { params }).then((res) => res.data),
//   post: (url: string, data: any, config: object = {}) =>
//     api.post(url, data, config).then((res) => res.data),
//   put: (url: string, data: any) => api.put(url, data).then((res) => res.data),
//   patch: (url: string, data: any, config: object = {}) =>
//     api.patch(url, data, config).then((res) => res.data),
//   delete: (url: string) => api.delete(url).then((res) => res.data),
// };

// export default api;

// src/api/apiService.js
import axios from "axios";
import { logout } from "@/services/userService"; // adjust path as needed

const BASE_URL = "/api/v1/";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Send cookies
});

// ✅ Request logging (you already added)
api.interceptors.request.use(
  (config) => {
    console.log("🔄 Making request to:", config.url);
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ RESPONSE INTERCEPTOR: Refresh logic
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If accessToken expired & not already retried
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;
      try {
        // Try refreshing access token
        await axios.post(
          `${BASE_URL}auth/refresh`,
          {},
          { withCredentials: true }
        );

        // Retry original request
        return api(originalRequest);
      } catch (refreshError) {
        console.error("❌ Refresh failed, logging out");
        logout(); // Optional: clear state & redirect
      }
    }

    return Promise.reject(error);
  }
);

// ✅ Your typed API methods
export const apiService = {
  get: (url: string, params: object = {}) =>
    api.get(url, { params }).then((res) => res.data),
  post: (url: string, data: any, config: object = {}) =>
    api.post(url, data, config).then((res) => res.data),
  put: (url: string, data: any) => api.put(url, data).then((res) => res.data),
  patch: (url: string, data: any, config: object = {}) =>
    api.patch(url, data, config).then((res) => res.data),
  delete: (url: string) => api.delete(url).then((res) => res.data),
};

export default api;
