import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { renderEmail, TemplateName } from '@/lib/notify';

export default function EmailPreview() {
  const router = useRouter();
  const { name } = router.query;
  const [lang, setLang] = useState<'en' | 'tl'>('en');
  const [tab, setTab] = useState<'html' | 'text'>('html');
  useEffect(() => {
    const q = router.query.lang;
    if (q === 'tl' || q === 'en') setLang(q);
    else if (typeof window !== 'undefined') {
      const ls = window.localStorage.getItem('copyV');
      if (ls === 'taglish') setLang('tl');
      else setLang(process.env.NEXT_PUBLIC_COPY_VARIANT === 'taglish' ? 'tl' : 'en');
    }
  }, [router.query.lang]);
  if (process.env.NODE_ENV === 'production' || !name || typeof name !== 'string') return null;
  const samples: Record<TemplateName, Record<string, unknown>> = {
    'apply:applicant': {
      title: 'Sample Job',
      company: 'Acme',
      applicantName: 'Alex',
      applyUrl: 'https://example.com/app',
    },
    'apply:employer': {
      title: 'Sample Job',
      applicantName: 'Alex',
      manageUrl: 'https://example.com/manage',
    },
    'interview:proposed': {
      title: 'Sample Job',
      slots: 'Jan 1 10:00, Jan 2 14:00',
      method: 'phone',
      location: '',
      detailUrl: 'https://example.com/app',
    },
    'interview:accepted': {
      title: 'Sample Job',
      when: 'Jan 1 10:00',
      tz: 'PHT',
      detailUrl: 'https://example.com/manage',
      uid: '1',
      startISO: new Date().toISOString(),
      durationMin: 30,
      location: '',
      url: 'https://example.com/manage',
    },
    'interview:declined': {
      title: 'Sample Job',
      detailUrl: 'https://example.com/manage',
    },
    'digest:admin': { jobs: 1, applications: 2, reports: 0 },
  };
  const email = renderEmail(name as TemplateName, samples[name as TemplateName], lang);
  return (
    <div style={{ padding: 20 }}>
      <div style={{ marginBottom: 10 }}>
        <button onClick={() => setTab('html')} style={{ marginRight: 5 }}>
          HTML
        </button>
        <button onClick={() => setTab('text')}>TEXT</button>
      </div>
      {tab === 'html' ? (
        <div dangerouslySetInnerHTML={{ __html: email.html }} />
      ) : (
        <pre>{email.text}</pre>
      )}
    </div>
  );
}
