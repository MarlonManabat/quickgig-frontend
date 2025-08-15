import { API } from '@/config/api';
import { env } from '@/config/env';
import { cookies } from 'next/headers';

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
      {data.resumeUrl && (
        <a
          href={data.resumeUrl}
          className="text-qg-accent"
          target="_blank"
          rel="noopener noreferrer"
        >
          Download Resume
        </a>
      )}
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
