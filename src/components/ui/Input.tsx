import * as React from 'react';
import { tokens as T } from '../../theme/tokens';
type InputProps = React.InputHTMLAttributes<HTMLInputElement> & { label?: string; error?: string };
export function Input({ label, error, style, ...props }: InputProps){
  const id = React.useId();
  return (
    <label htmlFor={id} style={{display:'block', width:'100%'}}>
      {label && <div style={{marginBottom:6, fontSize:14, color:T.colors.subtext}}>{label}</div>}
      <input id={id} {...props} style={{
        width:'100%', padding:'12px 14px', borderRadius:12, border:`1px solid ${error?T.colors.danger:T.colors.border}`,
        outline:'none', fontFamily:T.font.base, ...style
      }} />
      {error && <div style={{color:T.colors.danger, fontSize:12, marginTop:6}}>{error}</div>}
    </label>
  );
}

type SelectOption = { value: string; label: string };
type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string; error?: string; options?: SelectOption[]; placeholder?: string };
export function Select({ label, error, options=[], placeholder, style, ...props }: SelectProps){
  const id = React.useId();
  return (
    <label htmlFor={id} style={{display:'block', width:'100%'}}>
      {label && <div style={{marginBottom:6, fontSize:14, color:T.colors.subtext}}>{label}</div>}
      <select id={id} {...props} style={{
        width:'100%', padding:'12px 14px', borderRadius:12, border:`1px solid ${error?T.colors.danger:T.colors.border}`,
        outline:'none', fontFamily:T.font.base, ...style
      }}>
        {placeholder ? <option value="" disabled hidden>{placeholder}</option> : null}
        {options.map(o=> <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {error && <div style={{color:T.colors.danger, fontSize:12, marginTop:6}}>{error}</div>}
    </label>
  );
}

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string; error?: string };
export function Textarea({ label, error, style, ...props }: TextareaProps){
  const id = React.useId();
  return (
    <label htmlFor={id} style={{display:'block', width:'100%'}}>
      {label && <div style={{marginBottom:6, fontSize:14, color:T.colors.subtext}}>{label}</div>}
      <textarea id={id} {...props} style={{
        width:'100%', padding:'12px 14px', borderRadius:12, border:`1px solid ${error?T.colors.danger:T.colors.border}`,
        outline:'none', fontFamily:T.font.base, ...style
      }} />
      {error && <div style={{color:T.colors.danger, fontSize:12, marginTop:6}}>{error}</div>}
    </label>
  );
}

export default Input;
