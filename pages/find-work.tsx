import * as React from 'react';
import type { GetServerSideProps } from 'next';
import ProductShell from '../src/components/layout/ProductShell';
import { HeadSEO } from '../src/components/HeadSEO';
import { JobGrid } from '../src/product/JobCard';
import { searchJobs, type JobSummary } from '../src/lib/api';
import FilterBar from '../src/product/ui/FilterBar';
import Pagination from '../src/product/ui/Pagination';
import { t } from '../src/lib/t';

type Props = {
  legacyHtml?: string;
  items?: JobSummary[];
  total?: number;
  q?: string; loc?: string; cat?: string; sort?: string; page?: number; size?: number;
};
export default function FindWork({ legacyHtml, items=[], total, q, loc, cat, sort='relevant', page=1, size=12 }: Props) {
  if (legacyHtml) return <div dangerouslySetInnerHTML={{ __html: legacyHtml }} />;
  const qs = new URLSearchParams(); if (q) qs.set('q', q); if (loc) qs.set('loc', loc); if (cat) qs.set('cat', cat); if (sort && sort!=='relevant') qs.set('sort', sort);
  const hasNext = total ? (page*size < total) : (items.length===size);
  return (
    <ProductShell>
      <HeadSEO titleKey="search_title" descKey="search_title" />
      <h1>{t('search_title')}</h1>
      <FilterBar q={q} loc={loc} cat={cat} sort={sort} />
      {items.length ? (
        <>
          <p style={{margin:'8px 0'}}>{t('search_results_count', { total: total ?? items.length })}</p>
          <JobGrid jobs={items} />
          <Pagination page={page} hasNext={hasNext} hrefBase="/find-work" qs={qs} />
        </>
      ) : (
        <div style={{padding:'24px 0'}}>
          <p>{t('search_empty')}</p>
        </div>
      )}
    </ProductShell>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ query }) => {
  try {
    const q = typeof query.q==='string'? query.q : '';
    const loc = typeof query.loc==='string'? query.loc : '';
    const cat = typeof query.cat==='string'? query.cat : '';
    const sort = (typeof query.sort==='string' && ['relevant','new','pay'].includes(query.sort)) ? query.sort as 'relevant' | 'new' | 'pay' : 'relevant';
    const page = Number(query.page||1) || 1;
    const size = 12;
    const res = await searchJobs({ q, loc, cat, sort, page, size });
    return { props: { items: res.items, total: res.total, q, loc, cat, sort, page, size } };
  } catch {
    return { props: { items: [] } };
  }
};
