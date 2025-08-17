import * as React from 'react';
import ProductShell from '../src/components/layout/ProductShell';
import { HeadSEO } from '../src/components/HeadSEO';
import Link from 'next/link';
import { t } from '../src/lib/t';

export default function AppError() {
  return (
    <ProductShell>
      <HeadSEO titleKey="err500_title" descKey="err500_body" noIndex />
      <h1>{t('err500_title')}</h1>
      <p>
        {t('err500_body')}{' '}
        <Link href="/">Home</Link>
      </p>
    </ProductShell>
  );
}
