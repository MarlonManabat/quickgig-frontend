export function setupErrlog() {
  if (typeof window === "undefined") return;
  if ((window as any).__qqg_errlog) return;
  (window as any).__qqg_errlog = true;

  function send(payload: Record<string, any>) {
    try {
      fetch("/api/errlog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        keepalive: true,
      });
    } catch {
      // ignore
    }
  }

  window.addEventListener("error", (e) => {
    send({
      path: window.location.pathname,
      message: e.message,
      stack:
        e.error && e.error.stack
          ? String(e.error.stack).slice(0, 200)
          : undefined,
    });
  });
  window.addEventListener("unhandledrejection", (e: PromiseRejectionEvent) => {
    send({
      path: window.location.pathname,
      message: String(e.reason),
    });
  });
}
