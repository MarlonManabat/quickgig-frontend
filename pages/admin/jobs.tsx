"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import AdminTable from "@/components/AdminTable";
import { listJobs } from "@/lib/admin";

export default function AdminJobs() {
  const [rows, setRows] = useState<any[]>([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");

  const load = async () => {
    const { data } = await listJobs({ q, status });
    setRows(data || []);
  };

  useEffect(() => {
    load();
  }, [q, status]);

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Jobs</h1>
      <div className="flex gap-2 mb-4">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search title..."
          className="border p-2 flex-1"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border p-2"
        >
          <option value="">All</option>
          <option value="open">open</option>
          <option value="closed">closed</option>
        </select>
      </div>
      <AdminTable>
        <thead>
          <tr className="text-left">
            <th>Title</th>
            <th>Status</th>
            <th>User</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((j) => (
            <tr key={j.id} className="border-t">
              <td>
                <Link href={`/gigs/${j.id}`} className="underline">
                  {j.title}
                </Link>
              </td>
              <td>{j.status}</td>
              <td>{j.user_id}</td>
              <td>{new Date(j.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </AdminTable>
    </main>
  );
}
