'use client';
import * as React from 'react';
import { getVariantRuntime, setVariantRuntime } from '../lib/t';
export default function LocaleSwitch() {
  const [v, setV] = React.useState<"english"|"taglish">(getVariantRuntime());
  function set(lang: "english"|"taglish") {
    setVariantRuntime(lang);
    setV(lang);
    location.reload();
  }
  return (
    <div style={{display:'inline-flex', gap:8, alignItems:'center'}}>
      <button aria-pressed={v==='english'} onClick={()=>set('english')}>EN</button>
      <button aria-pressed={v==='taglish'} onClick={()=>set('taglish')}>TL</button>
    </div>
  );
}
