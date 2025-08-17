import * as React from 'react';
import { tokens as T } from '../../theme/tokens';
type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: string;
  full?: boolean;
  size?: 'sm'|'md'|'lg';
};
export function Button({ variant='primary', full, size='md', style, ...props }: Props){
  const sizePad: Record<string,string> = { sm:'8px 12px', md:'10px 14px', lg:'14px 20px' };
  const base: React.CSSProperties = {
    display:'inline-flex', alignItems:'center', justifyContent:'center',
    gap:8, padding:sizePad[size]||sizePad.md, borderRadius:T.radius.md, fontWeight:600,
    border:'1px solid transparent', cursor:'pointer', width: full ? '100%' : undefined,
    transition:'transform .02s ease, background .2s ease, border-color .2s ease'
  };
  const map: Record<string, React.CSSProperties> = {
    primary:{ background:T.colors.brand, color:'#fff' },
    outline:{ background:'#fff', color:T.colors.text, borderColor:T.colors.border },
    ghost:  { background:'transparent', color:T.colors.text },
    secondary:{ background:T.colors.panel, color:T.colors.text, borderColor:T.colors.border }
  };
  const variantStyle = map[variant] || map.primary;
  return (
    <button
      className={props.className}
      style={{...base, ...variantStyle, ...style}}
      onMouseDown={e => (e.currentTarget.style.transform = 'translateY(1px)')}
      onMouseUp={e => (e.currentTarget.style.transform = 'translateY(0)')}
      {...props}
    />
  );
}

export default Button;
