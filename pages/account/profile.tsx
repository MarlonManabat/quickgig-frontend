import * as React from 'react';
import { HeadSEO } from '../../src/components/HeadSEO';
import ProductShell from '../../src/components/layout/ProductShell';
import { t } from '../../src/lib/t';
import { toast } from '../../src/lib/toast';
import { ApplicantProfile } from '../../src/types/profile';
import { requireAuthSSR } from '@/lib/auth';
import UploadField from '../../src/components/product/UploadField';
import { getResume, setResume, getAvatar, setAvatar } from '../../src/lib/profileStore';
import { UploadedFile } from '@/types/upload';
import { ACCEPT_STRING } from '@/lib/upload';

export const getServerSideProps = requireAuthSSR();

function field(label:string, el:React.ReactNode){
  return (
    <label style={{display:'grid', gap:6}}>
      <span style={{fontWeight:600}}>{label}</span>
      {el}
    </label>
  );
}

export default function ProfilePage(){
  const [profile,setProfile] = React.useState<ApplicantProfile|null>(null);
  const [rolesText,setRolesText] = React.useState('');
  const [resume,setResumeState] = React.useState<UploadedFile|null>(null);
  const [avatar,setAvatarState] = React.useState<UploadedFile|null>(null);

  React.useEffect(()=>{
    (async()=>{
      try{
        const r = await fetch('/api/account/profile');
        const p = await r.json();
        setProfile(p);
        setRolesText((p.roles||[]).join(', '));
      }catch{}
      try { setResumeState(getResume()); setAvatarState(getAvatar()); } catch {}
    })();
  },[]);

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

  if(!profile) return (
    <ProductShell>
      <HeadSEO titleKey="profile.title" descKey="profile.subtitle" noIndex />
      <p>Loading…</p>
    </ProductShell>
  );

  return (
    <ProductShell>
      <HeadSEO titleKey="profile.title" descKey="profile.subtitle" noIndex />
      <form onSubmit={onSave} style={{display:'grid', gap:12, maxWidth:600}}>
        <h1 style={{margin:0}}>{t('profile.title')}</h1>
        <p>{t('profile.subtitle')}</p>
        {field(t('field.name'), <input value={profile.name} onChange={e=>update('name',e.target.value)} style={{padding:'10px 12px', borderRadius:8, border:'1px solid #ccc'}} />)}
        {field(t('field.email'), <input value={profile.email} readOnly style={{padding:'10px 12px', borderRadius:8, border:'1px solid #ccc', background:'#eee'}} />)}
        {field(t('field.phone'), <input value={profile.phone||''} onChange={e=>update('phone',e.target.value)} style={{padding:'10px 12px', borderRadius:8, border:'1px solid #ccc'}} />)}
        {field(t('field.city'), <input value={profile.city||''} onChange={e=>update('city',e.target.value)} style={{padding:'10px 12px', borderRadius:8, border:'1px solid #ccc'}} />)}
        {field(t('field.barangay'), <input value={profile.barangay||''} onChange={e=>update('barangay',e.target.value)} style={{padding:'10px 12px', borderRadius:8, border:'1px solid #ccc'}} />)}
        {field(t('field.roles'), <input value={rolesText} onChange={e=>setRolesText(e.target.value)} placeholder="e.g. Barista, Cook" style={{padding:'10px 12px', borderRadius:8, border:'1px solid #ccc'}} />)}
        {field(t('field.expectedRate'), <input value={profile.expectedRate||''} onChange={e=>update('expectedRate',e.target.value)} placeholder="₱800/day" style={{padding:'10px 12px', borderRadius:8, border:'1px solid #ccc'}} />)}
        {field(t('field.bio'), <textarea value={profile.bio||''} onChange={e=>update('bio',e.target.value)} rows={4} style={{padding:'10px 12px', borderRadius:8, border:'1px solid #ccc', resize:'vertical'}} />)}
        <UploadField label={t('profile.resume.title')} accept={ACCEPT_STRING} kind="resume" file={resume} onSaved={f=>{ setResumeState(f); setResume(f); update('resumeUrl', f?.url || ''); }} />
        <UploadField label={t('profile.avatar.title')} accept="image/*" kind="avatar" file={avatar} onSaved={f=>{ setAvatarState(f); setAvatar(f); update('avatarUrl', f?.url || ''); }} />
        <div>
          <button type="submit" style={{padding:'10px 14px', borderRadius:8, background:'#0069d1', color:'#fff', border:'none', fontWeight:700}}>{t('action.save')}</button>
        </div>
      </form>
    </ProductShell>
  );
}
