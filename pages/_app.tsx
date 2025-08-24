import type { AppProps } from "next/app";
import Head from "next/head";
import "../styles/theme.css";
import "../styles/globals.css";
import "../styles/accessibility.css";
import { useRouter } from "next/router";
import AppHeader from "@/components/nav/AppHeader";
import AppFooter from "@/components/nav/AppFooter";
import Container from "@/components/Container";
import { useEffect } from "react";
import { setupErrlog } from "@/lib/errlog";
import { qgSans } from "@/lib/fonts";

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isError = router.pathname === '/404' || router.pathname === '/500';
  useEffect(() => {
    setupErrlog();
  }, []);
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
      <div className={`${qgSans.className} min-h-screen bg-surface text-text flex flex-col`}>
        {!isError && <AppHeader />}
        <main className="flex-1 py-6 bg-surface">
          <Container>
            <Component {...pageProps} />
          </Container>
        </main>
        {!isError && <AppFooter />}
      </div>
    </>
  );
}

export { reportWebVitals } from "@/lib/vitals";
