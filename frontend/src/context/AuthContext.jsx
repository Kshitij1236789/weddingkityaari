import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// Debug logging for production
console.log('🔧 Frontend Environment Config:');
console.log('  - API_URL:', API_URL);
console.log('  - VITE_API_URL:', import.meta.env.VITE_API_URL);
console.log('  - Mode:', import.meta.env.MODE);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Check if user is logged in on app start
    const savedToken = localStorage.getItem('weddingkityaari_token');
    const savedUser = localStorage.getItem('weddingkityaari_current_user');
    
    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
        // Verify token with backend
        verifyToken(savedToken);
      } catch (error) {
        console.error('Error parsing saved user:', error);
        logout();
      }
    }
    setIsLoading(false);
  }, []);

  const verifyToken = async (authToken) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        logout();
        return false;
      }

      const userData = await response.json();
      setUser(userData);
      return true;
    } catch (error) {
      console.error('Token verification error:', error);
      logout();
      return false;
    }
  };

  const register = async (userData) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Store token and user data
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('weddingkityaari_token', data.token);
      localStorage.setItem('weddingkityaari_current_user', JSON.stringify(data.user));

      return { success: true, message: data.message };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Store token and user data
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('weddingkityaari_token', data.token);
      localStorage.setItem('weddingkityaari_current_user', JSON.stringify(data.user));

      return { success: true, message: data.message };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('weddingkityaari_current_user');
    localStorage.removeItem('weddingkityaari_token');
    // Clear chat histories on logout
    localStorage.removeItem('weddingkityaari_chat_histories');
  };

  const updateProfile = async (profileData) => {
    try {
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await fetch(`${API_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Profile update failed');
      }

      // Update local user data
      setUser(data.user);
      localStorage.setItem('weddingkityaari_current_user', JSON.stringify(data.user));

      return { success: true, message: data.message };
    } catch (error) {
      console.error('Profile update error:', error);
      return { success: false, message: error.message };
    }
  };

  // Chat history functions with backend integration
  const saveChatHistory = async (mode, messages) => {
    try {
      if (!token) {
        // Fallback to localStorage if not authenticated
        const histories = JSON.parse(localStorage.getItem('weddingkityaari_chat_histories') || '{}');
        histories[mode] = messages;
        localStorage.setItem('weddingkityaari_chat_histories', JSON.stringify(histories));
        return;
      }

      await fetch(`${API_URL}/api/chat/${mode}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages }),
      });
    } catch (error) {
      console.error('Error saving chat history:', error);
      // Fallback to localStorage
      const histories = JSON.parse(localStorage.getItem('weddingkityaari_chat_histories') || '{}');
      histories[mode] = messages;
      localStorage.setItem('weddingkityaari_chat_histories', JSON.stringify(histories));
    }
  };

  const getChatHistory = async (mode) => {
    try {
      if (!token) {
        // Fallback to localStorage if not authenticated
        const histories = JSON.parse(localStorage.getItem('weddingkityaari_chat_histories') || '{}');
        return histories[mode] || [];
      }

      const response = await fetch(`${API_URL}/api/chat/${mode}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data.messages || [];
      } else {
        // Fallback to localStorage
        const histories = JSON.parse(localStorage.getItem('weddingkityaari_chat_histories') || '{}');
        return histories[mode] || [];
      }
    } catch (error) {
      console.error('Error getting chat history:', error);
      // Fallback to localStorage
      const histories = JSON.parse(localStorage.getItem('weddingkityaari_chat_histories') || '{}');
      return histories[mode] || [];
    }
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    updateProfile,
    saveChatHistory,
    getChatHistory,
    setUser,
    setToken,
    isAuthenticated: !!user,
    isLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};