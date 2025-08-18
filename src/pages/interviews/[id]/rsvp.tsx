import { useRouter } from 'next/router';
import Link from 'next/link';

export default function RSVPPage() {
  const { query } = useRouter();
  const result = query.result as string | undefined;
  let message = 'Invalid or expired link.';
  if (result === 'accepted') message = 'You have accepted the interview.';
  else if (result === 'declined') message = 'You have declined the interview.';
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">{message}</h1>
      <Link href="/interviews" className="text-blue-600 underline">
        Back to interviews
      </Link>
    </div>
  );
}
