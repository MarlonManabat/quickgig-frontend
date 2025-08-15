export default function LoadingEmployerJobs() {
  return (
    <main className="p-4 space-y-4">
      <div className="h-8 w-1/3 bg-gray-200 animate-pulse rounded" />
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-12 bg-gray-200 animate-pulse rounded" />
      ))}
    </main>
  );
}
