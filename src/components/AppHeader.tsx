"use client";
import Link from "next/link";
import { authAware } from "@/lib/hostAware";

export default function AppHeader() {
  return (
    <header className="w-full border-b bg-white">
      <div className="mx-auto max-w-6xl flex items-center gap-4 px-4 py-3">
        <Link href="/" className="font-semibold">QuickGig</Link>
        <nav className="ml-auto flex items-center gap-3">
          <Link href="/browse-jobs" data-testid="nav-browse-jobs">Browse Jobs</Link>
          <Link href={authAware('/gigs/create')} data-testid="nav-post-job" rel="noopener">
            Post a job
          </Link>
          <Link href="/applications" data-testid="nav-my-applications">My Applications</Link>
          <Link href="/login" data-testid="nav-login">Login</Link>
        </nav>
      </div>
    </header>
  );
}

