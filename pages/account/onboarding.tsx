import * as React from 'react';
import Link from 'next/link';
import { HeadSEO } from '../../src/components/HeadSEO';
import ProductShell from '../../src/components/layout/ProductShell';
import { t } from '../../src/lib/t';
import { toast } from '../../src/lib/toast';
import { Checklist } from '../../src/product/onboarding/Checklist';
import { computeCompleteness, type ChecklistKey } from '../../src/product/onboarding/complete';
import type { ApplicantProfile } from '../../src/types/profile';
import { getSavedIds } from '../../src/lib/savedJobs';
import { listApplied } from '../../src/lib/appliedStore';
import { requireAuthSSR } from '@/lib/auth';

export const getServerSideProps = requireAuthSSR();

function field(label:string, el:React.ReactNode){
  return (
    <label style={{display:'grid', gap:6}}>
      <span style={{fontWeight:600}}>{label}</span>
      {el}
    </label>
  );
}

export default function OnboardingPage(){
  const [profile,setProfile] = React.useState<ApplicantProfile|null>(null);
  const [rolesText,setRolesText] = React.useState('');

  React.useEffect(()=>{
    (async()=>{
      try{
        const r = await fetch('/api/account/profile');
        const p = await r.json();
        setProfile(p);
        setRolesText((p.roles||[]).join(', '));
      }catch{}
    })();
  },[]);

  const hints = React.useMemo(()=>({ hasSaved:getSavedIds().length>0, hasApplied:listApplied().length>0 }),[]);
  const completeness = profile ? computeCompleteness(profile,hints) : {score:0, items:[]};

  const update = <K extends keyof ApplicantProfile>(key: K, value: ApplicantProfile[K]) => {
    setProfile(p => (p ? { ...p, [key]: value } : p));
  };

  const onSave = async (e:React.FormEvent)=>{
    e.preventDefault();
    if(!profile) return;
    const payload = { ...profile, roles: rolesText.split(',').map(r=>r.trim()).filter(Boolean) };
    try{
      const r = await fetch('/api/account/profile',{ method:'PUT', headers:{'content-type':'application/json'}, body: JSON.stringify(payload)});
      if(r.ok){
        const j = await r.json().catch(()=>payload);
        setProfile(j);
        setRolesText((j.roles||[]).join(', '));
        toast(t('saved_success'));
      }
    }catch{}
  };

  const onAction = (key:ChecklistKey)=>{ console.log('onboard_action', key); };

  if(!profile) return (
    <ProductShell>
      <HeadSEO titleKey="onboarding.title" descKey="onboarding.subtitle" noIndex />
      <p>Loading…</p>
    </ProductShell>
  );

  if(completeness.score>=100){
    return (
      <ProductShell>
        <HeadSEO titleKey="onboarding.title" descKey="onboarding.subtitle" noIndex />
        <div style={{display:'grid', gap:12}}>
          <h1>{t('onboarding.done_title')}</h1>
          <p>{t('onboarding.done_body')}</p>
          <Link href="/find-work" style={{color:'#0069d1'}}>{t('onboarding.banner_cta')}</Link>
        </div>
      </ProductShell>
    );
  }

  return (
    <ProductShell>
      <HeadSEO titleKey="onboarding.title" descKey="onboarding.subtitle" noIndex />
      <div style={{display:'grid', gap:24, gridTemplateColumns:'1fr 2fr', alignItems:'start'}}>
        <Checklist c={completeness} onAction={onAction} />
        <form onSubmit={onSave} style={{display:'grid', gap:12}}>
          {field(t('field.name'), <input value={profile.name} onChange={e=>update('name',e.target.value)} style={{padding:'10px 12px', borderRadius:8, border:'1px solid #ccc'}} />)}
          {field(t('field.bio'), <textarea value={profile.bio||''} onChange={e=>update('bio',e.target.value)} rows={3} style={{padding:'10px 12px', borderRadius:8, border:'1px solid #ccc'}} />)}
          {field(t('field.roles'), <input value={rolesText} onChange={e=>setRolesText(e.target.value)} placeholder="e.g. Barista, Cook" style={{padding:'10px 12px', borderRadius:8, border:'1px solid #ccc'}} />)}
          {field(t('field.resumeUrl'), <input value={profile.resumeUrl||''} onChange={e=>update('resumeUrl',e.target.value)} placeholder="https://..." style={{padding:'10px 12px', borderRadius:8, border:'1px solid #ccc'}} />)}
          <div>
            <button type="submit" style={{padding:'10px 14px', borderRadius:8, background:'#0069d1', color:'#fff', border:'none', fontWeight:700}}>{t('action.save')}</button>
          </div>
        </form>
      </div>
    </ProductShell>
  );
}
