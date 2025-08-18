import * as React from 'react';
import { tokens as T } from '../../theme/tokens';
import NavBar from '../product/NavBar';
import Footer from '../Footer';
import { t } from '@/lib/t';

export default function ProductShell({children}:{children:React.ReactNode}) {
  return (
    <div style={{display:'grid', gap:16, padding:'16px', background:T.colors.surface, minHeight:'100vh'}}>
      <a href="#main" style={{position:'absolute', left:-9999, top:-9999, padding:8, background:'#fff', zIndex:1000}} onFocus={(e)=>{e.currentTarget.style.left='8px'; e.currentTarget.style.top='8px';}} onBlur={(e)=>{e.currentTarget.style.left='-9999px'; e.currentTarget.style.top='-9999px';}}>{t('skip_to_content')}</a>
      <header>
        <div style={{display:'flex', alignItems:'center', gap:12}}>
          <h1 style={{margin:0}}>QuickGig</h1>
        </div>
        <NavBar />
      </header>
      <main id="main" style={{display:'grid', gap:16}}>{children}</main>
      <Footer />
    </div>
  );
}
