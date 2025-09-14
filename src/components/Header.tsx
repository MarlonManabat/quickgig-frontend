import Link from "next/link";
import React from "react";

export default function Header() {
  return (
    <header className="w-full border-b">
      <div className="mx-auto max-w-5xl px-4 h-12 flex items-center justify-between">
        <Link href="/" className="font-semibold">QuickGig</Link>
        <nav className="flex items-center gap-4">
          {/* Smokes look for these exact testids */}
          <Link data-testid="nav-browse-jobs" href="/browse-jobs">Browse Jobs</Link>
          <Link data-testid="nav-post-job" href="/post-job">Post a job</Link>
          <Link data-testid="nav-my-applications" href="/applications">My Applications</Link>
          <Link data-testid="nav-login" href="/login">Login</Link>
        </nav>
      </div>
    </header>
  );
}
