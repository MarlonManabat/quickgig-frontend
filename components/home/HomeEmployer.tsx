import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { uploadAvatar } from "@/lib/avatar";
import { asNumber, asRole, asString, toBool } from "@/lib/normalize";
import type { Role, WalletRow } from "@/lib/types";

export default function HomeEmployer() {
  const [role, setRole] = useState<Role>("seeker");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [profileEmail, setProfileEmail] = useState<string>("");
  const [suspended, setSuspended] = useState<boolean>(false);
  const [deleted, setDeleted] = useState<boolean>(false);
  const [balance, setBalance] = useState<number>(0);

  // seeker
  const [apps, setApps] = useState<any[]>([]);
  const [activeMatches, setActiveMatches] = useState<any[]>([]);
  // employer
  const [myJobs, setMyJobs] = useState<any[]>([]);
  const [pendingCounts, setPendingCounts] = useState<Record<string, number>>(
    {},
  );

  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      const { data: auth } = await supabase.auth.getUser();
      if (!auth?.user) return;

      const { data: prof } = await supabase
        .from("profiles")
        .select("role, avatar_url, email, suspended_at, deleted_at")
        .eq("id", auth.user.id)
        .maybeSingle();

      // Profile -> normalized state
      setRole(asRole(prof?.role) ?? "seeker");
      setAvatarUrl(asString(prof?.avatar_url));
      setProfileEmail(asString(prof?.email) ?? "");
      setSuspended(toBool(prof?.suspended_at));
      setDeleted(toBool(prof?.deleted_at));

      const { data: wallet } = await supabase
        .from("v_ticket_balances")
        .select("balance")
        .eq("user_id", auth.user.id)
        .maybeSingle<WalletRow>();
      setBalance(asNumber(wallet?.balance) ?? 0);

      // seeker widgets
      const { data: seekerApps } = await supabase
        .from("applications")
        .select("id, job_id, status, updated_at, job:jobs(title)")
        .order("updated_at", { ascending: false })
        .limit(5);
      setApps(seekerApps ?? []);

      const { data: seekerMatches } = await supabase
        .from("matches")
        .select("id, status, job_id, updated_at, job:jobs(title)")
        .in("status", ["agreed", "in_progress"])
        .order("updated_at", { ascending: false })
        .limit(5);
      setActiveMatches(seekerMatches ?? []);

      // employer widgets
      const { data: jobs } = await supabase
        .from("jobs")
        .select(
          "id, title, created_at, is_online, location_city, location_region",
        )
        .order("created_at", { ascending: false })
        .limit(5);
      setMyJobs(jobs ?? []);

      const { data: pend, error: pendErr } = await supabase
        .from("applications")
        .select("job_id, status")
        .eq("status", "pending");
      if (!pendErr && pend) {
        const m: Record<string, number> = {};
        for (const a of pend as any[]) m[a.job_id] = (m[a.job_id] ?? 0) + 1;
        setPendingCounts(m);
      }
    })();
  }, []);

  const roleLabel = useMemo(
    () =>
      role === "employer" ? "Employer" : role === "admin" ? "Admin" : "Seeker",
    [role],
  );

  async function onPickAvatar(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      const url = await uploadAvatar(f);
      setAvatarUrl(url);
    } catch (err) {
      console.error(err);
      alert("Failed to upload avatar.");
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <main className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header with avatar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative h-14 w-14 rounded-full overflow-hidden bg-gray-100">
            {avatarUrl ? (
              <Image src={avatarUrl} alt="Profile photo" fill sizes="56px" />
            ) : (
              <div className="h-full w-full grid place-items-center text-gray-400">
                Add photo
              </div>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold">Home</h1>
            <div className="text-sm text-gray-600">
              Signed in as <b>{roleLabel}</b>
              {profileEmail ? ` • ${profileEmail}` : ""}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onPickAvatar}
          />
          <button
            className="qg-btn qg-btn--white px-3 py-2"
            onClick={() => fileRef.current?.click()}
          >
            Change photo
          </button>
          <Link href="/profile" className="qg-btn qg-btn--outline px-3 py-2">
            Edit Profile
          </Link>
        </div>
      </div>

      {(suspended || deleted) && (
        <div className="rounded bg-yellow-50 p-3 text-yellow-800">
          {deleted
            ? "Your account is scheduled for deletion."
            : "Your account is currently suspended."}{" "}
          Need help?{" "}
          <Link href="/support" className="underline">
            Contact support
          </Link>
          .
        </div>
      )}

      {/* Top cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card title="Tickets">
          <div className="text-3xl font-semibold mb-3">{balance}</div>
          <div className="flex gap-2">
            <Link href="/wallet" className="qg-btn qg-btn--primary px-3 py-2">
              Buy Tickets
            </Link>
            <Link href="/wallet" className="qg-btn qg-btn--outline px-3 py-2">
              View History
            </Link>
          </div>
        </Card>

        <Card title="Quick Actions">
          {role === "employer" || role === "admin" ? (
            <div className="flex flex-wrap gap-2">
              <Link href="/employer/post" className="qg-btn qg-btn--primary px-3 py-2">
                Post Job
              </Link>
              <Link
                href="/admin/payments"
                className="qg-btn qg-btn--outline px-3 py-2"
              >
                Review Payments
              </Link>
              <Link
                href="/admin/reviews"
                className="qg-btn qg-btn--outline px-3 py-2"
              >
                Moderate Reviews
              </Link>
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              <Link href="/find?focus=search" className="qg-btn qg-btn--primary px-3 py-2">
                Browse Jobs
              </Link>
              <Link
                href="/messages"
                className="qg-btn qg-btn--outline px-3 py-2"
              >
                Messages
              </Link>
              <Link
                href="/profile"
                className="qg-btn qg-btn--outline px-3 py-2"
              >
                Edit Profile
              </Link>
            </div>
          )}
        </Card>

        <Card title="Recent messages">
          <div className="text-sm text-gray-500">
            Open your inbox to continue chatting.
          </div>
          <Link
            href="/messages"
            className="mt-3 inline-block qg-btn qg-btn--white px-3 py-2"
          >
            Open Messages
          </Link>
        </Card>
      </section>

      {/* Role sections */}
      {role === "employer" || role === "admin" ? (
        <>
          <Section
            title="Your job posts"
            actionHref="/employer/post"
            actionLabel="Post new"
          />
          <Grid>
            {myJobs.length === 0 ? (
              <Empty text="No job posts yet. Create one to receive applications." />
            ) : (
              myJobs.map((j) => (
                <ListCard
                  key={j.id}
                  title={j.title}
                  subtitle={
                    j.is_online
                      ? "Online Job"
                      : [j.location_city, j.location_region]
                          .filter(Boolean)
                          .join(", ") || "—"
                  }
                  meta={new Date(j.created_at).toLocaleString()}
                >
                  <div className="flex gap-2">
                    <Link
                      className="qg-btn qg-btn--outline px-3 py-1.5"
                      href={`/jobs/${j.id}`}
                    >
                      View
                    </Link>
                    <Link
                      className="qg-btn qg-btn--white px-3 py-1.5"
                      href={`/jobs/${j.id}/edit`}
                    >
                      Edit
                    </Link>
                    <span className="ml-auto text-xs text-gray-600">
                      {pendingCounts[j.id]
                        ? `${pendingCounts[j.id]} pending apps`
                        : "No pending apps"}
                    </span>
                  </div>
                </ListCard>
              ))
            )}
          </Grid>
        </>
      ) : (
        <>
          <Section
            title="Your applications"
            actionHref="/find"
            actionLabel="Find jobs"
          />
          <Grid>
            {apps.length === 0 ? (
              <Empty text="You haven't applied to any jobs yet." />
            ) : (
              apps.map((a) => (
                <ListCard
                  key={a.id}
                  title={a.job?.title ?? "Job"}
                  subtitle={`Status: ${a.status}`}
                  meta={new Date(a.updated_at).toLocaleString()}
                >
                  <Link
                    className="qg-btn qg-btn--outline px-3 py-1.5"
                    href={`/jobs/${a.job_id}`}
                  >
                    View job
                  </Link>
                </ListCard>
              ))
            )}
          </Grid>

          <Section title="Active matches" />
          <Grid>
            {activeMatches.length === 0 ? (
              <Empty text="When both parties agree, your active matches appear here." />
            ) : (
              activeMatches.map((m) => (
                <ListCard
                  key={m.id}
                  title={m.job?.title ?? "Job"}
                  subtitle={`Status: ${m.status}`}
                  meta={new Date(m.updated_at).toLocaleString()}
                >
                  <Link
                    className="qg-btn qg-btn--outline px-3 py-1.5"
                    href={`/jobs/${m.job_id}`}
                  >
                    Open chat
                  </Link>
                </ListCard>
              ))
            )}
          </Grid>
        </>
      )}
    </main>
  );
}

function Card({ title, children }: { title: string; children: any }) {
  return (
    <div className="border rounded p-4">
      <div className="text-sm text-gray-500 mb-2">{title}</div>
      {children}
    </div>
  );
}
function Section({
  title,
  actionHref,
  actionLabel,
}: {
  title: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="flex items-center justify-between mt-4 mb-2">
      <h2 className="text-lg font-semibold">{title}</h2>
      {actionHref && actionLabel && (
        <Link href={actionHref} className="qg-btn qg-btn--white px-3 py-1.5">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
function Grid({ children }: { children: any }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">{children}</div>
  );
}
function ListCard({
  title,
  subtitle,
  meta,
  children,
}: {
  title: string;
  subtitle?: string;
  meta?: string;
  children?: any;
}) {
  return (
    <div className="border rounded p-4">
      <div className="font-semibold">{title}</div>
      {subtitle && <div className="text-sm text-gray-600">{subtitle}</div>}
      {meta && <div className="text-xs text-gray-500 mt-1">{meta}</div>}
      <div className="mt-3">{children}</div>
    </div>
  );
}
function Empty({ text }: { text: string }) {
  return <div className="border rounded p-4 text-gray-600">{text}</div>;
}
