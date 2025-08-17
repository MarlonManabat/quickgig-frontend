import Link from 'next/link';
import { useRouter } from 'next/router';
import { tokens as T } from '../../theme/tokens';
import { t } from '../../lib/t';
import dynamic from 'next/dynamic';
import { legacyFlagFromEnv } from '../../lib/legacyFlag';
import { useSession } from '../../hooks/useSession';
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
  const { pathname, push } = useRouter();
  const is = (p: string) => pathname === p || (p !== '/' && pathname.startsWith(p));
  const legacy = legacyFlagFromEnv();
  const { session, logout } = useSession();
  const onLogout = async () => {
    await logout();
    push('/');
  };
  return (
    <nav style={{display:'flex', gap:8, alignItems:'center', padding:'8px 0'}}>
      <Link href="/" style={linkStyle(is('/'))}>Home</Link>
      <Link href="/find-work" style={linkStyle(is('/find-work'))}>{t('nav_find')}</Link>
      {!legacy && <Link href="/saved" style={linkStyle(is('/saved'))}>{t('nav_saved')}</Link>}
      {!legacy && <Link href="/account" style={linkStyle(is('/account'))}>{t('nav_account')}</Link>}
      {!legacy && <Link href="/employer/jobs" style={linkStyle(is('/employer'))}>{t('employer_title')}</Link>}
      <Link href="/employer/post" style={linkStyle(is('/employer/post'))}>{t('nav_post_job')}</Link>
      <div style={{flex:1}} />
      {session ? (
        <details style={{ position: 'relative' }}>
          <summary style={{ listStyle: 'none', cursor: 'pointer', width: 32, height: 32, borderRadius: '50%', background: T.colors.brand, color: '#fff', display: 'grid', placeItems: 'center' }}>
            {session.name?.charAt(0).toUpperCase()}
          </summary>
          <div style={{ position: 'absolute', right: 0, marginTop: 4, background: '#fff', border: `1px solid ${T.colors.border}`, borderRadius: 8, boxShadow: '0 2px 6px rgba(0,0,0,0.1)', minWidth: 160 }}>
            <Link href="/account" style={{ display: 'block', padding: '6px 12px', textDecoration: 'none', color: T.colors.text }}>{t('navbar_account')}</Link>
            {session.role === 'employer' && (
              <Link href="/employer/jobs" style={{ display: 'block', padding: '6px 12px', textDecoration: 'none', color: T.colors.text }}>{t('my_jobs')}</Link>
            )}
            <hr style={{ margin: '6px 0' }} />
            <button onClick={onLogout} style={{ display: 'block', width: '100%', padding: '6px 12px', background: 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer' }}>
              {t('navbar_logout')}
            </button>
          </div>
        </details>
      ) : (
        <Link href="/login" style={linkStyle(is('/login'))}>{t('navbar_signin')}</Link>
      )}
      <span style={{marginLeft:12}}><LocaleSwitch /></span>
    </nav>
  );
}
