import Link from 'next/link';
import { useRouter } from 'next/router';
import { tokens as T } from '../../theme/tokens';

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
  return (
    <nav style={{display:'flex', gap:8, alignItems:'center', padding:'8px 0'}}>
      <Link href="/" style={linkStyle(is('/'))}>Home</Link>
      <Link href="/find-work" style={linkStyle(is('/find-work'))}>Find Work</Link>
      <div style={{flex:1}} />
      <Link href="/login" style={linkStyle(is('/login'))}>Sign in</Link>
    </nav>
  );
}
