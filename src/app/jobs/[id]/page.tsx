interface JobPageProps {
  params: { id: string };
}

export default function JobPage({ params }: JobPageProps) {
  return (
    <main className="p-4">
      <h1 className="text-xl mb-4">Job {params.id}</h1>
      <p>Details coming soon.</p>
    </main>
  );
}
