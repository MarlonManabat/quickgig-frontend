import BulkActions from '@/components/employer/BulkActions';
import { t } from '@/lib/i18n';

const applicants = [
  { id: 'a1', name: 'Alice' },
  { id: 'a2', name: 'Bob' },
  { id: 'a3', name: 'Carlo' },
  { id: 'a4', name: 'Dana' },
  { id: 'a5', name: 'Eli' },
];
const job = { id: 'j1', title: 'Sample Job' };

export default function BulkRejectionQA({ auto }: { auto: boolean }) {
  return (
    <main className="p-4 space-y-2">
      <h1 className="text-xl font-semibold">{t('qa.bulkRejectionTitle')}</h1>
      <BulkActions applicants={applicants} job={job} auto={auto} />
    </main>
  );
}

export async function getServerSideProps(ctx: { query: { [k: string]: string } }) {
  if (
    process.env.NEXT_PUBLIC_ENABLE_BULK_REJECTION_QA !== 'true' ||
    process.env.ENGINE_MODE === 'php'
  ) {
    return { notFound: true };
  }
  return { props: { auto: ctx.query.auto === '1' } };
}
