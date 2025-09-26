import { requireUser } from "../(app)/_lib/requireUser";

export const dynamic = "force-dynamic";

export default async function Page() {
  await requireUser();

  const applications: any[] = [];

  return (
    <main className="mx-auto max-w-5xl p-4">
      <h1 className="mb-4 text-xl font-semibold">My Applications</h1>
      <div data-testid="applications-list">
        {applications.length === 0 ? (
          <p>No applications yet.</p>
        ) : (
          applications.map((application, index) => (
            <article key={String(index)} className="rounded border p-3">
              Application #{index + 1}
            </article>
          ))
        )}
      </div>
    </main>
  );
}
