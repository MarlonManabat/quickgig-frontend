import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { AuthProvider } from "../context/AuthContext";
import { SocketProvider } from "../context/SocketContext";
import Navigation from "../components/Navigation";
import ErrorBoundary from "../components/ErrorBoundary";
import { ToastProvider } from "../components/ToastProvider";
import ClientBootstrap from './ClientBootstrap';
import ClientAuthGuard from './ClientAuthGuard';
import { SEO } from "@/config/seo";
import { canonical } from "@/lib/canonical";

export const metadata: Metadata = {
  title: "QuickGig.ph - Find Gigs Fast in the Philippines",
  description: "Kahit saan sa Pinas, may gig para sa'yo! Connect with opportunities and talent across the Philippines. Find work or hire skilled professionals quickly and easily.",
  keywords: "freelance, gigs, Philippines, work, jobs, hiring, talent, remote work, Filipino freelancers",
  authors: [{ name: "QuickGig.ph Team" }],
  creator: "QuickGig.ph",
  publisher: "QuickGig.ph",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(SEO.siteUrl || 'https://quickgig.ph'),
  alternates: {
    canonical: canonical(),
  },
  openGraph: {
    title: "QuickGig.ph - Find Gigs Fast in the Philippines",
    description: "Kahit saan sa Pinas, may gig para sa'yo! Connect with opportunities and talent across the Philippines.",
    url: canonical(),
    siteName: 'QuickGig.ph',
    images: [
      {
        url: '/logo-main.png',
        width: 1200,
        height: 630,
        alt: 'QuickGig.ph - Filipino Freelance Platform',
      },
    ],
    locale: 'en_PH',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "QuickGig.ph - Find Gigs Fast in the Philippines",
    description: "Kahit saan sa Pinas, may gig para sa'yo!",
    images: ['/logo-main.png'],
    creator: '@QuickGigPH',
  },
  icons: [{ rel: 'icon', url: '/favicon.svg' }],
  manifest: '/manifest.json',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="font-body antialiased bg-bg text-fg">
        <ClientAuthGuard />
        <ClientBootstrap />
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
                    {/* eslint-disable-next-line @next/next/no-img-element -- logo placeholder */}
                    <img src="/logo-horizontal.png" alt="QuickGig.ph" className="h-8 mb-4" />
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
