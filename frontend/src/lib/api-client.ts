import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      const excludedRoutes = ["/auth/login", "/auth/register", "/auth/me"];
      const shouldSkip = excludedRoutes.some((route) =>
        error.config?.url?.includes(route)
      );
      if (!shouldSkip) {
        window.location.href = "/auth";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
