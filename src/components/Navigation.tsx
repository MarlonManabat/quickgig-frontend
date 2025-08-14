'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import NotificationDropdown from './NotificationDropdown';
import WalletDisplay from './WalletDisplay';
import Button from './ui/Button';
import { Menu, X, User, LogOut, Briefcase, Plus, MessageCircle, Settings, Home } from 'lucide-react';

const Navigation: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <nav className="qg-navbar bg-qg-navy shadow-qg-lg sticky top-0 z-50">
      <div className="qg-container">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-3 group">
              <Image
                src="/logo-main.png"
                alt="QuickGig.ph"
                width={40}
                height={40}
                className="h-10 w-10 transition-transform duration-qg-fast group-hover:scale-105"
                priority
              />
              <span className="font-heading text-xl font-bold text-fg hidden sm:block">
                QuickGig<span className="text-qg-accent">.ph</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <Link
              href="/"
              className="qg-navbar-link flex items-center px-4 py-2 rounded-qg-md text-sm font-medium transition-all duration-qg-fast hover:bg-qg-navy-light hover:text-qg-accent"
            >
              <Home className="w-4 h-4 mr-2" />
              Home
            </Link>
            <Link
              href="/find-work"
              className="qg-navbar-link flex items-center px-4 py-2 rounded-qg-md text-sm font-medium transition-all duration-qg-fast hover:bg-qg-navy-light hover:text-qg-accent"
            >
              <Briefcase className="w-4 h-4 mr-2" />
              Find Work
            </Link>
            <Link
              href="/post-job"
              className="qg-navbar-link flex items-center px-4 py-2 rounded-qg-md text-sm font-medium transition-all duration-qg-fast hover:bg-qg-navy-light hover:text-qg-accent"
            >
              <Plus className="w-4 h-4 mr-2" />
              Post Job
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center space-x-2 ml-4 pl-4 border-l border-qg-navy-light">
                {user?.role === 'Admin' && (
                  <Link
                    href="/admin"
                    className="qg-navbar-link flex items-center px-4 py-2 rounded-qg-md text-sm font-medium transition-all duration-qg-fast hover:bg-qg-navy-light hover:text-qg-accent"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Admin
                  </Link>
                )}
                {user?.role === 'Employer' && (
                  <Link
                    href="/my-jobs"
                    className="qg-navbar-link flex items-center px-4 py-2 rounded-qg-md text-sm font-medium transition-all duration-qg-fast hover:bg-qg-navy-light hover:text-qg-accent"
                  >
                    <Briefcase className="w-4 h-4 mr-2" />
                    My Jobs
                  </Link>
                )}
                <Link
                  href="/messages"
                  className="qg-navbar-link flex items-center px-4 py-2 rounded-qg-md text-sm font-medium transition-all duration-qg-fast hover:bg-qg-navy-light hover:text-qg-accent"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Messages
                </Link>
                
                {/* Notification Dropdown */}
                <NotificationDropdown />
                
                {/* Wallet Display */}
                <WalletDisplay />
                
                <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-qg-navy-light">
                  <Link
                    href="/profile"
                    className="qg-navbar-link flex items-center px-3 py-2 rounded-qg-md text-sm font-medium transition-all duration-qg-fast hover:bg-qg-navy-light hover:text-qg-accent"
                  >
                    <User className="w-4 h-4 mr-2" />
                    <span className="hidden xl:inline">Profile</span>
                  </Link>
                  <div className="hidden xl:flex flex-col">
                    <span className="text-xs text-gray-300">Kumusta,</span>
                    <span className="text-sm font-medium text-fg">{user?.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="qg-navbar-link flex items-center px-3 py-2 rounded-qg-md text-sm font-medium transition-all duration-qg-fast hover:bg-red-600 hover:text-fg"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden xl:inline ml-2">Logout</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-qg-navy-light">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-fg hover:bg-qg-navy-light hover:text-qg-accent">
                    Login
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button variant="secondary" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center space-x-2">
            {isAuthenticated && <WalletDisplay />}
            <button
              onClick={toggleMenu}
              className="qg-navbar-link p-2 rounded-qg-md transition-all duration-qg-fast hover:bg-qg-navy-light hover:text-qg-accent"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-qg-navy-light">
            <div className="py-4 space-y-2">
              <Link
                href="/"
                className="qg-navbar-link flex items-center px-4 py-3 rounded-qg-md text-base font-medium transition-all duration-qg-fast hover:bg-qg-navy-light hover:text-qg-accent"
                onClick={() => setIsMenuOpen(false)}
              >
                <Home className="w-5 h-5 mr-3" />
                Home
              </Link>
              <Link
                href="/find-work"
                className="qg-navbar-link flex items-center px-4 py-3 rounded-qg-md text-base font-medium transition-all duration-qg-fast hover:bg-qg-navy-light hover:text-qg-accent"
                onClick={() => setIsMenuOpen(false)}
              >
                <Briefcase className="w-5 h-5 mr-3" />
                Find Work
              </Link>
              <Link
                href="/post-job"
                className="qg-navbar-link flex items-center px-4 py-3 rounded-qg-md text-base font-medium transition-all duration-qg-fast hover:bg-qg-navy-light hover:text-qg-accent"
                onClick={() => setIsMenuOpen(false)}
              >
                <Plus className="w-5 h-5 mr-3" />
                Post Job
              </Link>

              {isAuthenticated ? (
                <>
                  <div className="border-t border-qg-navy-light my-4 pt-4">
                    <div className="px-4 py-2 text-sm text-gray-300">
                      Kumusta, <span className="font-medium text-fg">{user?.name}</span>
                    </div>
                  </div>
                  
                  {user?.role === 'Admin' && (
                    <Link
                      href="/admin"
                      className="qg-navbar-link flex items-center px-4 py-3 rounded-qg-md text-base font-medium transition-all duration-qg-fast hover:bg-qg-navy-light hover:text-qg-accent"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Settings className="w-5 h-5 mr-3" />
                      Admin Dashboard
                    </Link>
                  )}
                  {user?.role === 'Employer' && (
                    <Link
                      href="/my-jobs"
                      className="qg-navbar-link flex items-center px-4 py-3 rounded-qg-md text-base font-medium transition-all duration-qg-fast hover:bg-qg-navy-light hover:text-qg-accent"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Briefcase className="w-5 h-5 mr-3" />
                      My Jobs
                    </Link>
                  )}
                  <Link
                    href="/messages"
                    className="qg-navbar-link flex items-center px-4 py-3 rounded-qg-md text-base font-medium transition-all duration-qg-fast hover:bg-qg-navy-light hover:text-qg-accent"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <MessageCircle className="w-5 h-5 mr-3" />
                    Messages
                  </Link>
                  <Link
                    href="/profile"
                    className="qg-navbar-link flex items-center px-4 py-3 rounded-qg-md text-base font-medium transition-all duration-qg-fast hover:bg-qg-navy-light hover:text-qg-accent"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="w-5 h-5 mr-3" />
                    Profile
                  </Link>
                  
                  <div className="border-t border-qg-navy-light mt-4 pt-4">
                    <button
                      onClick={handleLogout}
                      className="qg-navbar-link flex items-center px-4 py-3 rounded-qg-md text-base font-medium transition-all duration-qg-fast hover:bg-red-600 hover:text-fg w-full text-left"
                    >
                      <LogOut className="w-5 h-5 mr-3" />
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <div className="border-t border-qg-navy-light mt-4 pt-4 space-y-3">
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full text-fg hover:bg-qg-navy-light hover:text-qg-accent">
                      Login
                    </Button>
                  </Link>
                  <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="secondary" className="w-full">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;

