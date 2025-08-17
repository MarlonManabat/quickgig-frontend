export interface ConnectOptions {
  enabled: boolean;
  onMessage: (data: unknown) => void;
  onReady?: () => void;
  onError?: () => void;
}

export function connectMessagesEvents({ enabled, onMessage, onReady, onError }: ConnectOptions) {
  if (typeof window === 'undefined' || !enabled) {
    return { close() {} };
  }
  let closed = false;
  let source: EventSource | null = null;
  let retry = 1000;

  const connect = () => {
    if (closed) return;
    source = new EventSource('/api/messages/events');
    source.addEventListener('ready', () => {
      retry = 1000;
      onReady?.();
    });
    source.addEventListener('message', (ev) => {
      try {
        onMessage(JSON.parse((ev as MessageEvent).data) as unknown);
      } catch {}
    });
    const err = () => {
      onError?.();
      source?.close();
      source = null;
      if (closed) return;
      setTimeout(connect, retry);
      retry = Math.min(retry * 2, 8000);
    };
    source.addEventListener('error', err);
  };

  connect();

  return {
    close() {
      closed = true;
      source?.close();
    },
  };
}
