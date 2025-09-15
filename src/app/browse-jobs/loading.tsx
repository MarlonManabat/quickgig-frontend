export default function Loading() {
  return (
    <ul data-testid="jobs-list" className="grid gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <li key={i} className="h-24 rounded bg-gray-200 animate-pulse" />
      ))}
    </ul>
  );
}
