import { API } from '@/config/api';
import { env } from '@/config/env';
import Link from 'next/link';

async function fetchCompany(slug: string) {
  const res = await fetch(`${env.API_URL}${API.publicCompany(slug)}`, { cache: 'no-store' });
  if (!res.ok) return null;
  return res.json().catch(() => null);
}

export default async function PublicCompanyPage({ params }: { params: { slug: string } }) {
  const data = await fetchCompany(params.slug);
  if (!data) return <main className="p-4">Company not found</main>;
  return (
    <main className="p-4 space-y-4 max-w-3xl">
      {data.logo && <img src={data.logo} alt={`${data.name} logo`} className="max-h-32" />}
      <h1 className="text-2xl font-semibold">{data.companyName || data.name}</h1>
      {data.website && (
        <a href={data.website} className="text-qg-accent" target="_blank" rel="noopener noreferrer">
          {data.website}
        </a>
      )}
      {data.about && <p>{data.about}</p>}
      {Array.isArray(data.jobs) && data.jobs.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold">Jobs</h2>
          <ul className="list-disc pl-5 space-y-1">
            {data.jobs.map((j: { id: string | number; title?: string; name?: string }) => (
              <li key={j.id}>
                <Link href={`/jobs/${j.id}`} className="text-qg-accent">
                  {j.title || j.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const data = await fetchCompany(params.slug);
  return {
    title: data?.name ? `${data.name} — QuickGig Company` : 'QuickGig Company',
    alternates: { canonical: `/c/${params.slug}` },
  };
}
