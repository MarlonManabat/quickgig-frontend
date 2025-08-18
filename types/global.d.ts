declare global { interface Notification { read?: boolean } }

declare module '@sentry/nextjs' {
  // Minimal Sentry stub
  export function init(options: Record<string, unknown>): void;
}

declare module '@vercel/analytics/react' {
  import type { ComponentType } from 'react';
  export const Analytics: ComponentType;
}

declare module 'mixpanel-browser' {
  export function init(token: string): void;
}

declare module 'web-vitals' {
  export function onCLS(cb: (metric: { name: string; value: number }) => void): void;
  export function onFID(cb: (metric: { name: string; value: number }) => void): void;
  export function onLCP(cb: (metric: { name: string; value: number }) => void): void;
}

export {};
