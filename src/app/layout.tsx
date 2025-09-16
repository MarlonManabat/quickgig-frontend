import type { Metadata } from "next";
import "./globals.css";
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
      </body>
    </html>
  );
}
