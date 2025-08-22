import Link from 'next/link';

export default function MessagesList() {
  // placeholder list; real implementation would fetch threads
  return (
    <div className="p-4">
      <p>No messages.</p>
      {/* threads would have <Link data-testid="thread-row" href={`/messages/${id}`}> */}
    </div>
  );
}
