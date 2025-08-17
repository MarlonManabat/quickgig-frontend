import * as React from 'react';
import path from 'path';
import fs from 'fs';
import { useRouter } from 'next/router';
import ProductShell from '../src/components/layout/ProductShell';
import { Card } from '../src/product/ui/Card';
import { Input } from '../src/product/ui/Input';
import { Button } from '../src/product/ui/Button';
import { legacyFlagFromEnv, legacyFlagFromQuery } from '../src/lib/legacyFlag';
import { t } from '../src/lib/t';
import { toast } from '../src/lib/toast';
import { useSession } from '../src/hooks/useSession';
import { HeadSEO } from '../src/components/HeadSEO';

type Props = { legacyHtml?: string };

export async function getStaticProps() {
  try {
    const pub = path.join(process.cwd(), 'public', 'legacy');
    const frag = fs.readFileSync(path.join(pub, 'login.fragment.html'), 'utf8');
    const legacyHtml = `<link rel="preload" as="font" href="/legacy/fonts/LegacySans.woff2" type="font/woff2" crossOrigin /><link rel="stylesheet" href="/legacy/styles.css" />` + frag;
    return { props: { legacyHtml }, revalidate: 300 };
  } catch {
    return { props: {}, revalidate: 600 };
  }
}

export default function LoginPage({ legacyHtml }: Props) {
  const { login } = useSession();
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [sending, setSending] = React.useState(false);
  const [useLegacy, setUseLegacy] = React.useState(false);
  React.useEffect(() => {
    try {
      setUseLegacy(legacyFlagFromEnv() || legacyFlagFromQuery(new URL(window.location.href).searchParams));
    } catch {}
  }, []);
  if (useLegacy && legacyHtml) return <div dangerouslySetInnerHTML={{ __html: legacyHtml }} />;

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const session = await login(email, password);
      if (session?.role === 'employer') {
        router.push('/employer/jobs');
      } else {
        const next = typeof router.query.next === 'string' ? router.query.next : '/account';
        router.push(next);
      }
    } catch {
      toast('Login failed');
      setSending(false);
    }
  };

  return (
    <ProductShell>
      <HeadSEO titleKey="login_title" descKey="login_title" />
      <Card style={{ maxWidth: 420, margin: '0 auto' }}>
        <h2 style={{ marginTop: 0 }}>{t('login_title')}</h2>
        <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
          <label>
            {t('login_email')}
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label>
            {t('login_password')}
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          <Button type="submit" disabled={sending}>
            {t('login_submit')}
          </Button>
        </form>
        <p style={{ marginTop: 12, fontSize: 14, opacity: 0.8 }}>{t('login_hint')}</p>
      </Card>
    </ProductShell>
  );
}
