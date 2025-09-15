"use client";
import Link from "next/link";
import { useState } from "react";

const APP_HOST = process.env.NEXT_PUBLIC_APP_HOST || "";

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-semibold">QuickGig</Link>
        <nav className="hidden md:flex gap-6 items-center">
          {/* What tests expect to find */}
          <Link data-testid="nav-browse-jobs" href="/browse-jobs">Browse Jobs</Link>
          <Link data-testid="nav-my-applications" href={`${APP_HOST}/login`}>My Applications</Link>
          {/* Use different visible text to avoid strict-mode duplicate with page body */}
          <Link data-testid="nav-post-job" href={`${APP_HOST}/gigs/create`} className="btn btn-primary">Post</Link>
          <Link data-testid="nav-login" href="/login">Login</Link>
        </nav>
        <div className="md:hidden">
          {/* simplified mobile menu */}
          <details>
            <summary className="cursor-pointer">Menu</summary>
            <div className="mt-2 flex flex-col gap-3">
              <Link data-testid="nav-browse-jobs" href="/browse-jobs">Browse Jobs</Link>
              <Link data-testid="nav-my-applications" href={`${APP_HOST}/login`}>My Applications</Link>
              <Link data-testid="nav-post-job" href={`${APP_HOST}/gigs/create`} className="btn btn-primary">Post</Link>
              <Link data-testid="nav-login" href="/login">Login</Link>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
