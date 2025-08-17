import * as React from 'react';
import ProductShell from '@/components/layout/ProductShell';
import { HeadSEO } from '@/components/HeadSEO';
import ThreadItem from '@/product/messages/ThreadItem';
import { requireAuthSSR } from '@/lib/auth';
import { t } from '@/lib/t';
import type { Thread } from '@/types/messages';
import type { Session } from '@/types/user';
import { env } from '@/config/env';
import type { GetServerSidePropsContext } from 'next';

interface Props { threads: Thread[]; session: Session }

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  if (!env.NEXT_PUBLIC_ENABLE_MESSAGES) return { notFound: true };
  return requireAuthSSR([], async ({ req }) => {
    const base = process.env.BASE_URL || `http://${req.headers.host}`;
    try {
      const r = await fetch(`${base}/api/messages`, { headers: { cookie: req.headers.cookie || '' } });
      const j = await r.json().catch(() => ({}));
      return { threads: j.threads || [] };
    } catch {
      return { threads: [] };
    }
  })(ctx);
};

export default function MessagesPage({ threads, session }: Props) {
  return (
    <ProductShell>
      <HeadSEO titleKey="messages.title" noIndex />
      <h1>{t('messages.title')}</h1>
      {threads.length ? (
        threads.map((th) => <ThreadItem key={th.id} thread={th} selfId={session?.id || ''} />)
      ) : (
        <p>{t('messages.empty')}</p>
      )}
    </ProductShell>
  );
}
