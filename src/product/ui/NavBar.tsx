import * as React from 'react';
import Link from 'next/link';
import { tokens as T } from '../../theme/tokens';
export function NavBar(){
  return (
    <nav style={{position:'sticky', top:0, zIndex:20, background:'#fff', borderBottom:`1px solid ${T.colors.border}`}}>
      <div style={{maxWidth:1024, margin:'0 auto', padding:'10px 16px', display:'flex', alignItems:'center', gap:16}}>
        <Link href="/" legacyBehavior>
          <a style={{display:'flex', alignItems:'center', gap:10, textDecoration:'none', color:T.colors.text}}>
            <img alt="QuickGig" src="/legacy/img/logo-main.png" width="28" height="28" />
            <strong>QuickGig</strong>
          </a>
        </Link>
        <div style={{marginLeft:'auto', display:'flex', gap:12}}>
          <Link href="/find-work" legacyBehavior><a style={{textDecoration:'none', color:T.colors.text}}>Find work</a></Link>
          <Link href="/login" legacyBehavior><a style={{textDecoration:'none', color:T.colors.text}}>Log in</a></Link>
          <Link href="/register" legacyBehavior>
            <a style={{color:'#fff', background:T.colors.brand, padding:'8px 12px', borderRadius:12, textDecoration:'none'}}>Sign up</a>
          </Link>
        </div>
      </div>
    </nav>
  );
}
