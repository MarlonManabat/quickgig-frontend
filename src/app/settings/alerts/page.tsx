'use client';

import { useEffect, useState } from 'react';
import { API, JobFilters } from '@/config/api';
import { env } from '@/config/env';
import { toast } from '@/lib/toast';
import Button from '@/components/ui/Button';
import AlertModal, { AlertData } from '@/components/alerts/AlertModal';
import { notFound } from 'next/navigation';
import { apiGet, apiPost } from '@/lib/api';

interface Alert extends AlertData {
  id: string | number;
}

export default function AlertsSettingsPage() {
  if (!env.NEXT_PUBLIC_ENABLE_ALERTS) notFound();

  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Alert | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await apiGet<{ items?: Alert[] }>(API.alertsList);
        const items = Array.isArray(res) ? res : res.items || [];
        setAlerts(items as Alert[]);
      } catch {
        toast('Failed to load alerts');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const summary = (f: JobFilters) => {
    const parts: string[] = [];
    if (f.q) parts.push(`"${f.q}"`);
    if (f.location) parts.push(f.location);
    if (f.category) parts.push(f.category);
    if (f.type) parts.push(f.type);
    if (f.remote) parts.push('remote');
    if (f.minSalary || f.maxSalary)
      parts.push(`₱${f.minSalary || 0}-${f.maxSalary || ''}`);
    return parts.join(', ') || 'Any';
  };

  const handleSaved = (a: AlertData) => {
    if (!a.id) return;
    setAlerts((prev) => {
      const idx = prev.findIndex((p) => p.id === a.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = a as Alert;
        return copy;
      }
      return [...prev, a as Alert];
    });
  };

  const toggleEmail = async (a: Alert) => {
    const next = !a.email;
    setAlerts((prev) => prev.map((p) => (p.id === a.id ? { ...p, email: next } : p)));
    try {
      await apiPost(API.alertsToggle(a.id), { email: next });
      toast('Alert updated');
    } catch {
      toast('Failed to update');
      setAlerts((prev) => prev.map((p) => (p.id === a.id ? { ...p, email: a.email } : p)));
    }
  };

  const deleteAlert = async (id: string | number) => {
    if (!confirm('Delete this alert?')) return;
    const prev = alerts;
    setAlerts((p) => p.filter((a) => a.id !== id));
    try {
      await apiPost(API.alertsDelete(id), {});
      toast('Alert deleted');
    } catch {
      toast('Failed to delete');
      setAlerts(prev);
    }
  };

  return (
    <main className="p-4 space-y-4 max-w-3xl">
      <h1 className="text-xl font-semibold">Job Alerts</h1>
      <Button
        onClick={() => {
          setEditing(null);
          setOpen(true);
        }}
      >
        New Alert
      </Button>
      {loading ? (
        <p>Loading...</p>
      ) : alerts.length === 0 ? (
        <p>No alerts yet — create one from your current Jobs filters.</p>
      ) : (
        <table className="w-full text-sm border">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Name</th>
              <th className="p-2">Filters</th>
              <th className="p-2">Frequency</th>
              <th className="p-2">Email</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((a) => (
              <tr key={a.id} className="border-t">
                <td className="p-2">{a.name}</td>
                <td className="p-2">{summary(a.filters)}</td>
                <td className="p-2 capitalize">{a.frequency}</td>
                <td className="p-2">
                  <input
                    type="checkbox"
                    checked={a.email}
                    onChange={() => toggleEmail(a)}
                  />
                </td>
                <td className="p-2 space-x-2">
                  <button
                    className="text-qg-accent"
                    onClick={() => {
                      setEditing(a);
                      setOpen(true);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-600"
                    onClick={() => deleteAlert(a.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <AlertModal
        open={open}
        onClose={() => setOpen(false)}
        initial={editing || undefined}
        onSaved={handleSaved}
      />
    </main>
  );
}
