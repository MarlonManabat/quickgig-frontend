import { useEffect, useState } from "react";
import { listGigs } from "@/lib/gigs/api";
import GigCard from "@/components/gigs/GigCard";

export default function GigsIndex() {
  const [gigs, setGigs] = useState<any[]>([]);
  useEffect(() => {
    listGigs().then(({ data }) => setGigs(data || []));
  }, []);
  return (
    <main className="p-4 space-y-4">
      {gigs.map((g) => (
        <GigCard key={g.id} gig={g} />
      ))}
    </main>
  );
}
