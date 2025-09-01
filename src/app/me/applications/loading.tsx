export default function Loading() {
  return (
    <main className="mx-auto max-w-3xl p-6 animate-pulse">
      <div className="h-8 w-64 bg-slate-200 rounded mb-4" />
      <div className="space-y-3">
        <div className="h-24 bg-slate-200 rounded" />
        <div className="h-24 bg-slate-200 rounded" />
        <div className="h-24 bg-slate-200 rounded" />
      </div>
    </main>
  );
}
