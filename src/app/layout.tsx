import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import { SocketProvider } from "../context/SocketContext";
import Navigation from "../components/Navigation";
import ErrorBoundary from "../components/ErrorBoundary";
import { ToastProvider } from "../components/ToastProvider";
import { SEO } from "@/config/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SEO.siteUrl),
  title: {
    default: SEO.defaultTitle,
    template: `%s | ${SEO.siteName}`,
  },
  description: SEO.defaultDescription,
  openGraph: {
    title: SEO.defaultTitle,
    description: SEO.defaultDescription,
    url: SEO.siteUrl,
    siteName: SEO.siteName,
  },
  twitter: {
    card: 'summary_large_image',
    site: SEO.twitter.site,
    creator: SEO.twitter.creator,
  },
  themeColor: '#0ea5e9',
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/logo-icon.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/logo-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.png',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="theme-color" content="#0ea5e9" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-body antialiased bg-bg text-fg">
        <AuthProvider>
          <SocketProvider>
            <ToastProvider>
              <ErrorBoundary>
                <Navigation />
                <main className="min-h-screen">
                  {children}
                </main>
                <footer className="qg-footer">
              <div className="qg-container">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div className="col-span-1 md:col-span-2">
                    <Image src="/logo-horizontal.png" alt="QuickGig.ph" width={160} height={32} className="h-8 mb-4 w-auto" />
                    <p className="text-fg opacity-70 mb-4">
                      Ang pinakamabilis na paraan para makahanap ng trabaho at talent sa Pilipinas.
                    </p>
                    <p className="text-sm text-fg opacity-60">
                      © 2024 QuickGig.ph. All rights reserved.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-fg mb-4">Para sa Freelancers</h3>
                    <ul className="space-y-2 text-fg opacity-70">
                      <li>
                        <Link href="/find-work" className="hover:text-qg-accent transition-colors">Find Work</Link>
                      </li>
                      <li>
                        <Link href="/profile" className="hover:text-qg-accent transition-colors">Profile</Link>
                      </li>
                      <li>
                        <Link href="/my-jobs" className="hover:text-qg-accent transition-colors">My Jobs</Link>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-fg mb-4">Para sa Employers</h3>
                    <ul className="space-y-2 text-fg opacity-70">
                      <li>
                        <Link href="/post-job" className="hover:text-qg-accent transition-colors">Post Job</Link>
                      </li>
                      <li>
                        <Link href="/buy-tickets" className="hover:text-qg-accent transition-colors">Buy Tickets</Link>
                      </li>
                      <li>
                        <Link href="/messages" className="hover:text-qg-accent transition-colors">Messages</Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
                </footer>
              </ErrorBoundary>
            </ToastProvider>
          </SocketProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
