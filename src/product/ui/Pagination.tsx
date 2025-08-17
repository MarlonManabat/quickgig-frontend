import * as React from 'react';
import Link from 'next/link';

export default function Pagination({ page=1, hasNext=false, hrefBase, qs }:{ page?:number; hasNext?:boolean; hrefBase:string; qs:URLSearchParams }) {
  const prevQs = new URLSearchParams(qs);
  if (page > 2) prevQs.set('page', String(page - 1));
  else prevQs.delete('page');
  const nextQs = new URLSearchParams(qs);
  nextQs.set('page', String(page + 1));
  const prevHref = `${hrefBase}${prevQs.toString() ? `?${prevQs}` : ''}`;
  const nextHref = `${hrefBase}?${nextQs.toString()}`;
  return (
    <nav style={{display:'flex', gap:12, marginTop:16}}>
      <Link aria-disabled={page<=1} href={prevHref} onClick={e=>{if(page<=1) e.preventDefault();}}>← Prev</Link>
      <span>Page {page}</span>
      <Link aria-disabled={!hasNext} href={nextHref} onClick={e=>{if(!hasNext) e.preventDefault();}}>Next →</Link>
    </nav>
  );
}
