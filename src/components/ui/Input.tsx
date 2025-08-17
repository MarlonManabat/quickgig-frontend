import * as React from 'react';
import { tokens as T } from '../../theme/tokens';
type Option = { value: string; label: string };
type BaseProps = { label?: string; error?: string; style?: React.CSSProperties; className?: string };
type Props = React.InputHTMLAttributes<HTMLInputElement> & BaseProps;
export function Input({ label, error, style, className, ...props }: Props){
  const id = React.useId();
  return (
    <label htmlFor={id} className={className} style={{display:'block', width:'100%', ...style}}>
      {label && <div style={{marginBottom:6, fontSize:14, color:T.colors.subtext}}>{label}</div>}
      <input id={id} {...props} style={{
        width:'100%', padding:'12px 14px', borderRadius:12, border:`1px solid ${error?T.colors.danger:T.colors.border}`,
        outline:'none', fontFamily:T.font.base
      }} />
      {error && <div style={{color:T.colors.danger, fontSize:12, marginTop:6}}>{error}</div>}
    </label>
  );
}

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & BaseProps & { options?: Option[]; placeholder?: string };
export function Select({ label, error, style, className, options = [], placeholder, ...props }: SelectProps){
  const id = React.useId();
  return (
    <label htmlFor={id} className={className} style={{display:'block', width:'100%', ...style}}>
      {label && <div style={{marginBottom:6, fontSize:14, color:T.colors.subtext}}>{label}</div>}
      <select id={id} {...props} style={{
        width:'100%', padding:'12px 14px', borderRadius:12, border:`1px solid ${error?T.colors.danger:T.colors.border}`,
        outline:'none', fontFamily:T.font.base, background:'#fff'
      }}>
        {placeholder && <option value="" disabled selected hidden>{placeholder}</option>}
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {error && <div style={{color:T.colors.danger, fontSize:12, marginTop:6}}>{error}</div>}
    </label>
  );
}

export function Textarea({ label, error, style, className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & BaseProps){
  const id = React.useId();
  return (
    <label htmlFor={id} className={className} style={{display:'block', width:'100%', ...style}}>
      {label && <div style={{marginBottom:6, fontSize:14, color:T.colors.subtext}}>{label}</div>}
      <textarea id={id} {...props} style={{
        width:'100%', padding:'12px 14px', borderRadius:12, border:`1px solid ${error?T.colors.danger:T.colors.border}`,
        outline:'none', fontFamily:T.font.base
      }} />
      {error && <div style={{color:T.colors.danger, fontSize:12, marginTop:6}}>{error}</div>}
    </label>
  );
}

export default Input;
