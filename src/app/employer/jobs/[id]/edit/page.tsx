'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import JobForm, { JobFormData } from '@/components/JobForm';
import { getJob, updateJob } from '@/lib/employerStore';

interface PageProps {
  params: { id: string };
}

export default function EditJobPage({ params }: PageProps) {
  const router = useRouter();
  const [initial, setInitial] = useState<JobFormData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const job = await getJob(params.id);
        if (job) {
          setInitial({
            title: job.title,
            description: job.description,
            location: job.location || '',
            payRange: job.payRange || '',
            tags: job.tags || [],
            published: job.status === 'published',
          });
        }
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.id]);

  const handleSubmit = async (data: JobFormData) => {
    const { published, ...rest } = data;
    await updateJob(params.id, {
      ...rest,
      status: published ? 'published' : 'draft',
    });
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
