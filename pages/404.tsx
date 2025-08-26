import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-lg p-8 text-center space-y-4">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <p className="text-slate-600">
        Sorry, hindi namin mahanap ang page na ito. Try one of these:
      </p>
      <div className="flex gap-3 justify-center">
        <Link
          href="/start?intent=worker"
          className="qg-btn qg-btn--primary px-4 py-2"
        >
          Find work
        </Link>
        <Link
          href="/start?intent=employer"
          className="qg-btn qg-btn--outline px-4 py-2"
        >
          Post a job
        </Link>
      </div>
      <p className="text-sm text-slate-500">
        Or go to{" "}
        <Link className="qg-link" href="/">
          home
        </Link>
        .
      </p>
    </main>
  );
}
