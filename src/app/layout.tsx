import type { Metadata } from "next";
import "./globals.css";
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:4010";

export const metadata: Metadata = {
  title: "QuickGig",
  description: "Find and post gigs fast",
  metadataBase: new URL(siteUrl),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className="border-b">
          <nav className="mx-auto flex max-w-6xl items-center justify-between p-4">
            <a href="/" className="font-semibold">QuickGig</a>
            <div className="flex items-center gap-4">
              <a data-testid="nav-browse-jobs" href="/browse-jobs" className="text-sm">
                Browse Jobs
              </a>
              <a data-testid="nav-my-applications" href="/my-applications" className="text-sm">
                My Applications
              </a>
              <a data-testid="nav-login" href="/login" className="text-sm">
                Login
              </a>
              {/** Employer CTA — same host for now; test checks presence and clickability */}
              <a
                data-testid="nav-post-job"
                href="/gigs/create"
                className="rounded bg-blue-600 px-3 py-1 text-sm text-white"
              >
                Post a job
              </a>
            </div>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
