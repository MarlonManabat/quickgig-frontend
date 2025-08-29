'use client';

export default function PostError({ error, reset }: { error: Error & { digest?: string }, reset: () => void }) {
  console.error('Post route error:', error);
  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-xl font-semibold mb-3">Something went wrong</h1>
      <p className="mb-4 opacity-80">We couldn’t load the location widget. You can still post using basic fields below.</p>

      {/* Minimal hard fallback so users aren’t blocked */}
      <form onSubmit={(e)=>e.preventDefault()} className="grid gap-3">
        <input className="input" placeholder="Job title" required />
        <input className="input" placeholder="Company (optional)" />
        <input className="input" placeholder="Region" />
        <input className="input" placeholder="Province / Metro / HUC" />
        <input className="input" placeholder="City / LGU" />
        <div className="flex gap-2">
          <button className="btn btn-primary" aria-label="Post Job (fallback)">Post Job</button>
          <button type="button" className="btn" onClick={()=>reset()}>Try again</button>
        </div>
      </form>
    </main>
  );
}
