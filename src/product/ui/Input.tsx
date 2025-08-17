import * as React from 'react';
import { tokens as T } from '../../theme/tokens';
export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      style={{
        width:'100%', padding:'10px 12px', borderRadius: T.radius.md,
        border:`1px solid ${T.colors.border}`, background:'#fff',
        fontFamily: T.font.ui, ...props.style,
      }}
    />
  );
}
export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      style={{
        width:'100%', padding:'10px 12px', borderRadius: T.radius.md,
        border:`1px solid ${T.colors.border}`, background:'#fff',
        fontFamily: T.font.ui, ...props.style,
      }}
    />
  );
}
