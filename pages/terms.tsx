import ProductShell from '../src/components/layout/ProductShell';
import { HeadSEO } from '../src/components/HeadSEO';
import { t } from '../src/lib/t';

export default function Terms() {
  return (
    <ProductShell>
      <HeadSEO titleKey="terms.title" noIndex />
      <h1>{t('terms.title')}</h1>
      <p>Placeholder terms and conditions.</p>
    </ProductShell>
  );
}
