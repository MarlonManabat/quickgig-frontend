import * as React from 'react';
import { useRouter } from 'next/router';
import { t } from '../../lib/t';

type Props = {
  q?: string; loc?: string; cat?: string; sort?: string;
};
const cats = ['', 'IT', 'Admin', 'Sales', 'Design', 'Marketing'];
export default function FilterBar({ q='', loc='', cat='', sort='relevant' }: Props) {
  const r = useRouter();
  const [state, set] = React.useState({ q, loc, cat, sort });
  function push(next: typeof state & { page?: number }) {
    const qs = new URLSearchParams();
    if (next.q) qs.set('q', next.q);
    if (next.loc) qs.set('loc', next.loc);
    if (next.cat) qs.set('cat', next.cat);
    if (next.sort && next.sort !== 'relevant') qs.set('sort', next.sort);
    if (next.page && next.page > 1) qs.set('page', String(next.page));
    r.push(`/find-work${qs.toString() ? `?${qs}` : ''}`);
  }
  return (
    <form onSubmit={(e)=>{e.preventDefault(); push(state);}} style={{display:'grid', gap:12, gridTemplateColumns:'1fr 1fr 1fr 1fr auto'}}>
      <input placeholder={t('search_placeholder')} value={state.q} onChange={e=>set(s=>({...s,q:e.target.value}))}/>
      <input placeholder="Location" value={state.loc} onChange={e=>set(s=>({...s,loc:e.target.value}))}/>
      <select value={state.cat} onChange={e=>set(s=>({...s,cat:e.target.value}))}>
        {cats.map(c=><option key={c} value={c}>{c||'All categories'}</option>)}
      </select>
      <select value={state.sort} onChange={e=>{const sort=e.target.value; set(s=>({...s,sort}));}}>
        <option value="relevant">Relevance</option>
        <option value="new">Newest</option>
        <option value="pay">Pay (high→low)</option>
      </select>
      <button type="submit">Search</button>
    </form>
  );
}
