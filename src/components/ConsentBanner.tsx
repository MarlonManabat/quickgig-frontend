'use client';
import * as React from 'react';
import { t } from '@/lib/t';

export function ConsentBanner() {
  const [show, setShow] = React.useState(false);
  React.useEffect(() => {
    if (process.env.NEXT_PUBLIC_ENABLE_CONSENT === 'true') {
      try {
        const c = localStorage.getItem('consent');
        if (!c) setShow(true);
      } catch {}
    }
  }, []);
  if (!show) return null;
  return (
    <div style={{position:'fixed', bottom:0, left:0, right:0, background:'#222', color:'#fff', padding:'8px 16px', display:'flex', gap:8, justifyContent:'center', zIndex:2000}}>
      <span>{t('consent.ask')}</span>
      <button
        onClick={() => { try{localStorage.setItem('consent','granted');}catch{} setShow(false); }}
        style={{background:'#4caf50', color:'#fff', border:'none', padding:'4px 8px', borderRadius:4, cursor:'pointer'}}
      >{t('consent.yes')}</button>
      <button
        onClick={() => { try{localStorage.setItem('consent','denied');}catch{} setShow(false); }}
        style={{background:'#555', color:'#fff', border:'none', padding:'4px 8px', borderRadius:4, cursor:'pointer'}}
      >{t('consent.no')}</button>
    </div>
  );
}
