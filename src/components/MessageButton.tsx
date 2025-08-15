'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Button from './ui/Button';

export default function MessageButton({ appId }: { appId: string | number }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const start = async () => {
    setLoading(true);
    const res = await fetch('/api/msg/start', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ appId }),
    })
      .then((r) => r.json())
      .catch(() => ({ ok: false }));
    setLoading(false);
    if (res?.id || res?.conversationId) {
      router.push(`/messages/${res.id || res.conversationId}`);
    }
  };

  return (
    <Button onClick={start} disabled={loading}>
      Message
    </Button>
  );
}
