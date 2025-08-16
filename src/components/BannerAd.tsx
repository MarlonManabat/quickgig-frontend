'use client';

import { useState } from 'react';
import { env } from '@/config/env';

function sanitize(html: string) {
  return html
    .replace(/<script.*?>.*?<\/script>/gi, '')
    .replace(/on[a-z]+="[^"]*"/gi, '');
}

export default function BannerAd() {
  const [dismissed, setDismissed] = useState(false);
  if (!env.NEXT_PUBLIC_BANNER_HTML || dismissed) return null;
  const safe = sanitize(env.NEXT_PUBLIC_BANNER_HTML);
  return (
    <div className="banner-ad">
      {/* eslint-disable-next-line react/no-danger */}
      <div dangerouslySetInnerHTML={{ __html: safe }} />
      <button aria-label="Dismiss banner" onClick={() => setDismissed(true)}>
        ×
      </button>
    </div>
  );
}
