import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "QuickGig",
  // quiets the Next warning during smoke, safe default in preview
  metadataBase: new URL("https://example.com"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* Header with stable test ids the smoke expects */}
        <header className="px-4 py-3 border-b">
          <nav className="flex flex-wrap items-center gap-4">
            <Link href="/" aria-label="Home">QuickGig</Link>
            <Link href="/browse-jobs" data-testid="nav-browse-jobs">Browse jobs</Link>
            <Link href="/post-job" data-testid="nav-post-job">Post a job</Link>
            <Link href="/applications" data-testid="nav-my-applications">My Applications</Link>
            <Link href="/login" data-testid="nav-login">Login</Link>
          </nav>
        </header>
        <main className="p-4">{children}</main>
      </body>
    </html>
  );
}
