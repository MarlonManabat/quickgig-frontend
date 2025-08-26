import { useEffect, useState } from "react";
import { isSaved, toggleSave } from "@/lib/saved";

export default function SaveButton({
  gigId,
  className = "",
  withText = false,
}: {
  gigId: number;
  className?: string;
  withText?: boolean;
}) {
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    isSaved(gigId).then(setSaved);
  }, [gigId]);
  const onClick = async () => {
    const s = await toggleSave(gigId);
    setSaved(s);
  };
  return (
    <button
      onClick={onClick}
      className={className}
      aria-label={saved ? "Unsave gig" : "Save gig"}
    >
      {saved ? "⭐" : "☆"}
      {withText && <span className="ml-1">{saved ? "Unsave" : "Save"}</span>}
    </button>
  );
}
