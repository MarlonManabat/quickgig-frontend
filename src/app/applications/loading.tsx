export default function LoadingApplications() {
  return (
    <main className="p-4 space-y-4">
      <div className="h-8 w-1/3 bg-gray-200 animate-pulse rounded" />
      {[...Array(2)].map((_, i) => (
        <div key={i} className="h-16 bg-gray-200 animate-pulse rounded" />
      ))}
    </main>
  );
}
