import { notFound } from 'next/navigation';
import { getSeededJobs } from '@/app/lib/seed';
import JobDetailClient from './JobDetailClient';

export default async function JobDetailPage({ params }: { params: { id: string } }) {
  const jobs = await getSeededJobs();
  const job = jobs.find((j) => j.id === params.id);
  if (!job) {
    notFound();
  }
  return <JobDetailClient job={job} />;
}
