'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createJobDraft } from '@/lib/employerStore';

export default function NewJobPage() {
  const router = useRouter();
  useEffect(() => {
    createJobDraft()
      .then((job) => {
        router.replace(`/employer/jobs/${job.id}/edit`);
      })
      .catch(() => {
        router.replace('/employer/jobs');
      });
  }, [router]);
  return <main className="p-4">Creating draft...</main>;
}
