'use client';

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  // Best-effort client log; the server log will also have the stack
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line no-console
    console.error('App error:', { message: error.message, digest: (error as any).digest });
  }
  return (
    <html>
      <body className="p-8">
        <div className="max-w-xl mx-auto space-y-3">
          <h1 className="text-xl font-semibold">Something went wrong</h1>
          <p>We hit an unexpected error while loading this page.</p>
          {'digest' in error && (error as any).digest ? (
            <p className="text-sm opacity-70">Error digest: {(error as any).digest}</p>
          ) : null}
          <a className="underline" href="/">
            Go Home
          </a>
        </div>
      </body>
    </html>
  );
}
