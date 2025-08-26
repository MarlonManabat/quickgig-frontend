import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import GigForm from "@/components/gigs/GigForm";
import { getGig, updateGig } from "@/lib/gigs/api";

export default function EditGig() {
  const router = useRouter();
  const id = Number(
    Array.isArray(router.query.id) ? router.query.id[0] : router.query.id,
  );
  const [gig, setGig] = useState<any>(null);
  useEffect(() => {
    if (!id) return;
    getGig(id).then(({ data }) => setGig(data));
  }, [id]);
  if (!gig) return null;
  return (
    <main className="p-4">
      <GigForm
        initial={gig}
        onSubmit={async (g) => {
          await updateGig(id, g);
          router.push(`/gigs/${id}`);
        }}
      />
    </main>
  );
}
