import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If we have token but user isn't fetched, we could fetch profile here.
    // For now, our backend login returns user details, let's load from localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser && token) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, [token]);

  const loginContext = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password });
      if (data.success) {
        setUser(data.data.user);
        setToken(data.data.token);
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        toast.success('Login successful!');
        return true;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const signupContext = async (name, email, password) => {
    try {
      const { data } = await api.post('/auth/signup', { name, email, password });
      if (data.success) {
        setUser(data.data.user);
        setToken(data.data.token);
        localStorage.setItem('token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        toast.success('Registration successful!');
        return true;
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      return false;
    }
  };

  const logoutContext = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, loginContext, signupContext, logoutContext }}>
      {children}
    </AuthContext.Provider>
  );
};
