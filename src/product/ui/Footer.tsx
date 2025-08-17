import * as React from 'react';
import { tokens as T } from '../../theme/tokens';
export function Footer(){
  return (
    <footer style={{borderTop:`1px solid ${T.colors.border}`, marginTop:32}}>
      <div style={{maxWidth:1024, margin:'0 auto', padding:'16px', color:T.colors.subtle, fontFamily:T.font.ui}}>
        © QuickGig PH · <a href="/system/status">Status</a>
      </div>
    </footer>
  );
}
