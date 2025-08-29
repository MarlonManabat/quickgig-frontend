import dynamic from 'next/dynamic';
import LandingHeader from '@/components/landing/Header';
import LandingHero from '@/components/landing/Hero';

const MobileStickyCTA = dynamic(() => import('@/components/MobileStickyCTA'), { ssr: false });

export default function Home() {
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
