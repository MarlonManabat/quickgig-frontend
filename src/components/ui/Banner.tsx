import * as React from 'react';
import { tokens as T } from '../../theme/tokens';
export function Banner(){
  const html = process.env.NEXT_PUBLIC_BANNER_HTML || '';
  if(!html) return null;
  return (
    <div style={{background:T.colors.bannerBg, color:T.colors.bannerText, padding:'8px 12px', textAlign:'center'}}>
      <span dangerouslySetInnerHTML={{__html: html}} />
    </div>
  );
}
