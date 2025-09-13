"use client";
import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="border-b">
      <nav data-testid="nav" className="mx-auto flex max-w-6xl items-center gap-4 p-4">
        <Link href="/" className="font-semibold">QuickGig</Link>

        {/* Desktop */}
        <div className="ml-auto hidden md:flex items-center gap-4">
          <Link data-testid="nav-browse-jobs" href="/browse-jobs">Browse jobs</Link>
          <Link data-testid="nav-post-job" href="/post-job">Post a job</Link>
          <Link data-testid="nav-my-applications" href="/applications">My Applications</Link>
          <Link data-testid="nav-login" href="/login">Login</Link>
        </div>

        {/* Mobile */}
        <button
          type="button"
          className="ml-auto md:hidden border rounded px-3 py-1"
          onClick={() => setOpen(v => !v)}
          aria-expanded={open}
          aria-controls="nav-menu"
          data-testid="nav-menu-button"
        >
          Menu
        </button>
      </nav>
      <div
        id="nav-menu"
        data-testid="nav-menu"
        className={`md:hidden border-t ${open ? "block" : "hidden"}`}
      >
        <div className="mx-auto max-w-6xl p-4 flex flex-col gap-3">
          <Link data-testid="nav-browse-jobs" href="/browse-jobs">Browse jobs</Link>
          <Link data-testid="nav-post-job" href="/post-job">Post a job</Link>
          <Link data-testid="nav-my-applications" href="/applications">My Applications</Link>
          <Link data-testid="nav-login" href="/login">Login</Link>
        </div>
      </div>
    </header>
  );
}
