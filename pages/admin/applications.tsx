'use client';
export default function AdminApps() {
  return <h1 data-testid="admin-apps">Admin Applications</h1>;
}

export { forceSSR as getServerSideProps } from '@/lib/ssr'
