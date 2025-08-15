'use client';

import { useEffect, useState } from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { isSaved, toggle, hydrateSavedIds } from '@/lib/savedJobs';

export default function SaveJobButton({ id }: { id: string | number }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    hydrateSavedIds().then(() => setSaved(isSaved(id)));
  }, [id]);

  async function handleClick() {
    const next = await toggle(id);
    setSaved(next);
  }

  return (
    <button
      onClick={handleClick}
      aria-label={saved ? 'Saved' : 'Save job'}
      title={saved ? 'Saved' : 'Save job'}
      className="p-2 rounded hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
      type="button"
    >
      {saved ? (
        <BookmarkCheck className="w-5 h-5 text-green-600" />
      ) : (
        <Bookmark className="w-5 h-5" />
      )}
    </button>
  );
}
