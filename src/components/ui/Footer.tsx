import * as React from 'react';
import { tokens as T } from '../../theme/tokens';
export function Footer(){
  return (
    <footer style={{borderTop:`1px solid ${T.colors.border}`, marginTop:40}}>
      <div style={{maxWidth:1024, margin:'0 auto', padding:'24px 16px', color:T.colors.subtext, fontSize:14}}>
        © {new Date().getFullYear()} QuickGig PH — All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
