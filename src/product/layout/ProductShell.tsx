import * as React from 'react';
import { NavBar } from '../ui/NavBar';
import { Footer } from '../ui/Footer';
import { Banner } from '../ui/Banner';

export default function ProductShell({children}:{children:React.ReactNode}){
  const bannerHtml = (process.env.NEXT_PUBLIC_BANNER_HTML ?? '').trim() || undefined;
  return (
    <>
      <Banner html={bannerHtml}/>
      <NavBar/>
      <main style={{maxWidth:1024, margin:'0 auto', padding:'24px 16px'}}>{children}</main>
      <Footer/>
    </>
  );
}
