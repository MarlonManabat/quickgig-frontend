export default function NotFound() {
  return (
    <main className="mx-auto max-w-xl p-10 text-center">
      <h1 className="text-3xl font-semibold mb-2">Page not found</h1>
      <p className="text-slate-600">We couldn’t find that page. Check the URL or go back.</p>
      <a className="inline-block mt-6 border rounded px-4 py-2" href="/">Go home</a>
    </main>
  );
}
