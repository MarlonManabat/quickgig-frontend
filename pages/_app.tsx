import type { AppProps } from 'next/app';
import { SessionProvider } from '../src/hooks/useSession';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SessionProvider>
      <Component {...pageProps} />
    </SessionProvider>
  );
}
