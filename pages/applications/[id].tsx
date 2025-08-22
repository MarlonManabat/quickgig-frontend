import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import useSWR from 'swr';
import ApplicationThread from '@/components/ApplicationThread';
import MessageComposer from '@/components/MessageComposer';
import { supabase } from '@/utils/supabaseClient';
import { getOrCreateThread } from '@/utils/application';
import Card from '@/components/ui/Card';
import { getString } from '@/utils/getString';

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

  const fetcher = async (_: string, id: string) => {
    const { data, error } = await supabase
      .from('applications')
      .select(
        'id, gig_id, applicant, gigs(title, owner, profiles:owner(full_name)), profiles:applicant(full_name)'
      )
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  };

  const { data, error, isLoading } = useSWR(appId ? ['application-by-id', appId] : null, fetcher);

  useEffect(() => {
    if (!data?.id) return;
    getOrCreateThread(data.id).then((th) => setThreadId(th.id));
  }, [data]);

  if (!appId) return <div data-testid="application-redirecting" />;
  if (isLoading) return <div data-testid="application-loading">Loading…</div>;
  if (error) return <div data-testid="application-error">Failed to load application.</div>;
  if (!data) return <div data-testid="application-empty">Application not found.</div>;

  const counterpart =
    user?.id === data.applicant
      ? data.gigs?.profiles?.full_name ?? data.gigs?.owner
      : data.profiles?.full_name ?? data.applicant;

  return (
    <main data-testid="application-title">
      <div className="mx-auto flex h-[80vh] max-w-3xl flex-col gap-4 p-4">
        <p className="text-sm text-brand-subtle">Applications / View application</p>
        <Card className="p-4 space-y-1">
          <h1>{data.gigs?.title}</h1>
          <p className="text-sm text-brand-subtle">Conversation with {counterpart}</p>
        </Card>
        {threadId && <ApplicationThread threadId={threadId} />}
        {threadId && <MessageComposer threadId={threadId} />}
      </div>
    </main>
  );
}
