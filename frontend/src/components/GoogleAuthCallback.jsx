import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const GoogleAuthCallback = () => {
  const { setUser, setToken } = useAuth();

  useEffect(() => {
    const handleCallback = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      const userDataString = urlParams.get('user');
      const error = urlParams.get('error');

      if (error) {
        console.error('Google Auth Error:', error);
        // Redirect to main page with error
        window.location.href = '/?error=' + error;
        return;
      }

      if (token && userDataString) {
        try {
          const userData = JSON.parse(decodeURIComponent(userDataString));
          
          // Store auth data with the same keys as regular auth
          localStorage.setItem('weddingkityaari_token', token);
          localStorage.setItem('weddingkityaari_current_user', JSON.stringify(userData));
          
          // Update auth context
          setToken(token);
          setUser(userData);
          
          // Redirect to home page
          window.location.href = '/';
        } catch (error) {
          console.error('Error parsing user data:', error);
          window.location.href = '/?error=invalid_data';
        }
      } else {
        window.location.href = '/?error=missing_data';
      }
    };

    handleCallback();
  }, [setUser, setToken]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-pink-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Signing you in...</h2>
        <p className="text-gray-600">Please wait while we complete your Google sign-in.</p>
      </div>
    </div>
  );
};

export default GoogleAuthCallback;