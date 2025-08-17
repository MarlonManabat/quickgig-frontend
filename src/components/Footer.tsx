import * as React from 'react';
import { tokens as T } from '../theme/tokens';
import Link from 'next/link';
import { t } from '../lib/t';

export default function Footer() {
  return (
    <footer style={{
      marginTop: 32,
      padding: '24px 0',
      borderTop: `1px solid ${T.colors.border}`,
      color: T.colors.subtle
    }}>
      <div style={{display:'flex', gap:12, flexWrap:'wrap', alignItems:'center', justifyContent:'space-between'}}>
        <div>{t('footer_copyright', { year: new Date().getFullYear() })}</div>
        <nav style={{display:'flex', gap:12}}>
          <Link href="/about">{t('footer_about')}</Link>
          <Link href="/terms">{t('footer_terms')}</Link>
          <Link href="/privacy">{t('footer_privacy')}</Link>
        </nav>
      </div>
    </footer>
  );
}
