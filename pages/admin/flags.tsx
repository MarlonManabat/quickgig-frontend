'use client';
import { useEffect, useState } from 'react';
import AdminTable from '@/components/AdminTable';
import { setFlag } from '@/lib/admin';
import { supabase } from '@/lib/supabaseClient';

export default function AdminFlags() {
  const [rows, setRows] = useState<any[]>([]);
  const [key, setKey] = useState('');
  const [enabled, setEnabled] = useState(false);

  const load = async () => {
    const { data } = await supabase
      .from('feature_flags')
      .select('key, enabled, updated_at')
      .order('key');
    setRows(data || []);
  };

  useEffect(() => {
    load();
  }, []);

  const handleToggle = async (k: string, e: boolean) => {
    await setFlag(k, !e);
    await load();
  };

  const handleAdd = async () => {
    if (key.trim()) {
      await setFlag(key.trim(), enabled);
      setKey('');
      setEnabled(false);
      await load();
    }
  };

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Feature Flags</h1>
      <div className="flex gap-2 mb-4">
        <input
          value={key}
          onChange={(e) => setKey(e.target.value)}
          placeholder="Flag key"
          className="border p-2 flex-1"
        />
        <label className="flex items-center gap-1">
          <input
            type="checkbox"
            checked={enabled}
            onChange={(e) => setEnabled(e.target.checked)}
          />
          Enabled
        </label>
        <button
          onClick={handleAdd}
          data-testid="admin-add-flag"
          className="px-3 py-2 border"
        >
          Add
        </button>
      </div>
      <AdminTable>
        <thead>
          <tr className="text-left">
            <th>Key</th>
            <th>Enabled</th>
            <th>Updated</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((f) => (
            <tr key={f.key} className="border-t">
              <td>{f.key}</td>
              <td>{f.enabled ? 'true' : 'false'}</td>
              <td>{new Date(f.updated_at).toLocaleString()}</td>
              <td>
                <button
                  onClick={() => handleToggle(f.key, f.enabled)}
                  data-testid="admin-toggle-flag"
                  className="underline text-sm"
                >
                  Toggle
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </AdminTable>
    </main>
  );
}

export { forceSSR as getServerSideProps } from '@/lib/ssr'
