import * as React from 'react';
import ProductShell from '../src/components/layout/ProductShell';
import { HeadSEO } from '../src/components/HeadSEO';
import Link from 'next/link';

export default function NotFound() {
  return (
    <ProductShell>
      <HeadSEO title="Page not found • QuickGig" noIndex />
      <h1>Page not found</h1>
      <p>We couldn’t find that page. Try <Link href="/">the homepage</Link> or <Link href="/find-work">find work</Link>.</p>
    </ProductShell>
  );
}
