import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // When app loads, if we have a token, fetch the user profile
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      
      try {
        // We'll decode the JWT id or we need an endpoint like /api/users/me
        // Wait, the backend doesn't have a /api/users/me endpoint.
        // Let's decode the JWT manually since it has { id, username }
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        const decoded = JSON.parse(jsonPayload);
        
        // Fetch full profile using the ID from token
        const res = await api.get(`/users/${decoded.id}`);
        setUser(res.data);
      } catch (error) {
        console.error("Failed to fetch user, token might be invalid", error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token, user } = res.data;
    localStorage.setItem('token', token);
    setToken(token);
    setUser(user);
    return res.data;
  };

  const register = async (username, email, password) => {
    const res = await api.post('/auth/register', { username, email, password });
    const { token, user } = res.data;
    localStorage.setItem('token', token);
    setToken(token);
    setUser(user);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
