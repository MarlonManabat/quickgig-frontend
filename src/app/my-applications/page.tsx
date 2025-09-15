"use client";
import { useEffect, useState } from "react";

function hasAuthCookie() {
  if (typeof document === "undefined") return false;
  return document.cookie.split(";").some(c => c.trim().startsWith("qg_auth=1"));
}

export default function MyApplicationsPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    const ok = hasAuthCookie();
    setAuthed(ok);
    if (!ok) {
      const next = encodeURIComponent("/my-applications");
      window.location.href = `/login?next=${next}`;
    }
  }, []);

  if (authed === false) return null; // redirecting

  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="text-2xl font-semibold">My Applications</h1>
      <div data-testid="applications-empty" className="mt-4 text-gray-600">
        You haven’t applied to any jobs yet.
      </div>
    </main>
  );
}
