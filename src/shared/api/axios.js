import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const response = error.response;

    // Ambil message dari backend
    const message =
      response?.data?.message ||
      response?.data?.error ||
      error.message ||
      "Terjadi kesalahan.";

    return Promise.reject({
      ...error,
      message,
    });
  }
);

export default api;
