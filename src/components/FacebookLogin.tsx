'use client';

import React, { useState, useEffect } from 'react';
import { facebookSDK, FacebookUser, FacebookLoginResponse } from './lib/facebook';
import { Button } from './components/ui/Button';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { saveToken, clearAuth } from '@/lib/auth';

interface FacebookLoginProps {
  onLoginSuccess?: (user: FacebookUser) => void;
  onLoginError?: (error: string) => void;
  className?: string;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

export default function FacebookLogin({
  onLoginSuccess,
  onLoginError,
  className = '',
  variant = 'primary',
  size = 'md'
}: FacebookLoginProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<FacebookUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const response = await facebookSDK.getLoginStatus();
      if (response.status === 'connected') {
        const userInfo = await facebookSDK.getUserInfo();
        setUser(userInfo);
        setIsLoggedIn(true);
        
        // Send to backend for authentication
        await authenticateWithBackend(response.authResponse!.accessToken, userInfo);
      }
    } catch (error) {
      console.error('Error checking login status:', error);
    }
  };

  const authenticateWithBackend = async (accessToken: string, userInfo: FacebookUser) => {
    try {
      const data = await api('/auth/facebook', {
        method: 'POST',
        body: JSON.stringify({ accessToken, userInfo })
      });
      if (data.token) saveToken(data.token);
      if (onLoginSuccess) {
        onLoginSuccess(userInfo);
      }
    } catch (error) {
      console.error('Backend authentication error:', error);
      if (onLoginError) {
        onLoginError('Authentication failed. Please try again.');
      }
    }
  };

  const handleLogin = async () => {
    setIsLoading(true);
    
    try {
      const response: FacebookLoginResponse = await facebookSDK.login(['public_profile', 'email']);
      
      if (response.status === 'connected') {
        const userInfo = await facebookSDK.getUserInfo();
        setUser(userInfo);
        setIsLoggedIn(true);
        
        // Authenticate with backend
        await authenticateWithBackend(response.authResponse!.accessToken, userInfo);
        
        // Redirect to dashboard or home
        router.push('/dashboard');
      } else {
        throw new Error('Facebook login was cancelled or failed');
      }
    } catch (error) {
      console.error('Facebook login error:', error);
      if (onLoginError) {
        onLoginError(error instanceof Error ? error.message : 'Login failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    setIsLoading(true);
    
    try {
      await facebookSDK.logout();
      setUser(null);
      setIsLoggedIn(false);
      
      // Clear local storage
      clearAuth();
      
      // Redirect to home
      router.push('/');
    } catch (error) {
      console.error('Facebook logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoggedIn && user) {
    return (
      <div className={`flex items-center space-x-3 ${className}`}>
        <div className="flex items-center space-x-2">
          {user.picture && (
            <img
              src={user.picture.data.url}
              alt={user.name}
              className="w-8 h-8 rounded-full"
            />
          )}
          <span className="text-sm font-medium text-gray-700">
            Kumusta, {user.name.split(' ')[0]}!
          </span>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleLogout}
          disabled={isLoading}
        >
          {isLoading ? 'Logging out...' : 'Logout'}
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleLogin}
      disabled={isLoading}
      className={`flex items-center space-x-2 ${className}`}
    >
      <svg
        className="w-5 h-5"
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
      <span>
        {isLoading ? 'Connecting...' : 'Continue with Facebook'}
      </span>
    </Button>
  );
}

// Alternative compact version for navigation
export function FacebookLoginButton({ className = '' }: { className?: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = async () => {
    try {
      const response = await facebookSDK.getLoginStatus();
      setIsLoggedIn(response.status === 'connected');
    } catch (error) {
      console.error('Error checking login status:', error);
    }
  };

  const handleLogin = async () => {
    setIsLoading(true);
    
    try {
      const response = await facebookSDK.login(['public_profile', 'email']);
      
      if (response.status === 'connected') {
        const userInfo = await facebookSDK.getUserInfo();
        
        // Authenticate with backend
        const data = await api('/auth/facebook', {
          method: 'POST',
          body: JSON.stringify({
            accessToken: response.authResponse!.accessToken,
            userInfo
          })
        });
        if (data.token) saveToken(data.token);
        setIsLoggedIn(true);
        router.push('/dashboard');
      }
    } catch (error) {
      console.error('Facebook login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoggedIn) {
    return null; // Don't show login button if already logged in
  }

  return (
    <button
      onClick={handleLogin}
      disabled={isLoading}
      className={`flex items-center space-x-2 px-4 py-2 bg-[#1877F2] text-white rounded-lg hover:bg-[#166FE5] transition-colors ${className}`}
    >
      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
      <span className="text-sm">
        {isLoading ? 'Connecting...' : 'Facebook Login'}
      </span>
    </button>
  );
}

