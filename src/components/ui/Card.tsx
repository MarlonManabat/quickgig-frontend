import * as React from 'react';
import { tokens as T } from '../../theme/tokens';
type Base = { style?: React.CSSProperties; className?: string; padding?: string };
export function Card(props: React.PropsWithChildren<Base>){
  const pad = props.padding ? (props.padding === 'md' ? 16 : props.padding === 'lg' ? 24 : 8) : undefined;
  return <div className={props.className} style={{background:'#fff', border:`1px solid ${T.colors.border}`, borderRadius:T.radius.lg, boxShadow:T.shadow.sm, padding:pad, ...props.style}}>{props.children}</div>;
}

export function CardHeader(props: React.PropsWithChildren<Base>){
  return <div className={props.className} style={{padding:16, borderBottom:`1px solid ${T.colors.border}`, ...props.style}}>{props.children}</div>;
}

export function CardContent(props: React.PropsWithChildren<Base>){
  return <div className={props.className} style={{padding:16, ...props.style}}>{props.children}</div>;
}

export function CardFooter(props: React.PropsWithChildren<Base>){
  return <div className={props.className} style={{padding:16, borderTop:`1px solid ${T.colors.border}`, ...props.style}}>{props.children}</div>;
}

export function CardTag(props: React.PropsWithChildren<Base>){
  return <span className={props.className} style={{display:'inline-block', background:T.colors.panel, borderRadius:8, padding:'2px 6px', fontSize:12, ...props.style}}>{props.children}</span>;
}

export default Card;
