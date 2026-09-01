import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('cloud_dataguard_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await authApi.login({ email, password });
      if (res.success) {
        setUser(res.user);
        localStorage.setItem('cloud_dataguard_user', JSON.stringify(res.user));
        localStorage.setItem('cloud_dataguard_token', res.token);
        return { success: true, user: res.user };
      }
    } catch (err) {
      return { 
        success: false, 
        message: err.response?.data?.message || 'Authentication failed' 
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('cloud_dataguard_user');
    localStorage.removeItem('cloud_dataguard_token');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
