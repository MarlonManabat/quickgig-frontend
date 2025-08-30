import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { getGig, applyToGig, toggleSave } from "@/lib/gigs/api";

export default function GigDetail() {
  const router = useRouter();
  const id = Number(
    Array.isArray(router.query.id) ? router.query.id[0] : router.query.id,
  );
  const [gig, setGig] = useState<any>(null);
  const [saved, setSaved] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!id) return;
    getGig(id).then(({ data }) => setGig(data));
  }, [id]);

  const saveToggle = async () => {
    const next = !saved;
    setSaved(next);
    try {
      await toggleSave(id, next);
    } catch {
      setSaved(!next);
    }
  };

  const apply = async () => {
    await applyToGig(id, message);
    alert("Application submitted");
  };

  if (!gig) return null;

  return (
    <main className="p-4 space-y-4">
      <h1 className="text-2xl font-semibold">{gig.title}</h1>
      <p>{gig.description}</p>
      <button onClick={saveToggle} className="text-blue-600 text-sm">
        {saved ? "Unsave" : "Save"}
      </button>
      <div className="space-y-2">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border p-2"
          placeholder="Message"
        />
        <button
          onClick={apply}
          className="px-4 py-2 bg-black text-white rounded"
        >
          Apply
        </button>
      </div>
    </main>
  );
}
