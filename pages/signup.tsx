import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function SignupRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/start');
  }, [router]);
  return <p className="p-6">Redirecting...</p>;
}
