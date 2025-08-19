export const dynamic = "force-dynamic";
export default function Status() {
  return (
    <main className="p-6 font-mono">
      <h1 className="text-xl font-bold">QuickGig Status</h1>
      <ul className="mt-4 space-y-1">
        <li>ENV: {process.env.NEXT_PUBLIC_ENV || "unknown"}</li>
        <li>Commit: {process.env.NEXT_PUBLIC_COMMIT || "unknown"}</li>
        <li>Built: {new Date(Number(process.env.NEXT_PUBLIC_BUILD_TS || Date.now())).toISOString()}</li>
      </ul>
    </main>
  );
}
