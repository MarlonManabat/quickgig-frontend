export default function NotFound() {
  return (
    <main className="mx-auto max-w-xl p-10 text-center">
      <h1 className="text-3xl font-semibold mb-2">Page not found</h1>
      <p className="text-slate-600 mb-4">
        We couldn’t find the page you were looking for.
      </p>
      <a href="/" className="underline inline-block">
        Go home
      </a>
    </main>
  );
}
