import Link, { LinkProps } from 'next/link';
import * as React from 'react';
import { hasDynamicParam, fillPath } from '@/utils/safeNav';

type AnchorProps = React.AnchorHTMLAttributes<HTMLAnchorElement>;
type Props = (LinkProps & AnchorProps) & {
  params?: Record<string, string | number | undefined | null>;
};

const LinkSafe = React.forwardRef<HTMLAnchorElement, Props>(function LinkSafe(
  { href, params = {}, ...rest },
  ref
) {
  const to =
    typeof href === 'string'
      ? hasDynamicParam(href)
        ? fillPath(href, params)
        : href
      : href;

  // Pass through all anchor props (className, style, data-*, etc.)
  return <Link ref={ref} href={to} {...rest} />;
});

export default LinkSafe;
