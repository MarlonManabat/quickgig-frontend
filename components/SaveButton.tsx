import { useEffect, useState } from "react"
import { isSaved, toggleSave } from "@/lib/saved"

export default function SaveButton({ id, className = "", withText = false }: { id: number; className?: string; withText?: boolean }) {
  const [saved, setSaved] = useState(false)
  useEffect(() => {
    isSaved(id).then(setSaved)
  }, [id])
  const onClick = async () => {
    const s = await toggleSave(id)
    setSaved(s)
  }
  return (
    <button onClick={onClick} className={className} aria-label={saved ? "Unsave gig" : "Save gig"}>
      {saved ? "⭐" : "☆"}
      {withText && <span className="ml-1">{saved ? "Unsave" : "Save"}</span>}
    </button>
  )
}
