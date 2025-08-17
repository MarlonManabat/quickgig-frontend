import type { AppProps } from 'next/app';
import { SessionProvider } from '../src/hooks/useSession';
import { useMessagesWatcher } from '../src/hooks/useMessagesWatcher';
import { ToastProvider } from '../src/components/ToastProvider';

export default function App({ Component, pageProps }: AppProps) {
  useMessagesWatcher(Boolean(process.env.NEXT_PUBLIC_ENABLE_MESSAGES === 'true'));
  return (
    <SessionProvider>
      <ToastProvider>
        <Component {...pageProps} />
      </ToastProvider>
    </SessionProvider>
  );
}
