export default function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="text-center border rounded-2xl p-10">
      <h2 className="text-xl font-medium mb-1">{title}</h2>
      {hint && <p className="text-slate-600">{hint}</p>}
    </div>
  );
}

