'use client';
import Link, { LinkProps } from 'next/link';
import { toAppPath } from '@/app/lib/routes';

type Props = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & LinkProps;

export function LinkApp({ href, ...rest }: Props) {
  const dest = typeof href === 'string' ? toAppPath(href) : href;
  return <Link href={dest as any} {...rest} />;
}

export default LinkApp;
