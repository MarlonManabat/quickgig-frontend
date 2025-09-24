import type { Metadata } from "next";
import "./globals.css";
import { SpeedInsights } from "@vercel/speed-insights/next";
import SiteHeader from "@/components/layout/SiteHeader";
import { isAuthedServer } from "@/lib/auth/isAuthedServer";
import { authAware, hostAware } from "@/lib/hostAware";
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
  const authed = isAuthedServer();
  const browseHref = "/browse-jobs";
  const postHref = authed ? hostAware("/gigs/create") : authAware("/gigs/create");
  const loginHref = hostAware("/login");
  const logoutHref = hostAware("/api/auth/logout?next=/");
  const myApplicationsHref = authed
    ? hostAware("/my-applications")
    : authAware("/my-applications");

  return (
    <html lang="en">
      <body>
        <SiteHeader
          authed={authed}
          browseHref={browseHref}
          postHref={postHref}
          loginHref={loginHref}
          logoutHref={logoutHref}
          myApplicationsHref={myApplicationsHref}
        />
        {children}
        {/* Render Speed Insights in production only to avoid non-prod noise */}
        {process.env.NODE_ENV === "production" && <SpeedInsights />}
      </body>
    </html>
  );
}
