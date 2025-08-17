import * as React from 'react';
import { tokens as T } from '../../theme/tokens';
export function Card(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div {...props} style={{
      background:'#fff', border:`1px solid ${T.colors.border}`,
      borderRadius:T.radius.lg, boxShadow:T.shadow.md, padding:16, ...props.style
    }}/>
  );
}
