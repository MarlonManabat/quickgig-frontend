import ApplicantsTable from '@/components/owner/ApplicantsTable';
import { getOrigin } from '@/lib/origin';
import type { ApplicantRow } from '@/types/owner';

export const dynamic = 'force-dynamic';

export default async function GigApplicantsPage({
  params,
}: {
  params: { id: string };
}) {
  const res = await fetch(
    `${getOrigin()}/api/owner/gigs/${params.id}/applicants`,
    { cache: 'no-store' },
  );
  const data = await res.json().catch(() => ({ items: [] }));
  const items = (data.items as ApplicantRow[]) || [];
  return (
    <main className="mx-auto max-w-3xl p-6 space-y-4">
      <h1 className="text-xl font-semibold">Applicants</h1>
      <ApplicantsTable items={items} />
    </main>
  );
}
