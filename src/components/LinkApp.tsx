'use client';
import Link from 'next/link';
import type { ComponentProps } from 'react';
import { toAppPath } from '@/lib/routes';

export default function LinkApp({ href, ...props }: ComponentProps<typeof Link>) {
  const dest = typeof href === 'string' ? toAppPath(href) : href;
  return <Link {...props} href={dest} />;
}
