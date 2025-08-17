import * as React from 'react';
import { tokens as T } from '../../theme/tokens';
export function Card({ style, children, ...props }: React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>){
  return <div {...props} style={{background:'#fff', border:`1px solid ${T.colors.border}`, borderRadius:T.radius.lg, boxShadow:T.shadow.sm, ...style}}>{children}</div>;
}
export function CardHeader(props: React.HTMLAttributes<HTMLDivElement>){
  return <div {...props} />;
}
export function CardContent(props: React.HTMLAttributes<HTMLDivElement>){
  return <div {...props} />;
}
export function CardFooter(props: React.HTMLAttributes<HTMLDivElement>){
  return <div {...props} />;
}
export function CardTag(props: React.HTMLAttributes<HTMLDivElement>){
  return <div {...props} />;
}
export default Card;
