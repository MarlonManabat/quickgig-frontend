'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import JobForm, { JobFormData } from '@/components/JobForm';
import { api } from '@/lib/apiClient';
import { API } from '@/config/api';

interface PageProps {
  params: { id: string };
}

interface JobDetail extends Partial<JobFormData> {
  published?: boolean;
}

export default function EditJobPage({ params }: PageProps) {
  const router = useRouter();
  const [initial, setInitial] = useState<JobFormData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await api.get<JobDetail>(API.jobById(params.id));
        setInitial({
          title: res.data.title || '',
          description: res.data.description || '',
          location: res.data.location || '',
          payRange: res.data.payRange || '',
          tags: res.data.tags || [],
          published: res.data.published ?? false,
        });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.id]);

  const handleSubmit = async (data: JobFormData) => {
    await api.patch(API.updateJob(params.id), data);
    router.push('/employer/jobs');
  };

  if (loading || !initial) return <main className="p-4">Loading...</main>;

  return (
    <main className="p-4 space-y-4">
      <h1 className="text-xl font-semibold">Edit Job</h1>
      <JobForm initial={initial} onSubmit={handleSubmit} />
    </main>
  );
}
