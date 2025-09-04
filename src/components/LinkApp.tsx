'use client';
import Link from 'next/link';
import type { ComponentProps } from 'react';
import { toAppPath } from '@/lib/routes';

type Props = ComponentProps<typeof Link> & { toPath?: string };

export default function LinkApp({ href, toPath, ...props }: Props) {
  const dest = toPath ?? href;
  const final = typeof dest === 'string' ? toAppPath(dest) : dest;
  return <Link {...props} href={final} />;
}
