import type { AppProps } from 'next/app';
import { SessionProvider } from '../src/hooks/useSession';
import { useMessageWatcher } from '../src/hooks/useMessageWatcher';
import { ToastProvider } from '../src/components/ToastProvider';

export default function App({ Component, pageProps }: AppProps) {
  useMessageWatcher(Boolean(process.env.NEXT_PUBLIC_ENABLE_NOTIFICATIONS === 'true'));
  return (
    <SessionProvider>
      <ToastProvider>
        <Component {...pageProps} />
      </ToastProvider>
    </SessionProvider>
  );
}
