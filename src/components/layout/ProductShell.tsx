import * as React from 'react';
import { tokens as T } from '../../theme/tokens';
import NavBar from '../product/NavBar';
import Footer from '../Footer';

export default function ProductShell({children}:{children:React.ReactNode}) {
  return (
    <div style={{display:'grid', gap:16, padding:'16px', background:T.colors.surface, minHeight:'100vh'}}>
      <header>
        <div style={{display:'flex', alignItems:'center', gap:12}}>
          <h1 style={{margin:0}}>QuickGig</h1>
        </div>
        <NavBar />
      </header>
      <main style={{display:'grid', gap:16}}>{children}</main>
      <Footer />
    </div>
  );
}
