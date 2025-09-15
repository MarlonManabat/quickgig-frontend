import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
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
        <Header />
        {children}
      </body>
    </html>
  );
}
