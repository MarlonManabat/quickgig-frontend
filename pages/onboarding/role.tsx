import { useRouter } from "next/router";

export default function RolePick() {
  const router = useRouter();

  function go(role: "worker" | "employer") {
    const next = encodeURIComponent("/profile");
    router.push(`/login?next=${next}&role=${role}`);
  }

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-4">
      <h1 className="text-2xl font-bold">How will you use QuickGig?</h1>
      <p className="text-gray-600">Choose to personalize your experience.</p>
      <div className="flex gap-3">
        <button
          onClick={() => go("worker")}
          className="qg-btn qg-btn--primary px-4 py-2"
        >
          I’m looking for work
        </button>
        <button
          onClick={() => go("employer")}
          className="qg-btn qg-btn--outline px-4 py-2"
        >
          I’m hiring
        </button>
      </div>
      <a href="/home" className="qg-link text-sm">
        Skip for now
      </a>
    </main>
  );
}
