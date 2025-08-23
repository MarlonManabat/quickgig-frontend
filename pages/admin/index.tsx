'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { isAdmin, getAdminStats } from '@/utils/admin';
import { copy } from '@/copy';

export default function AdminHome() {
  const router = useRouter();
  const [allowed, setAllowed] = useState<boolean|null>(null);
  const [stats, setStats] = useState<any>({});

  useEffect(() => {
    (async () => {
      const ok = await isAdmin();
      setAllowed(ok);
      if (ok) setStats(await getAdminStats());
      else router.replace('/');
    })();
  }, [router]);

  if (allowed === null) return null; // loading

  const Card = ({ title, total, last7, href, testId }:{
    title:string; total:any; last7:any; href:string; testId:string;
  }) => (
    <a href={href} data-testid={testId}
       className="rounded-2xl border p-5 shadow-sm hover:shadow-md transition bg-white">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-3xl font-semibold my-2">{total ?? '–'}</div>
      <div className="text-xs text-gray-500">{copy.admin.last7d}: {last7 ?? '–'}</div>
      <div className="mt-3 text-blue-600 underline">{copy.admin.view}</div>
    </a>
  );

  return (
    <main className="w-full px-4 py-8">
      <div className="mx-auto w-full max-w-6xl">
        <h1 className="text-2xl md:text-3xl font-semibold mb-6" data-testid="admin-home">
          {copy.admin.title}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <Card title={copy.admin.orders}       total={stats?.orders?.total}       last7={stats?.orders?.last7}       href="/admin/orders"       testId="admin-card-orders" />
          <Card title={copy.admin.users}        total={stats?.profiles?.total}     last7={stats?.profiles?.last7}     href="/admin/users"        testId="admin-card-users" />
          <Card title={copy.admin.gigs}         total={stats?.gigs?.total}         last7={stats?.gigs?.last7}         href="/admin/gigs"         testId="admin-card-gigs" />
          <Card title={copy.admin.applications} total={stats?.applications?.total} last7={stats?.applications?.last7} href="/admin/applications" testId="admin-card-apps" />
        </div>
        {/* Optional: recent activity table placeholder */}
      </div>
    </main>
  );
}
