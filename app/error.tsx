'use client';

import { useEffect } from 'react';

import { Button } from '@/components/ui/button';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-2xl font-semibold">May nangyaring mali.</h1>
      <p className="max-w-md text-muted-foreground">Pasensya na! I-refresh lang ang page o bumalik sa Browse Jobs.</p>
      <div className="flex gap-3">
        <Button onClick={() => reset()}>Subukang muli</Button>
        <Button variant="secondary" asChild>
          <a href="/browse-jobs">Bumalik sa Browse Jobs</a>
        </Button>
      </div>
    </div>
  );
}
