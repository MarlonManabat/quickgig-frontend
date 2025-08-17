import * as React from 'react';
import ProductShell from '../src/components/layout/ProductShell';
import { HeadSEO } from '../src/components/HeadSEO';
import Link from 'next/link';

export default function AppError() {
  return (
    <ProductShell>
      <HeadSEO title="Something went wrong • QuickGig" noIndex />
      <h1>Something went wrong</h1>
      <p>Please retry, or go back to <Link href="/">the homepage</Link>.</p>
    </ProductShell>
  );
}
