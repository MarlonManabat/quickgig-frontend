import ThreadClient from '@/features/applications/ThreadClient';
import { notFound } from 'next/navigation';
import { getApplicationById } from '@/lib/applications/server';
import { listMessages } from '@/lib/messages/server';

export const dynamic = 'force-dynamic';

async function loadInitial(id: string) {
  const app = await getApplicationById(id);
  if (!app) notFound();
  const msgs = await listMessages({ applicationId: id, limit: 20 });
  return { app, msgs };
}

export default async function Page({ params }: { params: { id: string } }) {
  const initial = await loadInitial(params.id);
  return <ThreadClient applicationId={params.id} initial={initial} />;
}
