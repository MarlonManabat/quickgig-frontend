import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { getStubRole } from '@/lib/testAuth';

// Replace this with your real auth hook if available
function useRole(): 'admin' | 'user' | undefined {
  const stub = getStubRole();
  if (stub === 'admin') return 'admin';
  if (typeof window !== 'undefined') {
    const r = window.localStorage.getItem('role');
    if (r === 'admin' || r === 'user') return r;
  }
  return undefined;
}

export function withAdminGuard<P>(Component: React.ComponentType<P>) {
  return function Guarded(props: P): JSX.Element {
    const router = useRouter();
    const role = useRole();

    useEffect(() => {
      // Redirect non-admins away from /admin
      if (role !== 'admin') {
        router.replace('/');
      }
    }, [role, router]);

    // Render for admin; non-admin will be redirected quickly
    return <Component {...(props as any)} />;
  };
}
