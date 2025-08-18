"use client";

import { env } from "@/config/env";

export default function DebugEnvPage() {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const entries = Object.entries(env).filter(([key]) =>
    key.startsWith("NEXT_PUBLIC"),
  );

  return (
    <main className="p-4">
      <h1 className="mb-4 text-xl">Environment variables</h1>
      {origin && <p className="mb-4">Origin: {origin}</p>}
      <ul className="space-y-2">
        {entries.map(([key, value]) => (
          <li key={key}>
            <span className="font-mono">{key}</span>: {value ? (
              <span>{value}</span>
            ) : (
              <span className="rounded bg-red-200 px-1 text-red-800">missing</span>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
