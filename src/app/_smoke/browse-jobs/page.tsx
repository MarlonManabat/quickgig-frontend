"use client";
import Header from "../_components/Header";

export default function Page() {
  return (
    <main className="p-6 space-y-4">
      <Header />
      <ul data-testid="jobs-list">
        {[1,2,3].map(n => (
          <li key={n} data-testid="job-card" className="p-3 border rounded">
            <div>{`Job ${n}`}</div>
            <a data-testid="apply-button" href={`/login?next=${encodeURIComponent('/applications')}`}>Apply</a>
          </li>
        ))}
      </ul>
    </main>
  );
}
