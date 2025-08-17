import * as React from 'react';
import { tokens as T } from '../../theme/tokens';
type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary'|'outline'|'ghost'|string; full?: boolean; size?: string; };
export function Button({ variant='primary', full, style, ...props }: Props){
  const base: React.CSSProperties = {
    display:'inline-flex', alignItems:'center', justifyContent:'center',
    gap:8, padding:'10px 14px', borderRadius:T.radius.md, fontWeight:600,
    border:'1px solid transparent', cursor:'pointer', width: full ? '100%' : undefined,
    transition:'transform .02s ease, background .2s ease, border-color .2s ease'
  };
  const map: Record<string, React.CSSProperties> = {
    primary:{ background:T.colors.brand, color:'#fff' },
    outline:{ background:'#fff', color:T.colors.text, borderColor:T.colors.border },
    ghost:  { background:'transparent', color:T.colors.text }
  };
  return <button style={{...base, ...(map[variant]||{}), ...style}} onMouseDown={e=>((e.currentTarget.style.transform='translateY(1px)'))} onMouseUp={e=>((e.currentTarget.style.transform='translateY(0)'))} {...props} />;
}
export default Button;
