'use client';

import { useEffect, useState } from 'react';
import RejectionEmail from '@/emails/templates/rejection';

interface Applicant { id: string; name: string; }
interface Job { id: string; title: string; }

export default function BulkActions({ applicants, job, auto = false }: { applicants: Applicant[]; job: Job; auto?: boolean }) {
  const [show, setShow] = useState(false);
  const run = () => setShow(true);
  useEffect(() => {
    if (auto) run();
  }, [auto]);
  return (
    <div className="space-y-2" data-testid="bulk-actions">
      {!auto && (
        <button
          onClick={run}
          className="bg-qg-accent text-white px-3 py-1 rounded"
          data-testid="bulk-trigger"
        >
          Send bulk rejection
        </button>
      )}
      {show && (
        <div>
          {applicants.map((a) => (
            <div key={a.id} data-testid="bulk-email-preview" className="border p-2 my-2">
              <RejectionEmail applicantName={a.name} jobTitle={job.title} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
