import Link from 'next/link';

export default function EmployerPage() {
  return (
    <main className="p-4 space-y-4">
      <h1 className="text-xl font-semibold">Employer Dashboard</h1>
      <ul className="list-disc pl-5 space-y-1">
        <li>
          <Link href="/employer/jobs" className="text-qg-accent">
            My Jobs
          </Link>
        </li>
        <li>
          <Link href="/employer/jobs/new" className="text-qg-accent">
            Post a Job
          </Link>
        </li>
      </ul>
    </main>
  );
}
