export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl p-6 prose">
      <h1>Help & Support</h1>
      <p>Having trouble? Check these basics first:</p>
      <ul>
        <li>Make sure you’re signed in.</li>
        <li>Retry the action after refreshing the page.</li>
        <li>If the issue persists, contact support.</li>
      </ul>
      <p className="text-sm">
        This is placeholder content for MVP; replace with full FAQ later.
      </p>
    </main>
  );
}
