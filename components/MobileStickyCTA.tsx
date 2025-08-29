'use client';
import { appHref } from '@/lib/appLinks';

export default function MobileStickyCTA() {
  // Visible only on small screens; avoid overlapping with iOS home bar.
  return (
    <div className="sm:hidden fixed inset-x-0 bottom-0 z-40 bg-white/95 backdrop-blur border-t border-gray-200 px-4 pt-3 pb-[calc(12px+env(safe-area-inset-bottom))]">
      <div className="max-w-5xl mx-auto grid grid-cols-2 gap-3">
        <a
          href={appHref('/find')}
          className="inline-flex items-center justify-center rounded-xl border px-4 py-3 text-sm font-medium"
          aria-label="Browse Jobs"
        >
          Browse Jobs
        </a>
        <a
          href={appHref('/post')}
          className="inline-flex items-center justify-center rounded-xl bg-black text-white px-4 py-3 text-sm font-semibold"
          aria-label="Post a Job"
        >
          Post a Job
        </a>
      </div>
    </div>
  );
}
