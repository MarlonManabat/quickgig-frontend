import { useState, ChangeEvent, FormEvent } from "react";
import { getUserId } from "../utils/session";

interface GigFormValues {
  title?: string;
  description?: string;
  budget?: number | null;
  city?: string;
  image_url?: string | null;
  owner?: string;
}

interface GigFormProps {
  initialGig: GigFormValues;
  onSubmit: (gig: GigFormValues) => Promise<void> | void;
  onFileUpload?: (file: File) => Promise<string | null>;
  submitLabel?: string;
}

export default function GigForm({ initialGig, onSubmit, onFileUpload, submitLabel = "Save" }: GigFormProps) {
  const [gig, setGig] = useState<GigFormValues>(initialGig ?? {});
  const [message, setMessage] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setGig(prev => ({
      ...prev,
      [name]: name === "budget" ? (value === "" ? null : Number(value)) : value,
    }));
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!onFileUpload) return;
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      const url = await onFileUpload(f);
      setGig(prev => ({ ...prev, image_url: url ?? null }));
    } catch (err: any) {
      setMessage(err.message ?? "File upload failed");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(null);
    const uid = await getUserId();
    if (!uid) {
      setMessage("Please sign in");
      return;
    }
    try {
      await onSubmit({ ...gig, owner: uid });
    } catch (err: any) {
      if (err?.status === 401 || err?.status === 403) {
        setMessage("You are not allowed to edit this gig.");
      } else {
        setMessage(err.message ?? "An error occurred");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {message && <p className="text-red-500">{message}</p>}
      <div>
        <input
          className="w-full rounded border border-slate-700 px-3 py-2"
          placeholder="Title"
          name="title"
          value={gig.title ?? ""}
          onChange={handleChange}
        />
      </div>
      <div>
        <textarea
          className="w-full rounded border border-slate-700 px-3 py-2"
          placeholder="Description"
          rows={5}
          name="description"
          value={gig.description ?? ""}
          onChange={handleChange}
        />
      </div>
      <div>
        <input
          className="w-full rounded border border-slate-700 px-3 py-2"
          placeholder="Budget"
          name="budget"
          type="number"
          value={gig.budget ?? ""}
          onChange={handleChange}
        />
      </div>
      <div>
        <input
          className="w-full rounded border border-slate-700 px-3 py-2"
          placeholder="City"
          name="city"
          value={gig.city ?? ""}
          onChange={handleChange}
        />
      </div>
      {onFileUpload && (
        <div>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {gig.image_url && <img src={gig.image_url ?? ''} alt="Gig" className="mt-2 max-w-xs" />}
        </div>
      )}
      <button
        type="submit"
        className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        {submitLabel}
      </button>
    </form>
  );
}
