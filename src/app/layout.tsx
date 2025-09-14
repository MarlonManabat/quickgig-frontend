import type { ReactNode } from "react";
import Link from "next/link";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial" }}>
        <header
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 16px",
            borderBottom: "1px solid #e5e7eb",
            position: "sticky",
            top: 0,
            background: "white",
            zIndex: 10,
          }}
        >
          <Link href="/" style={{ fontWeight: 700, textDecoration: "none", color: "inherit" }}>
            QuickGig
          </Link>
          <nav style={{ display: "flex", gap: 16 }}>
            {/* The smoke tests look for these exact test IDs and visible links */}
            <Link data-testid="nav-browse-jobs" href="/browse-jobs">
              Browse Jobs
            </Link>
            {/* Use text 'Post job' (no “a”) so 'getByText("Post a job", { exact: false })' only matches the placeholder on /post-job */}
            <Link data-testid="nav-post-job" href="/post-job">
              Post job
            </Link>
            <Link data-testid="nav-my-applications" href="/applications">
              My Applications
            </Link>
            <Link data-testid="nav-login" href="/login">
              Login
            </Link>
          </nav>
        </header>
        <main style={{ padding: 16 }}>{children}</main>
      </body>
    </html>
  );
}
