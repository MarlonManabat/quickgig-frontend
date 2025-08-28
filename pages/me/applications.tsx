import { useEffect, useState } from "react";
import { listMyApplications } from "@/lib/gigs/api";

export default function MyApplications() {
  const [apps, setApps] = useState<any[]>([]);
  useEffect(() => {
    listMyApplications().then(({ data }) => setApps(data || []));
  }, []);
  return (
    <main className="p-4 space-y-4">
      {apps.map((a) => (
        <div key={a.id} className="border p-2 space-y-1">
          <p className="font-semibold">{a.gigs?.title}</p>
          {(() => {
            const cls =
              a.status === 'hired'
                ? 'bg-green-100 text-green-800'
                : a.status === 'rejected'
                ? 'bg-rose-100 text-rose-800'
                : 'bg-slate-200 text-slate-800';
            return (
              <span
                data-testid="status-pill"
                className={`inline-block px-2 py-0.5 rounded text-xs ${cls}`}
              >
                {a.status}
              </span>
            );
          })()}
        </div>
      ))}
    </main>
  );
}
