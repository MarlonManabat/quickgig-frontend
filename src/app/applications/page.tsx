'use client';

import { useEffect, useState } from 'react';

export default function ApplicationsPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return null;
  }

  return (
    <main className="p-4">
      <h1 className="text-xl font-semibold mb-4">My Applications</h1>
      <p>Coming soon.</p>
    </main>
  );
}
