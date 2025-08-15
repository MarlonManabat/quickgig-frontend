import { useEffect } from 'react';

export function usePolling<T = unknown>(url: string | null, ms: number, onData: (data: T) => void) {
  useEffect(() => {
    if (!url || ms <= 0) return;
    let timer: NodeJS.Timeout;
    let controller: AbortController | null = null;
    let interval = ms;

    const fetchData = () => {
      controller?.abort();
      controller = new AbortController();
      fetch(url, { signal: controller.signal })
        .then((r) => r.json() as Promise<T>)
        .then((d) => onData(d))
        .catch(() => {});
    };

    fetchData();
    timer = setInterval(fetchData, interval);

    const handleVis = () => {
      clearInterval(timer);
      interval = document.hidden ? ms * 4 : ms;
      timer = setInterval(fetchData, interval);
    };
    document.addEventListener('visibilitychange', handleVis);

    return () => {
      document.removeEventListener('visibilitychange', handleVis);
      controller?.abort();
      clearInterval(timer);
    };
  }, [url, ms, onData]);
}
