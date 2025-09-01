import FindWorkFiltersClient from '@/features/gigs/FindWorkFiltersClient';
export const dynamic = 'force-dynamic';

export default async function GigsListPage() {
  // server can read initial query, fetch initial gigs, etc.
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-xl font-semibold mb-3">Find Work</h1>
      <FindWorkFiltersClient />
      {/* TODO: render list using your existing server data or client fetch */}
    </div>
  );
}
