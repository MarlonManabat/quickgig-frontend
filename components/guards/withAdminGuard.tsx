import { useRouter } from 'next/router';
import { useEffect } from 'react';

// Replace this with your real auth hook if available
function useRole(): 'admin' | 'user' | undefined {
  // Prefer app auth state; fall back to localStorage for E2E stubs
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
      if (role && role !== 'admin') {
        router.replace('/');
      }
    }, [role, router]);

    // Render for admin; non-admin will be redirected quickly
    return <Component {...(props as any)} />;
  };
}
