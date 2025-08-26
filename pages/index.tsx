import { useEffect, useState } from "react";
import Link from "next/link";
import Card from "@/components/ui/Card";
import { H1, P } from "@/components/ui/Text";
import { getProfile } from "@/utils/session";
import { copy } from "@/copy";

export default function Home() {
  const [canPost, setCanPost] = useState(false);

  useEffect(() => {
    getProfile().then((p) => setCanPost(!!p?.can_post_job));
  }, []);

  return (
    <Card className="p-6 text-center space-y-4">
      <H1>QuickGig.ph</H1>
      <P>Connect with opportunities — find work or hire talent quickly.</P>
      <div className="flex justify-center gap-4">
        <Link
          href="/search?intent=worker"
          className="btn-primary"
          data-testid="cta-findwork"
        >
          {copy.nav.findWork}
        </Link>
        {canPost && (
          <Link
            href="/post?intent=employer"
            className="btn-secondary"
            data-testid="cta-postjob"
          >
            {copy.nav.postJob}
          </Link>
        )}
      </div>
    </Card>
  );
}

export async function getStaticProps() {
  return { props: {}, revalidate: 60 };
}
