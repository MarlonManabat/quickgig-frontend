import * as React from 'react';
import { tokens as T } from '../../theme/tokens';

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'solid' | 'subtle' | 'danger';
  size?: 'sm'|'md';
};
export function Button({ variant='solid', size='md', style, ...rest }: Props) {
  const pad = size === 'sm' ? '8px 12px' : '10px 16px';
  let bg: string = T.colors.brand, fg: string = T.colors.brandTextOn, brd: string = 'transparent';
  if (variant==='subtle'){ bg='transparent'; fg=T.colors.text; brd=T.colors.border; }
  if (variant==='danger'){ bg=T.colors.danger; fg='#fff'; }
  return (
    <button
      style={{
        fontFamily: T.font.ui, padding: pad, borderRadius: T.radius.md,
        background: bg, color: fg, border: `1px solid ${brd}`,
        boxShadow: T.shadow.sm, cursor:'pointer', ...style
      }}
      {...rest}
    />
  );
}
export default Button;
