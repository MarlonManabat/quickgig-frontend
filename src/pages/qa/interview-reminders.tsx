import InterviewScheduler from '@/components/InterviewScheduler';
import { t } from '@/lib/i18n';

export default function InterviewRemindersQA({ auto }: { auto: boolean }) {
  return (
    <main className="p-4 space-y-2">
      <h1 className="text-xl font-semibold">{t('qa.interviewRemindersTitle')}</h1>
      <InterviewScheduler auto={auto} />
    </main>
  );
}

export async function getServerSideProps(ctx: { query: { [k: string]: string } }) {
  if (process.env.NEXT_PUBLIC_ENABLE_INTERVIEW_REMINDERS_QA !== 'true') {
    return { notFound: true };
  }
  return { props: { auto: ctx.query.auto === '1' } };
}
