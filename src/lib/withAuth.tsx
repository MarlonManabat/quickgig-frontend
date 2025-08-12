'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthed } from './auth';

export default function withAuth<P>(Comp: React.ComponentType<P>) {
  return function Guarded(props: P) {
    const r = useRouter();
    useEffect(() => {
      if (!isAuthed()) r.replace('/login');
    }, []);
    return <Comp {...props} />;
  };
}
