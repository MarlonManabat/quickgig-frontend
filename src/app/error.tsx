'use client';

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  return (
    <html>
      <body>
        <main className="mx-auto max-w-lg p-8">
          <h1 className="text-2xl font-semibold mb-2">Something went wrong</h1>
          <p className="text-slate-600 mb-4">Please try again in a moment.</p>
          <pre className="text-xs bg-slate-100 p-3 rounded overflow-auto">{error.message}</pre>
          <a className="underline mt-4 inline-block" href="/">Go home</a>
        </main>
      </body>
    </html>
  );
}
