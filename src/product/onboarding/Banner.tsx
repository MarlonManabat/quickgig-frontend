import Link from 'next/link';
import { t } from '@/lib/t';
import { tokens as T } from '@/theme/tokens';
import { useOnboarding } from './useOnboarding';

export function OnboardingBanner(){
  const { enabled, completeness, dismissed, dismiss } = useOnboarding();
  if(!enabled || dismissed || completeness.score>=100) return null;
  return (
    <div style={{background:'#fffbe6', border:`1px solid ${T.colors.border}`, padding:'8px 12px', borderRadius:8, display:'flex', alignItems:'center', gap:8}}>
      <span style={{flex:1}}>{t('onboarding.banner_title')}</span>
      <Link href="/account/onboarding" onClick={()=>console.log('onboard_banner_cta')} style={{fontWeight:600}}>{t('onboarding.banner_cta')}</Link>
      <button onClick={dismiss} style={{border:'none', background:'transparent', cursor:'pointer'}}>×</button>
    </div>
  );
}
