import React from 'react';
import Link from 'next/link';

export default class AppErrorBoundary extends React.Component<
  { children: React.ReactNode }, { hasError: boolean; msg?: string }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(err: any) {
    return { hasError: true, msg: err?.message || 'Something went wrong.' };
  }
  componentDidCatch(err: any, info: any) {
    // Optional: log to your backend or Sentry here
    console.error('AppErrorBoundary', err, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <main className="max-w-xl mx-auto p-6">
          <h1 className="text-xl font-semibold mb-2">Something went wrong</h1>
          <p className="text-sm opacity-70">{this.state.msg}</p>
          <Link className="underline mt-4 inline-block" href="/">Go home</Link>
        </main>
      );
    }
    return this.props.children as any;
  }
}
