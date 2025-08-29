import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import LandingHeader from '@/components/landing/Header';
import LandingHero from '@/components/landing/Hero';
import { APP_BASE } from '@/lib/appLinks';

const MobileStickyCTA = dynamic(() => import('@/components/MobileStickyCTA'), { ssr: false });

export default function Home() {
  const [isApp, setIsApp] = useState(false);
  useEffect(() => {
    try {
      const appHost = new URL(APP_BASE).host;
      setIsApp(window.location.host === appHost);
    } catch {}
  }, []);
  if (isApp) return null;
  return (
    <>
      <LandingHeader />
      <LandingHero />
      <MobileStickyCTA />
    </>
  );
}

export async function getStaticProps() {
  return { props: {}, revalidate: 60 };
}
