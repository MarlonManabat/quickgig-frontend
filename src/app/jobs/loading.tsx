export default function LoadingJobs() {
  return (
    <main className="p-4 space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-24 bg-gray-200 animate-pulse rounded" />
      ))}
    </main>
  );
}
