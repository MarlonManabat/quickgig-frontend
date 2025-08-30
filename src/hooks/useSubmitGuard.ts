import { useState, useCallback } from 'react';

export function useSubmitGuard() {
  const [submitting, setSubmitting] = useState(false);
  const guard = useCallback(async (fn: () => Promise<void>) => {
    if (submitting) return;
    setSubmitting(true);
    try {
      await fn();
    } finally {
      setSubmitting(false);
    }
  }, [submitting]);

  return { submitting, guard };
}

export default useSubmitGuard;
