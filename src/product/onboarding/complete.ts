export type ChecklistKey = 'profile_basic'|'profile_contact'|'roles'|'resume'|'first_save'|'first_apply';
export type ChecklistItem = { key: ChecklistKey; done: boolean; weight: number; href?: string; };
export type Completeness = { score: number; items: ChecklistItem[]; };

import type { ApplicantProfile } from '@/types/profile';

export function computeCompleteness(p: ApplicantProfile, hints:{hasSaved:boolean,hasApplied:boolean}): Completeness {
  const items: ChecklistItem[] = [
    { key: 'profile_basic',   done: !!(p.name && p.bio),                 weight: 30,  href: '/account/profile' },
    { key: 'profile_contact', done: !!(p.email && p.phone),              weight: 20,  href: '/account/profile' },
    { key: 'roles',           done: !!(p.roles && p.roles.length),       weight: 20,  href: '/account/profile' },
    { key: 'resume',          done: !!p.resumeUrl,                       weight: 15,  href: '/account/profile' },
    { key: 'first_save',      done: hints.hasSaved,                      weight: 7.5, href: '/find-work' },
    { key: 'first_apply',     done: hints.hasApplied,                    weight: 7.5, href: '/find-work' },
  ];
  const score = Math.max(0, Math.min(100, items.reduce((s,i)=> i.done? s + i.weight : s, 0)));
  return { score, items };
}
