'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function LegacyHeader() {
  const { isAuthenticated, logout } = useAuth();
  return (
    <header className="legacy-header">
      <div className="logo">
        <Link href="/" className="font-bold text-xl">QuickGig<span>.ph</span></Link>
      </div>
      <nav>
        <Link href="/">Home</Link>
        <Link href="/find-work">Find Work</Link>
        <Link href="/post-job">Post Job</Link>
      </nav>
      <div className="auth">
        {isAuthenticated ? (
          <>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/messages">Messages</Link>
            <Link href="/profile">Profile</Link>
            <button onClick={() => logout()}>Logout</button>
          </>
        ) : (
          <>
            <Link href="/login">Login</Link>
            <Link href="/register">Sign Up</Link>
          </>
        )}
      </div>
    </header>
  );
}
