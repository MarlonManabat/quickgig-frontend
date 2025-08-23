import type { AppProps } from "next/app";
import "../styles/globals.css";
import "../styles/accessibility.css";
import AppShell from "@/components/AppShell";

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppShell>
      <Component {...pageProps} />
    </AppShell>
  );
}
