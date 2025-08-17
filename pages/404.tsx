import * as React from 'react';
import ProductShell from '../src/components/layout/ProductShell';
import { HeadSEO } from '../src/components/HeadSEO';
import Link from 'next/link';
import { t } from '../src/lib/t';

export default function NotFound() {
  return (
    <ProductShell>
      <HeadSEO titleKey="err404_title" descKey="err404_body" noIndex />
      <h1>{t('err404_title')}</h1>
      <p>
        {t('err404_body')}{' '}
        <Link href="/">Home</Link>
      </p>
    </ProductShell>
  );
}
