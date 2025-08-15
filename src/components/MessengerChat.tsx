'use client';

import React, { useEffect, useState } from 'react';
import { env } from '@/config/env';

interface MessengerChatProps {
  pageId?: string;
  appId?: string;
  themeColor?: string;
  loggedInGreeting?: string;
  loggedOutGreeting?: string;
  greetingDialogDisplay?: 'show' | 'hide' | 'fade';
  greetingDialogDelay?: number;
  minimized?: boolean;
  className?: string;
}

declare global {
  interface Window {
    FB?: any; // eslint-disable-line @typescript-eslint/no-explicit-any -- Facebook SDK globals
    fbAsyncInit?: () => void;
  }
}

export default function MessengerChat({
  pageId = env.NEXT_PUBLIC_FACEBOOK_PAGE_ID,
  appId = env.NEXT_PUBLIC_FACEBOOK_APP_ID,
  themeColor = '#00B272',
  loggedInGreeting = 'Kumusta! Paano ka namin matutulungan sa QuickGig.ph?',
  loggedOutGreeting = 'Kumusta! May tanong ka ba tungkol sa QuickGig.ph? Message mo kami!',
  greetingDialogDisplay = 'show',
  greetingDialogDelay = 0,
  minimized = false,
  className = ''
}: MessengerChatProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined' || !pageId || !appId) return;

    // Load Facebook SDK if not already loaded
    if (!window.FB) {
      loadFacebookSDK();
    } else {
      initializeMessenger();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- loadFacebookSDK is stable
  }, [pageId, appId]);

  const loadFacebookSDK = () => {
    // Create Facebook SDK script
    if (!document.getElementById('facebook-jssdk')) {
      const script = document.createElement('script');
      script.id = 'facebook-jssdk';
      script.src = 'https://connect.facebook.net/en_US/sdk/xfbml.customerchat.js';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    // Initialize when loaded
    window.fbAsyncInit = () => {
      window.FB.init({
        appId: appId,
        xfbml: true,
        version: 'v18.0'
      });

      initializeMessenger();
    };
  };

  const initializeMessenger = () => {
    if (window.FB && window.FB.XFBML) {
      window.FB.XFBML.parse();
      setIsLoaded(true);
    }
  };

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  if (!pageId || !appId) {
    console.warn('MessengerChat: pageId and appId are required');
    return null;
  }

  return (
    <>
      {/* Messenger Chat Plugin */}
      <div
        className={`fb-customerchat ${className}`}
        data-page-id={pageId}
        data-theme-color={themeColor}
        data-logged-in-greeting={loggedInGreeting}
        data-logged-out-greeting={loggedOutGreeting}
        data-greeting-dialog-display={greetingDialogDisplay}
        data-greeting-dialog-delay={greetingDialogDelay}
        data-minimized={minimized}
        style={{
          display: isVisible ? 'block' : 'none'
        }}
      />

      {/* Custom toggle button (optional) */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={toggleVisibility}
          className="bg-[#00B272] hover:bg-[#009960] text-white p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105"
          title={isVisible ? 'Hide Messenger' : 'Show Messenger'}
        >
          {isVisible ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 2.98.97 4.29L1 23l6.71-1.97C9.02 21.64 10.46 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.4 0-2.73-.35-3.89-.98L7 19.5l.5-1.11C6.85 17.73 6.5 16.4 6.5 15c0-4.14 3.36-7.5 7.5-7.5s7.5 3.36 7.5 7.5S16.14 20 12 20z"/>
              <path d="M8.5 12.5l2 2 5-5"/>
            </svg>
          )}
        </button>
      </div>

      {/* Loading indicator */}
      {!isLoaded && (
        <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#00B272]"></div>
            <span className="text-sm text-gray-600">Loading chat...</span>
          </div>
        </div>
      )}
    </>
  );
}

// Simplified version for specific pages
export function MessengerChatSimple({ 
  className = '',
  minimized = true 
}: { 
  className?: string;
  minimized?: boolean;
}) {
  return (
    <MessengerChat
      className={className}
      minimized={minimized}
      loggedInGreeting="Hi! Kamusta? May tanong ka ba sa QuickGig.ph?"
      loggedOutGreeting="Hello! Welcome sa QuickGig.ph! Paano ka namin matutulungan?"
      greetingDialogDisplay="fade"
      greetingDialogDelay={3000}
    />
  );
}

// Chat button for manual trigger
export function MessengerChatButton({ 
  className = '',
  text = 'Chat with us'
}: { 
  className?: string;
  text?: string;
}) {
  const openMessenger = () => {
    if (window.FB && window.FB.CustomerChat) {
      window.FB.CustomerChat.showDialog();
    }
  };

  return (
    <button
      onClick={openMessenger}
      className={`flex items-center space-x-2 bg-[#00B272] hover:bg-[#009960] text-white px-4 py-2 rounded-lg transition-colors ${className}`}
    >
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 2.98.97 4.29L1 23l6.71-1.97C9.02 21.64 10.46 22 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-1.4 0-2.73-.35-3.89-.98L7 19.5l.5-1.11C6.85 17.73 6.5 16.4 6.5 15c0-4.14 3.36-7.5 7.5-7.5s7.5 3.36 7.5 7.5S16.14 20 12 20z"/>
        <path d="M8.5 12.5l2 2 5-5"/>
      </svg>
      <span>{text}</span>
    </button>
  );
}

