import type { AppProps } from "next/app";
import Head from "next/head";
import "../styles/theme.css";
import "../styles/globals.css";
import "../styles/accessibility.css";
// Load legacy fonts via plain CSS to avoid bundler/format issues
import "@/public/fonts/css/legacy.css";
import { useRouter } from "next/router";
import AppHeader from "@/components/nav/AppHeader";
import AppFooter from "@/components/nav/AppFooter";
import Container from "@/components/Container";
import { useEffect } from "react";
import { setupErrlog } from "@/lib/errlog";
import { supabase } from "@/utils/supabaseClient";
import AppErrorBoundary from "@/components/AppErrorBoundary";

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isError = router.pathname === "/404" || router.pathname === "/500";
  const isApp = typeof window !== "undefined" && window.location.hostname.startsWith("app.");
  const showHeader = isApp ? true : process.env.NEXT_PUBLIC_LEGACY_UI !== "1";
  useEffect(() => {
    setupErrlog();
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session && router.pathname.startsWith("/profile"))
        router.replace("/start");
    });
    return () => {
      sub.subscription.unsubscribe();
    };
  }, [router]);
  return (
    <>
      <Head>
        <meta
          name="description"
          content="QuickGig — find or post quick gigs fast."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content="QuickGig" />
        <meta
          property="og:description"
          content="Find work or hire quickly with simple, ticket-based matches."
        />
      </Head>
      <AppErrorBoundary>
        <div className="min-h-screen bg-surface text-text flex flex-col">
          {!isError && showHeader && <AppHeader />}
          <main className="flex-1 py-6 bg-surface">
            <Container>
              <Component {...pageProps} />
            </Container>
          </main>
          {!isError && showHeader && <AppFooter />}
        </div>
      </AppErrorBoundary>
    </>
  );
}

export { reportWebVitals } from "@/lib/vitals";
