export const dynamic = 'force-dynamic';

export default function Page() {
  return (
    <main className="mx-auto max-w-3xl p-6 prose">
      <h1>Terms of Service</h1>
      <p>
        These terms describe the basic rules for using QuickGig. This page is a
        lightweight placeholder for MVP and is not final legal text.
      </p>
      <ol>
        <li>Use the service responsibly.</li>
        <li>Only submit accurate information.</li>
        <li>Respect other users and employers.</li>
      </ol>
      <p className="text-sm">Full legal terms will be added before launch.</p>
    </main>
  );
}
