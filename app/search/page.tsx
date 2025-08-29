'use client';

import { useEffect, useState } from 'react';

type Job = {
  id: string;
  title: string;
  company?: string;
  regionCode?: string;
  adminUnitCode?: string;
  cityCode?: string;
  createdAt: string;
};

export default function SearchPage() {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    async function load() {
      let server: Job[] = [];
      try {
        const res = await fetch('/api/jobs');
        if (res.ok) server = await res.json();
      } catch {}
      let local: Job[] = [];
      try {
        local = JSON.parse(localStorage.getItem('jobs-fallback') || '[]');
      } catch {}
      const all = [...server, ...local].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      setJobs(all);
    }
    load();
  }, []);

  return (
    <main className="p-4 max-w-md mx-auto">
      <h1 className="text-xl mb-4">Job Search</h1>
      <ul className="space-y-2">
        {jobs.map((j) => (
          <li key={j.id} data-testid="job-item" className="border p-2">
            <strong>{j.title}</strong>
            {j.company ? <span> – {j.company}</span> : null}
          </li>
        ))}
      </ul>
    </main>
  );
}
