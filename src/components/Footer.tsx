import * as React from 'react';
import { tokens as T } from '../theme/tokens';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer style={{
      marginTop: 32,
      padding: '24px 0',
      borderTop: `1px solid ${T.colors.border}`,
      color: T.colors.subtle
    }}>
      <div style={{display:'flex', gap:12, flexWrap:'wrap', alignItems:'center', justifyContent:'space-between'}}>
        <div>© {new Date().getFullYear()} QuickGig.ph</div>
        <nav style={{display:'flex', gap:12}}>
          <Link href="/find-work">Find work</Link>
          <Link href="/login">Sign in</Link>
          <Link href="/__health">Health</Link>
        </nav>
      </div>
    </footer>
  );
}
