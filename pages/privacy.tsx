import ProductShell from '../src/components/layout/ProductShell';
import { HeadSEO } from '../src/components/HeadSEO';
import { t } from '../src/lib/t';

export default function Privacy() {
  return (
    <ProductShell>
      <HeadSEO titleKey="privacy.title" noIndex />
      <h1>{t('privacy.title')}</h1>
      <p>Placeholder privacy policy.</p>
    </ProductShell>
  );
}
