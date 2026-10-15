/**
 * authApi.js  —  Register / Login / Me API calls.
 */
import axios from "axios";

const BASE = process.env.REACT_APP_API_URL || "http://localhost:8000";

const client = axios.create({ baseURL: BASE, timeout: 10000 });

export const authApi = {
  register: (name, email, password) =>
    client.post("/auth/register", { name, email, password }).then(r => r.data),

  login: (email, password) =>
    client.post("/auth/login", { email, password }).then(r => r.data),

  me: (token) =>
    client.get("/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    }).then(r => r.data),
};
