export function setupClientMonitoring() {
  if (typeof window === 'undefined') return;
  if ((window as any).__qqg_mon) return; (window as any).__qqg_mon = true;

  window.addEventListener('error', (e) => {
    // placeholder: replace with a real logging service later
    console.warn('[client-error]', e.message);
  });
  window.addEventListener('unhandledrejection', (e: PromiseRejectionEvent) => {
    console.warn('[unhandled-rejection]', String(e.reason));
  });
}
