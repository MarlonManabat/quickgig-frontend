import type { Metadata } from "next";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Header from "@/components/Header";
import { metadataBaseOrigin } from "@/lib/env";

export const metadata: Metadata = {
  title: "QuickGig",
  description: "Find and post gigs fast",
  metadataBase: metadataBaseOrigin(),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        {/* Render Speed Insights in production only to avoid non-prod noise */}
        {process.env.NODE_ENV === "production" && <SpeedInsights />}
      </body>
    </html>
  );
}
