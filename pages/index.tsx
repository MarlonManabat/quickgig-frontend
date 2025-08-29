import { useEffect, useState } from "react";
import Card from "@/components/ui/Card";
import { H1, P } from "@/components/ui/Text";
import { getProfile } from "@/utils/session";
import { copy } from "@/copy";
import { resolveAppOrigin } from "@/lib/appOrigin";

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
        <a
          href={`${resolveAppOrigin()}/search`}
          className="btn-primary"
          data-testid="cta-findwork"
        >
          {copy.nav.findWork}
        </a>
        {canPost && (
          <a
            href={`${resolveAppOrigin()}/post`}
            className="btn-secondary"
            data-testid="cta-postjob"
          >
            {copy.nav.postJob}
          </a>
        )}
      </div>
    </Card>
  );
}

export async function getStaticProps() {
  return { props: {}, revalidate: 60 };
}
