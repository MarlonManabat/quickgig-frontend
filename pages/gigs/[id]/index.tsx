import { GetServerSideProps } from "next";
import Shell from "@/components/Shell";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import Link from "next/link";
import SaveButton from "@/components/SaveButton";

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const id = ctx.params?.id as string;
  const { data, error } = await supabase.from("gigs").select("*").eq("id", id).single();
  if (error || !data) return { notFound: true };
  return { props: { gig: data } };
};

export default function GigPage({ gig }: { gig: any }) {
  const [user, setUser] = useState<any>(undefined);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  async function report() {
    const reason = prompt("Why are you reporting this gig?") || "";
    try {
      await fetch("/api/reports/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "gig", target_id: gig.id, reason }),
      });
      alert("Reported");
    } catch (_) {}
  }

  if (gig.hidden) {
    if (user === undefined) return <Shell><p>Loading…</p></Shell>;
    if (!user || user.id !== gig.owner) return <Shell><p>This gig is unavailable.</p></Shell>;
  }

  return (
    <Shell>
      <div className="mb-2 flex items-center justify-between">
        <h1 className="text-3xl font-bold">{gig.title}</h1>
        <div className="flex items-center gap-2">
          <SaveButton gigId={gig.id} withText />
          <button onClick={report} className="text-sm underline">Report</button>
        </div>
      </div>
      {user?.id !== gig.owner ? (
        <Link
          href={`/gigs/${gig.id}/apply`}
          className="rounded bg-yellow-400 text-black px-3 py-1"
        >
          Apply
        </Link>
      ) : (
        <Link href={`/gigs/${gig.id}/applicants`} className="underline">
          View Applicants
        </Link>
      )}
      {gig.image_url && (
        <img
          src={gig.image_url}
          alt=""
          className="rounded mb-4 max-h-64 object-cover"
        />
      )}
      <p className="opacity-90 mb-4 whitespace-pre-wrap">{gig.description}</p>
      <div className="text-sm opacity-80 space-x-4">
        <span>Budget: {gig.budget ?? "—"}</span>
        <span>City: {gig.city ?? "—"}</span>
      </div>
    </Shell>
  );
}
