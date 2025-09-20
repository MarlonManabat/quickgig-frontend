'use client';

import { useFormStatus } from 'react-dom';

import { Button } from '@/components/ui/button';

export function ApplyButton({ jobId }: { jobId: string }) {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      data-testid="apply-button"
      disabled={pending}
      onClick={() => {
        void fetch('/api/track/apply', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jobId }),
          keepalive: true,
        }).catch(() => {
          // ignore
        });
      }}
    >
      {pending ? 'Nag-aapply…' : 'Mag-apply ngayon'}
    </Button>
  );
}
