import { useEffect, useState } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import { getProfile } from '@/utils/session';

export default function Home() {
  const [canPost, setCanPost] = useState(false);

  useEffect(() => {
    getProfile().then((p) => setCanPost(!!p?.can_post_job));
  }, []);

  return (
    <Card className="p-6 text-center space-y-4">
      <h1>QuickGig.ph</h1>
      <p>Connect with opportunities — find work or hire talent quickly.</p>
      <div className="flex justify-center gap-4">
        <Link href="/gigs" className="btn-primary">Find Work</Link>
        {canPost && (
          <Link href="/gigs/new" className="btn-secondary">Post a Job</Link>
        )}
      </div>
    </Card>
  );
}
