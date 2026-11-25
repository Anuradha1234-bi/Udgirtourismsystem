import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

/**
 * Safely decodes a JWT payload without external dependencies.
 * Returns null if the token is missing, malformed, or has invalid JSON.
 */
export const parseJwt = (token) => {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  try {
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

/**
 * Checks whether a given JWT string is structurally valid and unexpired.
 */
export const isTokenValid = (token) => {
  const payload = parseJwt(token);
  if (!payload) return false;
  if (typeof payload.exp === 'number') {
    const currentTimeInSeconds = Math.floor(Date.now() / 1000);
    if (payload.exp <= currentTimeInSeconds) {
      return false; // Token expired
    }
  }
  return true;
};

const getInitialToken = () => {
  try {
    const stored = localStorage.getItem('udgir_admin_token');
    if (!stored) return null;
    if (!isTokenValid(stored)) {
      localStorage.removeItem('udgir_admin_token');
      localStorage.removeItem('udgir_admin_user');
      return null;
    }
    return stored;
  } catch {
    return null;
  }
};

const getInitialUsername = () => {
  try {
    const storedToken = localStorage.getItem('udgir_admin_token');
    if (!storedToken || !isTokenValid(storedToken)) return null;
    return localStorage.getItem('udgir_admin_user');
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(getInitialToken);
  const [username, setUsername] = useState(getInitialUsername);

  const logout = () => {
    try {
      localStorage.removeItem('udgir_admin_token');
      localStorage.removeItem('udgir_admin_user');
    } catch {
      // Ignore storage errors
    }
    setToken(null);
    setUsername(null);
  };

  const login = (newToken, newUsername) => {
    try {
      localStorage.setItem('udgir_admin_token', newToken);
      localStorage.setItem('udgir_admin_user', newUsername);
    } catch {
      // Ignore storage errors
    }
    setToken(newToken);
    setUsername(newUsername);
  };

  // Schedule auto-logout when the token naturally expires
  useEffect(() => {
    if (!token) return;
    if (!isTokenValid(token)) {
      logout();
      return;
    }

    const payload = parseJwt(token);
    if (payload && typeof payload.exp === 'number') {
      const msUntilExpiry = payload.exp * 1000 - Date.now();
      if (msUntilExpiry <= 0) {
        logout();
      } else {
        const timer = setTimeout(() => {
          logout();
        }, msUntilExpiry);
        return () => clearTimeout(timer);
      }
    }
  }, [token]);

  const isAuthenticated = Boolean(token && isTokenValid(token));

  return (
    <AuthContext.Provider value={{ token, username, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

