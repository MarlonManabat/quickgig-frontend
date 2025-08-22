import { useRouter } from 'next/router';
import IdGate from '@/components/IdGate';

export default function MessageThreadPage() {
  const router = useRouter();
  const { id } = router.query;
  return (
    <IdGate id={id}>
      <div className="p-4">
        <textarea data-testid="chat-input" className="w-full border border-brand-border p-2" />
      </div>
    </IdGate>
  );
}
