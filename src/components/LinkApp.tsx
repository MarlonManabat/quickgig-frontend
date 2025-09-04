'use client';
import Link from 'next/link';
import type { ComponentProps } from 'react';

export default function LinkApp(props: ComponentProps<typeof Link>) {
  // Simple passthrough; any cross-host logic stays centralized here if needed later.
  return <Link {...props} />;
}
