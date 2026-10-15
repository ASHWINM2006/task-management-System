/**
 * AuthContext.js  —  Global auth state (token + user).
 * Persists token to localStorage.
 */
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authApi } from "../services/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [token,   setToken]   = useState(() => localStorage.getItem("tf_token") || null);
  const [loading, setLoading] = useState(true);   // checking saved token on mount

  // On mount — validate saved token
  useEffect(() => {
    if (!token) { setLoading(false); return; }
    authApi.me(token)
      .then(u  => setUser(u))
      .catch(() => { localStorage.removeItem("tf_token"); setToken(null); })
      .finally(() => setLoading(false));
  }, []); // eslint-disable-line

  const login = useCallback(async (email, password) => {
    const data = await authApi.login(email, password);
    localStorage.setItem("tf_token", data.access_token);
    setToken(data.access_token);
    setUser(data.user);
    return data;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const data = await authApi.register(name, email, password);
    localStorage.setItem("tf_token", data.access_token);
    setToken(data.access_token);
    setUser(data.user);
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("tf_token");
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
