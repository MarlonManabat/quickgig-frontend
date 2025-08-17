import Link from 'next/link';
import { useRouter } from 'next/router';
import { tokens as T } from '../../theme/tokens';
import { t } from '../../lib/t';
import dynamic from 'next/dynamic';
import { legacyFlagFromEnv } from '../../lib/legacyFlag';
const LocaleSwitch = dynamic(() => import('../LocaleSwitch'), { ssr: false });

const linkStyle = (active: boolean): React.CSSProperties => ({
  padding: '10px 12px',
  borderRadius: 8,
  textDecoration: 'none',
  color: active ? '#fff' : T.colors.text,
  background: active ? T.colors.brand : 'transparent',
  fontWeight: 600,
});

export default function NavBar() {
  const { pathname } = useRouter();
  const is = (p: string) => pathname === p || (p !== '/' && pathname.startsWith(p));
  const legacy = legacyFlagFromEnv();
  return (
    <nav style={{display:'flex', gap:8, alignItems:'center', padding:'8px 0'}}>
      <Link href="/" style={linkStyle(is('/'))}>Home</Link>
      <Link href="/find-work" style={linkStyle(is('/find-work'))}>{t('nav_find')}</Link>
      {!legacy && <Link href="/saved" style={linkStyle(is('/saved'))}>{t('nav_saved')}</Link>}
      {!legacy && <Link href="/account" style={linkStyle(is('/account'))}>{t('nav_account')}</Link>}
      {!legacy && <Link href="/employer/jobs" style={linkStyle(is('/employer'))}>{t('employer_title')}</Link>}
      <Link href="/employer/post" style={linkStyle(is('/employer/post'))}>{t('nav_post_job')}</Link>
      <div style={{flex:1}} />
      <Link href="/login" style={linkStyle(is('/login'))}>{t('nav_signin')}</Link>
      <span style={{marginLeft:12}}><LocaleSwitch /></span>
    </nav>
  );
}
