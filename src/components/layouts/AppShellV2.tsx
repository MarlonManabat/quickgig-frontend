import type { ReactNode } from 'react';
import Link from 'next/link';
import { t } from '@/lib/i18n';
import SettingsBanner from '@/components/SettingsBanner';

export default function AppShellV2({ children }: { children: ReactNode }) {
  return (
    <>
      <nav data-testid="navbar" className="bg-bg text-fg shadow-qg-lg">
        <div className="qg-container flex items-center justify-between py-4">
          <Link href="/" className="font-heading text-2xl font-bold">
            QuickGig<span className="text-accent">.ph</span>
          </Link>
          <div className="space-x-4 text-sm font-medium">
            <Link href="/" className="hover:text-accent">
              {t('navbar.home')}
            </Link>
            <Link href="/find-work" className="hover:text-accent">
              {t('navbar.jobs')}
            </Link>
            <Link href="/login" className="hover:text-accent">
              {t('navbar.login')}
            </Link>
          </div>
        </div>
      </nav>
      <SettingsBanner />
      <main>{children}</main>
      <footer
        data-testid="footer"
        className="bg-bg text-fg border-t border-muted mt-10"
      >
        <div className="qg-container py-8 flex flex-col sm:flex-row justify-between text-sm">
          <p className="mb-4 sm:mb-0">© 2024 QuickGig.ph</p>
          <div className="space-x-4">
            <Link href="/about" className="hover:text-accent">
              {t('footer.about')}
            </Link>
            <Link href="/privacy" className="hover:text-accent">
              {t('footer.privacy')}
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
