import type { AppProps } from "next/app";
import "../styles/theme.css";
import "../styles/globals.css";
import "../styles/accessibility.css";
import { useRouter } from "next/router";
import AppHeader from "@/components/nav/AppHeader";
import AppFooter from "@/components/nav/AppFooter";
import Container from "@/components/Container";

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isError = router.pathname === '/404' || router.pathname === '/500';
  return (
    <div className="min-h-screen bg-surface text-text flex flex-col">
      {!isError && <AppHeader />}
      <main className="flex-1 py-6 bg-surface">
        <Container>
          <Component {...pageProps} />
        </Container>
      </main>
      {!isError && <AppFooter />}
    </div>
  );
}
