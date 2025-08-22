import Link, { LinkProps } from 'next/link';
import * as React from 'react';
import { hasDynamicParam, fillPath } from '@/utils/safeNav';

type Props = LinkProps & { children: React.ReactNode; params?: Record<string,string|number|undefined|null> };

export default function LinkSafe({ href, params = {}, children, ...rest }: Props) {
  const to = typeof href === 'string'
    ? (hasDynamicParam(href) ? fillPath(href, params) : href)
    : href;
  return <Link href={to} {...rest}>{children}</Link>;
}
