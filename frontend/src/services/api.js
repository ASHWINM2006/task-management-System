/**
 * services/api.js
 * Axios instance that automatically attaches the JWT token from localStorage.
 * Every API call is authenticated — backend enforces user isolation.
 */
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

const client = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

// ── Request interceptor: inject Bearer token on every request ──────────────
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("tf_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Response interceptor: normalise error messages ─────────────────────────
client.interceptors.response.use(
  (r) => r,
  (err) => {
    const msg =
      err?.response?.data?.detail ||
      err?.response?.data?.message ||
      err?.message ||
      "An unexpected error occurred.";
    // If 401, token is expired — clear it so user gets redirected to login
    if (err?.response?.status === 401) {
      localStorage.removeItem("tf_token");
      window.location.reload();   // triggers AuthContext to show login
    }
    return Promise.reject(new Error(msg));
  }
);

export const taskApi = {
  list:               (params = {}) => client.get("/tasks/",          { params }).then(r => r.data),
  get:                (id)          => client.get(`/tasks/${id}`).then(r => r.data),
  create:             (data)        => client.post("/tasks/", data).then(r => r.data),
  update:             (id, data)    => client.put(`/tasks/${id}`, data).then(r => r.data),
  delete:             (id)          => client.delete(`/tasks/${id}`).then(r => r.data),
  stats:              ()            => client.get("/tasks/stats").then(r => r.data),
  allowedTransitions: (id)          => client.get(`/tasks/${id}/allowed-transitions`).then(r => r.data),
};

export const activityApi = {
  list: (params = {}) => client.get("/activity/", { params }).then(r => r.data),
};

export default client;
