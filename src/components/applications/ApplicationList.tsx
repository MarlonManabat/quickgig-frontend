import type { Application } from '@/types/applications';

export default function ApplicationList({ items }: { items: Application[] }) {
  if (items.length === 0) {
    return <p className="text-slate-500">No applications yet.</p>;
  }

  return (
    <table className="w-full text-sm">
      <thead>
        <tr className="text-left">
          <th className="py-2">Title</th>
          <th className="py-2">Company</th>
          <th className="py-2">Status</th>
          <th className="py-2">Applied</th>
        </tr>
      </thead>
      <tbody>
        {items.map((a) => (
          <tr key={a.id} className="border-t">
            <td className="py-2">{a.title}</td>
            <td className="py-2">{a.company}</td>
            <td className="py-2 capitalize">{a.status}</td>
            <td className="py-2">
              {new Date(a.created_at).toLocaleDateString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

