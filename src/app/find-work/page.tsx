import Link from 'next/link';
import { fetchJobs } from '@/lib/api';
import { Card, CardContent, CardFooter, CardHeader, CardTag } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import type { Job } from '../../../types/jobs';

export const dynamic = 'force-dynamic';

export default async function FindWorkPage() {
  let jobs: Job[] = [];
  try {
    jobs = await fetchJobs();
  } catch (err) {
    console.error('fetchJobs error:', err);
  }

  if (!jobs.length) {
    return (
      <main className="p-4">
        <Card>
          <p>Walang jobs ngayon—try again</p>
        </Card>
      </main>
    );
  }

  return (
    <main className="p-4 space-y-4">
      {jobs.map((job) => (
        <Card key={job.id} padding="md">
          <CardHeader>{job.title}</CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              {job.company} · {job.location} · {job.rate}
            </p>
            {job.tags && (
              <div className="flex flex-wrap gap-2 mt-2">
                {job.tags.map((tag) => (
                  <CardTag key={tag}>{tag}</CardTag>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter>
            <span className="text-sm text-gray-500">
              Posted {new Date(job.postedAt).toLocaleDateString()}
            </span>
            <Link href={`/jobs/${job.id}`}>
              <Button size="sm">Apply</Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </main>
  );
}
