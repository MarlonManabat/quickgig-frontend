import * as React from 'react';
import { tokens as T } from '../../theme/tokens';

export function Banner({html}:{html?:string}){
  if(!html) return null;
  return (
    <div style={{background:T.colors.brand, color:'#fff', fontFamily:T.font.ui}}>
      <div style={{maxWidth:1024, margin:'0 auto', padding:'8px 12px'}}>
        <span dangerouslySetInnerHTML={{__html: html}} />
      </div>
    </div>
  );
}
