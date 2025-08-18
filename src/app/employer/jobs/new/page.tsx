'use client';

import { useRouter } from 'next/navigation';
import JobForm, { JobFormData } from '@/components/JobForm';
import { api } from '@/lib/apiClient';
import { API } from '@/config/api';
import { env } from '@/config/env';
import { track } from '@/lib/track';

export default function NewJobPage() {
  const router = useRouter();

  const handleSubmit = async (data: JobFormData) => {
    await api.post(API.createJob, data);
    if (env.NEXT_PUBLIC_ENABLE_ANALYTICS) track('job_post');
    router.push('/employer/jobs');
  };

  return (
    <main className="p-4 space-y-4">
      <h1 className="text-xl font-semibold">Post a Job</h1>
      <JobForm onSubmit={handleSubmit} />
    </main>
  );
}
