import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import ApplicationThread from '@/components/ApplicationThread';
import MessageComposer from '@/components/MessageComposer';
import { supabase } from '@/utils/supabaseClient';
import { getOrCreateThread } from '@/utils/application';
import Card from '@/components/ui/Card';
import { getString } from '@/utils/getString';

type ApplicationDetail = {
  id: string;
  applicant: string;
  applicant_profile?: { full_name?: string } | null;
  gig?: {
    id: string;
    title: string;
    owner: string;
    owner_profile?: { full_name?: string } | null;
  } | null;
};

export default function ApplicationPage() {
  const router = useRouter();
  const appId = getString(router.query.id);
  const [threadId, setThreadId] = useState<number | null>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (!appId) {
      console.error('Missing application id; redirecting to /applications');
      router.replace('/applications');
    }
  }, [appId, router]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const fetcher = async (_: string, id: string): Promise<ApplicationDetail> => {
    const { data, error } = await supabase
      .from('applications')
      .select(`
      id,
      applicant,
      applicant_profile:profiles!applications_applicant_fkey(full_name),
      gig:gigs(
        id,
        title,
        owner,
        owner_profile:profiles(full_name)
      )
    `)
      .eq('id', id)
      .single();
    if (error) throw error;
    return data as unknown as ApplicationDetail;
  };

  const { data, error, isLoading } = useSWR<ApplicationDetail>(
    appId ? ['application-by-id', appId] : null,
    fetcher
  );

  const app =
    data && Array.isArray((data as any).gig) ? { ...data, gig: (data as any).gig[0] } : data;

  useEffect(() => {
    if (!app?.id) return;
    getOrCreateThread(app.id).then((th) => setThreadId(th.id));
  }, [app]);

  if (!appId) return <div data-testid="application-redirecting" />;
  if (isLoading) return <div data-testid="application-loading">Loading…</div>;
  if (error) return <div data-testid="application-error">Failed to load application.</div>;
  if (!app) return <div data-testid="application-empty">Application not found.</div>;

  const ownerName = app.gig?.owner_profile?.full_name ?? app.gig?.owner ?? 'Owner';
  const applicantName = app.applicant_profile?.full_name ?? app.applicant ?? 'Applicant';
  const counterpart = user?.id === app.applicant ? ownerName : applicantName;

  return (
    <main data-testid="application-title">
      <div className="mx-auto flex h-[80vh] max-w-3xl flex-col gap-4 p-4">
        <p className="text-sm text-brand-subtle">Applications / View application</p>
        <Card className="p-4 space-y-1">
          <h1>{app.gig?.title}</h1>
          <p className="text-sm text-brand-subtle">Conversation with {counterpart}</p>
        </Card>
        {threadId && <ApplicationThread threadId={threadId} />}
        {threadId && user?.id && (
          <MessageComposer threadId={String(threadId)} userId={user.id} />
        )}
      </div>
    </main>
  );
}

export { forceSSR as getServerSideProps } from '@/lib/ssr'
