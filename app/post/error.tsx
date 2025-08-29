'use client';

export default function ErrorFallback() {
  return (
    <main className="p-4 max-w-md mx-auto">
      <h1 className="text-xl mb-4">Post a Job</h1>
      <form className="space-y-3">
        <input className="border rounded p-2 w-full" placeholder="Job title" />
        <input className="border rounded p-2 w-full" placeholder="Company" />
      </form>
      <p className="mt-4 text-red-600">Something went wrong.</p>
    </main>
  );
}
