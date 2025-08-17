import * as React from 'react';
import Link from 'next/link';
import { tokens as T } from '../../theme/tokens';
export function NavBar(){
  return (
    <nav style={{position:'sticky', top:0, zIndex:20, background:'#fff', borderBottom:`1px solid ${T.colors.border}`}}>
      <div style={{maxWidth:1024, margin:'0 auto', padding:'10px 16px', display:'flex', alignItems:'center', gap:16}}>
        <Link href="/" style={{display:'flex', alignItems:'center', gap:10, textDecoration:'none', color:T.colors.text}}>
          <img alt="QuickGig" src="/legacy/img/logo-main.png" width="28" height="28" />
          <strong>QuickGig</strong>
        </Link>
        <div style={{marginLeft:'auto', display:'flex', gap:12}}>
          <Link href="/find-work">Find work</Link>
          <Link href="/login">Log in</Link>
          <Link href="/register" style={{color:'#fff', background:T.colors.brand, padding:'8px 12px', borderRadius:12, textDecoration:'none'}}>Sign up</Link>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
