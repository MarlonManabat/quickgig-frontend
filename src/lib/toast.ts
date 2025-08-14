export type ToastListener = (message: string) => void;

const listeners = new Set<ToastListener>();

export function subscribe(listener: ToastListener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function toast(message: string) {
  listeners.forEach((l) => l(message));
}
