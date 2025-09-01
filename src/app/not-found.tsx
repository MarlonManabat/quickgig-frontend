export default function NotFound() {
  return (
    <main className="mx-auto max-w-lg p-8">
      <h1 className="text-2xl font-semibold mb-2">Page not found</h1>
      <p className="text-slate-600 mb-4">The page you’re looking for doesn’t exist.</p>
      <a className="underline" href="/">Go home</a>
    </main>
  );
}
