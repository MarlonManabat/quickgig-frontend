import Link from 'next/link';
import { t, type Messages } from '@/lib/t';
import { tokens as T } from '@/theme/tokens';
import type { Completeness, ChecklistKey } from './complete';

export function Checklist({ c, onAction }: { c: Completeness; onAction?: (key: ChecklistKey) => void }) {
  const pct = Math.round(c.score);
  return (
    <div style={{display:'grid', gap:12}}>
      <div>
        <div style={{fontWeight:600}}>{t('onboarding.progress', { score: pct })}</div>
        <div style={{height:8, background:'#eee', borderRadius:4, overflow:'hidden'}}>
          <div style={{width:`${pct}%`, background:T.colors.brand, height:'100%'}} />
        </div>
      </div>
      <ul style={{listStyle:'none', padding:0, margin:0, display:'grid', gap:8}}>
        {c.items.map(item => (
          <li key={item.key} style={{display:'flex', alignItems:'center', gap:8}}>
            <span>{item.done ? '✓' : '○'}</span>
            {item.done ? (
              <span>{t(`onboarding.cta_${item.key}` as keyof Messages)}</span>
            ) : (
              <Link href={item.href || '#'} onClick={() => onAction?.(item.key)} style={{color:T.colors.brand}}>
                {t(`onboarding.cta_${item.key}` as keyof Messages)}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
