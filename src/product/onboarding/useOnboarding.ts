import * as React from 'react';
import type { ApplicantProfile } from '@/types/profile';
import { getSavedIds } from '@/lib/savedJobs';
import { listApplied } from '@/lib/appliedStore';
import { computeCompleteness, type Completeness } from './complete';
import { env } from '@/config/env';

const KEY = 'onboarding:dismissed';
function today(){ return new Date().toISOString().slice(0,10); }

export function useOnboarding(){
  const enabled = env.NEXT_PUBLIC_ENABLE_ONBOARDING;
  const [completeness,setCompleteness] = React.useState<Completeness>({score:0, items:[]});
  const [dismissed,setDismissed] = React.useState(false);

  const refresh = React.useCallback(async()=>{
    if (!enabled || typeof window==='undefined') return;
    try{
      const r = await fetch('/api/account/profile');
      const p:ApplicantProfile = await r.json();
      const hints = { hasSaved: getSavedIds().length>0, hasApplied: listApplied().length>0 };
      setCompleteness(computeCompleteness(p,hints));
    }catch{
      setCompleteness({score:0, items:[]});
    }
  },[enabled]);

  React.useEffect(()=>{ refresh(); },[refresh]);

  React.useEffect(()=>{
    if(typeof window==='undefined') return;
    try{ setDismissed(localStorage.getItem(KEY)===today()); }catch{}
    const url = new URL(window.location.href);
    if(url.searchParams.get('noonboard')==='1') setDismissed(true);
  },[]);

  const dismiss = React.useCallback(()=>{
    if(typeof window==='undefined') return;
    try{ localStorage.setItem(KEY,today()); }catch{}
    setDismissed(true);
  },[]);

  React.useEffect(()=>{
    if(typeof window==='undefined') return;
    const fn = ()=>refresh();
    window.addEventListener('storage',fn);
    return ()=>window.removeEventListener('storage',fn);
  },[refresh]);

  return { enabled, completeness, dismiss, dismissed, refresh };
}
