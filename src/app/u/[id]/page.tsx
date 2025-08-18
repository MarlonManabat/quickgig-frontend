import { API } from '@/config/api';
import { env } from '@/config/env';
import { cookies } from 'next/headers';
import ReportButton from '@/components/ReportButton';
import { getUser } from '@/auth/getUser';

async function fetchUser(id: string) {
  const path = id === 'me' ? API.me : API.publicUser(id);
  const res = await fetch(`${env.API_URL}${path}`, {
    headers: { cookie: cookies().toString() },
    cache: 'no-store',
  });
  if (!res.ok) return null;
  return res.json().catch(() => null);
}

export default async function PublicProfilePage({ params }: { params: { id: string } }) {
  const data = await fetchUser(params.id);
  const me = await getUser();
  if (!data) return <main className="p-4">Profile not found</main>;
  return (
    <main className="p-4 space-y-4 max-w-2xl">
      <h1 className="text-2xl font-semibold">{data.name}</h1>
      {data.headline && <p className="text-gray-600">{data.headline}</p>}
      {data.location && <p>{data.location}</p>}
      {Array.isArray(data.skills) && data.skills.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {data.skills.map((s: string) => (
            <li key={s} className="px-2 py-1 bg-gray-200 rounded">
              {s}
            </li>
          ))}
        </ul>
      )}
      {data.bio && <p>{data.bio}</p>}
      {(data.resumeUrl || data.resumeKey) && (
        <ResumeButton url={data.resumeUrl} resumeKey={data.resumeKey} />
      )}
      {me ? <ReportButton type="user" targetId={data.id || params.id} /> : null}
    </main>
  );
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const data = await fetchUser(params.id);
  if (data?.name) {
    return { title: `${data.name} — QuickGig Profile` };
  }
  return { title: 'QuickGig Profile' };
}

function ResumeButton({
  url,
  resumeKey,
}: {
  url?: string;
  resumeKey?: string;
}) {
  'use client';
  const signEnabled =
    process.env.NEXT_PUBLIC_ENABLE_FILE_SIGNING === 'true' && !!resumeKey;
  const handle = async () => {
    if (signEnabled && resumeKey) {
      try {
        const res = await fetch(`/api/files/sign?key=${encodeURIComponent(resumeKey)}`);
        if (res.ok) {
          const json = await res.json();
          window.location.href = json.url;
          return;
        }
      } catch {
        /* ignore */
      }
    }
    if (url) window.open(url, '_blank');
  };
  return (
    <button onClick={handle} className="text-qg-accent">
      Download Resume
    </button>
  );
}
