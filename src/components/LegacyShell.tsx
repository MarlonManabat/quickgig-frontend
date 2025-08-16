'use client';

import { ReactNode, useEffect } from 'react';
import LegacyHeader from './LegacyHeader';
import LegacyFooter from './LegacyFooter';
import BannerAd from './BannerAd';

export default function LegacyShell({ children }: { children: ReactNode }) {
  useEffect(() => {
    console.info('legacy-ui: enabled');
  }, []);
  return (
    <div>
      <LegacyHeader />
      <BannerAd />
      <main className="legacy-main">{children}</main>
      <LegacyFooter />
    </div>
  );
}
